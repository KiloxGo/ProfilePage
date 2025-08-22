import { Text, VStack, Flex, Box } from "@chakra-ui/react";
import { PROFILE_CONFIG } from "../config/profile";

export const ProfileInfo = () => {
  const { name, subtitle, description, location, colors } = PROFILE_CONFIG;

  return (
    <VStack
      alignItems={{ base: "center", md: "flex-start" }}
      gap={-1}
      spacing={4}
    >
      <Flex
        gap={6}
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "center", md: "flex-end" }}
      >
        <VStack alignItems={{ base: "center", md: "flex-start" }} gap={-1}>
          <Text
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            color={colors.text.primary}
          >
            {name}
          </Text>
          <Text
            fontSize={{ base: "16px", md: "18px" }}
            color={colors.text.primary}
          >
            {subtitle}
          </Text>
        </VStack>
        <Text
          fontSize={{ base: "16px", md: "18px" }}
          color={colors.text.primary}
          whiteSpace="pre-line"
        >
          {description}
        </Text>
      </Flex>

      <Box
        w="auto"
        h="auto"
        py={1}
        px={2}
        bg={colors.background.location}
        color={colors.text.primary}
        borderRadius="5"
      >
        {location}
      </Box>
    </VStack>
  );
};
