import { Box, Image, Text, Flex, Skeleton, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);

export function AnimeCard({ anime, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!anime || !anime.subject) {
    return null;
  }

  const { name, name_cn, images, date } = anime.subject;
  const displayName = name_cn || name;
  const imageUrl = images?.common || images?.large || images?.medium || "";

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      cursor="pointer"
    >
      <Box
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(10px)"
        borderRadius="12px"
        overflow="hidden"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        transition="all 0.3s"
        _hover={{
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
        }}
      >
        {/* 图片部分 */}
        <Box position="relative" paddingTop="133.33%" bg="gray.100">
          {!imageLoaded && !imageError && (
            <Skeleton
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
            />
          )}
          {!imageError && imageUrl ? (
            <Image
              src={imageUrl}
              alt={displayName}
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              objectFit="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              display={imageLoaded ? "block" : "none"}
            />
          ) : (
            <Flex
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              alignItems="center"
              justifyContent="center"
              bg="gray.200"
            >
              <Text fontSize="sm" color="gray.500">
                暂无图片
              </Text>
            </Flex>
          )}
        </Box>

        {/* 信息部分 */}
        <Box p={3}>
          <VStack alignItems="center">
            <Text
              fontSize="sm"
              fontWeight="600"
              color="gray.800"
              noOfLines={2}
              flex="1"
              lineHeight="1.4"
              minH="2.8em"
            >
              {displayName}
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              flexShrink={0}
              ml={2}
              fontWeight="500"
            >
              {date ? date.slice(0, 7) : "未知"}
            </Text>
          </VStack>
        </Box>
      </Box>
    </MotionBox>
  );
}
