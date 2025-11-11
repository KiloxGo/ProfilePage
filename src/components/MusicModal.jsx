import { useState, useEffect, useCallback, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  ModalCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";
import { MUSIC_CONFIG } from "../config/music";
import { MusicCard } from "./MusicCard";
import { MusicPlayer } from "./MusicPlayer";

export const MusicModal = ({ isOpen, onClose }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(0);
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const playlistCacheRef = useRef(new Map());
  const isMobile = useBreakpointValue({ base: true, md: false });

  const loadPlaylistData = useCallback(async (playlistId) => {
    if (!playlistId) {
      return;
    }

    const cached = playlistCacheRef.current.get(playlistId);
    if (cached) {
      setMusicData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setMusicData([]);

    try {
      const response = await fetch(
        `${MUSIC_CONFIG.api.baseUrl}${MUSIC_CONFIG.api.endpoints.playlist}?id=${playlistId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch playlist");
      }

      const data = await response.json();

      if (data.code === 200 && data.songs) {
        // 处理所有歌曲，包括版权受限的
        const formattedMusic = data.songs.map((song, index) => {
          const privilege = data.privileges?.[index];
          const isPlayable =
            privilege && privilege.st === 0 && privilege.pl > 0;

          return {
            id: song.id,
            name: song.name,
            artists: song.ar.map((artist) => artist.name),
            album: song.al.name,
            cover: song.al.picUrl,
            duration: song.dt,
            isPlayable: isPlayable, // 标记是否可播放
          };
        });

        setMusicData(formattedMusic);
        playlistCacheRef.current.set(playlistId, formattedMusic);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("加载歌单失败");
      setMusicData([]);
      console.error("Failed to load playlist", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载歌单数据
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const playlist = MUSIC_CONFIG.playlists[selectedPlaylist];
    if (!playlist) {
      return;
    }

    loadPlaylistData(playlist.id);
  }, [isOpen, selectedPlaylist, loadPlaylistData]);

  const handlePlaySong = async (song) => {
    // 检查歌曲是否可播放
    if (!song.isPlayable) {
      // 可以显示一个提示，告诉用户这首歌无法播放
      return;
    }

    if (currentPlaying?.id === song.id && audioUrl) {
      // 如果当前歌曲已经在播放，直接返回
      return;
    }

    setLoadingAudio(true);
    setCurrentPlaying(song);
    setAudioUrl(null);

    try {
      const response = await fetch(
        `${MUSIC_CONFIG.api.baseUrl}${MUSIC_CONFIG.api.endpoints.songUrl}?id=${song.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch song URL");
      }

      const data = await response.json();

      if (data.code === 200 && data.data?.[0]?.url) {
        setAudioUrl(data.data[0].url);
      } else {
        throw new Error("Song URL not available");
      }
    } catch (err) {
      setCurrentPlaying(null);
      console.error("Failed to fetch song URL", err);
      // 可以显示错误提示
    } finally {
      setLoadingAudio(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <VStack spacing={4}>
            <Spinner
              size="lg"
              color={PROFILE_CONFIG.colors.primary}
              thickness="3px"
            />
            <Text color={PROFILE_CONFIG.colors.text.muted}>
              正在加载歌单...
            </Text>
          </VStack>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert status="warning" borderRadius="md" bg="rgba(255, 193, 7, 0.1)">
          <AlertIcon color="orange.400" />
          <Text color={PROFILE_CONFIG.colors.text.secondary}>{error}</Text>
        </Alert>
      );
    }

    if (musicData.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <Text color={PROFILE_CONFIG.colors.text.muted}>暂无歌曲</Text>
        </Box>
      );
    }

    return (
      <VStack spacing={3} align="stretch">
        {musicData.map((song) => (
          <MusicCard
            key={song.id}
            song={song}
            onPlay={() => handlePlaySong(song)}
            isPlaying={currentPlaying?.id === song.id}
            isLoading={loadingAudio && currentPlaying?.id === song.id}
            isPlayable={song.isPlayable}
          />
        ))}
      </VStack>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={!isMobile}
        size={isMobile ? "full" : "4xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(8px)" />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          mx={{ base: 4, md: 0 }}
          my={{ base: 6, md: 0 }}
          maxW={isMobile ? "calc(100vw - 32px)" : "900px"}
          borderRadius={{ base: "18px", md: "0" }}
        >
          <ModalCloseButton
            top={{ base: 5, md: 6 }}
            right={{ base: 4, md: -10 }}
            color="white"
            _hover={{ color: PROFILE_CONFIG.colors.primary }}
          />
          <Flex
            direction={{ base: "column", md: "row" }}
            align="stretch"
            w="full"
            gap={{ base: 6, md: 4 }}
          >
            {/* 主Modal内容 */}
            <Box
              bg={PROFILE_CONFIG.colors.background.card}
              backdropFilter="blur(20px)"
              border={`1px solid ${PROFILE_CONFIG.colors.secondary}40`}
              borderRadius={{ base: "16px", md: "20px" }}
              boxShadow="0 20px 40px rgba(54, 89, 185, 0.2), 0 8px 16px rgba(119, 187, 221, 0.15)"
              maxH={{ base: "calc(100vh - 160px)", md: "80vh" }}
              flex="1"
              position="relative"
              display="flex"
              flexDirection="column"
              overflow="hidden"
            >
              {/* 标题 */}
              <Box
                pt={{ base: 7, md: 8 }}
                pb={{ base: 6, md: 4 }}
                px={{ base: 6, md: 8 }}
              >
                <Box display="flex" alignItems="center" gap={3}>
                  <Icon
                    icon="mingcute:music-fill"
                    width="28"
                    height="28"
                    color={PROFILE_CONFIG.colors.primary}
                  />
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    color={PROFILE_CONFIG.colors.text.secondary}
                  >
                    {MUSIC_CONFIG.playlists[selectedPlaylist].name}
                  </Text>
                </Box>
              </Box>

              {/* 移动端歌单切换 */}
              <HStack
                spacing={3}
                px={{ base: 6, md: 8 }}
                pb={{ base: 4, md: 0 }}
                pt={{ base: 3, md: 0 }}
                display={{ base: "flex", md: "none" }}
                overflowX="auto"
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {MUSIC_CONFIG.playlists.map((playlist, index) => (
                  <Box
                    key={playlist.id}
                    as="button"
                    px={4}
                    py={2}
                    borderRadius="999px"
                    bg={
                      index === selectedPlaylist
                        ? PROFILE_CONFIG.colors.primary
                        : PROFILE_CONFIG.colors.background.badge
                    }
                    color={
                      index === selectedPlaylist
                        ? "white"
                        : PROFILE_CONFIG.colors.text.secondary
                    }
                    fontSize="sm"
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                    onClick={() => setSelectedPlaylist(index)}
                  >
                    {playlist.name}
                  </Box>
                ))}
              </HStack>

              <ModalBody
                px={{ base: 6, md: 8 }}
                pb={{ base: 6, md: 8 }}
                pt={0}
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(54, 89, 185, 0.3)",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(54, 89, 185, 0.5)",
                  },
                }}
              >
                {renderContent()}
              </ModalBody>
            </Box>

            {/* 右侧标签栏 */}
            <VStack
              spacing={2}
              bg="transparent"
              p={4}
              minW="120px"
              maxH="80vh"
              justify="flex-start"
              display={{ base: "none", md: "flex" }}
            >
              {MUSIC_CONFIG.playlists.map((playlist, index) => (
                <Box
                  key={playlist.id}
                  as="button"
                  w="full"
                  p={3}
                  borderRadius="12px"
                  bg={
                    index === selectedPlaylist
                      ? PROFILE_CONFIG.colors.primary
                      : PROFILE_CONFIG.colors.background.badge
                  }
                  color={
                    index === selectedPlaylist
                      ? "white"
                      : PROFILE_CONFIG.colors.text.secondary
                  }
                  fontSize="sm"
                  fontWeight="semibold"
                  transition="all 0.3s ease"
                  border={
                    index === selectedPlaylist
                      ? "none"
                      : `1px solid ${PROFILE_CONFIG.colors.secondary}30`
                  }
                  _hover={{
                    bg:
                      index === selectedPlaylist
                        ? PROFILE_CONFIG.colors.primary
                        : `${PROFILE_CONFIG.colors.primary}20`,
                    color:
                      index === selectedPlaylist
                        ? "white"
                        : PROFILE_CONFIG.colors.primary,
                    transform: "translateX(-2px)",
                    borderColor: PROFILE_CONFIG.colors.primary,
                  }}
                  onClick={() => setSelectedPlaylist(index)}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {playlist.name}
                </Box>
              ))}

              {/* 关闭按钮 */}
              <Box
                as="button"
                mt="auto"
                p={3}
                borderRadius="12px"
                bg={PROFILE_CONFIG.colors.background.badge}
                color={PROFILE_CONFIG.colors.text.muted}
                fontSize="sm"
                transition="all 0.3s ease"
                border={`1px solid ${PROFILE_CONFIG.colors.secondary}30`}
                _hover={{
                  bg: `${PROFILE_CONFIG.colors.primary}20`,
                  color: PROFILE_CONFIG.colors.primary,
                  borderColor: PROFILE_CONFIG.colors.primary,
                }}
                onClick={onClose}
                w="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon icon="mingcute:close-line" width="16" height="16" />
              </Box>
            </VStack>
          </Flex>
        </ModalContent>
      </Modal>

      {/* 音乐播放器 */}
      {currentPlaying && audioUrl && (
        <MusicPlayer
          song={currentPlaying}
          audioUrl={audioUrl}
          onClose={() => {
            setCurrentPlaying(null);
            setAudioUrl(null);
          }}
        />
      )}
    </>
  );
};
