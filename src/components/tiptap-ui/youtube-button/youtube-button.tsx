import { Button } from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import React from "react";
import { type Editor } from "@tiptap/react";
import { Youtube } from "lucide-react";

export const YoutubeButton = React.forwardRef<
  HTMLButtonElement,
  { editor?: Editor }
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const editor = useTiptapEditor(providedEditor);

  if (!editor || !editor.isEditable) {
    return null;
  }
  const addYoutubeVideo = () => {
    const url = prompt("삽입하실 Youtube Url을 입력해주세요");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  return (
    <Button
      type="button"
      // className={className.trim()}
      // disabled={isDisabled}
      data-style="ghost"
      // data-active-state={isActive ? "on" : "off"}
      // data-disabled={isDisabled}
      role="button"
      tabIndex={-1}
      // aria-label={label}
      // aria-pressed={isActive}
      tooltip={"Youtube"}
      // shortcutKeys={shortcutKey}
      onClick={addYoutubeVideo}
      {...buttonProps}
      ref={ref}
    >
      <Youtube />
      {/* {children || (
        <>
          <Icon className="tiptap-button-icon" />
          {text && <span className="tiptap-button-text">{text}</span>}
        </>
      )} */}
    </Button>
  );
});

YoutubeButton.displayName = "YoutubeButton";

export default YoutubeButton;
