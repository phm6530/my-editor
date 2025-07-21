import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";
import { useMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useEffect, useState } from "react";
import {
  MainToolbarContent,
  MobileToolbarContent,
} from "./contents/toolbar-contents";

export default function SimpleToolTip() {
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  );

  const isMobile = useMobile();
  const windowSize = useWindowSize();

  const [rect, setRect] = useState<
    Pick<DOMRect, "x" | "y" | "width" | "height">
  >({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  useEffect(() => {
    const updateRect = () => {
      setRect(document.body.getBoundingClientRect());
    };

    updateRect();

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", updateRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  return (
    <Toolbar
    // style={
    //   isMobile
    //     ? {
    //         bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
    //       }
    //     : {}
    // }
    >
      {mobileView === "main" ? (
        <MainToolbarContent
          onHighlighterClick={() => setMobileView("highlighter")}
          onLinkClick={() => setMobileView("link")}
          isMobile={isMobile}
        />
      ) : (
        <MobileToolbarContent
          type={mobileView === "highlighter" ? "highlighter" : "link"}
          onBack={() => setMobileView("main")}
        />
      )}
    </Toolbar>
  );
}
