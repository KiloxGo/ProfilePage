// GitHub API 配置
export const GITHUB_CONFIG = {
  owner: "KiloxGo", // 你的 GitHub 用户名
  repo: "ProfilePage", // 仓库名
  // 使用 GitHub Issues 作为动态数据存储
  issuesLabel: "zone-post", // 用于标识动态的标签
  // GitHub OAuth 配置
  clientId: "Ov23ctn3vbQgjl7H5CMx", // 请替换为你的实际 Client ID
};

// GitHub API 基础 URL
export const GITHUB_API_BASE = "https://api.github.com";

// 动态配置
export const ZONE_CONFIG = {
  // 每页显示的动态数量
  postsPerPage: 10,
  // 动态图片最大尺寸
  maxImageSize: 5 * 1024 * 1024, // 5MB
  // 支持的图片格式
  supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};
