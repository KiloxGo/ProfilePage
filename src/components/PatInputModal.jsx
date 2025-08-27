import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Link,
  Code,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Icon } from "@iconify/react";

export function PatInputModal({ isOpen, onClose, onTokenSet }) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!token.trim()) {
      toast({
        title: "请输入 Personal Access Token",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 验证 token 格式
    if (!token.startsWith("ghp_") && !token.startsWith("github_pat_")) {
      toast({
        title: "Token 格式错误",
        description: "Personal Access Token 应该以 'ghp_' 或 'github_pat_' 开头",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // 测试 token 是否有效
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (response.ok) {
        onTokenSet(token);
        toast({
          title: "登录成功",
          description: "Personal Access Token 验证成功",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        setToken("");
      } else {
        throw new Error("Token 验证失败");
      }
    } catch (error) {
      toast({
        title: "Token 验证失败",
        description: "请检查 Token 是否正确或是否有足够的权限",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setToken("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Icon icon="mingcute:key-line" style={{ display: "inline", marginRight: "8px" }} />
          设置 Personal Access Token
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <Text fontSize="sm">
                由于这是纯前端项目，需要您提供 GitHub Personal Access Token 来完成认证。
              </Text>
            </Alert>

            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium">
                如何获取 Personal Access Token：
              </Text>
              <VStack spacing={2} align="stretch" pl={4}>
                <Text fontSize="xs">
                  1. 前往{" "}
                  <Link
                    href="https://github.com/settings/tokens/new"
                    color="blue.500"
                    isExternal
                  >
                    GitHub Token 设置页面
                  </Link>
                </Text>
                <Text fontSize="xs">
                  2. 填写 Token 名称（如：ProfilePage Auth）
                </Text>
                <Text fontSize="xs">
                  3. 选择权限：<Code fontSize="xs">repo</Code>（仓库权限）
                </Text>
                <Text fontSize="xs">
                  4. 点击 "Generate token" 生成
                </Text>
                <Text fontSize="xs">
                  5. 复制生成的 Token 并粘贴到下方输入框
                </Text>
              </VStack>
            </VStack>

            <Input
              placeholder="粘贴您的 Personal Access Token（ghp_...）"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              size="md"
            />

            <Alert status="warning" fontSize="xs">
              <AlertIcon />
              Token 将仅保存在您的浏览器本地，不会上传到任何服务器。
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            取消
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="验证中..."
            leftIcon={<Icon icon="mingcute:check-line" />}
          >
            验证并登录
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
