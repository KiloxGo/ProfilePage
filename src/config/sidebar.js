// 侧边栏按钮配置
export const SIDEBAR_CONFIG = {
  buttons: [
    {
      id: "profile",
      icon: "mingcute:user-4-fill",
      label: "自述",
      type: "modal",
      modal: "profile-card",
    },
    {
      id: "zone",
      icon: "mingcute:time-line",
      label: "动态",
      type: "route",
      route: "/zone",
    },
    {
      id: "friendLink",
      icon: "mingcute:link-3-fill",
      label: "友链",
      type: "modal",
      modal: "friend-links",
    },
    {
      id: "musicList",
      icon: "mingcute:music-fill",
      label: "歌单",
      type: "modal",
    },
    {
      id: "github",
      icon: "mingcute:github-fill",
      label: "Github",
      type: "external",
      url: "https://github.com/KiloxGo/ProfilePage",
    },
  ],

  // 侧边栏样式配置
  styles: {
    position: {
      right: "20px",
      top: "25%",
    },
    button: {
      width: "140px",
      height: "50px",
      borderRadius: "12px",
      spacing: 4,
    },
    toggle: {
      width: "45px",
      height: "120px",
      borderRadius: "12px",
      marginTop: "20px",
    },
    animation: {
      duration: "0.3s",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

export const handleButtonAction = (button, navigate) => {
  switch (button.type) {
    case "scroll":
      document
        .querySelector(button.target)
        ?.scrollIntoView({ behavior: "smooth" });
      break;

    case "external":
      window.open(button.url, "_blank");
      break;

    case "route":
      if (navigate) {
        navigate(button.route);
      }
      break;

    case "action":
      button.action?.();
      break;

    default:
    // 未知的按钮类型，忽略
  }
};
