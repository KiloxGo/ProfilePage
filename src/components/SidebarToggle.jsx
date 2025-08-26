import {
  Box,
  VStack,
  IconButton,
  Collapse,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";
import { SIDEBAR_CONFIG, handleButtonAction } from "../config/sidebar";
import { ProfileCard } from "./ProfileCard";
import { FriendLinksModal } from "./FriendLinksModal";
import { MusicModal } from "./MusicModal";

export const SidebarToggle = () => {
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isProfileCardOpen,
    onOpen: onProfileCardOpen,
    onClose: onProfileCardClose,
  } = useDisclosure();
  const {
    isOpen: isFriendLinksOpen,
    onOpen: onFriendLinksOpen,
    onClose: onFriendLinksClose,
  } = useDisclosure();
  const {
    isOpen: isMusicOpen,
    onOpen: onMusicOpen,
    onClose: onMusicClose,
  } = useDisclosure();

  return (
    <Box
      position="fixed"
      right={SIDEBAR_CONFIG.styles.position.right}
      top={SIDEBAR_CONFIG.styles.position.top}
      zIndex="1000"
      display="flex"
      alignItems="flex-start"
    >
      {/* 侧边栏按钮列表 */}
      <Collapse in={isOpen} animateOpacity>
        <VStack
          spacing={SIDEBAR_CONFIG.styles.button.spacing}
          mr={3}
          maxH="40vh" // 确保不与底部组件重叠
          overflowY="auto"
          py={5} // 为hover效果预留空间
          sx={{
            // 隐藏滚动条但保持滚动功能
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {SIDEBAR_CONFIG.buttons.map((button) => (
            <Box
              key={button.id}
              bg={PROFILE_CONFIG.colors.background.card}
              backdropFilter="blur(12px)"
              borderRadius={SIDEBAR_CONFIG.styles.button.borderRadius}
              boxShadow={`0 2px 8px rgba(54, 89, 185, 0.1), 0 1px 3px rgba(119, 187, 221, 0.08)`}
              border={`1px solid ${PROFILE_CONFIG.colors.secondary}30`}
              overflow="visible"
              _hover={{
                bg: PROFILE_CONFIG.colors.background.cardHover,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 15px rgba(54, 89, 185, 0.2), 0 2px 6px rgba(119, 187, 221, 0.15)`,
              }}
              transition={`all ${SIDEBAR_CONFIG.styles.animation.duration} ${SIDEBAR_CONFIG.styles.animation.easing}`}
              cursor="pointer"
              onClick={() => {
                if (button.type === "modal") {
                  if (button.modal === "profile-card") {
                    onProfileCardOpen();
                  } else if (button.modal === "friend-links") {
                    onFriendLinksOpen();
                  } else if (button.id === "musicList") {
                    onMusicOpen();
                  }
                } else {
                  handleButtonAction(button);
                }
              }}
            >
              <Box
                px={4}
                py={3}
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                minW={SIDEBAR_CONFIG.styles.button.width}
                h={SIDEBAR_CONFIG.styles.button.height}
                gap={3}
              >
                <Icon
                  icon={button.icon}
                  width="20"
                  height="20"
                  color={PROFILE_CONFIG.colors.primary}
                  style={{ marginLeft: "4px" }}
                />
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={PROFILE_CONFIG.colors.text.secondary}
                  whiteSpace="nowrap"
                >
                  {button.label}
                </Text>
              </Box>
            </Box>
          ))}
        </VStack>
      </Collapse>

      {/* 三角形切换按钮 */}
      <Box
        bg={PROFILE_CONFIG.colors.background.card}
        backdropFilter="blur(12px)"
        w={SIDEBAR_CONFIG.styles.toggle.width}
        h={SIDEBAR_CONFIG.styles.toggle.height}
        borderRadius={SIDEBAR_CONFIG.styles.toggle.borderRadius}
        boxShadow={`0 2px 8px rgba(54, 89, 185, 0.1), 0 1px 3px rgba(119, 187, 221, 0.08)`}
        border={`1px solid ${PROFILE_CONFIG.colors.secondary}30`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        onClick={onToggle}
        mt={SIDEBAR_CONFIG.styles.toggle.marginTop}
        _hover={{
          bg: PROFILE_CONFIG.colors.background.cardHover,
          transform: "translateY(-2px)",
          boxShadow: `0 4px 15px rgba(54, 89, 185, 0.2), 0 2px 6px rgba(119, 187, 221, 0.15)`,
        }}
        transition={`all ${SIDEBAR_CONFIG.styles.animation.duration} ${SIDEBAR_CONFIG.styles.animation.easing}`}
        position="relative"
      >
        {/* 钝角三角形 */}
        <Box
          width="0"
          height="0"
          borderTop="12px solid transparent"
          borderBottom="12px solid transparent"
          borderLeft={
            isOpen ? "none" : `16px solid ${PROFILE_CONFIG.colors.primary}`
          }
          borderRight={
            isOpen ? `16px solid ${PROFILE_CONFIG.colors.primary}` : "none"
          }
          transition={`all ${SIDEBAR_CONFIG.styles.animation.duration} ${SIDEBAR_CONFIG.styles.animation.easing}`}
          transform={isOpen ? "translateX(2px)" : "translateX(-2px)"}
        />
      </Box>

      {/* 个人名片弹窗 */}
      <ProfileCard isOpen={isProfileCardOpen} onClose={onProfileCardClose} />

      {/* 友链弹窗 */}
      <FriendLinksModal
        isOpen={isFriendLinksOpen}
        onClose={onFriendLinksClose}
      />

      {/* 音乐弹窗 */}
      <MusicModal isOpen={isMusicOpen} onClose={onMusicClose} />
    </Box>
  );
};
