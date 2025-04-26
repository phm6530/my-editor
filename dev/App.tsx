"use client";

import "../src/styles/editor.scss";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
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
      value: `testtest`,
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

  return (
    <div>
      {/* <button className="border p-3 cursor-pointer" onClick={handleClick}>
        Get My Json
      </button>

      <div className="grid grid-cols-2">
        <FormProvider {...form}>
          <Components ref={compRef} />
        </FormProvider>
        <div className="border ">
          <div className="sticky top-0">{json && TocRender(json)}</div>
        </div>
      </div> */}

      <SimpleEditor
        placeholder="내용을 기재해주세요"
        uploadCallback={async (file) => {
          try {
            const test = await imgUploader(file, "blog");

            console.log(test);
            return test;
          } catch (err) {
            alert(err);
          }
        }}
      />
    </div>
  );
}
