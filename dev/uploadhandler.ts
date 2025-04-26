import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const imgUploader = async (e: File, path: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const file = e;
  if (!file) throw new Error("파일이 존재하지 않습니다.");

  const ext = file.name.split(".").pop();
  const uniqueFileName = `${path}/${uuidv4()}.${ext}`;

  const { error } = await supabase.storage
    .from("blog")
    .upload(uniqueFileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error("업로드 에러");
  }

  const { data } = supabase.storage.from("blog").getPublicUrl(uniqueFileName);
  return data.publicUrl;
};
