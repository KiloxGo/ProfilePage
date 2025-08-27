import { Button } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export function BackgroundToggle({ onRefresh }) {
  return (
    <motion.div
      style={{
        position: "fixed",
        top: "20px",
        right: "80px",
        zIndex: 1000,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="background-toggle-container"
    >
      <Button
        onClick={onRefresh}
        size="sm"
        variant="ghost"
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        borderRadius="full"
        p={2}
        _hover={{
          bg: "rgba(255, 255, 255, 0.9)",
          transform: "scale(1.05)",
        }}
        _active={{
          transform: "scale(0.95)",
        }}
        transition="all 0.2s"
        title="切换背景图片"
      >
        <Icon icon="mingcute:refresh-1-line" width="16" height="16" />
      </Button>
    </motion.div>
  );
}

export default BackgroundToggle;
