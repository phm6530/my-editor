"use client";

import "../src/global.css";
import "../src/style/editor.css";

import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Components from "./Components";

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
      <button className="border p-3 cursor-pointer" onClick={handleClick}>
        Get My Json
      </button>

      <div className="grid grid-cols-2">
        <FormProvider {...form}>
          <Components ref={compRef} />
        </FormProvider>
        <div className="border ">
          <div className="sticky top-0">{TocRender(json)}</div>
        </div>
      </div>
    </div>
  );
}
