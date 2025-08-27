import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

function SakanaWidgets() {
  const leftElRef = useRef(null);
  const rightElRef = useRef(null);
  const widgetsInitialized = useRef(false);

  useEffect(() => {
    const initWidgets = async () => {
      if (widgetsInitialized.current) return;
      widgetsInitialized.current = true;

      try {
        await import("sakana-widget/lib/index.css");
        const { default: SakanaWidget } = await import("sakana-widget");

        const widgetOptions = {
          size: 300,
          controls: false,
          rod: true,
          draggable: true,
          threshold: 0.1,
        };

        if (leftElRef.current) {
          const leftWidget = new SakanaWidget({
            ...widgetOptions,
            character: "chisato",
          });
          leftWidget.mount(leftElRef.current);
        }

        if (rightElRef.current) {
          const rightWidget = new SakanaWidget({
            ...widgetOptions,
            character: "takina",
          });
          rightWidget.mount(rightElRef.current);
        }
      } catch (error) {
        // 组件加载失败，静默忽略
      }
    };

    initWidgets();
  }, []);

  return (
    <>
      {/*左下角*/}
      <Box
        ref={leftElRef}
        position="fixed"
        bottom="0"
        left="0"
        zIndex="999"
        display={{ base: "none", lg: "block" }}
      />
      {/*右下角*/}
      <Box
        ref={rightElRef}
        position="fixed"
        bottom="0"
        right="0"
        zIndex="999"
        display={{ base: "none", lg: "block" }}
      />
    </>
  );
}

export default SakanaWidgets;
