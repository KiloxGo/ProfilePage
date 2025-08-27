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
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE_CONFIG } from "../config/profile";

export function ImageViewerModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

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
    }
  }, [isOpen, initialIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const currentImage = images[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      closeOnOverlayClick={true}
    >
      <ModalOverlay
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(8px)"
        onClick={onClose}
      />
      <ModalContent
        bg="transparent"
        boxShadow="none"
        maxW="95vw"
        maxH="95vh"
        border="none"
        position="relative"
        m={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <ModalBody
          p={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          w="100%"
          h="100vh"
        >
          {/* 关闭按钮 - 固定在模态框右上角 */}
          <IconButton
            aria-label="关闭"
            icon={<Icon icon="mingcute:close-line" width="20" height="20" />}
            position="fixed"
            top="20px"
            right="20px"
            zIndex="1000"
            size="md"
            variant="solid"
            bg="rgba(255, 255, 255, 0.9)"
            color={PROFILE_CONFIG.colors.text.secondary}
            borderRadius="50%"
            _hover={{
              bg: "rgba(255, 255, 255, 1)",
              transform: "scale(1.1)",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            transition="all 0.2s ease-in-out"
            onClick={onClose}
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
          />

          <Box
            position="relative"
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* 主图片 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || `图片 ${currentIndex + 1}`}
                  maxW="90vw"
                  maxH={images.length > 1 ? "calc(90vh - 100px)" : "90vh"}
                  objectFit="contain"
                  borderRadius="16px"
                  bg="white"
                  p={2}
                  boxShadow="0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)"
                  onClick={(e) => e.stopPropagation()}
                  cursor="default"
                />
              </motion.div>
            </AnimatePresence>

            {/* 导航按钮 */}
            {images.length > 1 && (
              <>
                <IconButton
                  icon={
                    <Icon icon="mingcute:left-line" width="24" height="24" />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  position="absolute"
                  left="20px"
                  top="50%"
                  transform="translateY(-50%)"
                  bg="rgba(255, 255, 255, 0.9)"
                  color={PROFILE_CONFIG.colors.text.secondary}
                  _hover={{
                    bg: "rgba(255, 255, 255, 1)",
                    transform: "translateY(-50%) scale(1.1)",
                  }}
                  size="lg"
                  borderRadius="full"
                  zIndex={10}
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                />

                <IconButton
                  icon={
                    <Icon icon="mingcute:right-line" width="24" height="24" />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  position="absolute"
                  right="20px"
                  top="50%"
                  transform="translateY(-50%)"
                  bg="rgba(255, 255, 255, 0.9)"
                  color={PROFILE_CONFIG.colors.text.secondary}
                  _hover={{
                    bg: "rgba(255, 255, 255, 1)",
                    transform: "translateY(-50%) scale(1.1)",
                  }}
                  size="lg"
                  borderRadius="full"
                  zIndex={10}
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                />
              </>
            )}

            {/* 图片计数器和缩略图 */}
            {images.length > 1 && (
              <Box
                position="absolute"
                bottom="20px"
                left="50%"
                transform="translateX(-50%)"
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(10px)"
                borderRadius="20px"
                px={4}
                py={3}
                zIndex={10}
                boxShadow="0 8px 16px rgba(0, 0, 0, 0.2)"
                onClick={(e) => e.stopPropagation()}
              >
                <HStack spacing={4} align="center">
                  <Text
                    color={PROFILE_CONFIG.colors.text.secondary}
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {currentIndex + 1} / {images.length}
                  </Text>

                  {/* 缩略图导航 */}
                  <HStack spacing={2} maxW="300px" overflowX="auto">
                    {images.map((image, index) => (
                      <Box
                        key={index}
                        w="40px"
                        h="40px"
                        borderRadius="8px"
                        overflow="hidden"
                        cursor="pointer"
                        border="2px solid"
                        borderColor={
                          index === currentIndex
                            ? PROFILE_CONFIG.colors.primary
                            : "transparent"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(index);
                        }}
                        _hover={{
                          borderColor: PROFILE_CONFIG.colors.secondary,
                        }}
                        transition="all 0.2s"
                        boxShadow={
                          index === currentIndex
                            ? `0 0 0 1px ${PROFILE_CONFIG.colors.primary}`
                            : "none"
                        }
                      >
                        <Image
                          src={image.url}
                          alt={`缩略图 ${index + 1}`}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      </Box>
                    ))}
                  </HStack>
                </HStack>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
