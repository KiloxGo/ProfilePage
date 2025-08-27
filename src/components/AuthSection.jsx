import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  HStack,
  Badge,
  Image,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { githubService } from "../services/zoneService";
import { PROFILE_CONFIG } from "../config/profile";

export function AuthSection({ isAuthenticated, user, onAuthChange }) {
  const toast = useToast();

  const handleLogout = () => {
    githubService.logout();
    onAuthChange(false, null);
    toast({
      title: "已退出登录",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // 已认证用户显示
  if (isAuthenticated && user) {
    const isOwner = githubService.checkIsOwner(user.login);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bg="rgba(255, 255, 255, 0.9)"
          borderRadius="lg"
          p={6}
          boxShadow="md"
          mb={6}
          border="2px solid"
          borderColor={isOwner ? "green.300" : "blue.300"}
        >
          <HStack justify="space-between" mb={3}>
            <HStack spacing={3}>
              <Image
                src={user.avatar_url}
                alt={user.login}
                w="50px"
                h="50px"
                borderRadius="full"
                border="3px solid"
                borderColor={isOwner ? "green.400" : "blue.400"}
              />
              <VStack align="start" spacing={0}>
                <HStack>
                  <Text
                    fontWeight="bold"
                    color={PROFILE_CONFIG.colors.text.primary}
                  >
                    {user.name || user.login}
                  </Text>
                  {isOwner && (
                    <Badge colorScheme="green" fontSize="xs">
                      <Icon icon="mingcute:crown-line" width="12" height="12" />
                      <Text ml={1}>管理员</Text>
                    </Badge>
                  )}
                </HStack>
                <Text fontSize="sm" color={PROFILE_CONFIG.colors.text.light}>
                  @{user.login}
                </Text>
                {isOwner ? (
                  <Text fontSize="xs" color="green.600">
                    你可以发布和管理动态
                  </Text>
                ) : (
                  <Text fontSize="xs" color="blue.600">
                    你可以查看所有动态
                  </Text>
                )}
              </VStack>
            </HStack>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={handleLogout}
              leftIcon={<Icon icon="mingcute:exit-line" />}
            >
              退出登录
            </Button>
          </HStack>
        </Box>
      </motion.div>
    );
  }

  // 未认证时不显示任何内容（登录按钮将在右上角）
  return null;
}
