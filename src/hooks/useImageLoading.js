import { useState } from "react";

export const useImageLoading = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  return {
    isImageLoaded,
    setIsImageLoaded,
    isAvatarLoaded,
    setIsAvatarLoaded,
  };
};
