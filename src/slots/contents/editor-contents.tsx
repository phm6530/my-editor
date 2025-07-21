import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import { Editor, EditorContent } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";

export default function SimpleEditorContents({
  editor: providedEditor,
  value,
  onChange,
  className,
  ...config
}: {
  editor?: Editor | null;
  onChange?: (html: any) => void;
  value?: string;
  className?: string;
}) {
  const editor = useTiptapEditor(providedEditor);

  // 외부(Form)의 `value`가 바뀔 때 실행
  useEffect(() => {
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  // update CB
  const handleUpdate = useCallback(() => {
    if (!editor || !onChange) return;
    const html = editor.getHTML();
    onChange(html === "<p></p>" ? "" : html);
  }, [editor, onChange]);

  // UpDate
  useEffect(() => {
    if (!editor || !onChange) return;
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onChange, handleUpdate]);

  const handleEditorClick = () => {
    editor.chain().focus().run();
  };

  return (
    <EditorContent
      editor={editor}
      role="presentation"
      className={`simple-editor-content ${className && className}`}
      onClick={() => handleEditorClick()}
      {...config}
    />
  );
}
