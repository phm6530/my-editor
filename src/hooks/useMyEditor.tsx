import { useLayoutEffect, useRef } from "react";
import { Editor, useEditor } from "@tiptap/react";
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

export default function useMyEditor({
  editorMode = "editor",
  content,
  onChange,
  ...configs
}: UseMyEditorProps) {
  const initialized = useRef(false);

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
    content: content || "",
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

    return (
      doc.content
        ?.filter((n) => n.type === "heading")
        .map((n) => ({
          level: n.attrs.level,
          id: `heading-${n.attrs.level}`,
          text: n.content?.map((c) => c.text).join("") ?? "",
        })) ?? []
    );
  };

  return { editor: control, getHeadings, editorMode, configs };
}
