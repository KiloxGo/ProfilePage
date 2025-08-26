import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  Text,
  Avatar,
  IconButton,
  VStack,
  HStack,
  useDisclosure,
  Divider,
  Center,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";

export const ProfileCard = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
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
        minH="400px"
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
          onClick={onClose}
        />

        <ModalBody p={10}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={10}
            align="flex-start"
            h="full"
            minH="320px"
            alignItems={"center"}
            alignContent={"center"}
          >
            {/* 左侧 - 头像和ID */}
            <VStack spacing={6} align="center" minW="200px" flex="0 0 auto">
              <Avatar
                src={PROFILE_CONFIG.images.avatar}
                size="2xl"
                border={`4px solid ${PROFILE_CONFIG.colors.primary}`}
                boxShadow={`0 12px 30px rgba(54, 89, 185, 0.4)`}
                w="120px"
                h="120px"
              />
              <VStack spacing={2} align="center">
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={PROFILE_CONFIG.colors.text.primary}
                >
                  {PROFILE_CONFIG.name}
                </Text>
                <Text
                  fontSize="md"
                  color={PROFILE_CONFIG.colors.text.muted}
                  fontStyle="italic"
                >
                  @KiloxGo
                </Text>
              </VStack>
              <HStack spacing={3} align="center" mt={3}>
                <Icon
                  icon="mingcute:location-line"
                  width="20"
                  height="20"
                  color={PROFILE_CONFIG.colors.primary}
                />
                <Text
                  fontSize="md"
                  color={PROFILE_CONFIG.colors.text.light}
                  fontWeight="medium"
                >
                  {PROFILE_CONFIG.location}
                </Text>
              </HStack>
            </VStack>

            {/* 分割线 (仅在移动端显示) */}
            <Divider
              display={{ base: "block", lg: "none" }}
              borderColor={`${PROFILE_CONFIG.colors.secondary}30`}
              my={4}
            />

            {/* 竖直分割线 (仅在桌面端显示) */}
            <Box
              display={{ base: "none", lg: "block" }}
              width="2px"
              minH="280px"
              bg={`linear-gradient(180deg, ${PROFILE_CONFIG.colors.primary}40, ${PROFILE_CONFIG.colors.secondary}40)`}
              borderRadius="full"
              alignSelf="stretch"
            />

            {/* 右侧 - 简介 */}
            <VStack
              spacing={6}
              align="flex-start"
              flex="1"
              h="full"
              justify="flex-start"
            >
              <VStack spacing={5} align="flex-start" w="100%">
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={PROFILE_CONFIG.colors.text.secondary}
                  lineHeight="1.2"
                >
                  {PROFILE_CONFIG.subtitle}
                </Text>

                <Text
                  fontSize="lg"
                  color={PROFILE_CONFIG.colors.text.muted}
                  lineHeight="1.7"
                  whiteSpace="pre-line"
                  maxW="400px"
                >
                  {PROFILE_CONFIG.description}
                </Text>
              </VStack>

              {/* 装饰性元素 */}
              <VStack spacing={4} w="100%" mt={6}>
                <Box
                  w="80%"
                  h="3px"
                  bg={`linear-gradient(90deg, ${PROFILE_CONFIG.colors.primary}, ${PROFILE_CONFIG.colors.secondary})`}
                  borderRadius="full"
                  opacity="0.7"
                />

                <Text
                  fontSize="sm"
                  color={PROFILE_CONFIG.colors.text.light}
                  fontStyle="italic"
                  alignSelf="center"
                  px={4}
                  py={2}
                  bg={`${PROFILE_CONFIG.colors.background.badge}`}
                  borderRadius="full"
                  border={`1px solid ${PROFILE_CONFIG.colors.secondary}20`}
                >
                  "人失去了个性 跟死了有什么区别"
                </Text>
              </VStack>
            </VStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
