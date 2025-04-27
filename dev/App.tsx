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
      value: `<blockquote><h2 id="heading-843d602d-60d5-44b6-a319-8fd684109afc" class="heading heading-lv2" lev="2"><u>CMS BLOG 생성배경</u></h2></blockquote><p></p><p>포트폴리오 겸 템플릿 생성 겸 CMS블로그를 생성하기로 하였다.</p><p>이전 블로그는 지금 EC2 + S3 + RDS등 AWS 서비스를 사용하며 매달 금액을 지불하고있다.</p><p>떄문에 블로그를 그냥 vercel과 Supabase로 변경하고 유지비용을 아끼기 위해서이다.</p><p></p><p>또.. React + Express로 구현되었기 때문에 SEO에 매우 취약하기도하며 Next 캐싱을 이용해서</p><p>트래픽을 최소화 하기 위한 목적으로 제작되었다.</p><p></p><p>비주얼 적으로 화려함보다 아닌 기본 기능을 견고하게 구현하고자 하였고</p><p>고정 콘텐츠 삽입이나 캐러셀의 순서 변경 등 일반적인 CMS 블로그와 버금가도록 구현해보고 싶었다.</p><p></p><p></p><p></p><p></p><p><strong>기존 블로그</strong></p><p><em><u>🔗 https://www.h-creations.com/</u></em></p><p></p><p>기존 Blog는 <code>Express + React</code> 로 구현하였지만, 소규모 프로젝트에 별도의 백엔드는 필요없고,</p><p>그리고 express.js를 연습하며 만든 것이기에 <code>Next.js</code>만 사용하여 구축하였다.</p><p></p><p></p><p></p><p></p><p><em>내 CMS 블로그 기능은 아래와 같다.</em></p><ul><li><p>- <u>포스팅의 CRUD 및 권한에 따른 UI + RBAC </u>&lt;-- 이건 너무 흔하니 생략..</p></li><li><p>- 대 댓글 : 재귀 활용</p></li><li><p>- Next.js + Cache : Data Cache , RevaildateTags , tanstack 적극 활용</p></li><li><p>- 좋아요 : Optimistic 상태 업데이트 ( 요청 실패 시 ref를 이용한 상태 복구와 피드백 )</p></li><li><p>- 카테고리 CRUD : CASCADE &amp; RESTRICT</p></li><li><p>- 고정 콘텐츠의 순서 변경 , 비밀 글 설정</p></li><li><p>- 방문자 수 및 헤더를 통한 집계</p></li><li><p>- 마이페이지</p></li><li><p>- TipTap Editor를 이용한 개인 라이브러리화</p></li><li><p>- 임시저장 &lt; - 요놈 설계 잘못해서 헬이 었음..</p></li></ul><p></p><p></p><p></p><p></p><p></p><p></p><h2 id="heading-f82b8616-2faa-42ef-84f0-03c8ae0373aa" class="heading heading-lv2" lev="2">⭐BLOG 주요기능</h2><p></p><p></p><h3 id="heading-136b99be-cb12-4bab-9043-72e5bdd537a2" class="heading heading-lv3" lev="3">#섬네일 생성기</h3><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/ea90bfc1-1f05-447c-9310-aa1dc0f4def6/2025-04-25T06:50:09.492Z-Animation.gif" style="width: 572px; height: auto; cursor: pointer;" draggable="true"><p></p><p>블로그의 비주얼적 요소는 사진이 95%라 생각하기 때문에</p><p>unsplash Api를 이용해서 썸네일 검색기를 반영하였다.</p><p>업로드의 경우는 S3+Cloud Front를 사용하며 추후 Storage의 변경에 대비하기 위해서</p><p>본문이나 썸네일의 src 속성의 baseURL을 제거하고 DB에 반영하고</p><p>프론트에 뿌려질때 매핑하여 BaseUrl을 할당하도록 하였다.</p><p></p><p></p><p></p><p></p><p></p><p></p><h3 id="heading-29d0d6dd-f124-4268-8b86-2dd6b8dcb66e" class="heading heading-lv3" lev="3">#고정글 + 비밀글 설정</h3><p></p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-25T10:03:58.775Z-Animation.gif" style="width: 654px; height: auto; cursor: pointer;" draggable="true"><p></p><p>블로그에는 비밀글은 기본적으로 제공되어야하지 않나란 생각으로 구현하였고</p><p>생성 시에 공개 비공개를 정할 수 있으며, 추후에 다시 비공개 처리가 가능하도록 관리자페이지를 구성하였다.</p><p>추가로 메인에 고정 되어야할 페이지인지 구별하고 이를 5개로 제한하였다.</p><p></p><p>그리고 고정이 되어있는 콘텐츠의 경우 비공개로 비활성화 할 경우,</p><p>경고 메세지를 알리며 그래도 비활성화를 진행 할 경우 고정 콘텐츠를 제거하고 캐싱 데이터들을 초기화 시키며,</p><p>예외 처리적인 부분들을 고려하여 구현하였다.</p><p></p><p></p><p></p><p></p><p></p><h3 id="heading-0c4319b6-558a-4320-8cfa-a419f8468ebc" class="heading heading-lv3" lev="3">#고정 콘텐츠 순서 변경</h3><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-25T10:19:16.690Z-Animation.gif" style="width: 558px; height: auto; cursor: pointer;" draggable="true"><p></p><p>모바일에서도 접근하여 순서변경하기 편하도록 하기위해 Drag &amp; Drop으로 순서에 따라 변경하도록 하였다.</p><p>order 컬럼을 만들어 오름차순 기준으로 update되어 순서가 업데이트되고 비공개 글은 설정 할 수 없도록 하였다.</p><p></p><p></p><p></p><p></p><p></p><h3 id="heading-e86f4a64-d4b6-4a16-b1e4-fe947a1ae9f0" class="heading heading-lv3" lev="3">#Optimistic Like</h3><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-25T10:53:39.313Z-Animation.gif" style="width: 561px; height: auto; cursor: pointer;" draggable="true"><p>좋아요는 마구잡이 요청을 방지해야 하기 때문에 디바운싱을 사용하였음 300ms뒤 요청이 되며,</p><p>실패 시 상태를 ref로 가지고 있고 이를 통해 복구 시키도록하였다.</p><p></p><p>또 좋아요 상태였다가 다시 좋아요 상태로 돌아오면 요청이 필요 없기 때문에</p><p>상태가 다름을 인지하면 디바운싱을 통해 Api 요청을 하는 식으로 구현하였다.</p><p></p><p></p><p></p><h3 id="heading-89ff9810-49ef-49a0-bbfa-73ec4441cd52" class="heading heading-lv3" lev="3">#카테고리</h3><p></p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/92e308ad-fbe4-40a2-a1a8-91acec627845/2025-04-26T16:04:23.123Z-스크린샷 2025-04-27 010331.png" alt="스크린샷 2025-04-27 010331" style="width: 425px; height: auto; cursor: pointer;" title="스크린샷 2025-04-27 010331" draggable="true"><p></p><p></p><p>자유롭게 카테고리 CRUD 기능을 구현하고 상위메뉴 삭제의 경우 하위의 메세지가 존재하면 삭제 할 수 없다.</p><p>마찬가지로 권한 요청을 체크한다.</p><p></p><p></p><p></p><p></p><p></p><blockquote><h3 id="heading-82612a03-7ddd-4a41-aba2-fd820b9a14fa" class="heading heading-lv3" lev="3">useMyEditor</h3></blockquote><ul><li><p>TipTap Editor는 매우 편리하고 공식문서가 굉장히 잘되어있다. 특징으로는 Quill Editor와 다르게 확장에</p></li><li><p>유연성이 굉장하게 열려있다. 때문에 많은 유틸을 설치해야하고 능동적으로 처리해야할 기능들이 꽤 많다.</p></li><li><p></p></li><li><p>그래서 해당 에디터는 커스텀 훅으로 <code>editor</code> 인스턴스를 생성하고 ToolBar , Content에 주입하여 인스턴스를 공유하고</p></li><li><p>따로 설치없이 기능등을 사용하도록 커스텀하여 라이브러리화 시켜 npm에 배포하였다.</p></li><li><p>또 목차기능은 유료이기 때문에 별도로 TOC을 생성해서 반환하는 함수를 제공하도록 하였다.</p></li></ul><p></p><p></p><p></p><h4 id="heading-7687bce4-ad9e-4f87-888c-3265453a4efc" class="heading heading-lv4" lev="4">🔎 인스턴스 설정</h4><pre><code>  /**---- 내 에디터 ---- */  const { editor, configs, editorMode } = useMyEditor({    editorMode: "editor",     placeholder: "내용을 기재해주세요",  /*placeholder*/    enableCodeBlock: true,  /*Code Block + Highlight  on off*/    enableImage: true,  /* 이미지 업로드 - uploadCallback 제공 */    enableYoutube: true, /*유튜브 기능 on off*/  });</code></pre><p>커스텀 Hook으로 라이브러리를 설치할때 패키지들을 미리 다 설치받아 prop으로 이를 유무를 체크하도록 하였다.</p><p>체크 시에는 라이브러리에서 제공하는 toolbar에서 인스턴스를 주입받아 아이콘으로 제공한다.</p><p></p><p></p><p></p><h4 id="heading-716f7bc6-cbc7-4939-ae91-327602229d08" class="heading heading-lv4" lev="4">🔎 목차제공</h4><p>목차는 기존 TipTap Eidtor의 h1, h2, h3를 기준으로 매핑하여 TOC 구조를 생성 하여 객체를 제공</p><pre><code class="language-typescriptreact">getHeadings // 목차제공 함수</code></pre><pre><code>type NewList = {    level: number;    id: string;    text: string;    children: NewList[]; // 재귀함수 사용하여 대댓글 형식의 트리형태 구현};</code></pre><p>이런 객체배열을 받아 재귀로 뿌려주기만 하면 완성 된다.</p><p>또 클릭시 ID를 매핑하여 클라이언트에서는 이 단락으로 이동하게 하였다.</p><p></p><p></p><p></p><p></p><p></p><p></p><p></p>`,
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
    editable: false,
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
