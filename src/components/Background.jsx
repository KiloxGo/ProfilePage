import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PROFILE_CONFIG } from "../config/profile";

export function Background() {
  const [randomImage] = useState(() => {
    const images = PROFILE_CONFIG.backgroundConfig.images;
    return images[Math.floor(Math.random() * images.length)];
  });
  const [isLoading, setIsLoading] = useState(true);
  const backgroundRef = useRef(null);

  const updateBackgroundImage = (imageUrl = randomImage) => {
    const background = backgroundRef.current;
    if (background) {
      setIsLoading(true);
      // 加载背景图片
      const img = new Image();
      img.onload = () => {
        background.style.backgroundImage = `url(${imageUrl})`;
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
      };
      img.src = imageUrl;
    }
  };

  useEffect(() => {
    // 直接更新背景图片，不使用IntersectionObserver
    updateBackgroundImage();
  }, []);

  return (
    <motion.div
      ref={backgroundRef}
      className="custom-clip-path"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "25vw",
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // 之前使用 zIndex: -1 会被父级具有背景色的容器遮挡，改为 0 并禁用指针事件
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: isLoading ? "rgba(240, 240, 240, 0.5)" : "transparent",
        transition: "background-color 0.3s ease",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: PROFILE_CONFIG.backgroundConfig.opacity }}
      transition={{ duration: 1 }}
    />
  );
}

export default Background;
