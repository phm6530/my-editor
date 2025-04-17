"use client";
import "./App.css";
import "./global.css";
import useMyEditor from "./hooks/useMyEditor";
import { MyToolbar, MyEditorContent } from "./components/MyEditorComponent";
import { useForm } from "react-hook-form";
import { imgUploader } from "./uploadhandler";

export default function App() {
  const form = useForm({
    defaultValues: {
      value: "",
    },
  });

  const { editor, editorMode, getHeadings, configs } = useMyEditor({
    placeholder: "test",
    onChange: (html) => {
      form.setValue("value", html);
    },
    enableImage: true,
  });

  const t = () => {
    const test = getHeadings();
    console.log(test);
  };

  // 전체 에디터 사용
  // return <MyEditor editor={editor} editorMode={editorMode} {...configs} />;

  // 또는 개별 컴포넌트 사용
  return (
    <div>
      <button onClick={t}>test</button>
      <MyToolbar
        editor={editor}
        editorMode={editorMode}
        {...configs}
        uploadCallback={async (e) => {
          return await imgUploader(e, "blog");
        }}
      />
      <div className="custom-wrapper">
        <MyEditorContent editor={editor} editorMode={editorMode} />
      </div>
    </div>
  );
}
