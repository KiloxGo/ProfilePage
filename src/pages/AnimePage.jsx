import {
  Container,
  VStack,
  Box,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Heading,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { HomeButton } from "../components/HomeButton";
import { AnimeCard } from "../components/AnimeCard";
import { bangumiService } from "../services/bangumiService";

// 收藏状态映射
const COLLECTION_TYPES = {
  1: { label: "想看", value: 1 },
  2: { label: "看过", value: 2 },
  3: { label: "在看", value: 3 }, //其实还有4: "搁置", 5: "抛弃"
};

function AnimePage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(3); // 默认显示"在看"
  const [sortMode, setSortMode] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");

  const loadCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bangumiService.getAllCollections();
      setCollections(data);
    } catch (err) {
      setError("加载失败，请稍后重试");
      console.error("Error loading collections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // 按状态分类
  const getCollectionsByType = useCallback(
    (type) => {
      return collections.filter((item) => item.type === type);
    },
    [collections]
  );

  // 按名称首字母排序
  const sortByName = useCallback(
    (items) => {
      return [...items].sort((a, b) => {
        const nameA = (a.subject.name_cn || a.subject.name || "").toLowerCase();
        const nameB = (b.subject.name_cn || b.subject.name || "").toLowerCase();
        const comparison = nameA.localeCompare(nameB, "zh-CN");
        return sortOrder === "asc" ? comparison : -comparison;
      });
    },
    [sortOrder]
  );

  // 按年份分组
  const groupByYear = useCallback(
    (items) => {
      const grouped = new Map();
      items.forEach((item) => {
        const date = item.subject.date || "";
        const year = date ? date.split("-")[0] : "未知年份";
        if (!grouped.has(year)) {
          grouped.set(year, []);
        }
        grouped.get(year).push(item);
      });

      // 对每个年份内的项目按月份排序
      grouped.forEach((yearItems) => {
        yearItems.sort((a, b) => {
          const dateA = a.subject.date || "0000-00";
          const dateB = b.subject.date || "0000-00";
          return dateB.localeCompare(dateA); // 降序，最新的在前
        });
      });

      // 转换为数组避免对象数字键被 JS 重排
      return Array.from(grouped.entries()).sort(([yearA], [yearB]) => {
        if (yearA === "未知年份") return 1;
        if (yearB === "未知年份") return -1;
        return sortOrder === "asc"
          ? yearA.localeCompare(yearB)
          : yearB.localeCompare(yearA);
      });
    },
    [sortOrder]
  );

  // 切换排序模式
  const toggleSortMode = () => {
    setSortMode((prev) => (prev === "name" ? "year" : "name"));
  };

  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // 渲染网格
  const renderAnimeGrid = (items) => {
    if (items.length === 0) {
      return (
        <Center py={20}>
          <Text color="gray.500" fontSize="lg">
            暂无内容
          </Text>
        </Center>
      );
    }

    if (sortMode === "name") {
      // 按名称排序
      const sortedItems = sortByName(items);
      return (
        <SimpleGrid
          columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          spacing={{ base: 4, md: 5, lg: 6 }}
          w="100%"
        >
          {sortedItems.map((anime, index) => (
            <AnimeCard key={anime.subject_id} anime={anime} index={index} />
          ))}
        </SimpleGrid>
      );
    } else {
      // 按年份分组
      const groupedItems = groupByYear(items);
      return (
        <VStack spacing={8} align="stretch" w="100%">
          {groupedItems.map(([year, yearItems]) => (
            <Box key={year}>
              <Heading
                size="md"
                mb={4}
                color="gray.700"
                fontWeight="700"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon icon="mingcute:calendar-line" width="24" height="24" />
                {year}
                <Text
                  as="span"
                  fontSize="sm"
                  fontWeight="normal"
                  color="gray.500"
                  ml={2}
                >
                  ({yearItems.length} 部)
                </Text>
              </Heading>
              <SimpleGrid
                columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                spacing={{ base: 4, md: 5, lg: 6 }}
                w="100%"
              >
                {yearItems.map((anime, index) => (
                  <AnimeCard
                    key={anime.subject_id}
                    anime={anime}
                    index={index}
                  />
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </VStack>
      );
    }
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

      <Container maxW="container.xl" py={20}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 加载状态 */}
          {loading && (
            <Center py={20}>
              <VStack spacing={4}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
                <Text color="gray.600">加载中...</Text>
              </VStack>
            </Center>
          )}

          {/* 错误状态 */}
          {error && !loading && (
            <Center py={20}>
              <VStack spacing={4}>
                <Icon
                  icon="mingcute:alert-line"
                  width="48"
                  height="48"
                  color="red.500"
                />
                <Text color="red.500" fontSize="lg">
                  {error}
                </Text>
              </VStack>
            </Center>
          )}

          {/* 内容区域 */}
          {!loading && !error && (
            <Box
              bg="rgba(255, 255, 255, 0.5)"
              backdropFilter="blur(10px)"
              borderRadius="16px"
              p={{ base: 4, md: 6 }}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
              position="relative"
            >
              {/* 排序控制按钮组 */}
              <Flex
                position="absolute"
                top={{ base: 4, md: 6 }}
                right={{ base: 4, md: 6 }}
                gap={2}
                zIndex={10}
              >
                {/* 升序/降序切换按钮 */}
                <IconButton
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={toggleSortOrder}
                  icon={
                    <Icon
                      icon={
                        sortOrder === "asc"
                          ? "mingcute:sort-ascending-line"
                          : "mingcute:sort-descending-line"
                      }
                      width="18"
                      height="18"
                    />
                  }
                  bg="white"
                  _hover={{
                    bg: "blue.50",
                  }}
                  aria-label={sortOrder === "asc" ? "升序" : "降序"}
                />

                {/* 排序模式切换按钮 */}
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={toggleSortMode}
                  leftIcon={
                    <Icon
                      icon={
                        sortMode === "name"
                          ? "mingcute:text-line"
                          : "mingcute:calendar-line"
                      }
                      width="16"
                      height="16"
                    />
                  }
                  bg="white"
                  _hover={{
                    bg: "blue.50",
                  }}
                >
                  {sortMode === "name" ? "名称" : "年份"}
                </Button>
              </Flex>

              <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                index={Object.values(COLLECTION_TYPES).findIndex(
                  (t) => t.value === activeTab
                )}
                onChange={(index) => {
                  setActiveTab(Object.values(COLLECTION_TYPES)[index].value);
                }}
              >
                <TabList mb={6} flexWrap="wrap" gap={2} justifyContent="center">
                  {Object.values(COLLECTION_TYPES).map((type) => {
                    const count = getCollectionsByType(type.value).length;
                    return (
                      <Tab
                        key={type.value}
                        fontWeight="600"
                        _selected={{
                          bg: "blue.500",
                          color: "white",
                        }}
                      >
                        {type.label}
                        <Text
                          as="span"
                          ml={2}
                          fontSize="xs"
                          opacity={0.8}
                          fontWeight="normal"
                        >
                          ({count})
                        </Text>
                      </Tab>
                    );
                  })}
                </TabList>

                <TabPanels>
                  {Object.values(COLLECTION_TYPES).map((type) => (
                    <TabPanel
                      key={`${type.value}-${sortMode}-${sortOrder}`}
                      p={0}
                    >
                      {renderAnimeGrid(getCollectionsByType(type.value))}
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </motion.div>
      </Container>
    </motion.div>
  );
}

export default AnimePage;
