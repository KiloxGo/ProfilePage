import { BANGUMI_CONFIG } from "../config/bangumi";

class BangumiService {
  constructor() {
    this.cache = new Map();
    this.cacheTime = BANGUMI_CONFIG.revalidateTime * 1000; // 转换为毫秒
  }

  // 获取用户数据
  async getUserData() {
    const cacheKey = "userData";
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTime) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${BANGUMI_CONFIG.apiUrl}/users/${BANGUMI_CONFIG.username}`,
        {
          headers: {
            "User-Agent": BANGUMI_CONFIG.userAgent,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error("Error fetching Bangumi user data:", error);
      throw error;
    }
  }

  // 获取单页收藏数据
  async getCollectionsPage(offset = 0, limit = 50) {
    try {
      const response = await fetch(
        `${BANGUMI_CONFIG.apiUrl}/users/${BANGUMI_CONFIG.username}/collections?offset=${offset}&limit=${limit}`,
        {
          headers: {
            "User-Agent": BANGUMI_CONFIG.userAgent,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching Bangumi collections:", error);
      throw error;
    }
  }

  // 获取所有收藏数据
  async getAllCollections() {
    const cacheKey = "allCollections";
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTime) {
      return cached.data;
    }

    try {
      const allCollections = [];
      let offset = 0;
      const limit = 50;
      let hasMore = true;

      while (hasMore) {
        const response = await this.getCollectionsPage(offset, limit);
        allCollections.push(...response.data);

        offset += limit;
        hasMore = response.offset + response.data.length < response.total;
      }

      this.cache.set(cacheKey, { data: allCollections, timestamp: Date.now() });
      return allCollections;
    } catch (error) {
      console.error("Error fetching all Bangumi collections:", error);
      throw error;
    }
  }

  // 按状态过滤收藏
  filterByStatus(collections, status) {
    return collections.filter((item) => item.type === status);
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
  }
}

export const bangumiService = new BangumiService();
