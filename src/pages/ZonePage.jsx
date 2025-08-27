import {
  Container,
  VStack,
  Box,
  Text,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PROFILE_CONFIG } from "../config/profile";
import { HomeButton } from "../components/HomeButton";
import { AuthSection } from "../components/AuthSection";
import { LoginButton } from "../components/LoginButton";
import { PostEditor } from "../components/PostEditor";
import { Timeline } from "../components/Timeline";
import { PatInputModal } from "../components/PatInputModal";
import { githubService } from "../services/zoneService";

function ZonePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isPatModalOpen, 
    onOpen: onPatModalOpen, 
    onClose: onPatModalClose 
  } = useDisclosure();

  useEffect(() => {
    loadPosts();
    checkAuth();
  }, []);

  // 监听 token 变更（跨 Tab 的 storage 事件 + 同 Tab 自定义事件）以刷新认证状态
  useEffect(() => {
    const handler = (e) => {
      if (!e || e.type === "github_token_updated" || e.key === "github_token") {
        checkAuth();
      }
    };
    window.addEventListener("storage", handler);
    window.addEventListener("github_token_updated", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("github_token_updated", handler);
    };
  }, []);

  // 监听 PAT 输入模态框显示事件
  useEffect(() => {
    const handleShowPatModal = () => {
      onPatModalOpen();
    };
    window.addEventListener("show_pat_input_modal", handleShowPatModal);
    return () => {
      window.removeEventListener("show_pat_input_modal", handleShowPatModal);
    };
  }, [onPatModalOpen]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await githubService.getPosts();
      setPosts(postsData);
    } catch (error) {
      // 忽略加载错误，UI 上可选择展示占位
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const authenticated = await githubService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const userData = await githubService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      // 忽略认证检查错误
    }
  };

  const handleAuthChange = (authenticated, userData) => {
    setIsAuthenticated(authenticated);
    setUser(userData);
  };

  const handlePostSubmit = async (postData) => {
    try {
      await githubService.createPost(
        postData.title,
        postData.content,
        postData.images
      );
      await loadPosts();
      onClose();
    } catch (error) {
      alert("发布失败，请重试");
    }
  };

  const handleTokenSet = (token) => {
    githubService.setToken(token);
    checkAuth(); // 重新检查认证状态
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 主页按钮 */}
      <HomeButton />

      {/* 登录按钮（仅在未认证时显示） */}
      <LoginButton
        isAuthenticated={isAuthenticated}
        onAuthChange={handleAuthChange}
      />

      {/* 发布按钮（仅对管理员显示） */}
      {isAuthenticated && user && githubService.checkIsOwner(user.login) && (
        <motion.div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 1000,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            onClick={onOpen}
            size="md"
            colorScheme="blue"
            borderRadius="full"
            px={6}
            py={3}
            boxShadow="lg"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "xl",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            transition="all 0.2s"
          >
            <Icon
              icon="mingcute:add-line"
              width="20"
              height="20"
              style={{ marginRight: "8px" }}
            />
            <Text fontSize="sm" fontWeight="medium">
              发布动态
            </Text>
          </Button>
        </motion.div>
      )}

      <Container maxW="container.lg" py={20}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 页面标题 */}
          <VStack spacing={6} mb={10}>
            <Flex align="center" gap={3}>
              <Icon
                icon="mingcute:time-line"
                width="32"
                height="32"
                color={PROFILE_CONFIG.colors.primary}
              />
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={PROFILE_CONFIG.colors.text.secondary}
              >
                Kilox的动态
              </Text>
            </Flex>
          </VStack>

          {/* 认证部分 */}
          <AuthSection
            isAuthenticated={isAuthenticated}
            user={user}
            onAuthChange={handleAuthChange}
          />

          {/* 时间轴组件 */}
          <Timeline posts={posts} loading={loading} />
        </motion.div>
      </Container>

      {/* 发布动态模态框 */}
      <PostEditor
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handlePostSubmit}
      />

      {/* PAT 输入模态框 */}
      <PatInputModal
        isOpen={isPatModalOpen}
        onClose={onPatModalClose}
        onTokenSet={handleTokenSet}
      />
    </motion.div>
  );
}

export default ZonePage;
