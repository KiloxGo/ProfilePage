import { Box, Image, Skeleton, Avatar } from "@chakra-ui/react";
import { PROFILE_CONFIG } from "../config/profile";

export const ProfileImage = ({
  isImageLoaded,
  setIsImageLoaded,
  isAvatarLoaded,
  setIsAvatarLoaded,
}) => {
  const { images, colors, sizes } = PROFILE_CONFIG;

  return (
    <>
      {/* 桌面端圆形边框 */}
      <Box
        border="5px solid"
        borderColor={colors.primary}
        borderRadius="50"
        boxSize={sizes.avatar.desktop}
        alignItems={"center"}
        justifyContent={"center"}
        top={"30%"}
        display={{ base: "none", lg: "block" }}
      />

      {/* 移动端头像 */}
      <Box display={{ base: "block", lg: "none" }}>
        <Image
          src={images.avatar}
          onLoad={() => setIsAvatarLoaded(true)}
          display="none"
        />
        <Skeleton
          isLoaded={isAvatarLoaded}
          w={{ base: sizes.avatar.mobile, md: sizes.avatar.desktop }}
          h={{ base: sizes.avatar.mobile, md: sizes.avatar.desktop }}
          borderRadius="full"
        >
          <Avatar
            src={images.avatar}
            name={PROFILE_CONFIG.name}
            size="full"
            w="100%"
            h="100%"
            border={`3px solid ${colors.primary}`}
          />
        </Skeleton>
      </Box>

      {/* 桌面端背景图片 */}
      <Skeleton
        isLoaded={isImageLoaded}
        w={{ base: "0", lg: sizes.background.width }}
        h={{ base: "0", lg: sizes.background.height }}
        position={{ base: "static", lg: "absolute" }}
        display={{ base: "none", lg: "block" }}
      >
        <Image
          src={images.background}
          onLoad={() => setIsImageLoaded(true)}
          w="100%"
          h="100%"
          objectFit="contain"
        />
      </Skeleton>
    </>
  );
};
