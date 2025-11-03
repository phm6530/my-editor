// Trigger reload
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
      value: `d

브라우저 랜더링

어떤 언어로 웹 개발을 하든, 브라우저를 통해 사용자에게 페이지를 제공하게 된다.

브라우저가 최종적으로 화면을 그려 보여지게 되는 것은 CSS, HTML의 형태로 웹사이트를 그리게 된다.



웹사이트의 화면을 그리는 데엔 비용이 높기 때문에 이를 효율 적으로 관리하기 위하여

React나 JS 같은 Ajax나 가상 DOM을 포함한 라이브러리를 사용한다.



더 효율적으로 사용하기 위해서는 브라우저 랜더링을 이해하고

랜더링의 각 단계에서 실행되는 React Hook의 실행 컨텍스트를 이해하는 것이

이 React 심화적으로 이해하고 우아한 코드를 작성하는 발돋움이 될 것이다.









CSSOM과 DOM 트리로 웹페이지는 구성된다.

브라우저 랜더링은 기본적으로 CSS와 HTML만으로 페이지를 그린다.

웹 페이지를 그리기 위해 두 가지의 트리를 구성하는데 html는 DOM 트리, CSS의 CSSOM 생성한다.







이후 두 가지의 트리를 Commit 하며

화면에 보여져야 할 DOM과 CSSOM의 교 집합 된 Render Tree를 구성한다.

Render Tree는 크기를 계산할 요소들의 묶음으로 아직 계산 되지 않은 명세 전 단계이다.



Render Tree의 요소들을 크기를 계산하는 layout 단계를 거쳐서 최종적으로 Paint 되게 되고,

마지막 GPU을 거쳐 합성(composite) 단계에 거쳐 눈으로 볼 수 있는 화면을 제공한다.









Layout, Paint 단계에 이해

Layout 단계는 “계산”하여 DOM의 크기를 명세 하는 단계이며, Paint는 스타일을 반영하여 그리는 단계이다.

랜더링 개념으로 보자면 Layout은 DOM의 크기를 계산 하는 것을 ReFlow,

DOM에 크기에 대해 개입하지 않고 스타일링하는 RePaint 가 발생한다.

“Re”가 들어가 오해 할 수 있는데 초기 랜더링 시에도 RePaint, ReFlow가 발생하며 이는 작업 자체를 말한다.





Reflow

만약 가변적인 “width:100%” 같은 크기로 설정된 DOM이라면 브라우저의 크기에 따라서 DOM의 크기 또한 재 계산 되어야 하기 때문에

브라우저에 정의된 Api따라 트리거하여 해당 DOM에 대한 Reflow가 발생하게 된다.





RePaint

페인트는 계산이 아닌 스타일링 작업이다. 대표적인 작업 속성명을 나열하자면

color, background-color, border-color , visibility ,box-shadow 등이 있고 이들은 전부 크기 계산이 아닌

DOM에 대한 색칠이나 스타일링 작업이다.













Script는 하단이나 “defer”를 사용하자.

브라우저가 DOM과 CSS 트리를 구성하는 순서는 인터프리터 언어처럼 순차적으로 한줄 한줄 실행하게 된다.

한줄씩 파싱 하다 JS 구문을 만나게 된다면 파싱을 중지하고 JS를 실행하게 된다.



만약에 js로 DOM을 선택하는데 특정 id보다 선택이 우선이라면 당연하게 reffer 에러를 반환 할 것이다.

<script>
  const el = document.getElementById("Element"); //Error..
</script>

<div id="Element">타겟</div> 

defer는 파일이 다운로드 되더라도 즉시 실행되지 않고 DOMContentLoaded 이벤트 직전에 실행 되기 때문에

HTML가 파싱된 이후 실행 되기에 reffer에러를 방지 할 수 있다.

만약 파일 형태가 아니라면 body 하단에 위치하여 에러를 방지해야 한다.



추가로 “async”로 선언 하는 방식있지만, 이 방식은 비 동기적으로 자바스크립트 코드를 실행한다.

자바스크립트는 load 되자마자 동시에 병렬적으로 실행되게 된다.

때문에, 백그라운드에서 처리 해야 하는 Api 호출이나 서버 작업 등에서는 매우 효율적이지만,

DOM을 핸들링엔 적합하지 않다.











'CSS' + 'HTML'





HTML 파싱 → DOM 트리 생성
브라우저는 html을 파싱하여 DOM 트리를 생성한다. 
이때 Css나 js등 외부 리소스를 만날 경우 DOM을 일시정지(블로킹) 한다.



CSS 파싱 → CSSOM 트리 생성
CSSOM 트리 생성, DOM 생성 중 Link, 나 Style 구문을 만나게되면 
별도의 파싱을 진행한다.



랜더트리 생성
DOM과 CSSOM을 결합해 실제 화면에 표시될 요소만 포함하여 랜더트리 생성
display :none 등 제외 시킴,



레이아웃
랜더트리의 각 요소의 위치와 크기를 계산한다.



페인팅
레이아웃 정보를 토대로 각 요소를 화면에 그리는 역할



합성
페인트 결과들을 GPU등을 통해서 화면에 표시함









마무리

브라우저 랜더링은 DOM과 Css에 따른 트리를 생성한다.

이를 토대로 생성된 랜더트리는 DOM → CSSOM → 페인팅 순서로 진행되어 브라우저에 보여지게 되며

JS가 선언된 파일이라면 중간에 JS파일이나 구문을 접하게 된다면 트리 생성을 중단하고 JS를 우선 실행이나, 병렬적으로 처리하게 된다.



이에 따른 DOM 트리 선택에 따른 에러는 defer , async에 따라 적절한 핸들링을 통해 방지 할 수 있으며,

파일에 대한 개발자에게 파일이 어떠한 코드들에 대한 집합인지도 알릴 수 있는 피드백 요소가 될 수도 있다.

ddd`,
    },
  });

  const handleClick = () => {
    const result = getHeadings();
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
        ㅁㅁㅁ
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
