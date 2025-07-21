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
import Heading from "@tiptap/extension-heading";
import { v4 as uuidv4 } from "uuid";

const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("jsx", js);
lowlight.register("tsx", ts);

type TocListProps = {
  level: number;
  id: string;
  text: string;
  children: TocListProps[];
};

/**
 *
 * Callback은 String 반환 하도록
 *
 */

// 목차 반환
const getHeadings = () => {
  const test = document.querySelector(".ProseMirror");
  const heads = Array.from(test.querySelectorAll(".heading")) as HTMLElement[];

  const tree: TocListProps[] = [];
  let tempGroup: Record<number, TocListProps> = {};

  for (const head of heads) {
    const level = Number(head.tagName.replace("H", ""));
    const text = head.textContent?.trim() ?? "";

    if (!text) continue;

    const node: TocListProps = {
      id: head.id,
      level,
      text,
      children: [],
    };

    // 이하 트리 구조 연결 로직 유지
    for (const lvl in tempGroup) {
      if (+lvl >= level) {
        delete tempGroup[+lvl];
      }
    }

    if (level === 1) {
      tempGroup = {};
    }

    let parent: TocListProps | undefined;
    for (let lvl = level - 1; lvl >= 1; lvl--) {
      if (tempGroup[lvl]) {
        parent = tempGroup[lvl];
        break;
      }
    }

    if (parent) {
      parent.children.push(node);
    } else {
      tree.push(node);
    }

    tempGroup[level] = node;
  }

  return tree;
};

export function useSimpleEditor({
  placeholder,
  uploadCallback,
  editable,
}: {
  placeholder?: string;
  uploadCallback?: (file: File) => Promise<string>;
  editable?: boolean;
} = {}) {
  const CustomHeading = Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
      const level = node.attrs.level;
      return [
        `h${level}`,
        {
          ...HTMLAttributes,
          id: `heading-${uuidv4()}`,
          class: `heading heading-lv${level}`,
          lev: level,
        },
        0,
      ];
    },
  });

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
      StarterKit.configure({ codeBlock: false, heading: false }),
      CustomHeading,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      ImageResize.configure({
        inline: true,
      }),
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
              upload: (...arg) => {
                return handleImageUpload(...arg, uploadCallback);
              },
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
    editable,
  });

  return { editor, getHeadings };
}
