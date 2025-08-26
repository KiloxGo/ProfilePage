import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Progress,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";

export const MusicPlayer = ({ song, audioUrl, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen: showControls, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = volume / 100;

      // 尝试自动播放
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log("Auto-play prevented:", error);
            setIsLoading(false);
          });
      }
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Play failed:", error);
            });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatArtists = (artists) => {
    return artists.join(" / ");
  };

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      w="320px"
      bg={PROFILE_CONFIG.colors.background.card}
      backdropFilter="blur(20px)"
      borderRadius="16px"
      boxShadow="0 12px 32px rgba(54, 89, 185, 0.3), 0 4px 12px rgba(119, 187, 221, 0.2)"
      border={`1px solid ${PROFILE_CONFIG.colors.secondary}40`}
      overflow="hidden"
      zIndex="9999"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      {/* 头部 - 歌曲信息 */}
      <Flex
        p={4}
        align="center"
        gap={3}
        cursor="pointer"
        onClick={onToggle}
        _hover={{
          bg: `${PROFILE_CONFIG.colors.background.cardHover}`,
        }}
        transition="all 0.2s ease"
      >
        <Box
          w="50px"
          h="50px"
          borderRadius="8px"
          overflow="hidden"
          flexShrink={0}
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
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
                bg={PROFILE_CONFIG.colors.background.badge}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  icon="mingcute:music-fill"
                  width="20"
                  height="20"
                  color={PROFILE_CONFIG.colors.text.muted}
                />
              </Box>
            }
          />
        </Box>

        <VStack spacing={0} align="stretch" flex="1" minW="0">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={PROFILE_CONFIG.colors.text.primary}
            noOfLines={1}
          >
            {song.name}
          </Text>
          <Text
            fontSize="xs"
            color={PROFILE_CONFIG.colors.text.secondary}
            noOfLines={1}
          >
            {formatArtists(song.artists)}
          </Text>
        </VStack>

        <HStack spacing={2}>
          <IconButton
            aria-label={isPlaying ? "暂停" : "播放"}
            icon={
              isLoading ? (
                <Icon
                  icon="mingcute:loading-fill"
                  width="16"
                  height="16"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : isPlaying ? (
                <Icon icon="mingcute:pause-fill" width="16" height="16" />
              ) : (
                <Icon icon="mingcute:play-fill" width="16" height="16" />
              )
            }
            size="sm"
            variant="ghost"
            color={PROFILE_CONFIG.colors.primary}
            _hover={{
              bg: `${PROFILE_CONFIG.colors.primary}20`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            isDisabled={isLoading}
          />

          <IconButton
            aria-label="关闭"
            icon={<Icon icon="mingcute:close-line" width="14" height="14" />}
            size="sm"
            variant="ghost"
            color={PROFILE_CONFIG.colors.text.muted}
            _hover={{
              bg: "rgba(255, 255, 255, 0.1)",
              color: PROFILE_CONFIG.colors.text.secondary,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        </HStack>
      </Flex>

      {/* 展开的控制面板 */}
      <Collapse in={showControls}>
        <VStack spacing={3} p={4} pt={0}>
          {/* 进度条 */}
          <VStack spacing={1} w="full">
            <Slider
              value={currentTime}
              max={duration || 100}
              onChange={handleSeek}
              focusThumbOnChange={false}
              size="sm"
            >
              <SliderTrack bg={`${PROFILE_CONFIG.colors.secondary}30`}>
                <SliderFilledTrack bg={PROFILE_CONFIG.colors.primary} />
              </SliderTrack>
              <SliderThumb
                boxSize={3}
                bg={PROFILE_CONFIG.colors.primary}
                _focus={{
                  boxShadow: `0 0 0 3px ${PROFILE_CONFIG.colors.primary}30`,
                }}
              />
            </Slider>
            <HStack
              justify="space-between"
              w="full"
              fontSize="xs"
              color={PROFILE_CONFIG.colors.text.muted}
            >
              <Text>{formatTime(currentTime)}</Text>
              <Text>{formatTime(duration)}</Text>
            </HStack>
          </VStack>

          {/* 音量控制 */}
          <HStack spacing={2} w="full">
            <Icon
              icon="mingcute:volume-line"
              width="14"
              height="14"
              color={PROFILE_CONFIG.colors.text.muted}
            />
            <Slider
              value={volume}
              onChange={setVolume}
              max={100}
              focusThumbOnChange={false}
              size="sm"
              flex="1"
            >
              <SliderTrack bg={`${PROFILE_CONFIG.colors.secondary}30`}>
                <SliderFilledTrack bg={PROFILE_CONFIG.colors.accent} />
              </SliderTrack>
              <SliderThumb
                boxSize={3}
                bg={PROFILE_CONFIG.colors.accent}
                _focus={{
                  boxShadow: `0 0 0 3px ${PROFILE_CONFIG.colors.accent}30`,
                }}
              />
            </Slider>
            <Text
              fontSize="xs"
              color={PROFILE_CONFIG.colors.text.muted}
              minW="28px"
            >
              {volume}%
            </Text>
          </HStack>
        </VStack>
      </Collapse>
    </Box>
  );
};
