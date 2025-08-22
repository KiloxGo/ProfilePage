import { useState, useEffect } from "react";
import { fetchWakaTimeData } from "../services/wakatimeService";

export const useWakaTime = () => {
  const [wakaTimeData, setWakaTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWakaTimeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWakaTimeData();
        setWakaTimeData(data);
      } catch (err) {
        setError(err);
        console.error("Error loading WakaTime data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWakaTimeData();
  }, []);

  return { wakaTimeData, loading, error };
};
