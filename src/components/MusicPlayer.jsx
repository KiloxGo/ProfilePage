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

  // 使用节流来优化时间更新
  const timeUpdateThrottleRef = useRef(null);

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
          .catch(() => {
            // 自动播放被阻止时静默失败
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
            .catch(() => {
              // 播放失败静默处理
            });
        }
      }
    }
  };

  // 节流时间更新，避免过于频繁的状态更新
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      if (timeUpdateThrottleRef.current) {
        clearTimeout(timeUpdateThrottleRef.current);
      }
      timeUpdateThrottleRef.current = setTimeout(() => {
        setCurrentTime(audioRef.current.currentTime);
      }, 100); // 100ms节流
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

  // 音浪效果组件 - 高性能版本
  const AudioWave = React.memo(() => {
    const waveRef = useRef(null);
    const animationRef = useRef(null);
    const barsRef = useRef([]);
    const isPlayingRef = useRef(isPlaying);

    // 同步最新的播放状态
    useEffect(() => {
      isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
      if (!waveRef.current) return;

      const bars = waveRef.current.children;
      barsRef.current = Array.from(bars);

      let lastTime = 0;
      const targetFPS = 24; // 降低到电影帧率，更加节能
      const frameInterval = 1000 / targetFPS;

      // 预计算一些值以提高性能
      const barCount = barsRef.current.length;
      const phaseStep = 0.5;
      const timeScale = 1 / 200;

      const animateWave = (currentTime) => {
        if (currentTime - lastTime >= frameInterval) {
          const playing = isPlayingRef.current;

          barsRef.current.forEach((bar, index) => {
            if (!bar) return;

            if (playing) {
              const baseHeight = Math.random() * 0.6 + 0.1;
              const phase =
                (currentTime * timeScale + index * phaseStep) % (2 * Math.PI);
              const width = Math.sin(phase) * 0.3 + baseHeight;

              // 使用transform而不是width改变，性能更好
              bar.style.transform = `scaleX(${width})`;
              bar.style.opacity = "0.8";
            } else {
              bar.style.transform = "scaleX(0.1)";
              bar.style.opacity = "0.3";
            }
          });

          lastTime = currentTime;
        }

        animationRef.current = requestAnimationFrame(animateWave);
      };

      animationRef.current = requestAnimationFrame(animateWave);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []); // 移除isPlaying依赖，避免重复创建动画

    return (
      <VStack
        ref={waveRef}
        spacing={0.5}
        justify="space-evenly"
        align="center"
        h="400px"
        w="60px"
      >
        {Array.from({ length: 36 }, (_, index) => (
          <Box
            key={index}
            h="1.5px"
            w="100%" // 固定宽度，通过transform缩放
            bg={PROFILE_CONFIG.colors.primary}
            borderRadius="1px"
            opacity={0.3}
            minW="4px"
            maxW="50px"
            transformOrigin="left center" // 设置缩放原点
            willChange="transform, opacity" // 优化GPU加速
            style={{
              transform: "scaleX(0.1)", // 初始缩放
            }}
          />
        ))}
      </VStack>
    );
  });

  return (
    <Box
      position="fixed"
      left="40px"
      top="13vh"
      w="360px"
      h="auto"
      minH="450px"
      bg={PROFILE_CONFIG.colors.background.card}
      backdropFilter="blur(20px)"
      borderRadius="16px"
      boxShadow="0 12px 32px rgba(54, 89, 185, 0.3), 0 4px 12px rgba(119, 187, 221, 0.2)"
      border={`1px solid ${PROFILE_CONFIG.colors.secondary}40`}
      overflow="hidden"
      zIndex="9999"
      style={{
        animation:
          "slideInFromLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
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

      {/* 水平布局：左侧播放器，右侧音浪 */}
      <HStack spacing={0} align="stretch" minH="450px">
        {/* 左侧：原播放器内容 */}
        <VStack spacing={4} p={6} align="center" flex="1" justify="center">
          {/* 1. 较大的封面 */}
          <Box
            w="180px"
            h="180px"
            borderRadius="12px"
            overflow="hidden"
            flexShrink={0}
            boxShadow="0 8px 24px rgba(0, 0, 0, 0.3)"
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
                    width="60"
                    height="60"
                    color={PROFILE_CONFIG.colors.text.muted}
                  />
                </Box>
              }
            />
          </Box>

          {/* 2. 歌曲名 */}
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={PROFILE_CONFIG.colors.text.primary}
            textAlign="center"
            noOfLines={2}
            w="full"
            lineHeight="1.3"
          >
            {song.name}
          </Text>

          {/* 3. 作者名 */}
          <Text
            fontSize="md"
            color={PROFILE_CONFIG.colors.text.secondary}
            textAlign="center"
            noOfLines={1}
            w="full"
          >
            {formatArtists(song.artists)}
          </Text>

          {/* 4. 暂停按钮和关闭按钮 */}
          <HStack spacing={4}>
            <IconButton
              aria-label={isPlaying ? "暂停" : "播放"}
              icon={
                isLoading ? (
                  <Icon
                    icon="mingcute:loading-fill"
                    width="24"
                    height="24"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : isPlaying ? (
                  <Icon icon="mingcute:pause-fill" width="24" height="24" />
                ) : (
                  <Icon icon="mingcute:play-fill" width="24" height="24" />
                )
              }
              size="lg"
              variant="solid"
              bg={PROFILE_CONFIG.colors.primary}
              color="white"
              _hover={{
                bg: PROFILE_CONFIG.colors.accent,
                transform: "scale(1.05)",
              }}
              transition="all 0.2s ease"
              onClick={handlePlayPause}
              isDisabled={isLoading}
              borderRadius="full"
            />

            <IconButton
              aria-label="关闭"
              icon={<Icon icon="mingcute:close-line" width="20" height="20" />}
              size="md"
              variant="ghost"
              color={PROFILE_CONFIG.colors.text.muted}
              _hover={{
                bg: "rgba(255, 255, 255, 0.1)",
                color: PROFILE_CONFIG.colors.text.secondary,
                transform: "scale(1.05)",
              }}
              transition="all 0.2s ease"
              onClick={onClose}
              borderRadius="full"
            />
          </HStack>

          {/* 5. 进度条 */}
          <VStack spacing={2} w="full">
            <Slider
              value={currentTime}
              max={duration || 100}
              onChange={handleSeek}
              focusThumbOnChange={false}
              size="md"
            >
              <SliderTrack bg={`${PROFILE_CONFIG.colors.secondary}30`} h="6px">
                <SliderFilledTrack bg={PROFILE_CONFIG.colors.primary} />
              </SliderTrack>
              <SliderThumb
                boxSize={4}
                bg={PROFILE_CONFIG.colors.primary}
                _focus={{
                  boxShadow: `0 0 0 3px ${PROFILE_CONFIG.colors.primary}30`,
                }}
              />
            </Slider>
            <HStack
              justify="space-between"
              w="full"
              fontSize="sm"
              color={PROFILE_CONFIG.colors.text.muted}
            >
              <Text>{formatTime(currentTime)}</Text>
              <Text>{formatTime(duration)}</Text>
            </HStack>
          </VStack>

          {/* 6. 音量条 */}
          <HStack spacing={3} w="full">
            <Icon
              icon="mingcute:volume-line"
              width="18"
              height="18"
              color={PROFILE_CONFIG.colors.text.muted}
            />
            <Slider
              value={volume}
              onChange={setVolume}
              max={100}
              focusThumbOnChange={false}
              size="md"
              flex="1"
            >
              <SliderTrack bg={`${PROFILE_CONFIG.colors.secondary}30`} h="6px">
                <SliderFilledTrack bg={PROFILE_CONFIG.colors.accent} />
              </SliderTrack>
              <SliderThumb
                boxSize={4}
                bg={PROFILE_CONFIG.colors.accent}
                _focus={{
                  boxShadow: `0 0 0 3px ${PROFILE_CONFIG.colors.accent}30`,
                }}
              />
            </Slider>
            <Text
              fontSize="sm"
              color={PROFILE_CONFIG.colors.text.muted}
              minW="32px"
            >
              {volume}%
            </Text>
          </HStack>
        </VStack>

  {/* 右侧：音浪效果 */}
        <Box
          w="80px"
          minH="450px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderLeft={`1px solid ${PROFILE_CONFIG.colors.secondary}20`}
        >
          <AudioWave />
        </Box>
      </HStack>
    </Box>
  );
};
