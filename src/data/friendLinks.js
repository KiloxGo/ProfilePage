// 友链数据配置 - 支持GitHub项目和自定义链接
export const FRIEND_LINKS_CONFIG = {
  friends: [
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
