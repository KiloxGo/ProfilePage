import {
  Box,
  Text,
  HStack,
  Badge,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Flex,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { studyingData } from "../data/socialData";
import { PROFILE_CONFIG } from "../config/profile";

export const StudyingSection = () => {
  const { colors } = PROFILE_CONFIG;

  return (
    <Box w="100%">
      {studyingData.map((section) => (
        <Card
          key={section.title}
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
                icon={section.icon}
                width="22"
                height="22"
                color={section.iconColor}
              />
              <Text
                fontSize="xl"
                fontWeight="700"
                color={colors.text.secondary}
              >
                {section.title}
              </Text>
            </HStack>
          </CardHeader>

          <CardBody pt={0}>
            <VStack align="flex-start" spacing={4}>
              <Text color={colors.text.muted} fontSize="md" lineHeight="1.6">
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
                    color={colors.text.secondary}
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
                      <Icon icon={language.icon} width="18" height="18" />
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
  );
};
