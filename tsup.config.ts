import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    outDir: "dist",
    external: [
      // peerDependencies
      "react",
      "react-dom",
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
      "class-variance-authority",
      "classnames",
      "lucide-react",

      // 주요 dependencies (필요에 따라 추가)
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-blockquote",
      "@tiptap/extension-code-block-lowlight",
      "@tiptap/extension-font-family",
      "@tiptap/extension-heading",
      "@tiptap/extension-highlight",
      "@tiptap/extension-image",
      "@tiptap/extension-link",
      "@tiptap/extension-list-item",
      "@tiptap/extension-list-keymap",
      "@tiptap/extension-mention",
      "@tiptap/extension-ordered-list",
      "@tiptap/extension-placeholder",
      "@tiptap/extension-subscript",
      "@tiptap/extension-superscript",
      "@tiptap/extension-table",
      "@tiptap/extension-table-cell",
      "@tiptap/extension-table-header",
      "@tiptap/extension-task-item",
      "@tiptap/extension-task-list",
      "@tiptap/extension-text",
      "@tiptap/extension-text-align",
      "@tiptap/extension-text-style",
      "@tiptap/extension-typography",
      "@tiptap/extension-underline",
      "@tiptap/extension-youtube",
      "@tiptap/pm",
      "@floating-ui/react",
      "lodash",
      "react-hook-form",
      "uuid",
    ],
    esbuildOptions(options) {
      options.loader = {
        ...options.loader,
        ".scss": "css",
        ".css": "css",
      };
      return options;
    },
  },
]);
