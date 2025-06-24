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
      value: `<p><br></p><p>[AWS] 서브도메인 생성 + ELB SSL 인증</p><p><br></p><p>AWS는 Route53에서 도메인을 구매하여 연동할 수 있고 추가로 내부에서 구매한 Domain에 대한 SSL인증이 매우 간편하다.</p><p>EC2의 경우는 인스턴스를 생성하여 SSL 인증을 도메인에서 Https 암호화를 진행하고</p><p>ELB를 이용하여 복호화 하여 웹서버로 전달하는 방식을 사용해야한다.</p><p><br></p><p>이 부분도 과금이 되지만 SSL인증서를 따로 관리안하고 중앙집중관리 형식으로 손쉽게 관리할 수 있다라는 점이 가장 큰 장점이라</p><p>난 외부에서 SSL 인증을 하는 것을 택했다.</p><p><br></p><p><br></p><p><br></p><p><br></p><p><strong class="ql-size-large">1️⃣ 서브도메인 생성</strong></p><p>이왕 내가 구매한 도메인에 서브도메인을 만들어서 Api 전용 도메인을 만들었다.</p><p><br></p><p><br></p><p>✔️ Routes 53 &gt; 호스팅 영역 &gt; 호스팅 영역 생성</p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/84a76eb0-4f44-4c35-9235-c84d05d62939/__-__-1_20240616094852.jpg"></p><p><br></p><p><br></p><p><br></p><p><br></p><p>✔️생성된 서브도메인 클릭하여 네임서버 복사하여 Main 도메인 내 "NS 레코드 삽입"</p><p>*서브도메인 내에 독립적으로 사용하기 위해 서브도메인에 대한 DNS 관리 권한을 위임한다.</p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/84a76eb0-4f44-4c35-9235-c84d05d62939/__-__-1_20240616095112.jpg"></p><p><br></p><p><br></p><p><br></p><p><br></p><p>✔️ 반영 이후에는 ACM의 탭에서 서브도메인에 대한 SSL 인증서 발급</p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/84a76eb0-4f44-4c35-9235-c84d05d62939/__-__-2_20240616095545.jpg"></p><p><br></p><p><br></p><p><br></p><p><br></p><p><strong class="ql-size-large">2️⃣ EC2 + ELB 설정</strong></p><p>SSL인증을 외부에서 ELB가 복호화하고 http요청을 EC2 인스턴스에 전달하는데 이는 외부에서 https 요청을 복호화하고 </p><p>EC2 내에서는 복호화된 상태의 "평문" 으로 요청을 하기 때문에 그룹을 80port만 명시하면 된다. </p><p>또 추가로 웹서버 아파치나 , nginx에 다른 서버설정을 하지 않아도 된다.</p><p><br></p><p><br></p><p>✔️ EC2 &gt; 대상 그룹 생성에서 인스턴스 / 포트 80 설정</p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/a1_20240616101020.jpg"></p><p><br></p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/a2_20240616101025.jpg"></p><p><br></p><p><br></p><p>✔️ 다음페이지에 인스턴스 라우팅 포트 "80" 설정  "아래에 보류 중인 것으로 포함" 클릭</p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/vvv_20240616101201.jpg"></p><p><br></p><p><br></p><p><br></p><p><br></p><p>보안 그룹이 생성되었다면 ELB을 설정하자</p><p><br></p><p><strong>✔️EC2 인스턴스 생성이후 리전의 가용영역을 선택한다. 전부 다 선택했다.</strong></p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/b1_20240616101424.jpg"></p><p><br></p><p><br></p><p><br></p><p><strong>✔️ 보안그룹과 리스너를 설정하자</strong></p><p>보안그룹은 인바운드, 아웃바인드를 EC2기준으로 설정 해둔 것이 존재한다면 그 보안그룹을 선택하자.</p><p>나는 TCP 443, 80포트는 0.0.0.0/0과 SSH는 내 전용 ip만 접속하도록 인바운드 열어두었고 아웃바운드는 누구나 접속할 수 있도록 허용하였다.</p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/b2_20240616101832.jpg"></p><p><br></p><p>리스너의 경우 로드밸런서로 연결 "요청" 하는 프로세스이다. SSL 연결을 인증 하는 것이기에 443으로 로드벨런스에 복호화를 요청해야한다.</p><p>그러므로 443을 기재하고 그룹을 이전에 생성하였던 그룹을 선택한다. </p><p>그럼 로드밸런서는 https요청을 복호화하여 내가 설정한 그룹에 http요청을 서버로 보낸다. </p><p><br></p><p><br></p><p><strong>✔️ 인증서 선택</strong></p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/b3_20240616102053.jpg"></p><p><br></p><p><br></p><p><br></p><p>✔️ Route 53에서 레코드생성</p><p>Route53에서 A레코드를 생성하고 "별칭"으로 라우터와 로드밸런싱을 연결한다. </p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/__-__-7_20240616102625.jpg"></p><p><br></p><p>EC2의 ip를 찾기에  A레코드로 설정하고</p><p>엔드포인트를 ELB를 설정 / 리전은 서울 Resion을 선택하고 레코드 생성을 하자. </p><p><br></p><p><br></p><p><br></p><p>이제 로드밸런서 생성하고 DNS가 반영되기 까지 기다리면....</p><p><img src="https://d33h8icwcso2tj.cloudfront.net/uploads/blog/8ed9fadf-b477-4e39-bc5b-41512ab24515/b4_20240616102827.jpg"></p><p><br></p><p><br></p><p>완료!</p><p>이제 프론트에서 http로 요청만 하지않는다면 Mixed에러 없이 잘 통신이 완료 될 것이다. </p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>`,
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
