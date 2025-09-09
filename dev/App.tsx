"use client";

import "../src/styles/global.scss";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import EditorProvider from "@/slots/provider/editor-provider";
import { useSimpleEditor } from "@/hooks/useSimpleEditor";
import SimpleToolTip from "@/slots/tooltip-parts";
import SimpleEditorContents from "@/slots/contents/editor-contents";
import { imgUploader } from "./uploadhandler";

type TocItem = {
  id: string;
  level: number;
  text: string;
  children: TocItem[];
};

export default function App() {
  const [json, setJson] = useState<any>();

  const form = useForm({
    defaultValues: {
      title: "",
      value: `Quill Editor 사용 중 만난 IME 입력 이슈

난 주로 에디터로 Quill Editor를 주로 이용한다. 사용하기 간편하며 이미지 커스텀또한 지원하기 때문에 자주 쓰는편이다. 
근데 오늘 use Form Hook + Quill Editor로 연동하여 폼 제출을 하는 중간에 한글이 상이하게 입력되는 것을 볼 수 있었다.

예를 들어 '안녕'을 입력할 때, 'ㅇ' 을 입력하는 순간에는 watch 값에 변화가 없다가, '안'이라는 글자가 완성되어야 비로소 useForm의 defaultValue가 변경이 되는 현상이었다.
때문에 “o” 입력은 미 입력으로 처리되어 placeholder도 그대로 유지되는 현상이 있었다.





Form을 입력해도 value는 입력되지 않는다.

useForm의 watch메소드로 콘솔을 찍어보았다. 분명 화면에는 “ㄴ”이 입력되었는데 QuillEditor와 연동한 values 값은 undefined로 콘솔이 찍혔다. "ㄴ" 을 입력해도 반영이 되지않는다. 특이한 점은 알파벳이나 숫자로는 바로 입력이 된다라는점 한글을 적을 때만 상이하게 적용되는 것이다.



초기에는 ref의 랜더링 문제일까? 라고 생각해서 onChange에 상태를 반영하기도하였고, useEffect에도 반영하였지만 효능이 없었다. 알아 본 결과 문제는 IME(Input Method Editor) 시스템 문제였다.





IME (Input Method Editor)

IME는 입력 방식 편집기로 여러가지의 언어를 영어 자판으로 한글, 일어 등 여러 언어를 입력할 수 있도록 해주는 시스템이다.

한글 IME: ㄱ + ㅏ + ㄴ → 간
일본어 IME: k + a + n + j + i → 漢字
중국어 IME: n + i + h + a + o → 你好

언어마다 조합 법은 제 각각이며 각 문자마다 조합 중인지, 완성되어 있는지를 파악해야 한다. OS는 예로 “한/영”키를 등을 눌러 입력모드로 설정하게 되면, 현재 입력모드가 “한국어” 모드임을 감지하고 조합 규칙을 따르게 된다. 이어 초성, 중성, 종성에 한글을 작성한다.

https://blog.h-creations.com/

`,
    },
  });

  const compRef = useRef<{ getHeadings: () => any }>(null);

  const handleClick = () => {
    const result = compRef.current?.getHeadings();
    setJson(result);
  };

  useEffect(() => {
    setTimeout(() => {
      handleClick();
    }, 0);
  }, []);

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -80;
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const TocRender = (toc: TocItem[]) => {
    if (toc.length === 0) return null;

    return (
      <ul className="ml-4 list-disc">
        {toc.map((item) => (
          <li key={item.id}>
            <button
              className="text-sm hover:underline"
              onClick={() => scrollToHeading(item.id)}
            >
              {item.text}
            </button>
            {item.children.length > 0 && TocRender(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  const { editor, getHeadings } = useSimpleEditor({
    placeholder: "내용을 기재해주세요.",
    uploadCallback: async (file: File) => {
      return await imgUploader(file, "blog");
    },
    onFetchMetadata: async (url) => {
      console.log(url);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        image:
          "https://d33h8icwcso2tj.cloudfront.net/uploads/blog/165ba024-2f7c-4842-8760-72294da2930a/2025-08-20T08:08:46.771Z-165ba024-2f7c-4842-8760-72294da2930a",
        title: "test",
        description: "test 설명..",
      };
    },
    editable: true,
  });

  return (
    <div style={{ width: "100%" }}>
      <button className="border p-3 cursor-pointer" onClick={handleClick}>
        Get My Json
      </button>

      <div style={{ position: "relative" }}>
        {/* Provider */}
        <EditorProvider editor={editor}>
          <div>
            asdf
            <SimpleToolTip />
          </div>
          <input
            type="test"
            placeholder="제목을 입력하세요"
            {...form.register("title", { required: "필수.." })}
          />

          <Controller
            control={form.control}
            name="value"
            rules={{
              required: "내용을 입력해주세요.",
              minLength: {
                value: 1,
                message: "내용은 최소 10자 이상이어야 합니다.",
              },

              validate: (value) => {
                if (value === "" || value === "<p></p>") {
                  return "본문을 작성해주세요.";
                }
                return true;
              },
            }}
            render={({ field }) => {
              return <SimpleEditorContents {...field} />;
            }}
          />
        </EditorProvider>
      </div>
      <div className="grid grid-cols-2">
        <div className="border ">
          <div className="sticky top-0">{json && TocRender(json)}</div>
        </div>
      </div>

      <button
        onClick={form.handleSubmit((data) => {
          console.log(data);
        })}
      >
        제출
      </button>

      <button
        onClick={() => {
          console.log(getHeadings());
        }}
      >
        ddd
      </button>
    </div>
  );
}
