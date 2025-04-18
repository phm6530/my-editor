import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // ✅ 여기서 import된 것만 빌드됨!
  format: ["esm", "cjs"], // 둘 다 지원
  dts: true, // 타입 선언 포함
  clean: true, // dist 폴더 초기화
  external: ["react", "react-dom"], // peerDependencies는 외부 처리
});
