import { Editor } from "@tiptap/core";
import { EditorContext } from "@tiptap/react";
import { ReactNode } from "react";

export default function EditorProvider({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) {
  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="content-wrapper">{children}</div>
    </EditorContext.Provider>
  );
}
