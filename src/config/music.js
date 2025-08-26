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
      color: "#FF6B9D",
      description: "精选好听的歌曲",
    },
    {
      id: "14042168814", // 暂时使用同一个歌单，你可以替换为实际的JPOP歌单ID
      name: "JPOP",
      color: "#4ECDC4",
      description: "日语流行音乐",
    },
    // 可以添加更多歌单
    // {
    //   id: "your_playlist_id",
    //   name: "歌单名称",
    //   color: "#颜色代码",
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
