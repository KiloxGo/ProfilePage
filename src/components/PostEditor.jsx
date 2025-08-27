import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  VStack,
  Input,
  Textarea,
  Button,
  Box,
  Image,
  IconButton,
  Flex,
  Text,
  useToast,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import { githubService } from "../services/zoneService";
import { ZONE_CONFIG } from "../config/zone";
import { PROFILE_CONFIG } from "../config/profile";

export function PostEditor({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImages([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);

    // 验证文件
    const validFiles = files.filter((file) => {
      if (file.size > ZONE_CONFIG.maxImageSize) {
        toast({
          title: "图片过大",
          description: `图片 ${file.name} 超过 5MB 限制`,
          status: "error",
          duration: 3000,
        });
        return false;
      }

      if (!ZONE_CONFIG.supportedImageTypes.includes(file.type)) {
        toast({
          title: "不支持的格式",
          description: `图片 ${file.name} 格式不受支持`,
          status: "error",
          duration: 3000,
        });
        return false;
      }

      return true;
    });

    // 预览图片
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          {
            file,
            preview: e.target.result,
            uploaded: false,
            url: null,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadPromises = images.map(async (img, index) => {
      if (img.uploaded) return img.url;

      try {
        const url = await githubService.uploadImage(img.file, img.file.name);
        setImages((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, uploaded: true, url } : item
          )
        );
        return url;
      } catch (error) {
        toast({
          title: "图片上传失败",
          description: `图片 ${img.file.name} 上传失败`,
          status: "error",
          duration: 3000,
        });
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "请输入标题",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "请输入内容",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setPublishing(true);
      setUploading(true);

      // 上传图片
      const imageUrls = await uploadImages();
      setUploading(false);

      // 发布动态
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        images: imageUrls,
      });

      toast({
        title: "发布成功",
        description: "动态已成功发布",
        status: "success",
        duration: 3000,
      });

      handleClose();
  } catch (error) {
      toast({
        title: "发布失败",
        description: "请检查网络连接后重试",
        status: "error",
        duration: 3000,
      });
    } finally {
      setPublishing(false);
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="2xl">
      <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(8px)" />
      <ModalContent
        bg={PROFILE_CONFIG.colors.background.card}
        backdropFilter="blur(20px)"
        border={`1px solid ${PROFILE_CONFIG.colors.secondary}40`}
        borderRadius="20px"
        boxShadow="0 20px 40px rgba(54, 89, 185, 0.2), 0 8px 16px rgba(119, 187, 221, 0.15)"
        mx={4}
        my={4}
        maxW="680px"
        position="relative"
        overflow="hidden"
      >
        {/* 关闭按钮 */}
        <IconButton
          aria-label="关闭"
          icon={<Icon icon="mingcute:close-line" width="20" height="20" />}
          position="absolute"
          top="16px"
          right="16px"
          zIndex="1"
          size="sm"
          variant="ghost"
          bg="rgba(255, 255, 255, 0.8)"
          color={PROFILE_CONFIG.colors.text.secondary}
          borderRadius="50%"
          _hover={{
            bg: "rgba(255, 255, 255, 0.95)",
            transform: "scale(1.1)",
          }}
          _active={{
            transform: "scale(0.95)",
          }}
          transition="all 0.2s ease-in-out"
          onClick={handleClose}
        />

        <ModalBody p={8}>
          {/* 标题区域 */}
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <HStack justify="center" mb={2}>
                <Icon
                  icon="mingcute:add-circle-line"
                  width="24"
                  height="24"
                  color={PROFILE_CONFIG.colors.primary}
                />
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={PROFILE_CONFIG.colors.text.primary}
                >
                  发布新动态
                </Text>
              </HStack>
              <Text fontSize="sm" color={PROFILE_CONFIG.colors.text.light}>
                分享你的想法和生活点滴
              </Text>
            </Box>

            {/* 表单内容 */}
            <VStack spacing={5} align="stretch">
              {/* 标题输入 */}
              <FormControl>
                <FormLabel
                  fontSize="sm"
                  fontWeight="medium"
                  color={PROFILE_CONFIG.colors.text.secondary}
                >
                  标题
                </FormLabel>
                <Input
                  placeholder="输入动态标题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={publishing}
                  bg="rgba(255, 255, 255, 0.8)"
                  border="1px solid"
                  borderColor={PROFILE_CONFIG.colors.secondary + "40"}
                  borderRadius="12px"
                  _focus={{
                    borderColor: PROFILE_CONFIG.colors.primary,
                    boxShadow: `0 0 0 1px ${PROFILE_CONFIG.colors.primary}`,
                  }}
                />
              </FormControl>

              {/* 内容输入 */}
              <FormControl>
                <FormLabel
                  fontSize="sm"
                  fontWeight="medium"
                  color={PROFILE_CONFIG.colors.text.secondary}
                >
                  内容
                </FormLabel>
                <Textarea
                  placeholder="分享你的想法和生活点滴..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  disabled={publishing}
                  bg="rgba(255, 255, 255, 0.8)"
                  border="1px solid"
                  borderColor={PROFILE_CONFIG.colors.secondary + "40"}
                  borderRadius="12px"
                  _focus={{
                    borderColor: PROFILE_CONFIG.colors.primary,
                    boxShadow: `0 0 0 1px ${PROFILE_CONFIG.colors.primary}`,
                  }}
                  resize="vertical"
                />
              </FormControl>

              {/* 图片上传 */}
              <FormControl>
                <Flex justify="space-between" align="center" mb={3}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="medium"
                    color={PROFILE_CONFIG.colors.text.secondary}
                    mb={0}
                  >
                    图片
                  </FormLabel>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Icon icon="mingcute:add-line" />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={publishing}
                    color={PROFILE_CONFIG.colors.primary}
                    _hover={{
                      bg: PROFILE_CONFIG.colors.primary + "20",
                    }}
                  >
                    添加图片
                  </Button>
                </Flex>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />

                {/* 图片预览 */}
                {images.length > 0 && (
                  <Flex wrap="wrap" gap={2}>
                    {images.map((img, index) => (
                      <Box key={index} position="relative">
                        <Image
                          src={img.preview}
                          alt={`Preview ${index}`}
                          boxSize="100px"
                          objectFit="cover"
                          borderRadius="md"
                          border="1px solid #e2e8f0"
                        />
                        <IconButton
                          position="absolute"
                          top={1}
                          right={1}
                          size="xs"
                          colorScheme="red"
                          variant="solid"
                          icon={<Icon icon="mingcute:close-line" />}
                          onClick={() => removeImage(index)}
                          disabled={publishing}
                        />
                        {img.uploaded && (
                          <Box
                            position="absolute"
                            bottom={1}
                            left={1}
                            bg="green.500"
                            color="white"
                            px={1}
                            py={0.5}
                            borderRadius="sm"
                            fontSize="xs"
                          >
                            ✓
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Flex>
                )}
              </FormControl>

              {/* 操作按钮 */}
              <Flex w="100%" justify="flex-end" gap={3} pt={6}>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  disabled={publishing}
                  color={PROFILE_CONFIG.colors.text.light}
                  _hover={{
                    bg: "rgba(0, 0, 0, 0.05)",
                  }}
                >
                  取消
                </Button>
                <Button
                  bg={PROFILE_CONFIG.colors.primary}
                  color="white"
                  onClick={handleSubmit}
                  isLoading={publishing}
                  loadingText={uploading ? "上传中..." : "发布中..."}
                  _hover={{
                    bg: PROFILE_CONFIG.colors.secondary,
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(54, 89, 185, 0.4)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s"
                  borderRadius="12px"
                  px={6}
                >
                  发布动态
                </Button>
              </Flex>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
