// 友链数据配置 - 支持GitHub项目和自定义链接
export const FRIEND_LINKS_CONFIG = {
  // 友链列表，支持两种类型：github和custom
  friends: [
    // GitHub项目类型 - 通过API动态获取信息
    {
      type: "github",
      owner: "KodateMitsuru",
      repo: "KodateMitsuru.github.io",
    },
    {
      type: "custom",
      id: "custom-1",
      github: {
        username: "KodateMitsuru",
        avatar: "https://github.com/KodateMitsuru.png",
        name: "KodateMitsuru",
      },
      project: {
        name: "博客",
        description: "KodateMitsuru的个人博客",
        url: "https://blog.kodatemitsuru.com/",
        language: "Blog",
        stars: null,
      },
    },
  ],
};
