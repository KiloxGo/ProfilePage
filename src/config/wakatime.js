// WakaTime API 配置
export const WAKATIME_CONFIG = {
  api: {
    timeTracking:
      "https://wakatime.com/share/@Kilox/995aed08-0b92-41c5-a244-6543535b3429.json",
    language:
      "https://wakatime.com/share/@Kilox/0ee87a93-154a-46bf-aecd-7936e5868af2.json",
  },
  settings: {
    maxLanguages: 5, // 显示最多语言数量
    minPercentage: 0, // 最小显示百分比
  },
};

// 编程语言图标映射
export const LANGUAGE_ICONS = {
  python: "logos:python",
  javascript: "logos:javascript",
  typescript: "logos:typescript-icon",
  java: "logos:java",
  cpp: "logos:cplusplus",
  c: "devicon:c",
  html: "logos:html-5",
  css: "logos:css-3",
  react: "logos:react",
  vue: "logos:vue",
  markdown: "logos:markdown",
  json: "logos:json",
  bash: "logos:bash",
};

// 获取语言图标的工具函数
export const getLangIcon = (langName) => {
  return LANGUAGE_ICONS[langName.toLowerCase()] || "mingcute:code-line";
};
