import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import { Editor, EditorContent } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";

export default function SimpleEditorContents({
  editor: providedEditor,
  value,
  editorMode = "editor",
  onChange,
  className,
  ...config
}: {
  editor?: Editor | null;
  onChange?: (html: any) => void;
  value?: string;
  className?: string;
  editorMode?: "view" | "editor";
}) {
  const editor = useTiptapEditor(providedEditor);
  const initialized = useRef(false);

  //처음만벨류세팅함
  useEffect(() => {
    if (!editor || !value || initialized.current) return;
    editor.commands.setContent(value);
    initialized.current = true;
  }, [editor, value]);

  // update CB
  const handleUpdate = useCallback(() => {
    if (!editor || !onChange) return;
    const html = editor.getHTML();
    onChange(html === "<p></p>" ? "" : html);
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor || !onChange) return;

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onChange, handleUpdate]);

  const handleEditorClick = () => {
    if (editorMode === "editor") {
      editor.chain().focus().run();
    }
  };

  return (
    <EditorContent
      editor={editor}
      role="presentation"
      disabled={editorMode === "view"}
      className={`simple-editor-content ${className && className}`}
      onClick={handleEditorClick}
      {...config}
    />
  );
}
