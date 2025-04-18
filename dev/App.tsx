"use client";

import "../src/global.css";
import "../src/style/editor.css";

import { MyEditorContent, MyToolbar, useMyEditor } from "@/index";
import { useForm } from "react-hook-form";
import { imgUploader } from "./uploadhandler";
import { useEffect, useState } from "react";

export default function App() {
  const [json, setJson] = useState<any>();
  const form = useForm({
    defaultValues: {
      value: `<p>ddsdfasdfsdaf</p><p>sdfa</p><p>dsa</p><p>gs</p><p>asdg</p><p>gsda</p><h1 id="heading-1" class="heading-lv1">h1</h1><h2 id="heading-2" class="heading-lv2">h2h</h2><h3 id="heading-3" class="heading-lv3">h3</h3><h4 id="heading-4" class="heading-lv4">h34</h4>`,
    },
  });

  // console.log(form.watch());

  const { editor, editorMode, getHeadings } = useMyEditor({
    placeholder: "test",
    content: form.getValues("value"),
    enableImage: true,
    onChange: (html) => form.setValue("value", html),
  });

  useEffect(() => {
    if (editor) {
      const test = getHeadings();
      console.log(test);
      setJson(test);
    }
  }, [editor]);

  const t = () => {
    const test = getHeadings();
    console.log(test);
    setJson(test);
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
        uploadCallback={async (e) => {
          return await imgUploader(e, "blog");
        }}
      />
      <div className="custom-wrapper">
        <MyEditorContent
          editor={editor}
          editorMode={editorMode}
          {...form.register("value")}
        />
      </div>{" "}
      <pre className="border p-5">{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
}
