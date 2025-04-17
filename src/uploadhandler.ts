"use client";

import {
  createClient,
  //  type SupabaseClient
} from "@supabase/supabase-js";

export const imgUploader = async (e: File, path: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const file = e;
  if (!file) return;

  const ext = file.name.split(".").pop();
  const uniqueFileName = `${path}/test.${ext}`;

  const { error } = await supabase.storage
    .from("blog")
    .upload(uniqueFileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    alert("업로드 에러: " + error.message);
    return;
  }

  const { data } = supabase.storage.from("blog").getPublicUrl(uniqueFileName);
  return data.publicUrl;
};
