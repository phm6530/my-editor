import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

// Improved URL Regex
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const PasteHandler = Extension.create({
  name: "pasteHandler",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData.getData("text/plain");

            if (URL_REGEX.test(text)) {
              // If it's a URL, insert a metaBlock
              const { state, dispatch } = view;
              const { tr } = state;
              const metaBlock = this.editor.schema.nodes.metaBlock.create({
                url: text,
              });
              dispatch(tr.replaceSelectionWith(metaBlock));
              return true; // We've handled it
            }

            return false; // Don't handle it
          },
        },
      }),
    ];
  },
});
