// 音乐数据配置
export const MUSIC_CONFIG = {
  sections: [
    {
      id: "edm",
      title: "EDM",
      icon: "mingcute:lightning-line",
      iconColor: "#2C72FF",
      songs: [
        {
          id: "1940303073",
          name: "EDM Song 1", // 可选：歌曲名称
        },
        {
          id: "1421200829",
          name: "EDM Song 2",
        },
        {
          id: "425280053",
          name: "EDM Song 3",
        },
        {
          id: "1815533595",
          name: "EDM Song 4",
        },
      ],
    },
    {
      id: "jpop",
      title: "JPOP-我是ZUTOMAYO小馋猫-ACA小姐🤤🤤",
      icon: "mingcute:microphone-line",
      iconColor: "#2C72FF",
      songs: [
        {
          id: "1325357378",
          name: "ZUTOMAYO Song 1",
        },
        {
          id: "1325356411",
          name: "ZUTOMAYO Song 2",
        },
        {
          id: "1990571322",
          name: "ZUTOMAYO Song 3",
        },
        {
          id: "1870469768",
          name: "ZUTOMAYO Song 4",
        },
      ],
    },
  ],

  // 网易云音乐播放器配置
  player: {
    baseUrl: "//music.163.com/outchain/player",
    defaultParams: {
      type: "2",
      auto: "0",
      height: "66",
    },
    iframeStyle: {
      width: "100%",
      height: "86",
      frameBorder: "no",
      border: "0",
      marginWidth: "0",
      marginHeight: "0",
    },
  },
};
