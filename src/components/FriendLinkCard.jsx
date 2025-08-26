import {
  Box,
  Flex,
  Text,
  Avatar,
  HStack,
  VStack,
  Badge,
  Link,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";

export const FriendLinkCard = ({ friend }) => {
  const { github, project } = friend;

  const handleGitHubClick = (e) => {
    e.stopPropagation();
    window.open(`https://github.com/${github.username}`, "_blank");
  };

  const handleProjectClick = (e) => {
    e.stopPropagation();
    window.open(project.url, "_blank");
  };

  const formatStars = (stars) => {
    if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}k`;
    }
    return stars.toString();
  };

  return (
    <Box
      bg={PROFILE_CONFIG.colors.background.card}
      backdropFilter="blur(12px)"
      borderRadius="16px"
      boxShadow={`0 4px 12px rgba(54, 89, 185, 0.12), 0 2px 4px rgba(119, 187, 221, 0.08)`}
      border={`1px solid ${PROFILE_CONFIG.colors.secondary}25`}
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: `0 8px 25px rgba(54, 89, 185, 0.18), 0 4px 8px rgba(119, 187, 221, 0.12)`,
        borderColor: `${PROFILE_CONFIG.colors.secondary}40`,
      }}
      h="120px"
    >
      <Flex h="full" align="stretch">
        {/* 左侧 - GitHub信息 (40%) */}
        <Flex
          flex="0 0 40%"
          align="center"
          justify="center"
          p={4}
          bg={`${PROFILE_CONFIG.colors.background.badge}`}
          borderRight={`1px solid ${PROFILE_CONFIG.colors.secondary}20`}
          cursor="pointer"
          onClick={handleGitHubClick}
          _hover={{
            bg: `${PROFILE_CONFIG.colors.background.cardHover}`,
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <VStack spacing={2} align="center">
            <Avatar
              src={github.avatar}
              size="md"
              border={`2px solid ${PROFILE_CONFIG.colors.primary}`}
              boxShadow={`0 4px 12px rgba(54, 89, 185, 0.3)`}
            />
            <VStack spacing={0} align="center">
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={PROFILE_CONFIG.colors.text.primary}
                textAlign="center"
                noOfLines={1}
              >
                {github.name}
              </Text>
              <Text
                fontSize="xs"
                color={PROFILE_CONFIG.colors.text.muted}
                fontFamily="mono"
              >
                @{github.username}
              </Text>
            </VStack>
          </VStack>
        </Flex>

        {/* 右侧 - 项目信息 (60%) */}
        <Flex
          flex="1"
          direction="column"
          p={4}
          justify="space-between"
          cursor="pointer"
          onClick={handleProjectClick}
          _hover={{
            bg: `${PROFILE_CONFIG.colors.background.cardHover}`,
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <VStack spacing={2} align="flex-start" flex="1">
            {/* 项目标题和语言 */}
            <HStack justify="space-between" w="full" align="flex-start">
              <Text
                fontSize="md"
                fontWeight="bold"
                color={PROFILE_CONFIG.colors.text.secondary}
                noOfLines={1}
                flex="1"
              >
                {project.name}
              </Text>
              <Badge
                colorScheme="blue"
                variant="subtle"
                fontSize="2xs"
                px={2}
                py={1}
                borderRadius="full"
                flexShrink={0}
                ml={2}
              >
                {project.language}
              </Badge>
            </HStack>

            {/* 项目描述 */}
            <Text
              fontSize="xs"
              color={PROFILE_CONFIG.colors.text.muted}
              lineHeight="1.4"
              noOfLines={2}
              flex="1"
            >
              {project.description}
            </Text>
          </VStack>

          {/* 底部 - Stars和链接图标 */}
          <HStack justify="space-between" align="center" pt={1}>
            {/* 只有GitHub项目才显示星标 */}
            {project.stars !== null && project.stars !== undefined ? (
              <HStack spacing={1} align="center">
                <Icon
                  icon="mingcute:star-fill"
                  width="12"
                  height="12"
                  color="#FFD700"
                />
                <Text
                  fontSize="xs"
                  color={PROFILE_CONFIG.colors.text.light}
                  fontWeight="medium"
                >
                  {formatStars(project.stars)}
                </Text>
              </HStack>
            ) : (
              <Box /> /* 占位元素，保持布局对齐 */
            )}

            <Icon
              icon="mingcute:external-link-line"
              width="14"
              height="14"
              color={PROFILE_CONFIG.colors.primary}
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};
