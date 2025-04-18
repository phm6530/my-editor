import { useEffect, useLayoutEffect, useRef } from "react";
import { Editor, JSONContent, useEditor } from "@tiptap/react";
import { extensionsConfig } from "../config/editor.config";
import { debounce } from "lodash"; // 또는 직접 구현

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
const assignHeadingIds = (doc: JSONContent): JSONContent => {
  let i = 0;
  const walk = (node: JSONContent): JSONContent => {
    if (node.type === "heading") {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          id: `heading-${node.attrs.level}-${i++}`,
        },
        content: node.content?.map(walk),
      };
    }

    if (node.content) {
      return {
        ...node,
        content: node.content.map(walk),
      };
    }

    return node;
  };

  return walk(doc);
};

export default function useMyEditor({
  editorMode = "editor",
  content,
  onChange,
  ...configs
}: UseMyEditorProps) {
  const initialized = useRef(false);
  console.log("content", content);

  // control
  const editorRef = useRef<Editor | null>(null);
  const debouncedChange = useRef(
    debounce((editor: Editor) => {
      const html = editor.getHTML();
      onChange?.(html === "<p></p>" ? "" : html);
    }, 300)
  ).current;

  const control = useEditor({
    extensions: extensionsConfig({ ...configs }),
    editorProps: {
      handleDOMEvents: {
        beforeinput: () => true,
      },
    },

    onUpdate: ({ editor }) => {
      editorRef.current = editor;
      if (editorMode === "editor") {
        debouncedChange(editor);
      }
    },
    ...(editorMode === "view" && {
      editable: false,
    }),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (control) {
      editorRef.current = control;
    }
  }, [control]);

  useLayoutEffect(() => {
    if (control && content && !initialized.current) {
      control.commands.setContent(content);
      initialized.current = true;
    }
  }, [control, content]);

  // 목차 추출 도구
  const getHeadings = () => {
    if (!editorRef.current) return [];
    const doc = editorRef.current.getJSON();

    const heads = doc.content.filter((e) => e.type === "heading");

    const tree: NewList[] = [];
    const parentByLevel: Record<number, NewList> = {};

    for (const [i, head] of heads.entries()) {
      const node = {
        id: `heading-${head.attrs.level}-${i}`,
        level: head.attrs.level,
        text: head.content?.map((c) => c.text).join("") ?? "",
        children: [],
      };

      const parentLevel = head.attrs.level - 1;
      const parent = parentByLevel[parentLevel];

      if (parent) {
        parent.children.push(node);
      } else {
        tree.push(node); // 상위 부모가 없으면 root에 넣음
      }

      parentByLevel[head.attrs.level] = node; // 현재 레벨에 노드 등록
    }

    return tree;
  };

  return { editor: control, getHeadings, editorMode, configs };
}
