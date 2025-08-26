// 音乐配置
export const MUSIC_CONFIG = {
  // 网易云音乐API配置
  api: {
    baseUrl: "https://netease-cloud-music-api-backup-liard.vercel.app",
    endpoints: {
      playlist: "/playlist/track/all",
      songUrl: "/song/url",
    },
  },

  // 歌单配置
  playlists: [
    {
      id: "14042168814",
      name: "我喜欢你",
      description: "精选好听的歌曲",
    },
    {
      id: "13592899660",
      name: "JPOP",
      description: "日语流行音乐",
    },
    {
      id: "5003387223",
      name: "Favorites",
      description: "我最喜欢的歌曲",
    },
    // 可以添加更多歌单
    // {
    //   id: "your_playlist_id",
    //   name: "歌单名称",
    //   description: "歌单描述",
    // },
  ],

  // 播放器配置
  player: {
    defaultVolume: 70,
    seekUpdateInterval: 1000,
    autoPlay: true,
  },

  // UI配置
  ui: {
    modal: {
      maxWidth: "900px",
      maxHeight: "80vh",
    },
    card: {
      height: "100px",
    },
    player: {
      width: "320px",
      position: {
        bottom: "20px",
        right: "20px",
      },
    },
  },
};
