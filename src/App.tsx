"use client";
import TipTapEditor from "./tiptap-custom-editor";
import "./App.css";
import "./global.css";

export default function Counter() {
  const test = async () => {
    const url = window.prompt("이미지 URL을 입력하세요");
    return url || null;
  };

  const themeToggle = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
  };

  return (
    <>
      <button onClick={themeToggle} className="border p-3 mb-5 cursor-pointer">
        Theme Toggle
      </button>
      <TipTapEditor setFontFailmy={["SUIT-Regular"]} uploadCallback={test} />
    </>
  );
}
