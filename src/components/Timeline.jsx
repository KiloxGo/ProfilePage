import {
  VStack,
  Box,
  Text,
  Avatar,
  Flex,
  Badge,
  Image,
  Skeleton,
  SkeletonText,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { PROFILE_CONFIG } from "../config/profile";
import { ImageViewerModal } from "./ImageViewerModal";

export function Timeline({ posts, loading }) {
  if (loading) {
    return <TimelineLoading />;
  }

  if (posts.length === 0) {
    return <EmptyTimeline />;
  }

  return (
    <VStack spacing={0} align="stretch" position="relative">
      {/* 时间轴主线 */}
      <Box
        position="absolute"
        left="20px"
        top="0"
        bottom="0"
        width="2px"
        bg={PROFILE_CONFIG.colors.primary}
        opacity={0.3}
        zIndex={0}
      />

      {posts.map((post, index) => (
        <TimelineItem
          key={post.id}
          post={post}
          index={index}
          isLast={index === posts.length - 1}
        />
      ))}
    </VStack>
  );
}

function TimelineItem({ post, index, isLast }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const extractImages = (content) => {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const images = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        url: match[1],
        alt: `动态图片 ${images.length + 1}`,
      });
    }

    return images;
  };

  const removeImagesFromContent = (content) => {
    return content.replace(/!\[.*?\]\(.*?\)/g, "").trim();
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    onOpen();
  };

  const images = extractImages(post.content);
  const textContent = removeImagesFromContent(post.content);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Flex position="relative" pb={isLast ? 0 : 8}>
        {/* 时间轴节点 */}
        <Box
          position="absolute"
          left="12px"
          top="20px"
          width="16px"
          height="16px"
          bg={PROFILE_CONFIG.colors.primary}
          borderRadius="full"
          border="3px solid white"
          boxShadow="0 0 0 2px rgba(54, 89, 185, 0.2)"
          zIndex={1}
        />

        {/* 内容区域 */}
        <Box ml="50px" w="100%">
          {/* 动态卡片 */}
          <Box
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(10px)"
            borderRadius="lg"
            p={6}
            shadow="sm"
            border="1px solid rgba(255, 255, 255, 0.2)"
            _hover={{
              shadow: "md",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
          >
            {/* 动态头部 */}
            <Flex justify="space-between" align="start" mb={4}>
              <Flex align="center" gap={3}>
                <Avatar size="sm" src={post.avatar} name={post.author} />
                <Box>
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={PROFILE_CONFIG.colors.text.secondary}
                  >
                    {post.title}
                  </Text>
                  <Text fontSize="sm" color={PROFILE_CONFIG.colors.text.light}>
                    {formatDate(post.createdAt)}
                  </Text>
                </Box>
              </Flex>

              <Badge colorScheme="blue" variant="subtle">
                动态
              </Badge>
            </Flex>

            {/* 动态内容 */}
            {textContent && (
              <Text
                mb={4}
                color={PROFILE_CONFIG.colors.text.primary}
                lineHeight="1.6"
                whiteSpace="pre-wrap"
              >
                {textContent}
              </Text>
            )}

            {/* 图片展示 */}
            {images.length > 0 && (
              <Box mb={4}>
                <Flex wrap="wrap" gap={2}>
                  {images.map((image, imgIndex) => (
                    <Box key={imgIndex} maxW="200px">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        borderRadius="md"
                        objectFit="cover"
                        maxH="200px"
                        cursor="pointer"
                        _hover={{
                          opacity: 0.8,
                          transform: "scale(1.02)",
                        }}
                        transition="all 0.2s"
                        onClick={() => handleImageClick(imgIndex)}
                      />
                    </Box>
                  ))}
                </Flex>
              </Box>
            )}

            {/* 动态底部 */}
            <Flex
              justify="space-between"
              align="center"
              pt={3}
              borderTop="1px solid rgba(0,0,0,0.1)"
            >
              <Text fontSize="sm" color={PROFILE_CONFIG.colors.text.light}>
                {post.author} 发布
              </Text>

              <Link
                href={post.url}
                isExternal
                fontSize="sm"
                color={PROFILE_CONFIG.colors.primary}
                _hover={{ textDecoration: "underline" }}
              >
                <Flex align="center" gap={1}>
                  <Text>查看详情</Text>
                  <Icon
                    icon="mingcute:external-link-line"
                    width="14"
                    height="14"
                  />
                </Flex>
              </Link>
            </Flex>
          </Box>
        </Box>
      </Flex>

      {/* 图片查看器模态框 */}
      <ImageViewerModal
        isOpen={isOpen}
        onClose={onClose}
        images={images}
        initialIndex={selectedImageIndex}
      />
    </motion.div>
  );
}

function TimelineLoading() {
  return (
    <VStack spacing={6} align="stretch">
      {[1, 2, 3].map((i) => (
        <Flex key={i} position="relative">
          <Box ml="50px" w="100%">
            <Box
              bg="rgba(255, 255, 255, 0.8)"
              borderRadius="lg"
              p={6}
              shadow="sm"
            >
              <Flex gap={3} mb={4}>
                <Skeleton height="40px" width="40px" borderRadius="full" />
                <Box flex={1}>
                  <Skeleton height="20px" width="200px" mb={2} />
                  <Skeleton height="16px" width="150px" />
                </Box>
              </Flex>
              <SkeletonText mt={4} noOfLines={3} spacing={4} />
            </Box>
          </Box>
        </Flex>
      ))}
    </VStack>
  );
}

function EmptyTimeline() {
  return (
    <Box textAlign="center" py={16}>
      <Icon
        icon="mingcute:time-line"
        width="64"
        height="64"
        color={PROFILE_CONFIG.colors.text.light}
        style={{ margin: "0 auto 16px" }}
      />
      <Text fontSize="xl" color={PROFILE_CONFIG.colors.text.secondary} mb={2}>
        还没有动态
      </Text>
      <Text color={PROFILE_CONFIG.colors.text.light}>
        这里将展示最新的生活动态
      </Text>
    </Box>
  );
}
