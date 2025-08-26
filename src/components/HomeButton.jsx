import { Box, Flex } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";

export const HomeButton = () => {
  //TODO 实际上这里以后用于跳到main,暂时不作修改
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
      cursor="pointer"
      onClick={handleHomeClick}
      _hover={{
        bg: PROFILE_CONFIG.colors.background.cardHover,
        boxShadow: `0 8px 25px rgba(54, 89, 185, 0.25), 0 4px 8px rgba(54, 89, 185, 0.15)`,
      }}
      bg={PROFILE_CONFIG.colors.background.card}
      backdropFilter="blur(12px)"
      w="70px"
      h="70px"
      borderRadius="0 0 35px 0"
      boxShadow={`0 6px 20px rgba(54, 89, 185, 0.2), 0 2px 6px rgba(119, 187, 221, 0.15)`}
      border={`1px solid ${PROFILE_CONFIG.colors.secondary}40`}
      borderTop="none"
      borderLeft="none"
      transition="all 0.3s ease-in-out"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon
        icon="mingcute:home-4-fill"
        width="28"
        height="28"
        color={PROFILE_CONFIG.colors.primary}
      />
    </Box>
  );
};
