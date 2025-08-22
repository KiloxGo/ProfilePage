import { Flex, Button } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { socialLinks } from "../data/socialData";
import { PROFILE_CONFIG } from "../config/profile";

export const SocialLinks = () => {
  const { colors } = PROFILE_CONFIG;

  return (
    <Flex my={4} flexWrap="wrap" gap={4} alignItems="center">
      {socialLinks.map((link) => (
        <Button
          key={link.href}
          as="a"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          leftIcon={<Icon icon={link.icon} width="24" height="24" />}
          bg={colors.background.badge}
          color={colors.text.primary}
          _hover={{
            bg: colors.background.cardHover,
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
  );
};
