import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // <-- 너 라이브러리 진입점
      name: "SimpleEditor", // <-- 라이브러리 이름
      fileName: (format) => `simple-editor.${format}.js`, // <-- 출력 파일명
    },
    rollupOptions: {
      external: ["react", "react-dom"], // <-- 라이브러리에 react, react-dom은 포함하지 않는다
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
