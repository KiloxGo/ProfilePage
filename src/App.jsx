import {
  Box,
  Container,
  Flex,
  Image,
  Text,
  HStack,
  Badge,
  VStack,
  Button,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Skeleton,
  Avatar,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import "./index.css";
import { useState, useEffect } from "react";

//硬编码小馋猫😋

const socialLinks = [
  {
    name: "Blog",
    icon: "mingcute:book-line",
    href: "https://blog.kilox.top",
  },
  {
    name: "GitHub",
    icon: "mingcute:github-line",
    href: "https://github.com/KiloxGo",
  },
  {
    name: "网易云音乐",
    icon: "mingcute:netease-music-line",
    href: "https://music.163.com/#/user/home?id=3320591788",
  },
];

const currentlyStudying = [
  {
    title: "正在学习",
    description: "实际上有点摆烂",
    icon: "TrendingUp",
    iconColor: "text-green-500",
    languages: [
      {
        name: "Python",
        icon: "logos:python",
      },
      {
        name: "JavaScript",
        icon: "logos:javascript",
      },
      {
        name: "TypeScript",
        icon: "logos:typescript-icon",
      },
    ],
  },
];

const WAKATIME_API = {
  TimeTracking:
    "https://wakatime.com/share/@Kilox/995aed08-0b92-41c5-a244-6543535b3429.json",
  Language:
    "https://wakatime.com/share/@Kilox/0ee87a93-154a-46bf-aecd-7936e5868af2.json",
};

const getLangIcon = (langName) => {
  const iconMap = {
    python: "logos:python",
    javascript: "logos:javascript",
    typescript: "logos:typescript-icon",
    java: "logos:java",
    cpp: "logos:cplusplus",
    c: "devicon:c",
    html: "logos:html-5",
    css: "logos:css-3",
    react: "logos:react",
    vue: "logos:vue",
    markdown: "logos:markdown",
    json: "logos:json",
    bash: "logos:bash",
  };
  return iconMap[langName.toLowerCase()] || "mingcute:code-line";
};

function App() {
  const [wakaTimeData, setWakaTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  useEffect(() => {
    const fetchWakaTimeData = async () => {
      try {
        const [timeResponse, langResponse] = await Promise.all([
          fetch(WAKATIME_API.TimeTracking),
          fetch(WAKATIME_API.Language),
        ]);

        if (timeResponse.ok && langResponse.ok) {
          const [timeData, langData] = await Promise.all([
            timeResponse.json(),
            langResponse.json(),
          ]);

          setWakaTimeData({
            timeTrackingData: timeData,
            languageData: langData,
          });
        }
      } catch (error) {
        console.error("Failed to fetch WakaTime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWakaTimeData();
  }, []);
  return (
    <Container maxW={"container.lg"} py={70}>
      <VStack spacing={20} align="stretch">
        <Flex
          alignItems={"center"}
          position="relative"
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 4, lg: 0 }}
        >
          <Box
            border="5px solid"
            borderColor="#3659B9"
            borderRadius="50"
            boxSize="400px"
            alignItems={"center"}
            justifyContent={"center"}
            top={"30%"}
            display={{ base: "none", lg: "block" }}
          ></Box>
          <Box display={{ base: "block", lg: "none" }}>
            <Image
              src="/avatar.png"
              onLoad={() => setIsAvatarLoaded(true)}
              display="none"
            />
            <Skeleton
              isLoaded={isAvatarLoaded}
              w={{ base: "280px", md: "400px" }}
              h={{ base: "280px", md: "400px" }}
              borderRadius="full"
            >
              <Avatar
                src="/avatar.png"
                name="Kilox"
                size="full"
                w="100%"
                h="100%"
                border="3px solid #3659B9"
              />
            </Skeleton>
          </Box>

          <Skeleton
            isLoaded={isImageLoaded}
            w={{ base: "0", lg: "640px" }}
            h={{ base: "0", lg: "640px" }}
            position={{ base: "static", lg: "absolute" }}
            display={{ base: "none", lg: "block" }}
          >
            <Image
              src="/boximage.png"
              onLoad={() => setIsImageLoaded(true)}
              w="100%"
              h="100%"
              objectFit="contain"
            />
          </Skeleton>
          <Flex>
            <VStack
              transform={{ base: "none", lg: "translate(120px,100px)" }}
              alignItems={{ base: "center", md: "flex-start" }}
              spacing={{ base: 4, lg: 2 }}
              mt={{ base: 4, lg: 0 }}
            >
              <Flex
                gap={6}
                direction={{ base: "column", md: "row" }}
                alignItems={{ base: "center", md: "flex-end" }}
              >
                <VStack
                  alignItems={{ base: "center", md: "flex-start" }}
                  gap={-1}
                >
                  <Text
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    color="#3D3D3D"
                  >
                    Kilox
                  </Text>
                  <Text fontSize={{ base: "16px", md: "18px" }} color="#3D3D3D">
                    那就永远自由
                  </Text>
                </VStack>
                <Text fontSize={{ base: "16px", md: "18px" }} color="#3D3D3D">
                  A Normal Student Majoring in
                  <br />
                  Electrical Engineering
                </Text>
              </Flex>
              <Box
                w="auto"
                h="auto"
                py={1}
                px={2}
                bg="rgba(216, 216, 216, 0.5)"
                color="#3D3D3D"
                borderRadius="5"
              >
                Now in SJTU,Shanghai,China
              </Box>
              <Flex my={4} flexWrap="wrap" gap={4} alignItems="center">
                {socialLinks.map((link) => (
                  <Button
                    key={link.href}
                    as="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftIcon={<Icon icon={link.icon} width="24" height="24" />}
                    bg="rgba(248, 248, 248, 0.7)"
                    color="#3D3D3D"
                    _hover={{
                      bg: "rgba(248, 248, 248, 0.9)",
                      transform: "translateY(-1px)",
                    }}
                    _active={{
                      bg: "rgba(248, 248, 248, 0.8)",
                    }}
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.3)"
                    borderRadius="8"
                    size={{ base: "sm", md: "md" }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Flex>
              <Box w="100%">
                {currentlyStudying.map((section) => (
                  <Card
                    key={section.title}
                    bg="rgba(255, 255, 255, 0.75)"
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderRadius="12"
                    borderColor="rgba(255, 255, 255, 0.4)"
                    shadow="sm"
                    _hover={{
                      shadow: "xl",
                      borderColor: "rgba(255, 255, 255, 0.6)",
                    }}
                    transition="all 0.3s ease"
                  >
                    <CardHeader pb={2}>
                      <HStack spacing={3}>
                        <Icon
                          icon="mingcute:trending-up-line"
                          width="22"
                          height="22"
                          color="#22C55E"
                        />
                        <Text fontSize="xl" fontWeight="700" color="#2D3748">
                          {section.title}
                        </Text>
                      </HStack>
                    </CardHeader>

                    <CardBody pt={0}>
                      <VStack align="flex-start" spacing={4}>
                        <Text color="#4A5568" fontSize="md" lineHeight="1.6">
                          {section.description}
                        </Text>

                        <Flex flexWrap="wrap" gap={3}>
                          {section.languages.map((language) => (
                            <Badge
                              key={language.name}
                              variant="outline"
                              borderRadius="8"
                              px={3}
                              py={2}
                              bg="rgba(255, 255, 255, 0.6)"
                              border="1px solid"
                              borderColor="rgba(200, 200, 200, 0.5)"
                              color="#2D3748"
                              fontSize="sm"
                              fontWeight="500"
                              _hover={{
                                bg: "rgba(255, 255, 255, 0.9)",
                                transform: "translateY(-1px)",
                                shadow: "sm",
                                borderColor: "rgba(200, 200, 200, 0.7)",
                              }}
                              transition="all 0.2s ease"
                              cursor="default"
                            >
                              <HStack>
                                <Icon
                                  icon={language.icon}
                                  width="18"
                                  height="18"
                                />
                                <Text>{language.name}</Text>
                              </HStack>
                            </Badge>
                          ))}
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </VStack>
          </Flex>
        </Flex>

        <VStack spacing={6} align="stretch" pt={16}>
          <HStack spacing={3}>
            <Icon
              icon="mingcute:code-line"
              width="24"
              height="24"
              color="#0063DC"
            />
            <Text fontSize="2xl" fontWeight="bold" color="#2D3748">
              编程统计
            </Text>
          </HStack>

          {loading ? (
            <Text color="#4A5568">加载中...</Text>
          ) : wakaTimeData ? (
            <Flex gap={6} direction={{ base: "column", md: "row" }}>
              <Card
                flex="1"
                bg="rgba(255, 255, 255, 0.75)"
                backdropFilter="blur(20px)"
                border="1px solid"
                borderRadius="12"
                borderColor="rgba(255, 255, 255, 0.4)"
                shadow="sm"
                _hover={{
                  shadow: "xl",
                  borderColor: "rgba(255, 255, 255, 0.6)",
                }}
                transition="all 0.3s ease"
              >
                <CardHeader pb={2}>
                  <HStack spacing={3}>
                    <Icon
                      icon="mingcute:chart-vertical-line"
                      width="20"
                      height="20"
                      color="#77BBDD"
                    />
                    <Text fontSize="lg" fontWeight="700" color="#2D3748">
                      重要数据
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="flex-start" spacing={4}>
                    <Box>
                      <HStack spacing={2} mb={1}>
                        <Icon
                          icon="mingcute:trending-up-line"
                          width="16"
                          height="16"
                          color="#77BBDD"
                        />
                        <Text fontSize="sm" color="#4A5568" fontWeight="500">
                          总编程时间
                        </Text>
                      </HStack>
                      <Text fontSize="xl" color="#77BBDD" fontWeight="bold">
                        {
                          wakaTimeData.timeTrackingData.data.grand_total
                            .human_readable_total
                        }
                      </Text>
                      <Text fontSize="xs" color="#6B7280">
                        日均:{" "}
                        {
                          wakaTimeData.timeTrackingData.data.grand_total
                            .human_readable_daily_average
                        }
                      </Text>
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={1}>
                        <Icon
                          icon="mingcute:trophy-line"
                          width="16"
                          height="16"
                          color="#77BBDD"
                        />
                        <Text fontSize="sm" color="#4A5568" fontWeight="500">
                          最佳单日
                        </Text>
                      </HStack>
                      <Text fontSize="xl" color="#77BBDD" fontWeight="bold">
                        {wakaTimeData.timeTrackingData.data.best_day.text}
                      </Text>
                      <Text fontSize="xs" color="#6B7280">
                        {new Date(
                          wakaTimeData.timeTrackingData.data.best_day.date
                        ).toLocaleDateString("zh-CN")}
                      </Text>
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={1}>
                        <Icon
                          icon="mingcute:calendar-line"
                          width="16"
                          height="16"
                          color="#77BBDD"
                        />
                        <Text fontSize="sm" color="#4A5568" fontWeight="500">
                          活跃天数
                        </Text>
                      </HStack>
                      <Text fontSize="xl" color="#77BBDD" fontWeight="bold">
                        {
                          wakaTimeData.timeTrackingData.data.range
                            .days_minus_holidays
                        }{" "}
                        天
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                flex="1"
                bg="rgba(255, 255, 255, 0.75)"
                backdropFilter="blur(20px)"
                border="1px solid"
                borderRadius="12"
                borderColor="rgba(255, 255, 255, 0.4)"
                shadow="sm"
                _hover={{
                  shadow: "xl",
                  borderColor: "rgba(255, 255, 255, 0.6)",
                }}
                transition="all 0.3s ease"
              >
                <CardHeader pb={2}>
                  <HStack spacing={3}>
                    <Icon
                      icon="mingcute:heart-line"
                      width="20"
                      height="20"
                      color="#77BBDD"
                    />
                    <Text fontSize="lg" fontWeight="700" color="#2D3748">
                      最近常用的语言
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="flex-start" spacing={3}>
                    {wakaTimeData.languageData.data
                      .filter((lang) => lang.percent > 0)
                      .slice(0, 5)
                      .map((lang) => (
                        <Box key={lang.name} w="100%">
                          <Flex justify="space-between" align="center" mb={1}>
                            <HStack spacing={2}>
                              <Icon
                                icon={getLangIcon(lang.name)}
                                width="18"
                                height="18"
                              />
                              <Text
                                fontSize="sm"
                                color="#2D3748"
                                fontWeight="500"
                              >
                                {lang.name}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="#6B7280">
                              {lang.percent.toFixed(1)}%
                            </Text>
                          </Flex>
                          <Progress
                            value={lang.percent}
                            bg="rgba(200, 200, 200, 0.3)"
                            borderRadius="4"
                            h="6px"
                            sx={{
                              "& > div": {
                                bg: "#77BBDD",
                              },
                            }}
                          />
                        </Box>
                      ))}
                  </VStack>
                </CardBody>
              </Card>
            </Flex>
          ) : (
            <Card
              bg="rgba(255, 255, 255, 0.75)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderRadius="12"
              borderColor="rgba(255, 255, 255, 0.4)"
              p={6}
            >
              <Text color="#6B7280" textAlign="center">
                无法加载 WakaTime 数据，请检查配置
              </Text>
            </Card>
          )}
        </VStack>
        <VStack align="stretch">
          <HStack spacing={3}>
            <Icon
              icon="mingcute:music-2-fill"
              width="24"
              height="24"
              color="#0063DC"
            />
            <Text fontSize="2xl" fontWeight="bold" color="#2D3748">
              喜欢的音乐
            </Text>
          </HStack>

          <VStack spacing={6} align="stretch">
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon
                  icon="mingcute:lightning-line"
                  width="15"
                  height="15"
                  color="#2C72FF"
                />
                <Text fontSize="xl" fontWeight="bold" color="#2D3748">
                  EDM
                </Text>
              </HStack>

              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=1940303073&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>

              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=1421200829&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>

              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=425280053&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>

              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=1815533595&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>
              <HStack spacing={3}>
                <Icon
                  icon="mingcute:microphone-line"
                  width="15"
                  height="15"
                  color="#2C72FF"
                />
                <Text fontSize="xl" fontWeight="bold" color="#2D3748">
                  JPOP-我是ZUTOMAYO小馋猫-ACA小姐🤤🤤
                </Text>
              </HStack>
              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=1325357378&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>

              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=1325356411&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>

              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=1990571322&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>

              <Box
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  frameBorder="no"
                  border="0"
                  marginWidth="0"
                  marginHeight="0"
                  width="100%"
                  height="86"
                  src="//music.163.com/outchain/player?type=2&id=1870469768&auto=0&height=66"
                  style={{ borderRadius: "8px" }}
                />
              </Box>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Container>
  );
}

export default App;
