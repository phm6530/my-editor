"use client";
import { useState } from "react";
import "./App.css";
import TipTapEditor from "./tiptap-custom-editor";

export default function Counter() {
  const [count, setCount] = useState(0);

  const test = async () => {
    const url = window.prompt("이미지 URL을 입력하세요");
    return url || null;
  };

  return (
    <>
      <button onClick={() => setCount(count + 1)} className="">
        count: {count}
      </button>{" "}
      <TipTapEditor uploadCallback={test} />
    </>
  );
}
