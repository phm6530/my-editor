import { useEffect, useRef } from "react";
import { Editor, useEditor } from "@tiptap/react";
import { extensionsConfig } from "../config/editor.config";

export type UseMyEditorProps = {
  editorMode?: "editor" | "view";
  content?: string;
  onChange?: (html: string) => void;
  enableImage?: boolean;
  enableYoutube?: boolean;
  enableCodeBlock?: boolean;
  placeholder?: string;
};

type NewList = {
  level: number;
  id: string;
  text: string;
  children: NewList[];
};

export default function useMyEditor({
  editorMode = "editor",
  ...configs
}: UseMyEditorProps) {
  // control
  const editorRef = useRef<Editor | null>(null);

  const control = useEditor({
    extensions: extensionsConfig({ ...configs }),
    editorProps: {
      handleDOMEvents: {
        beforeinput: () => true,
      },
    },
    immediatelyRender: false,
  });

  // 목차 추출위해 만듬
  useEffect(() => {
    if (control) {
      editorRef.current = control;
    }
  }, [control]);

  // 목차 추출 도구
  const getHeadings = () => {
    if (!editorRef.current) return [];
    const test = document.querySelector(".ProseMirror");
    const heads = Array.from(
      test.querySelectorAll(".heading")
    ) as HTMLElement[];

    const tree: NewList[] = [];
    let tempGroup: Record<number, NewList> = {};

    for (const head of heads) {
      const level = Number(head.tagName.replace("H", ""));
      const text = head.textContent?.trim() ?? "";

      // ✅ 내용 없는 heading 제외
      if (!text) continue;

      const node: NewList = {
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

      let parent: NewList | undefined;
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

  return { editor: control, getHeadings, editorMode, configs };
}
