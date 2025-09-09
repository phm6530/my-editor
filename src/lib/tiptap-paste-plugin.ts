
import { Plugin } from "prosemirror-state";
import { Slice } from "prosemirror-model";
import { Editor } from "@tiptap/core";



export const pasteHandlerPlugin = (editor: Editor) => {
  return new Plugin({
    props: {
      handlePaste: (view, event, slice: Slice) => {
        const text = event.clipboardData.getData("text/plain");
const URL_REGEX = /^(https?://)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*/?$/;\``
        if (URL_REGEX.test(text)) {
          // If it's a URL, insert a metaBlock
          const { state } = view;
          const { tr } = state;
          const metaBlock = editor.schema.nodes.metaBlock.create({ url: text });
          tr.replaceSelectionWith(metaBlock);
          view.dispatch(tr);
          return true; // We've handled it
        }

        return false; // Don't handle it
      },
    },
  });
};
