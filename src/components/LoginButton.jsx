import { Button, useToast } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { githubService } from "../services/zoneService";

export function LoginButton({ isAuthenticated, onAuthChange }) {
  const toast = useToast();

  const handleOAuthLogin = () => {
    try {
      githubService.startOAuthFlow();
  } catch (error) {
      toast({
        title: "登录失败",
        description: "请检查网络连接",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 如果已经认证，不显示登录按钮
  if (isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        onClick={handleOAuthLogin}
        size="md"
        colorScheme="gray"
        variant="solid"
        borderRadius="full"
        px={4}
        py={2}
        bg="rgba(255, 255, 255, 0.9)"
        color="black"
        boxShadow="lg"
        _hover={{
          transform: "scale(1.05)",
          boxShadow: "xl",
          bg: "rgba(255, 255, 255, 1)",
        }}
        _active={{
          transform: "scale(0.95)",
        }}
        transition="all 0.2s"
        leftIcon={<Icon icon="mingcute:github-line" width="20" height="20" />}
      >
        登录
      </Button>
    </motion.div>
  );
}
