import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";

// --- Tiptap Node ---
import Youtube from "@tiptap/extension-youtube";

// --- Lib ---
import ImageResize from "tiptap-extension-resize-image";

//---codeBlock
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import Placeholder from "@tiptap/extension-placeholder";
const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

/**
 *
 * Callback은 String 반환 하도록
 *
 */
export function useSimpleEditor({
  placeholder,
  uploadCallback,
}: {
  placeholder?: string;
  uploadCallback?: (file: File) => Promise<string>;
} = {}) {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      ImageResize,
      Typography,

      Superscript,
      Subscript,
      Selection,
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      ...(uploadCallback
        ? [
            ImageUploadNode.configure({
              accept: "image/*",
              maxSize: MAX_FILE_SIZE,
              limit: 3,
              upload: (...arg) => handleImageUpload(...arg, uploadCallback),
              onError: (error) => console.error("Upload failed:", error),
            }),
          ]
        : []),
      Placeholder.configure({ placeholder }),
      TrailingNode,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({ openOnClick: false }),
    ],
  });

  return { editor };
}
