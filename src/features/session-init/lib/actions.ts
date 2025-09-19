"use server"
import { classifyForm } from "./utils/classifyForm"
import { simple_extractor } from "./utils/simple_extractor"
import { uploadState } from "../components/UploadForm"
import { createSession } from "./utils/createSession"
import { convertToImage } from "@/utils/fileHandling/convertToImage"
import { isForm } from "./utils/isForm"
import { setRedisCache } from "@/services/redis/redis"
import { TextTranslateParams } from "spitch/resources.js"
import { FormField } from "@/types/FormField"
import { connectRedis } from "@/lib/redis"
export async function initializeSession(prevData: uploadState, formdata: FormData){
    let file = formdata.get("file") as File
    const lang = formdata.get("lang") as TextTranslateParams["target"]

    if(!file || (file instanceof File && file.size === 0)) {
    return { message: "Please upload a file" }
    }

    try {
    if(file.type === "application/pdf"){
        console.log("PDF file detected, converting...")
        const convertedFile = await convertToImage(file)
        if(!convertedFile) return {message: "Failed to convert PDF"};

        file = convertedFile
    }

    const res = await isForm(file)
    if(!res?.success) return {message: res?.error?.message}
    if(!res.data.is_form) return {message: "Not a form document"}

    const classifyResponse = await classifyForm(file)
    if(!classifyResponse.success) return {message: classifyResponse.error.message}

    let fieldsExtracted: FormField[] = [];
    if (classifyResponse.data.class === "SIMPLE") {
        fieldsExtracted = await simple_extractor(file);
    } else {
        console.log("Custom form, use custom extractor..");
    }

    if (!fieldsExtracted || fieldsExtracted.length === 0) {
        return { message: "Extraction failed, No fields extracted" };
    }
    const id = await createSession(file, lang, fieldsExtracted);
    await connectRedis()
    await setRedisCache(
        
        `formSession:${id}`,
        JSON.stringify({ id, fields: fieldsExtracted, currentFieldIndex: 0, sessionStarted: false, session_lang: lang }),
    )

    return { id, message: `Redirecting to form Session...` };
    }catch(error){
    console.error("Unexpected error in initializeSession", error)
    return { message: "Unexpected failure, please try again later" }
    }
    
}