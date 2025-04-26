"use client";
import { MyEditorContent, MyToolbar, useMyEditor } from "@/index";
import { Controller, useFormContext } from "react-hook-form";
import { imgUploader } from "./uploadhandler";
import { forwardRef, useImperativeHandle } from "react";

export const Components = forwardRef(
  (_, ref: React.Ref<{ getHeadings: () => any }>) => {
    const form = useFormContext();

    const { editor, editorMode, configs, getHeadings } = useMyEditor({
      placeholder: "test",
      editorMode: "editor",
      enableImage: true,
      enableCodeBlock: true,
      enableYoutube: true,
    });

    useImperativeHandle(ref, () => ({
      getHeadings,
    }));

    return (
      <div>
        <MyToolbar
          editor={editor}
          editorMode={editorMode}
          uploadCallback={async (e) => {
            try {
              const test = await imgUploader(e, "blog");

              console.log(test);
              return test;
            } catch (err) {
              alert(err);
            }
          }}
          {...configs}
        />
        <div className="custom-wrapper">
          <Controller
            name="value"
            control={form.control}
            render={({ field }) => {
              return (
                <MyEditorContent
                  editor={editor}
                  editorMode={editorMode}
                  {...field}
                />
              );
            }}
          />
        </div>
        {/* <pre className="border p-5">{JSON.stringify(json, null, 2)}</pre> */}
      </div>
    );
  }
);
Components.displayName = "Components";
export default Components;
