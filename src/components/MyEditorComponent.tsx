import { Editor, EditorContent } from "@tiptap/react";
import { cn } from "../lib/utils";
import Toolbar from "../components/ToolBar";
import { useCallback, useEffect, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";

export const MyToolbar = ({
  editor,
  uploadCallback,
  setFontFailmy,
  ...configs
}: {
  editor: Editor | null;
  uploadCallback?: (e: File) => Promise<string | null>;
  setFontFailmy?: string[];
  [key: string]: any;
}) => {
  if (!editor) return null;

  return (
    <Toolbar
      uploadCallback={uploadCallback}
      editor={editor}
      setFontFailmy={setFontFailmy}
      {...configs}
    />
  );
};

export const MyEditorContent = ({
  editor,
  editorMode,
  className,
  onChange,
  value,
}: {
  editor: Editor | null;
  editorMode: "editor" | "view";
  className?: string;
  onChange?: (html: any) => void;
  value: string;
}) => {
  const initialized = useRef(false);
  const { debounce } = useDebounce();

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editorMode === "editor");
  }, [editor, editorMode]);

  useEffect(() => {
    if (!editor || !value || initialized.current) return;

    editor.commands.setContent(value);
    initialized.current = true;
  }, [editor, value]);

  const handleUpdate = useCallback(() => {
    if (!editor || !onChange) return;

    const html = editor.getHTML();
    onChange(html === "<p></p>" ? "" : html);
  }, [editor, onChange]);

  // 필요한 경우 디바운스 처리
  const debouncedUpdate = debounce(handleUpdate);

  useEffect(() => {
    // 조건부 로직을 함수 내부로 이동
    if (editor) {
      editor.on("update", debouncedUpdate);
      return () => editor.off("update", debouncedUpdate);
    }
    // 명시적으로 빈 클린업 함수 반환
    return () => {};
  }, [editor, debouncedUpdate]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center">
        <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin" />
        <span className="ml-4 opacity-70 text-xs">LOADING</span>
      </div>
    );
  }

  // 클릭시 맨뒤
  const handleEditorClick = () => {
    if (editorMode === "editor") {
      editor.chain().focus().run();
    }
  };

  return (
    <EditorContent
      editor={editor}
      disabled={editorMode === "view"}
      onChange={onChange}
      value={value}
      className={cn(
        "w-full h-full min-h-[150px] hover:cursor-text overflow-hidder",
        editorMode === "editor" && "dark:bg-custom-input p-3",
        className
      )}
      onClick={handleEditorClick}
    />
  );
};
