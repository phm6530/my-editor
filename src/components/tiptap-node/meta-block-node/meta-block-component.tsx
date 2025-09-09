import { NodeViewWrapper } from "@tiptap/react";
import { useEffect, useState } from "react";

export const MetaBlockComponent = ({ node, updateAttributes, extension }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = node.attrs.url;

  useEffect(() => {
    let isMounted = true;
    if (url) {
      extension.options.onFetchMetadata(url).then((data) => {
        if (isMounted && data) {
          setMetadata(data);
          updateAttributes(data); // 노드 속성 업데이트
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [
    url,
    updateAttributes,
    extension.options.onFetchMetadata,
    extension.options,
  ]);

  if (loading) {
    return (
      <NodeViewWrapper className="meta-block-loading">
        <p>Fetching link preview...</p>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="meta-block">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {metadata.image && <img src={metadata.image} alt={metadata.title} />}
        <div className="meta-block-content">
          <h4>{metadata.title}</h4>
          <p>{metadata.description}</p>
          <span>{url}</span>
        </div>
      </a>
    </NodeViewWrapper>
  );
};
