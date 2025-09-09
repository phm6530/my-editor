import { NodeViewWrapper } from "@tiptap/react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";

SyntaxHighlighter.registerLanguage("jsx", jsx);
export const CodeBlockComponent = ({
  node: {
    attrs: { language: defaultLanguage = "tsx" },
    textContent,
  },
  updateAttributes,
}) => {
  return (
    <NodeViewWrapper className="code-block">
      <select
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({ language: event.target.value })}
        className="absolute top-2 right-2"
      >
        <option value="null">auto</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="jsx">React (JSX)</option>
        <option value="tsx">React (TSX)</option>
        <option value="python">Python</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
      </select>
      <SyntaxHighlighter language={defaultLanguage} style={oneDark}>
        {textContent}
      </SyntaxHighlighter>
    </NodeViewWrapper>
  );
};
