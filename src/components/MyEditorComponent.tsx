// MyEditorComponents.tsx
import { Editor, EditorContent } from "@tiptap/react";
import { cn } from "../lib/utils";
import Toolbar from "../components/ToolBar";

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
}: {
  editor: Editor | null;
  editorMode: "editor" | "view";
  className?: string;
}) => {
  if (!editor) {
    return (
      <div className="flex items-center justify-center">
        <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin" />
        <span className="ml-4 opacity-70 text-xs">LOADING</span>
      </div>
    );
  }

  const handleEditorClick = () => {
    if (editorMode === "editor") {
      editor.chain().focus().run();
    }
  };

  return (
    <EditorContent
      editor={editor}
      disabled={editorMode === "view"}
      className={cn(
        "w-full h-full min-h-[150px] hover:cursor-text overflow-hidden border",
        editorMode === "editor" && "dark:bg-custom-input p-3",
        className
      )}
      onClick={handleEditorClick}
    />
  );
};

export const MyEditor = ({
  editor,
  editorMode,
  setFontFailmy,
  uploadCallback,
  className,
  ...configs
}: {
  editor: Editor | null;
  editorMode: "editor" | "view";
  className?: string;
  uploadCallback?: (e: File) => Promise<string | null>;
  setFontFailmy?: string[];
  [key: string]: any;
}) => {
  return (
    <div className="table w-full rounded-md border-collapse">
      <div className="flex flex-col relative">
        {editorMode === "editor" && (
          <MyToolbar
            editor={editor}
            uploadCallback={uploadCallback}
            setFontFailmy={setFontFailmy}
            {...configs}
          />
        )}
        <MyEditorContent
          editor={editor}
          editorMode={editorMode}
          className={className}
        />
      </div>
    </div>
  );
};
