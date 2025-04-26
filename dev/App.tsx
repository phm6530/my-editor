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
      value: ``,
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
  });

  return (
    <div style={{ width: "100%" }}>
      <button className="border p-3 cursor-pointer" onClick={handleClick}>
        Get My Json
      </button>

      {/* Provider */}
      <EditorProvider editor={editor}>
        <SimpleToolTip />
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

      <div className="grid grid-cols-2">
        <div className="border ">
          <div className="sticky top-0">{json && TocRender(json)}</div>
        </div>
      </div>

      <button
        onClick={form.handleSubmit((data) => {
          console.log(data); // 여기에 성공한 폼 데이터 나옴
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
