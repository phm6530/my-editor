"use client";
import {
  CustomTipTapEditor,
  handleHeadingChange,
} from "./tiptap-custom-editor";
import "./App.css";
import "./global.css";
import { imgUploader } from "./uploadhandler";
import { useState } from "react";

export default function Counter() {
  const [list, setList] = useState(null);
  const themeToggle = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
  };

  const createList = () => {
    const mylist = handleHeadingChange();
    console.log(mylist);
    setList(mylist);
  };

  return (
    <>
      <button onClick={themeToggle} className="border p-3 mb-5 cursor-pointer">
        Theme Toggle
      </button>
      <pre>{JSON.stringify(list, null, 2)}</pre>
      <button onClick={createList}>목차 만들기</button>
      <CustomTipTapEditor
        setFontFailmy={["SUIT-Regular"]}
        uploadCallback={async (e) => {
          return await imgUploader(e, "blog");
        }}
        onHeadingsChange={(e) => console.log(e)}
      />
    </>
  );
}
