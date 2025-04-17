import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  StrikethroughIcon,
  TextQuote,
  Underline,
  Youtube,
} from "lucide-react";

import { Editor } from "@tiptap/react";
import { ChangeEvent, useCallback, useRef } from "react";
import { cn } from "../lib/utils";
import { SelectList } from "./shared/select-list";
import { TooptipBtn } from "./shared/tootip-btn";
import { UseMyEditorProps } from "@/hooks/useMyEditor";
export default function Toolbar({
  editor,
  uploadCallback,
  setFontFailmy,
  enableImage,
  enableCodeBlock,
  enableYoutube,
}: {
  editor: Editor;
  uploadCallback?: (e: File) => Promise<string | null>;
  setFontFailmy: string[];
} & Omit<
  UseMyEditorProps,
  "onChange" | "content" | "editorMode" | "placeholder"
>) {
  const ref = useRef<HTMLInputElement | null>(null);
  const addYoutubeVideo = () => {
    const url = prompt("삽입하실 Youtube Url을 입력해주세요");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };
  const etcButtons = [
    enableCodeBlock && {
      toolname: "코드 블럭",
      onclick: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      icon: Code2,
    },
    enableYoutube && {
      toolname: "Youtube",
      onclick: () => addYoutubeVideo(),
      icon: Youtube,
    },
    {
      toolname: "Link",
      onclick: () => addLink(),
      icon: Link,
    },
    enableImage && {
      toolname: "이미지 삽입",
      onclick: () => ref.current?.click(),
      icon: Image,
    },
  ].filter(Boolean);

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("URL을 입력해주세요:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const urlWithProtocol =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    // 링크 추가
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: urlWithProtocol, target: "_blank" })
      .run();
  };

  // img Uploader
  const addImage = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const url = await uploadCallback(e.target.files[0]);

      if (url) {
        // 포커스 문서 뒤로
        editor
          ?.chain()
          .focus("end")
          .insertContent([{ type: "paragraph" }])
          .setImage({ src: url })
          .run();
      }
    },
    [editor, uploadCallback]
  );

  // menu
  const headingButtons = [
    // heading
    [
      {
        toolname: "제목1",
        onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        active: editor.isActive("heading", { level: 1 }),
        icon: Heading1,
      },
      {
        toolname: "제목2",
        onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        active: editor.isActive("heading", { level: 2 }),
        icon: Heading2,
      },
      {
        toolname: "제목3",
        onclick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        active: editor.isActive("heading", { level: 3 }),
        icon: Heading3,
      },
    ],
    // text style
    [
      {
        toolname: "굵게",
        onclick: () => editor.chain().focus().toggleBold().run(),
        active: editor.isActive("bold"),
        icon: Bold,
      },
      {
        toolname: "기울기",
        onclick: () => editor.chain().focus().toggleItalic().run(),
        active: editor.isActive("italic"),
        icon: Italic,
      },
      {
        toolname: "취소선",
        onclick: () => editor.chain().focus().toggleStrike().run(),
        active: editor.isActive("strike"),
        icon: StrikethroughIcon,
      },
      {
        toolname: "밑줄",
        onclick: () => editor.chain().focus().toggleUnderline().run(),
        icon: Underline,
      },
      {
        toolname: "인용구",
        onclick: () => editor.chain().focus().toggleBlockquote().run(),
        active: editor.isActive("blockquote"),
        icon: TextQuote,
      },
    ],

    // align
    [
      {
        toolname: "왼쪽 정렬",
        onclick: () => editor.chain().focus().setTextAlign("left").run(),
        active: editor.isActive({ textAlign: "left" }),
        icon: AlignLeft,
      },
      {
        toolname: "가운데 정렬",
        onclick: () => editor.chain().focus().setTextAlign("center").run(),
        active: editor.isActive({ textAlign: "center" }),
        icon: AlignCenter,
      },
      {
        toolname: "오른쪽 정렬",
        onclick: () => editor.chain().focus().setTextAlign("right").run(),
        active: editor.isActive({ textAlign: "right" }),
        icon: AlignRight,
      },
    ],

    etcButtons,
  ];

  return (
    <div className="flex  mb-2 sticky top-0  z-10 items-center bg-background py-3">
      {/* Font Family */}
      {setFontFailmy && <SelectList fontList={setFontFailmy} editor={editor} />}

      {/* upload */}
      <input type="file" className="hidden" ref={ref} onChange={addImage} />
      {headingButtons.map((group, groupIdx) => {
        return (
          <div
            key={`group-${groupIdx}`}
            className="border-r first:pl-0 px-2 border-border flex gap-1.5"
          >
            {group.map((btn, idx) => {
              return (
                <button
                  key={`${idx}`}
                  type="button"
                  onClick={btn.onclick}
                  className={`${cn(
                    btn?.active ? "bg-foreground text-background" : ""
                  )}  rounded-[5px] p-1 cursor-pointer hover:bg-foreground/10 `}
                >
                  <TooptipBtn message={btn.toolname}>
                    <btn.icon size={17} />
                  </TooptipBtn>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
