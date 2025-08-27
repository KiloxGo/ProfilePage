import { GITHUB_API_BASE, GITHUB_CONFIG } from "../config/zone";

class GitHubService {
  constructor() {
    this.token = localStorage.getItem("github_token");
    this.user = null;
  }

  // 设置 GitHub Token
  setToken(token) {
    this.token = token;
    localStorage.setItem("github_token", token);
  }

  // 获取当前用户信息
  async getCurrentUser() {
    if (!this.token) return null;

    try {
      const response = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: {
          Authorization: `token ${this.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (response.ok) {
        this.user = await response.json();
        return this.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // 检查是否为仓库所有者（只有仓库所有者可以发布动态）
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    const isOwner = user && user.login === GITHUB_CONFIG.owner;

    return isOwner;
  }

  // 检查指定用户是否为仓库所有者
  checkIsOwner(username) {
    if (!username) return false;
    const isOwner = username === GITHUB_CONFIG.owner;
    return isOwner;
  }

  // 检查是否有有效的 token（用于判断是否已登录）
  hasToken() {
    return !!this.token;
  }

  // 获取动态列表（从 Issues 获取）
  async getPosts(page = 1, perPage = 10) {
    try {
      const url = `${GITHUB_API_BASE}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues`;
      const params = new URLSearchParams({
        labels: GITHUB_CONFIG.issuesLabel,
        state: "open",
        sort: "created",
        direction: "desc",
        page: page.toString(),
        per_page: perPage.toString(),
      });

      const response = await fetch(`${url}?${params}`);

      if (response.ok) {
        const issues = await response.json();
        return issues.map(this.formatPost);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  // 创建新动态
  async createPost(title, content, images = []) {
    if (!this.token || !(await this.isAuthenticated())) {
      throw new Error("Not authenticated");
    }

    try {
      let body = content;

      // 如果有图片，添加到内容中
      if (images.length > 0) {
        body += "\n\n" + images.map((img) => `![image](${img})`).join("\n");
      }

      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${this.token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            body,
            labels: [GITHUB_CONFIG.issuesLabel],
          }),
        }
      );

      if (response.ok) {
        const issue = await response.json();
        return this.formatPost(issue);
      }
      throw new Error("Failed to create post");
    } catch (error) {
      throw error;
    }
  }

  // 上传图片到仓库
  async uploadImage(file, filename) {
    if (!this.token || !(await this.isAuthenticated())) {
      throw new Error("Not authenticated");
    }

    try {
      // 将文件转换为 base64
      const base64 = await this.fileToBase64(file);
      const content = base64.split(",")[1]; // 移除 data:image/... 前缀

      const path = `assets/zone/${Date.now()}-${filename}`;

      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${this.token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Upload zone image: ${filename}`,
            content,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.content.download_url;
      }
      throw new Error("Failed to upload image");
    } catch (error) {
      throw error;
    }
  }

  // 格式化 Issue 为动态格式
  formatPost(issue) {
    return {
      id: issue.id,
      title: issue.title,
      content: issue.body,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      author: issue.user.login,
      avatar: issue.user.avatar_url,
      url: issue.html_url,
    };
  }

  // 文件转 base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // GitHub OAuth 登录
  startOAuthFlow() {
    const redirectUri = encodeURIComponent(
      `${window.location.origin}${window.location.pathname}`
    );
    const scope = "repo";
    const state = Math.random().toString(36).substring(7); // 随机状态字符串

    // 保存状态到 localStorage 用于验证
    localStorage.setItem("oauth_state", state);

    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CONFIG.clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = url;
  }

  // 处理 OAuth 回调
  async handleOAuthCallback(code, state) {
    try {
      // 验证状态
      const savedState = localStorage.getItem("oauth_state");
      if (state !== savedState) {
        throw new Error("Invalid OAuth state");
      }

      // 由于是静态网站，我们需要使用 GitHub 的设备流程或者使用临时的代理服务
      // 这里我们暂时使用 Personal Access Token 的方式
      alert(
        "OAuth 回调成功！请在开发者工具控制台中设置你的 Personal Access Token"
      );

      // 清理状态
      localStorage.removeItem("oauth_state");

      return true;
    } catch (error) {
      return false;
    }
  }

  // 检查 URL 中是否有 OAuth 回调参数
  checkOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      this.handleOAuthCallback(code, state);
      // 清理 URL 参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } // 登出
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("github_token");
  }
}

export const githubService = new GitHubService();
