import { useEffect, useRef } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";

function SakanaWidgets() {
  const isDesktop = useBreakpointValue(
    { base: false, lg: true },
    { ssr: false }
  );

  const leftElRef = useRef(null);
  const rightElRef = useRef(null);
  const widgetsRef = useRef({ left: null, right: null });

  useEffect(() => {
    const initWidgets = async () => {
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

        if (leftElRef.current && !widgetsRef.current.left) {
          const leftWidget = new SakanaWidget({
            ...widgetOptions,
            character: "chisato",
          });
          leftWidget.mount(leftElRef.current);
          widgetsRef.current.left = leftWidget;
        }

        if (rightElRef.current && !widgetsRef.current.right) {
          const rightWidget = new SakanaWidget({
            ...widgetOptions,
            character: "takina",
          });
          rightWidget.mount(rightElRef.current);
          widgetsRef.current.right = rightWidget;
        }
      } catch (error) {
        console.error("Failed to load or mount SakanaWidget:", error);
      }
    };

    if (isDesktop) {
      initWidgets();
    }

    return () => {
      if (widgetsRef.current.left) {
        widgetsRef.current.left.unmount();
        widgetsRef.current.left = null;
      }
      if (widgetsRef.current.right) {
        widgetsRef.current.right.unmount();
        widgetsRef.current.right = null;
      }
    };
  }, [isDesktop]);

  if (!isDesktop) {
    return null;
  }

  return (
    <>
      {/*左下角*/}
      <Box ref={leftElRef} position="fixed" bottom="0" left="0" zIndex="999" />
      {/*右下角*/}
      <Box
        ref={rightElRef}
        position="fixed"
        bottom="0"
        right="0"
        zIndex="999"
      />
    </>
  );
}

export default SakanaWidgets;
