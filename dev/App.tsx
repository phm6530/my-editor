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
      value: `<blockquote><h2 id="heading-b00bb812-c4b8-4399-87ab-77c6d1c05824" class="heading heading-lv2" lev="2"><u>CMS BLOG 생성배경</u></h2></blockquote><p><br class="ProseMirror-trailingBreak"></p><p>포트폴리오 겸 템플릿 생성 겸 CMS블로그를 생성하기로 하였다.</p><p>이전 블로그는 지금 EC2 + S3 + RDS등 AWS 서비스를 사용하며 매달 금액을 지불하고있다.</p><p>떄문에 블로그를 그냥 vercel과 Supabase로 변경하고 유지비용을 아끼기 위해서이다.</p><p><br class="ProseMirror-trailingBreak"></p><p>또.. React + Express로 구현되었기 때문에 SEO에 매우 취약하기도하며 Next 캐싱을 이용해서</p><p>트래픽을 최소화 하기 위한 목적으로 제작되었다.</p><p><br class="ProseMirror-trailingBreak"></p><p>비주얼 적으로 화려함보다 아닌 기본 기능을 견고하게 구현하고자 하였고</p><p>고정 콘텐츠 삽입이나 캐러셀의 순서 변경 등 일반적인 CMS 블로그와 버금가도록 구현해보고 싶었다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><strong>기존 블로그</strong></p><p><em><u>🔗 https://www.h-creations.com/</u></em></p><p><br class="ProseMirror-trailingBreak"></p><p>기존 Blog는 <code>Express + React</code> 로 구현하였지만, 소규모 프로젝트에 별도의 백엔드는 필요없고,</p><p>그리고 express.js를 연습하며 만든 것이기에 <code>Next.js</code>만 사용하여 구축하였다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><em>내 CMS 블로그 기능은 아래와 같다.</em></p><ul><li><p>- <u>포스팅의 CRUD 및 권한에 따른 UI + RBAC </u>&lt;-- 이건 너무 흔하니 생략..</p></li><li><p>- 대 댓글 : 재귀 활용</p></li><li><p>- Next.js + Cache : Data Cache , RevaildateTags , tanstack 적극 활용</p></li><li><p>- 좋아요 : Optimistic 상태 업데이트 ( 요청 실패 시 ref를 이용한 상태 복구와 피드백 )</p></li><li><p>- 카테고리 CRUD : CASCADE &amp; RESTRICT</p></li><li><p>- 고정 콘텐츠의 순서 변경 , 비밀 글 설정</p></li><li><p>- 방문자 수 및 헤더를 통한 집계</p></li><li><p>- 마이페이지</p></li><li><p>- TipTap Editor를 이용한 개인 라이브러리화</p></li><li><p>- 임시저장 &lt; - 요놈 설계 잘못해서 헬이 었음..</p></li></ul><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h2 id="heading-8bc24c30-b2b3-4cbc-9038-34dae3dc952f" class="heading heading-lv2" lev="2">⭐BLOG 주요기능</h2><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h3 id="heading-cff32e1a-2ced-454e-b600-6c839b8f9a43" class="heading heading-lv3" lev="3">#섬네일 생성기</h3><div style="display: flex;" contenteditable="false" draggable="true"><div style="width: 698px; height: auto; cursor: pointer;"><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/ea90bfc1-1f05-447c-9310-aa1dc0f4def6/2025-04-25T06:50:09.492Z-Animation.gif" style="width: 698px; height: auto; cursor: pointer;" draggable="true"></div></div><p><br class="ProseMirror-trailingBreak"></p><p>블로그의 비주얼적 요소는 사진이 95%라 생각하기 때문에</p><p>unsplash Api를 이용해서 썸네일 검색기를 반영하였다.</p><p>업로드의 경우는 S3+Cloud Front를 사용하며 추후 Storage의 변경에 대비하기 위해서</p><p>본문이나 썸네일의 src 속성의 baseURL을 제거하고 DB에 반영하고</p><p>프론트에 뿌려질때 매핑하여 BaseUrl을 할당하도록 하였다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h3 id="heading-be36b01a-ae06-4153-9d8e-5c03809fea71" class="heading heading-lv3" lev="3">#고정글 + 비밀글 설정</h3><p><br class="ProseMirror-trailingBreak"></p><div style="display: flex;" contenteditable="false" draggable="true"><div style="width: 814px; height: auto; cursor: pointer;"><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-25T10:03:58.775Z-Animation.gif" style="width: 814px; height: auto; cursor: pointer;" draggable="true"></div></div><p><br class="ProseMirror-trailingBreak"></p><p>블로그에는 비밀글은 기본적으로 제공되어야하지 않나란 생각으로 구현하였고</p><p>생성 시에 공개 비공개를 정할 수 있으며, 추후에 다시 비공개 처리가 가능하도록 관리자페이지를 구성하였다.</p><p>추가로 메인에 고정 되어야할 페이지인지 구별하고 이를 5개로 제한하였다.</p><p data-placeholder="내용을 기재해주세요." class="is-empty"><br class="ProseMirror-trailingBreak"></p><p>그리고 고정이 되어있는 콘텐츠의 경우 비공개로 비활성화 할 경우,</p><p>경고 메세지를 알리며 그래도 비활성화를 진행 할 경우 고정 콘텐츠를 제거하고 캐싱 데이터들을 초기화 시키며,</p><p>예외 처리적인 부분들을 고려하여 구현하였다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h3 id="heading-93c0ca56-4dab-4707-ab77-c94090c5e108" class="heading heading-lv3" lev="3">#고정 콘텐츠 순서 변경</h3><div style="display: flex;" contenteditable="false" draggable="true"><div style="width: 630px; height: auto; cursor: pointer;"><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-25T10:19:16.690Z-Animation.gif" style="width: 630px; height: auto; cursor: pointer;" draggable="true"></div></div><p><br class="ProseMirror-trailingBreak"></p><p>모바일에서도 접근하여 순서변경하기 편하도록 하기위해 Drag &amp; Drop으로 순서에 따라 변경하도록 하였다.</p><p>order 컬럼을 만들어 오름차순 기준으로 update되어 순서가 업데이트되고 비공개 글은 설정 할 수 없도록 하였다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h3 id="heading-25cde961-ff15-41be-8221-53824b6ba8d8" class="heading heading-lv3" lev="3">#Optimistic Like</h3><div style="display: flex;" contenteditable="false" draggable="true"><div style="width: 689px; height: auto; cursor: pointer;"><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-25T10:53:39.313Z-Animation.gif" style="width: 689px; height: auto; cursor: pointer;" draggable="true"></div></div><p>좋아요는 마구잡이 요청을 방지해야 하기 때문에 디바운싱을 사용하였음 300ms뒤 요청이 되며,</p><p>실패 시 상태를 ref로 가지고 있고 이를 통해 복구 시키도록하였다.</p><p><br class="ProseMirror-trailingBreak"></p><p>또 좋아요 상태였다가 다시 좋아요 상태로 돌아오면 요청이 필요 없기 때문에</p><p>상태가 다름을 인지하면 디바운싱을 통해 Api 요청을 하는 식으로 구현하였다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h3 id="heading-adc512c2-4bae-4976-917d-f86ccbb2ccc6" class="heading heading-lv3" lev="3">#카테고리</h3><p><br class="ProseMirror-trailingBreak"></p><div style="display: flex;" contenteditable="false" draggable="true"><div style="width: 425px; height: auto; cursor: pointer;"><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-26T16:04:23.123Z-스크린샷 2025-04-27 010331.png" alt="스크린샷 2025-04-27 010331" style="width: 425px; height: auto; cursor: pointer;" title="스크린샷 2025-04-27 010331" draggable="true"></div></div><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p>자유롭게 카테고리 CRUD 기능을 구현하고 상위메뉴 삭제의 경우 하위의 메세지가 존재하면 삭제 할 수 없다.</p><p>마찬가지로 권한 요청을 체크한다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><blockquote><h3 id="heading-a64449a0-d300-4a5c-b2a9-aee8373ec28c" class="heading heading-lv3" lev="3">useMyEditor</h3></blockquote><ul><li><p>TipTap Editor는 매우 편리하고 공식문서가 굉장히 잘되어있다. 특징으로는 Quill Editor와 다르게 확장에</p></li><li><p>유연성이 굉장하게 열려있다. 때문에 많은 유틸을 설치해야하고 능동적으로 처리해야할 기능들이 꽤 많다.</p></li><li><p><br class="ProseMirror-trailingBreak"></p></li><li><p>그래서 해당 에디터는 커스텀 훅으로 <code>editor</code> 인스턴스를 생성하고 ToolBar , Content에 주입하여 인스턴스를 공유하고</p></li><li><p>따로 설치없이 기능등을 사용하도록 커스텀하여 라이브러리화 시켜 npm에 배포하였다.</p></li><li><p>또 목차기능은 유료이기 때문에 별도로 TOC을 생성해서 반환하는 함수를 제공하도록 하였다.</p></li></ul><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h4 id="heading-d84e4bbc-e196-4c8d-beda-f17ed72ce3f7" class="heading heading-lv4" lev="4">🔎 인스턴스 설정</h4><pre><code>  <span class="hljs-comment">/**---- 내 에디터 ---- */</span>
  <span class="hljs-keyword">const</span> { editor, configs, editorMode } = <span class="hljs-title function_ invoke__">useMyEditor</span>({
    <span class="hljs-attr">editorMode</span>: <span class="hljs-string">"editor"</span>, 
    <span class="hljs-attr">placeholder</span>: <span class="hljs-string">"내용을 기재해주세요"</span>,  <span class="hljs-comment">/*placeholder*/</span>
    <span class="hljs-attr">enableCodeBlock</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">/*Code Block + Highlight  on off*/</span>
    <span class="hljs-attr">enableImage</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">/* 이미지 업로드 - uploadCallback 제공 */</span>
    <span class="hljs-attr">enableYoutube</span>: <span class="hljs-literal">true</span>, <span class="hljs-comment">/*유튜브 기능 on off*/</span>
  });</code></pre><p>커스텀 Hook으로 라이브러리를 설치할때 패키지들을 미리 다 설치받아 prop으로 이를 유무를 체크하도록 하였다.</p><p>체크 시에는 라이브러리에서 제공하는 toolbar에서 인스턴스를 주입받아 아이콘으로 제공한다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><h4 id="heading-81fa7257-15fa-457a-9f08-70c071669983" class="heading heading-lv4" lev="4">🔎 목차제공</h4><p>목차는 기존 TipTap Eidtor의 h1, h2, h3를 기준으로 매핑하여 TOC 구조를 생성 하여 객체를 제공</p><pre><code class="language-typescriptreact"><span class="hljs-attr">getHeadings</span> <span class="hljs-string">// 목차제공 함수</span></code></pre><pre><code><span class="hljs-attr">type</span> <span class="hljs-string">NewList = {</span>
    <span class="hljs-attr">level</span>: <span class="hljs-string">number;</span>
    <span class="hljs-attr">id</span>: <span class="hljs-string">string;</span>
    <span class="hljs-attr">text</span>: <span class="hljs-string">string;</span>
    <span class="hljs-attr">children</span>: <span class="hljs-string">NewList[]; // 재귀함수 사용하여 대댓글 형식의 트리형태 구현</span>
<span class="hljs-attr">};</span></code></pre><p>이런 객체배열을 받아 재귀로 뿌려주기만 하면 완성 된다.</p><p>또 클릭시 ID를 매핑하여 클라이언트에서는 이 단락으로 이동하게 하였다.</p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p><p><br class="ProseMirror-trailingBreak"></p>`,
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
