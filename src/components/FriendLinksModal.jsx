import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Box,
  Text,
  IconButton,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PROFILE_CONFIG } from "../config/profile";
import { FRIEND_LINKS_CONFIG } from "../data/friendLinks";
import { FriendLinkCard } from "./FriendLinkCard";
import { getBatchGitHubRepos } from "../services/githubService";

export const FriendLinksModal = ({ isOpen, onClose }) => {
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载友链数据
  useEffect(() => {
    if (isOpen && FRIEND_LINKS_CONFIG.friends.length > 0) {
      loadFriendsData();
    }
  }, [isOpen]);

  const loadFriendsData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 分离GitHub项目和自定义链接
      const githubItems = FRIEND_LINKS_CONFIG.friends.filter(
        (item) => item.type === "github"
      );
      const customItems = FRIEND_LINKS_CONFIG.friends.filter(
        (item) => item.type === "custom"
      );

      let allFriendsData = [];

      // 处理GitHub项目数据
      if (githubItems.length > 0) {
        const repositories = githubItems.map((item) => ({
          owner: item.owner,
          repo: item.repo,
        }));

        const repoData = await getBatchGitHubRepos(repositories);

        // 转换GitHub数据格式
        const githubFriendsData = repoData.map((repo) => ({
          id: repo.id,
          type: "github",
          github: {
            username: repo.owner.username,
            avatar: repo.owner.avatar,
            name: repo.owner.name,
          },
          project: {
            name: repo.name,
            description: repo.description,
            url: repo.url,
            language: repo.language,
            stars: repo.stars,
          },
        }));

        allFriendsData = [...allFriendsData, ...githubFriendsData];
      }

      // 处理自定义链接数据
      if (customItems.length > 0) {
        const customFriendsData = customItems.map((item) => ({
          id: item.id,
          type: "custom",
          github: item.github,
          project: item.project,
        }));

        allFriendsData = [...allFriendsData, ...customFriendsData];
      }

      setFriendsData(allFriendsData);
    } catch (err) {
      setError("加载友链数据失败");
      // API失败时显示空数据
      setFriendsData([]);
    } finally {
      setLoading(false);
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
              正在加载友链数据...
            </Text>
          </VStack>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert status="warning" borderRadius="md" bg="rgba(255, 193, 7, 0.1)">
          <AlertIcon color="orange.400" />
          <Text color={PROFILE_CONFIG.colors.text.secondary}>
            {error}，显示默认数据
          </Text>
        </Alert>
      );
    }

    if (friendsData.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <Text color={PROFILE_CONFIG.colors.text.muted}>暂无友链数据</Text>
        </Box>
      );
    }

    return (
      <VStack spacing={4} align="stretch">
        {friendsData.map((friend) => (
          <FriendLinkCard key={friend.id} friend={friend} />
        ))}
      </VStack>
    );
  };

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
        maxW="720px"
        maxH="80vh"
        position="relative"
        display="flex"
        flexDirection="column"
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

        {/* 标题 */}
        <ModalHeader pt={8} pb={4} px={8}>
          <Box display="flex" alignItems="center" gap={3}>
            <Icon
              icon="mingcute:link-3-fill"
              width="28"
              height="28"
              color={PROFILE_CONFIG.colors.primary}
            />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={PROFILE_CONFIG.colors.text.secondary}
            >
              友链
            </Text>
          </Box>
        </ModalHeader>

        <ModalBody
          px={8}
          pb={8}
          maxH="calc(80vh - 120px)" // 减去标题高度
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

          {/* 底部装饰 */}
          <Box
            mt={6}
            pt={4}
            borderTop={`1px solid ${PROFILE_CONFIG.colors.secondary}20`}
            textAlign="center"
          >
            {/* <Text
              fontSize="xs"
              color={PROFILE_CONFIG.colors.text.light}
              fontStyle="italic"
            >
              数据来自 GitHub API
            </Text> */}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
