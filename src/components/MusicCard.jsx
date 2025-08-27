import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  HStack,
  IconButton,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";

export const MusicCard = ({
  song,
  onPlay,
  isPlaying,
  isLoading,
  isPlayable = true,
}) => {
  const toast = useToast();

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatArtists = (artists) => {
    return artists.join(" / ");
  };

  const handleCopySongName = async () => {
    try {
      await navigator.clipboard.writeText(song.name);
      toast({
        title: "复制成功",
        description: `已复制歌曲名：${song.name}`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      bg={PROFILE_CONFIG.colors.background.card}
      backdropFilter="blur(12px)"
      borderRadius="12px"
      boxShadow={`0 4px 12px rgba(54, 89, 185, 0.12), 0 2px 4px rgba(119, 187, 221, 0.08)`}
      border={`1px solid ${PROFILE_CONFIG.colors.secondary}25`}
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: `0 8px 25px rgba(54, 89, 185, 0.18), 0 4px 8px rgba(119, 187, 221, 0.12)`,
        borderColor: `${PROFILE_CONFIG.colors.secondary}40`,
      }}
      h="140px"
      position="relative"
    >
      <Flex h="full" align="stretch">
        {/* 左侧 - 封面区域 (正方形) */}
        <Flex
          flex="0 0 140px"
          align="center"
          justify="center"
          p={3}
          bg={`${PROFILE_CONFIG.colors.background.badge}`}
          borderRight={`1px solid ${PROFILE_CONFIG.colors.secondary}20`}
        >
          <Box
            w="126px"
            h="126px"
            borderRadius="10px"
            overflow="hidden"
            position="relative"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
            flexShrink={0}
          >
            <Image
              src={song.cover}
              alt={song.album}
              w="full"
              h="full"
              objectFit="cover"
              fallback={
                <Box
                  w="full"
                  h="full"
                  bg={PROFILE_CONFIG.colors.background.card}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    icon="mingcute:music-fill"
                    width="24"
                    height="24"
                    color={PROFILE_CONFIG.colors.text.muted}
                  />
                </Box>
              }
            />
          </Box>
        </Flex>

        {/* 右侧 - 歌曲信息 */}
        <Flex
          flex="1"
          direction="column"
          p={4}
          pr={5}
          justify="space-between"
          position="relative"
        >
          {/* 歌曲信息 */}
          <VStack spacing={2} align="stretch" flex="1">
            {/* 歌名 */}
            <Flex align="flex-start" wrap="wrap" gap={1}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={PROFILE_CONFIG.colors.text.primary}
                title={song.name}
                lineHeight="1.3"
                display="inline"
              >
                {song.name}
              </Text>
              <IconButton
                aria-label="复制歌曲名"
                icon={
                  <Icon icon="mingcute:copy-2-line" width="12" height="12" />
                }
                size="xs"
                variant="ghost"
                color={PROFILE_CONFIG.colors.text.muted}
                minW="auto"
                h="18px"
                w="18px"
                p={0}
                borderRadius="3px"
                opacity={0.6}
                _hover={{
                  opacity: 1,
                  bg: `${PROFILE_CONFIG.colors.primary}10`,
                  color: PROFILE_CONFIG.colors.primary,
                }}
                _active={{
                  transform: "scale(0.95)",
                }}
                transition="all 0.2s ease"
                onClick={handleCopySongName}
                flexShrink={0}
              />
            </Flex>

            {/* 艺术家 */}
            <Text
              fontSize="md"
              color={PROFILE_CONFIG.colors.text.secondary}
              noOfLines={1}
              title={formatArtists(song.artists)}
            >
              {formatArtists(song.artists)}
            </Text>

            {/* 专辑信息 */}
            <HStack spacing={1} align="center">
              <Text
                fontSize="xs"
                color={PROFILE_CONFIG.colors.text.light}
                fontStyle="italic"
              >
                from
              </Text>
              <Text
                fontSize="sm"
                color={PROFILE_CONFIG.colors.text.muted}
                fontWeight="medium"
                noOfLines={1}
                title={song.album}
              >
                {song.album}
              </Text>
            </HStack>
          </VStack>

          {/* 播放按钮 */}
          <Box position="absolute" bottom="16px" right="16px">
            <IconButton
              aria-label={
                !isPlayable
                  ? "版权受限，无法播放"
                  : isPlaying
                  ? "正在播放"
                  : "播放"
              }
              icon={
                !isPlayable ? (
                  <Icon icon="mingcute:lock-line" width="18" height="18" />
                ) : isLoading ? (
                  <Spinner size="md" color={PROFILE_CONFIG.colors.primary} />
                ) : isPlaying ? (
                  <Icon icon="mingcute:pause-fill" width="20" height="20" />
                ) : (
                  <Icon icon="mingcute:play-fill" width="20" height="20" />
                )
              }
              size="md"
              variant="solid"
              bg={
                !isPlayable
                  ? "#9CA3AF" // 灰色表示不可播放
                  : isPlaying
                  ? "#2B4C9C"
                  : PROFILE_CONFIG.colors.primary
              }
              color="white"
              borderRadius="50%"
              boxShadow={
                !isPlayable
                  ? "0 4px 12px rgba(156, 163, 175, 0.4)"
                  : isPlaying
                  ? "0 4px 12px rgba(54, 89, 185, 0.4)"
                  : "0 4px 12px rgba(54, 89, 185, 0.4)"
              }
              _hover={{
                bg: !isPlayable ? "#9CA3AF" : isPlaying ? "#2B4C9C" : "#2B4C9C",
                transform: !isPlayable ? "none" : "scale(1.1)",
                boxShadow: !isPlayable
                  ? "0 4px 12px rgba(156, 163, 175, 0.4)"
                  : isPlaying
                  ? "0 6px 16px rgba(54, 89, 185, 0.5)"
                  : "0 6px 16px rgba(54, 89, 185, 0.5)",
                cursor: !isPlayable ? "not-allowed" : "pointer",
              }}
              _active={{
                transform: !isPlayable ? "none" : "scale(0.95)",
              }}
              transition="all 0.2s ease-in-out"
              onClick={isPlayable ? onPlay : undefined}
              isDisabled={!isPlayable || isLoading}
            />
          </Box>

          {/* 时长显示 */}
          <Text
            position="absolute"
            bottom="16px"
            right="68px"
            fontSize="sm"
            color={PROFILE_CONFIG.colors.text.light}
            fontFamily="mono"
          >
            {formatDuration(song.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* 播放状态指示器 */}
      {isPlaying && (
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="2px"
          bg={`linear-gradient(90deg, ${PROFILE_CONFIG.colors.primary}, ${PROFILE_CONFIG.colors.accent})`}
          opacity="0.8"
        />
      )}
    </Box>
  );
};
