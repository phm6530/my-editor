import { AnyExtension } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import ImageResize from "tiptap-extension-resize-image";
import Heading from "@tiptap/extension-heading";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import Mention from "@tiptap/extension-mention";
import { Plugin, PluginKey } from "@tiptap/pm/state";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { UseMyEditorProps } from "../hooks/useMyEditor";
import Placeholder from "@tiptap/extension-placeholder";
import { v4 as uuidv4 } from "uuid";
import OrderedList from "@tiptap/extension-ordered-list";

import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import Link from "@tiptap/extension-link";
const lowlight = createLowlight(common);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export const extensionsConfig = ({
  enableImage,
  enableCodeBlock,
  enableYoutube,
  placeholder,
}: Omit<
  UseMyEditorProps,
  "onChange" | "content" | "editorMode"
>): AnyExtension[] => {
  const CustomHeading = Heading.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        id: {
          default: null,
          parseHTML: (element) => element.getAttribute("id"),
        },
      };
    },

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("heading_id_plugin"),
          appendTransaction: (transactions, oldState, newState) => {
            if (!transactions.some((tr) => tr.docChanged)) {
              return null;
            }

            const tr = newState.tr;
            let modified = false;
            newState.doc.descendants((node, pos) => {
              if (node.type.name === this.name && !node.attrs.id) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  id: `heading-${uuidv4()}`,
                });
                modified = true;
              }
            });

            if (modified) {
              return tr;
            }

            return null;
          },
        }),
      ];
    },

    renderHTML({ node, HTMLAttributes }) {
      const level = node.attrs.level;
      return [
        `h${level}`,
        {
          ...HTMLAttributes,
          class: `heading heading-lv${level}`,
          lev: level,
        },
        0,
      ];
    },
  });

  return [
    StarterKit.configure({
      codeBlock: false,
      heading: false,
      orderedList: false,
    }),
    OrderedList,
    // ListKeymap,
    CustomHeading,
    ...(enableImage ? [ImageResize] : []),
    ...(enableCodeBlock
      ? [
          CodeBlockLowlight.configure({
            lowlight,
          }),
        ]
      : []),
    ...(enableYoutube
      ? [
          Youtube.configure({
            controls: false,
            nocookie: true,
          }),
        ]
      : []),
    Placeholder.configure({ placeholder }),
    Link.configure({
      openOnClick: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Mention.configure({
      HTMLAttributes: {
        class: "mention",
      },
      //   suggestion,
    }),

    Underline,
    TextStyle,
    FontFamily,
  ];
};
