import { supabase } from "@/lib/supabase";

export async function uploadToStorage(file: File) {
  const { data, error } = await supabase.storage
    .from("uploadedforms") // bucket name
    .upload(`uploads/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // get public URL or signed URL
  const { data: { publicUrl } } = supabase.storage
    .from("uploadedforms")
    .getPublicUrl(data.path);

  return publicUrl;
}