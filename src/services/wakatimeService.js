import { WAKATIME_CONFIG } from "../config/wakatime";

/**
 * 获取 WakaTime 数据
 * @returns {Promise<{timeTrackingData: any, languageData: any} | null>}
 */
export const fetchWakaTimeData = async () => {
  try {
    const [timeResponse, langResponse] = await Promise.all([
      fetch(WAKATIME_CONFIG.api.timeTracking),
      fetch(WAKATIME_CONFIG.api.language),
    ]);

    if (timeResponse.ok && langResponse.ok) {
      const [timeData, langData] = await Promise.all([
        timeResponse.json(),
        langResponse.json(),
      ]);

      return {
        timeTrackingData: timeData,
        languageData: langData,
      };
    }

    throw new Error("Failed to fetch WakaTime data");
  } catch (error) {
    return null;
  }
};
