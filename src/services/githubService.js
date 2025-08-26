// GitHub API 服务
const GITHUB_API_BASE = "https://api.github.com";

/**
 * 获取GitHub仓库信息
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @returns {Promise<Object>} - 仓库信息
 */
export const getGitHubRepo = async (owner, repo) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    return {
      name: data.name,
      description: data.description || "暂无描述",
      language: data.language || "Unknown",
      stars: data.stargazers_count || 0,
      url: data.html_url,
      owner: {
        username: data.owner.login,
        avatar: data.owner.avatar_url,
        name: data.owner.name || data.owner.login,
        profileUrl: data.owner.html_url,
      },
    };
  } catch (error) {
    console.error("Error fetching GitHub repo:", error);
    return null;
  }
};

/**
 * 获取GitHub用户信息
 * @param {string} username - 用户名
 * @returns {Promise<Object>} - 用户信息
 */
export const getGitHubUser = async (username) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    return {
      username: data.login,
      name: data.name || data.login,
      avatar: data.avatar_url,
      bio: data.bio,
      profileUrl: data.html_url,
      publicRepos: data.public_repos,
      followers: data.followers,
    };
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    return null;
  }
};

/**
 * 批量获取多个仓库信息
 * @param {Array} repos - 仓库列表 [{owner, repo}]
 * @returns {Promise<Array>} - 仓库信息列表
 */
export const getBatchGitHubRepos = async (repos) => {
  const promises = repos.map(({ owner, repo }) => getGitHubRepo(owner, repo));
  const results = await Promise.allSettled(promises);

  return results.map((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      return {
        id: `repo-${index}`,
        ...result.value,
      };
    } else {
      // 如果API调用失败，返回fallback数据
      const { owner, repo } = repos[index];
      return {
        id: `repo-${index}`,
        name: repo,
        description: "获取描述失败，请稍后重试",
        language: "Unknown",
        stars: 0,
        url: `https://github.com/${owner}/${repo}`,
        owner: {
          username: owner,
          avatar: `https://github.com/${owner}.png`,
          name: owner,
          profileUrl: `https://github.com/${owner}`,
        },
      };
    }
  });
};
