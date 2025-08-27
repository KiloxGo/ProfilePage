import { Container, Flex, Text, HStack, VStack, Box } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { motion } from "framer-motion";
import "./index.css";
import { ProfileImage } from "./components/ProfileImage";
import { ProfileInfo } from "./components/ProfileInfo";
import { SocialLinks } from "./components/SocialLinks";
import { StudyingSection } from "./components/StudyingSection";
import { WakaTimeStats } from "./components/WakaTimeStats";
import { HomeButton } from "./components/HomeButton";
import { SidebarToggle } from "./components/SidebarToggle";
import { Background } from "./components/Background";
import SakanaWidgets from "./components/SakanaWidgets";
import { useWakaTime } from "./hooks/useWakaTime";
import { useImageLoading } from "./hooks/useImageLoading";
import { PROFILE_CONFIG } from "./config/profile";
import ZonePage from "./pages/ZonePage";

function HomePage() {
  const { wakaTimeData, loading } = useWakaTime();
  const imageLoadingState = useImageLoading();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 随机背景 */}
      <Background />

      {/* 主页按钮 */}
      <HomeButton />

      {/* 侧边栏切换 */}
      <SidebarToggle />

      <Container maxW={"container.lg"} py={70}>
        <VStack spacing={20} align="stretch">
          {/* 主要个人资料部分 */}
          <Flex
            data-section="profile"
            alignItems={"center"}
            position="relative"
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 4, lg: 0 }}
          >
            <ProfileImage {...imageLoadingState} />

            <Flex>
              <VStack
                transform={{ base: "none", lg: "translate(120px,100px)" }}
                alignItems={{ base: "center", md: "flex-start" }}
                spacing={{ base: 4, lg: 2 }}
                mt={{ base: 4, lg: 0 }}
              >
                <ProfileInfo />
                <SocialLinks />
                <StudyingSection />
              </VStack>
            </Flex>
          </Flex>

          {/* 编程统计部分 */}
          <VStack data-section="stats" spacing={6} align="stretch" pt={16}>
            <HStack spacing={3}>
              <Icon
                icon="mingcute:code-line"
                width="24"
                height="24"
                color="#0063DC"
              />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={PROFILE_CONFIG.colors.text.secondary}
              >
                编程统计
              </Text>
            </HStack>

            <WakaTimeStats wakaTimeData={wakaTimeData} loading={loading} />
          </VStack>
        </VStack>
      </Container>

      {/* Sakana 组件只在主页显示 */}
      <SakanaWidgets />
    </motion.div>
  );
}

// 加载中组件
function LoadingScreen() {
  return (
    <Box
      minH="100vh"
      bg="#8FC4FF"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text color="white" fontSize="lg">
        加载中...
      </Text>
    </Box>
  );
}

function App() {
  return (
    <Box minH="100vh" bg="#8FC4FF">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zone" element={<ZonePage />} />
        </Routes>
      </Suspense>
    </Box>
  );
}

export default App;
