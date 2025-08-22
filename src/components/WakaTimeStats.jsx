import {
  VStack,
  HStack,
  Text,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Box,
  Progress,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { getLangIcon, WAKATIME_CONFIG } from "../config/wakatime";
import { PROFILE_CONFIG } from "../config/profile";

export const WakaTimeStats = ({ wakaTimeData, loading }) => {
  const { colors } = PROFILE_CONFIG;

  if (loading) {
    return <Text color={colors.text.muted}>加载中...</Text>;
  }

  if (!wakaTimeData) {
    return (
      <Card
        bg={colors.background.card}
        backdropFilter="blur(20px)"
        border="1px solid"
        borderRadius="12"
        borderColor="rgba(255, 255, 255, 0.4)"
        p={6}
      >
        <Text color={colors.text.light} textAlign="center">
          无法加载 WakaTime 数据，请检查配置
        </Text>
      </Card>
    );
  }

  const { timeTrackingData, languageData } = wakaTimeData;
  const { maxLanguages, minPercentage } = WAKATIME_CONFIG.settings;

  return (
    <Flex gap={6} direction={{ base: "column", md: "row" }}>
      {/* 重要数据卡片 */}
      <Card
        flex="1"
        bg={colors.background.card}
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
              color={colors.secondary}
            />
            <Text fontSize="lg" fontWeight="700" color={colors.text.secondary}>
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
                  color={colors.secondary}
                />
                <Text fontSize="sm" color={colors.text.muted} fontWeight="500">
                  总编程时间
                </Text>
              </HStack>
              <Text fontSize="xl" color={colors.secondary} fontWeight="bold">
                {timeTrackingData.data.grand_total.human_readable_total}
              </Text>
              <Text fontSize="xs" color={colors.text.light}>
                日均:{" "}
                {timeTrackingData.data.grand_total.human_readable_daily_average}
              </Text>
            </Box>

            <Box>
              <HStack spacing={2} mb={1}>
                <Icon
                  icon="mingcute:trophy-line"
                  width="16"
                  height="16"
                  color={colors.secondary}
                />
                <Text fontSize="sm" color={colors.text.muted} fontWeight="500">
                  最佳单日
                </Text>
              </HStack>
              <Text fontSize="xl" color={colors.secondary} fontWeight="bold">
                {timeTrackingData.data.best_day.text}
              </Text>
              <Text fontSize="xs" color={colors.text.light}>
                {new Date(
                  timeTrackingData.data.best_day.date
                ).toLocaleDateString("zh-CN")}
              </Text>
            </Box>

            <Box>
              <HStack spacing={2} mb={1}>
                <Icon
                  icon="mingcute:calendar-line"
                  width="16"
                  height="16"
                  color={colors.secondary}
                />
                <Text fontSize="sm" color={colors.text.muted} fontWeight="500">
                  活跃天数
                </Text>
              </HStack>
              <Text fontSize="xl" color={colors.secondary} fontWeight="bold">
                {timeTrackingData.data.range.days_minus_holidays} 天
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* 语言统计卡片 */}
      <Card
        flex="1"
        bg={colors.background.card}
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
              color={colors.secondary}
            />
            <Text fontSize="lg" fontWeight="700" color={colors.text.secondary}>
              最近常用的语言
            </Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack align="flex-start" spacing={3}>
            {languageData.data
              .filter((lang) => lang.percent > minPercentage)
              .slice(0, maxLanguages)
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
                        color={colors.text.secondary}
                        fontWeight="500"
                      >
                        {lang.name}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={colors.text.light}>
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
                        bg: colors.secondary,
                      },
                    }}
                  />
                </Box>
              ))}
          </VStack>
        </CardBody>
      </Card>
    </Flex>
  );
};
