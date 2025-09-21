"use server"
import { getRedisCache, setRedisCache } from "@/services/redis/redis";
import { FormSessionDataType } from "@/types/FormSessionData";
export type ExportFormState = {
  message: string;
  fileUrl: string | null;
};
export async function exportForm(
  prevState: ExportFormState,
  formData: FormData
) {
  try {
    const sessionDataRaw = formData.get("sessionData")
    if (!sessionDataRaw) throw new Error("Form Session data missing")
    const sessionData: FormSessionDataType = JSON.parse(sessionDataRaw.toString())
    const cacheKey = `formSessionExport:${sessionData.id}`

    const exportCache = await getRedisCache<ExportFormState>(cacheKey)
    if(exportCache) {
      return exportCache 
    }
  
    const response = await fetch("https://formhelper-backend.onrender.com/export-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      fileUrl: sessionData.fileUrl,  
      fields: sessionData.fields,    
    }),
    })

    if (!response.ok) {
      return { message: "Failed to export form, try again.", fileUrl: null }
    }

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    const obj: ExportFormState = {
      message: "Form exported successfully!",
      fileUrl: `data:application/pdf;base64,${base64}`,
    };
    await setRedisCache(cacheKey, obj)
    return obj
  } catch (err) {
    return { message: `Unexpected error: ${err}`, fileUrl: null }
  }
}
