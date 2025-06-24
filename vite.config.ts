import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 콘솔 로그를 제거
        drop_debugger: true, // 디버거 구문을 제거
      },
      output: {
        comments: false, // 주석제거
      },
    },
  },
  server: {
    port: 3100,
  },
});
