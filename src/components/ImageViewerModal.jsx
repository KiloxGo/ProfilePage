import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
  Box,
  IconButton,
  HStack,
  Text,
  Flex,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE_CONFIG } from "../config/profile";

export function ImageViewerModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title, // 可选标题
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const resetTransform = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, currentIndex]);

  // 更新初始索引
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetTransform();
    }
  }, [isOpen, initialIndex, resetTransform]);

  // 图片切换时重置缩放与偏移
  useEffect(() => {
    resetTransform();
  }, [currentIndex, resetTransform]);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    // Ctrl+滚轮 或普通滚轮都缩放
    const delta = -e.deltaY;
    setScale((prev) => {
      const next = Math.min(4, Math.max(0.5, prev + delta * 0.0015));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (scale === 1) {
      setScale(2);
    } else {
      resetTransform();
    }
  };

  const handlePointerDown = (e) => {
    if (scale <= 1) return; // 仅缩放后允许拖拽
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
    // 捕获指针以保证拖动顺畅
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setOffset({
      x: offsetStartRef.current.x + dx,
      y: offsetStartRef.current.y + dy,
    });
  };

  const endPan = (e) => {
    if (!isPanning) return;
    setIsPanning(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const currentImage = images[currentIndex];

  const bgCard = PROFILE_CONFIG.colors.background.card;
  const iconColor = PROFILE_CONFIG.colors.primary;

  return (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay bg="rgba(0,0,0,0.4)" backdropFilter="blur(8px)" />
      <ModalContent
        bg={bgCard}
        backdropFilter="blur(20px)"
        border={`1px solid ${PROFILE_CONFIG.colors.secondary}40`}
        borderRadius="24px"
        boxShadow="0 20px 40px rgba(54, 89, 185, 0.25), 0 8px 16px rgba(119,187,221,0.15)"
    w="auto"
    maxW="85vw"
    maxH="85vh"
    display="flex"
    flexDirection="column"
    overflow="hidden"
      >
        <ModalBody p={0} display="flex" flexDirection="column" h="100%">
          {/* Header */}
            <Flex
              px={8}
              pt={6}
              pb={4}
              align="center"
              justify="space-between"
              borderBottom={`1px solid ${PROFILE_CONFIG.colors.secondary}25`}
            >
              <HStack spacing={3} minW={0}>
                <Icon
                  icon="mingcute:image-fill"
                  width="26"
                  height="26"
                  color={iconColor}
                />
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={PROFILE_CONFIG.colors.text.secondary}
                  noOfLines={1}
                  maxW="50vw"
                >
                  {title || currentImage.alt || `图片 ${currentIndex + 1}`}
                </Text>
                {images.length > 1 && (
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg={PROFILE_CONFIG.colors.background.badge}
                    color={PROFILE_CONFIG.colors.text.muted}
                  >
                    {currentIndex + 1} / {images.length}
                  </Text>
                )}
              </HStack>
              <HStack spacing={2}>
                {scale !== 1 && (
                  <IconButton
                    aria-label="重置"
                    icon={<Icon icon="mingcute:refresh-3-line" width={18} height={18} />}
                    size="sm"
                    variant="ghost"
                    color={PROFILE_CONFIG.colors.text.secondary}
                    onClick={(e) => {
                      e.stopPropagation();
                      resetTransform();
                    }}
                    _hover={{ bg: `${PROFILE_CONFIG.colors.primary}15`, color: PROFILE_CONFIG.colors.primary }}
                  />
                )}
                <IconButton
                  aria-label="关闭"
                  icon={<Icon icon="mingcute:close-line" width="20" height="20" />}
                  size="sm"
                  variant="ghost"
                  color={PROFILE_CONFIG.colors.text.secondary}
                  onClick={onClose}
                  _hover={{ bg: `${PROFILE_CONFIG.colors.primary}15`, color: PROFILE_CONFIG.colors.primary }}
                />
              </HStack>
            </Flex>

            {/* Viewer Area */}
            <Flex
              ref={containerRef}
              position="relative"
              align="center"
              justify="center"
              bg={useColorModeValue("rgba(255,255,255,0.4)", "rgba(0,0,0,0.2)")}
              overflow="hidden"
              onWheel={handleWheel}
              sx={{
                cursor: scale > 1 ? (isPanning ? "grabbing" : "grab") : "auto",
                userSelect: "none",
              }}
              maxW="75vw"
              maxH="70vh"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <Box
                    position="relative"
                    maxW="100%"
                    maxH="100%"
                    onDoubleClick={handleDoubleClick}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endPan}
                    onPointerLeave={endPan}
                  >
                    <Image
                      ref={imageRef}
                      src={currentImage.url}
                      alt={currentImage.alt || `图片 ${currentIndex + 1}`}
                      maxW="70vw"
                      maxH={images.length > 1 ? "calc(70vh - 100px)" : "70vh"}
                      objectFit="contain"
                      draggable={false}
                      style={{
                        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                        transition: isPanning ? "none" : "transform 0.2s ease",
                      }}
                      borderRadius="16px"
                      bg="rgba(255,255,255,0.85)"
                      boxShadow="0 12px 32px rgba(0,0,0,0.3)"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </Box>
                </motion.div>
              </AnimatePresence>

              {/* 左右导航 */}
              {images.length > 1 && (
                <>
                  <IconButton
                    aria-label="上一张"
                    icon={<Icon icon="mingcute:left-line" width={22} height={22} />}
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    bg="rgba(255,255,255,0.65)"
                    _hover={{ bg: "rgba(255,255,255,0.9)", transform: "translateY(-50%) scale(1.08)" }}
                    color={PROFILE_CONFIG.colors.text.secondary}
                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    borderRadius="full"
                  />
                  <IconButton
                    aria-label="下一张"
                    icon={<Icon icon="mingcute:right-line" width={22} height={22} />}
                    position="absolute"
                    right={4}
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    bg="rgba(255,255,255,0.65)"
                    _hover={{ bg: "rgba(255,255,255,0.9)", transform: "translateY(-50%) scale(1.08)" }}
                    color={PROFILE_CONFIG.colors.text.secondary}
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    borderRadius="full"
                  />
                </>
              )}
            </Flex>

            {/* 缩略图栏 */}
            {images.length > 1 && (
              <Box
                px={6}
                py={4}
                borderTop={`1px solid ${PROFILE_CONFIG.colors.secondary}20`}
                bg={PROFILE_CONFIG.colors.background.card}
                w="100%"
              >
                <HStack spacing={3} overflowX="auto" maxW="full" pb={1}
                  sx={{
                    "&::-webkit-scrollbar": { height: "6px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": { background: "rgba(54,89,185,0.35)", borderRadius: "3px" },
                  }}
                >
                  {images.map((image, index) => {
                    const active = index === currentIndex;
                    return (
                      <Box
                        key={index}
                        flex="0 0 auto"
                        w="56px"
                        h="56px"
                        position="relative"
                        borderRadius="12px"
                        overflow="hidden"
                        border={active ? `2px solid ${PROFILE_CONFIG.colors.primary}` : `1px solid ${PROFILE_CONFIG.colors.secondary}30`}
                        cursor="pointer"
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                        transition="all 0.2s ease"
                        _hover={{ borderColor: PROFILE_CONFIG.colors.primary, transform: "translateY(-2px)" }}
                      >
                        <Image src={image.url} alt={`缩略图 ${index + 1}`} w="100%" h="100%" objectFit="cover" />
                        {active && (
                          <Box position="absolute" inset={0} boxShadow={`inset 0 0 0 2px ${PROFILE_CONFIG.colors.primary}`} />
                        )}
                      </Box>
                    );
                  })}
                </HStack>
              </Box>
            )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
