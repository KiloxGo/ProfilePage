import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PROFILE_CONFIG } from "../config/profile";

export function Background() {
  const [randomImage] = useState(
    PROFILE_CONFIG.backgroundConfig.images[
      Math.floor(Math.random() * PROFILE_CONFIG.backgroundConfig.images.length)
    ]
  );
  const [isLoading, setIsLoading] = useState(true);
  const backgroundRef = useRef(null);

  const updateBackgroundImage = (imageUrl = randomImage) => {
    const background = backgroundRef.current;
    if (background) {
      setIsLoading(true);
      const img = new Image();
      img.onload = () => {
        background.style.backgroundImage = `url(${imageUrl})`;
        setIsLoading(false);
      };
      img.onerror = () => {
        console.warn(`Failed to load background image: ${imageUrl}`);
        setIsLoading(false);
      };
      img.src = imageUrl;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateBackgroundImage();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const background = backgroundRef.current;
    if (background) {
      observer.observe(background);
    }

    return () => {
      observer.disconnect();
    };
  }, [randomImage]);

  return (
    <motion.div
      ref={backgroundRef}
      className="custom-clip-path"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "auto",
        maxWidth: "25vw",
        height: "100vh",
        aspectRatio: "0.5",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
        backgroundColor: isLoading ? "rgba(240, 240, 240, 0.3)" : "transparent",
        transition: "background-color 0.3s ease",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: PROFILE_CONFIG.backgroundConfig.opacity }}
      transition={{ duration: 1 }}
    />
  );
}

export default Background;
