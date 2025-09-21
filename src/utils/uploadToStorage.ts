import { supabase } from "@/lib/supabase";

export async function uploadToStorage(file: File) {
  const { data, error } = await supabase.storage
    .from("uploadedforms")
    .upload(`uploads/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Error uploading form: ${error}`);

  const { data: { publicUrl } } = supabase.storage
    .from("uploadedforms")
    .getPublicUrl(data.path);

  return publicUrl;
}