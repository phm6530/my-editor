"use client";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Mention from "@tiptap/extension-mention";
import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import { suggestion } from "./components/suggestion";
import { cn } from "./lib/utils";
import Toolbar from "./components/ToolBar";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import ImageResize from "tiptap-extension-resize-image";
import Heading from "@tiptap/extension-heading";

// head로 목차 생성
const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    return [
      `h${level}`,
      {
        ...HTMLAttributes,
        id: `heading-${level}`,
        class: `heading-lv${level}`,
      },
      0,
    ];
  },
});

const lowlight = createLowlight(common);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const handleHeadingChange = debounce((editor: Editor) => {
  const doc = editor.getJSON();
  const headings =
    doc.content
      ?.filter((n) => n.type === "heading")
      .map((n) => ({
        level: n.attrs.level,
        id: n.attrs.id,
        text: n.content?.map((c) => c.text).join("") ?? "",
      })) ?? [];

  return headings;
}, 500);

const CustomTipTapEditor = ({
  mode = "editor",
  content,
  onChange,
  placeholder = "내용을 입력해주세요",
  uploadCallback,
  className,
  setFontFailmy,
  onHeadingsChange,
}: {
  content?: string;
  onChange?: (_html: string) => void;
  placeholder?: string;
  mode?: "view" | "editor";
  uploadCallback?: (e: File) => Promise<string | null>;
  className?: string;
  setFontFailmy?: string[];
  onHeadingsChange: (e: object) => any;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(
    mode === "editor" && false
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
      }), // 여기 이미 Heading + codeblock
      CustomHeading,
      ImageResize,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion,
      }),
      Image,

      Underline,
      TextStyle,
      FontFamily,
    ],

    editorProps: {
      handleDOMEvents: {
        beforeinput: () => true,
      },
    },

    content: content || "",
    onUpdate: ({ editor }) => {
      if (mode === "editor") {
        const html = editor.getHTML();
        onChange?.(html === "<p></p>" ? "" : html);
      }

      const doc = editor.getJSON();
    },
    ...(mode === "view" && {
      editable: false,
    }),
    onCreate: () => {
      setIsLoading(false);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor || isLoading) {
    return "loading....";
  }

  const handleEditorClick = () => {
    if (mode === "editor") {
      editor.chain().focus().run();
    }
  };

  return (
    <div className="table w-full rounded-md border-collapse ">
      <div className="flex flex-col relative">
        {/* tool bar */}
        {mode === "editor" && (
          <Toolbar
            uploadCallback={uploadCallback}
            editor={editor}
            setFontFailmy={setFontFailmy}
          />
        )}
        <div
          className={cn(
            mode === "view" && "border-none",
            "table-cell w-full border-input border !rounded-lg cursor-text  h-full overflow-hidden rounded-b-md focus-within:focus-within:bg-[hsl(var(--custom-color))]"
          )}
        >
          <EditorContent
            editor={editor}
            disabled={mode === "view" ? true : false}
            className={cn(
              " w-full h-full min-h-[150px] overflow-hidden ",
              mode === "editor" && " dark:bg-custom-input p-3 ",
              className
            )}
            onClick={handleEditorClick}
          />
        </div>
      </div>
    </div>
  );
};

export { CustomTipTapEditor, handleHeadingChange };
