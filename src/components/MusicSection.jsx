import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { MUSIC_CONFIG } from "../data/musicData";
import { PROFILE_CONFIG } from "../config/profile";

export const MusicSection = () => {
  const { colors } = PROFILE_CONFIG;
  const { sections, player } = MUSIC_CONFIG;

  const generatePlayerUrl = (songId) => {
    const params = new URLSearchParams({
      ...player.defaultParams,
      id: songId,
    });
    return `${player.baseUrl}?${params.toString()}`;
  };

  return (
    <VStack align="stretch">
      <HStack spacing={3}>
        <Icon
          icon="mingcute:music-2-fill"
          width="24"
          height="24"
          color="#0063DC"
        />
        <Text fontSize="2xl" fontWeight="bold" color={colors.text.secondary}>
          喜欢的音乐
        </Text>
      </HStack>

      <VStack spacing={6} align="stretch">
        {sections.map((section) => (
          <VStack key={section.id} spacing={4} align="stretch">
            <HStack spacing={3}>
              <Icon
                icon={section.icon}
                width="15"
                height="15"
                color={section.iconColor}
              />
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                {section.title}
              </Text>
            </HStack>

            {section.songs.map((song) => (
              <Box
                key={song.id}
                borderRadius="12px"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.1)"
                p={3}
                w="100%"
              >
                <iframe
                  {...player.iframeStyle}
                  src={generatePlayerUrl(song.id)}
                  style={{ borderRadius: "8px" }}
                />
              </Box>
            ))}
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
};
