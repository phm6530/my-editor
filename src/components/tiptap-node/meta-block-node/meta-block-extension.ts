
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MetaBlockComponent } from "./meta-block-component";

export const MetaBlock = Node.create({
  name: "metaBlock",
  group: "block",
  atom: true,

  addOptions() {
    return {
      onFetchMetadata: async (url: string) => {
        console.warn("onFetchMetadata is not configured. Using placeholder data.");
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              title: `Title for ${url}`,
              description: "This is a placeholder description. Configure onFetchMetadata to fetch real data.",
              image: "https://via.placeholder.com/150",
            });
          }, 1000);
        });
      },
    };
  },

  addAttributes() {
    return {
      url: { default: null },
      title: { default: null },
      description: { default: null },
      image: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="meta-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "meta-block" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MetaBlockComponent);
  },
});
