"use client";
import TipTapEditor from "./tiptap-custom-editor";
import "./App.css";
import "./global.css";
import { imgUploader } from "./uploadhandler";

export default function Counter() {
  const themeToggle = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
  };

  return (
    <>
      <button onClick={themeToggle} className="border p-3 mb-5 cursor-pointer">
        Theme Toggle
      </button>
      <TipTapEditor
        setFontFailmy={["SUIT-Regular"]}
        uploadCallback={async (e) => {
          return await imgUploader(e, "blog");
        }}
      />
    </>
  );
}
