import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@tiptap/react";
import { Type } from "lucide-react";

export function SelectList({
  editor,
  fontList,
}: {
  editor: Editor;
  fontList: string[];
}) {
  const [currentFont, setCurrentFont] = useState<string>("default");

  useEffect(() => {
    const updateCurrentFont = () => {
      // 현재 선택된 텍스트의 fontFamily 가져오기
      const attrs = editor.getAttributes("textStyle");

      if (attrs.fontFamily) {
        if (fontList.includes(attrs.fontFamily)) {
          setCurrentFont(attrs.fontFamily);
        }
      } else {
        setCurrentFont("default");
      }
    };
    editor.on("selectionUpdate", updateCurrentFont);
    editor.on("update", updateCurrentFont);

    updateCurrentFont();

    return () => {
      editor.off("selectionUpdate", updateCurrentFont);
      editor.off("update", updateCurrentFont);
    };
  }, [editor, fontList]);

  return (
    <Select
      value={currentFont}
      onValueChange={(font) => {
        if (font === "default") {
          editor.chain().focus().unsetFontFamily().run();
        } else {
          editor.chain().focus().setFontFamily(font).run();
        }
        setCurrentFont(font);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue className="[&_span]:text-xs!" placeholder="기본서체">
          <Type />
          {currentFont === "default" ? "기본서체" : currentFont}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem className="text-xs" value="default">
            기본서체
          </SelectItem>
          {fontList.map((font) => (
            <SelectItem className="text-xs" key={font} value={font}>
              {font}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
