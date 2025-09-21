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
export async function initializeSession(prevData: uploadState, formdata: FormData){
    let file = formdata.get("file") as File
    const lang = formdata.get("lang") as TextTranslateParams["target"]

    if(!file || (file instanceof File && file.size === 0)) {
    return { message: "Please upload a file" }
    }

    try {
    if(file.type === "application/pdf"){
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
    //TO-DO: Separate custom-extractor to use better reasoning models and prompt.
    if (classifyResponse.data.class === "SIMPLE" || classifyResponse.data.class === "CUSTOM") {
        fieldsExtracted = await simple_extractor(file);
    }

    if (!fieldsExtracted || fieldsExtracted.length === 0) {
        return { message: "Extraction failed, No fields extracted" };
    }
    const createdSession = await createSession(file, lang, fieldsExtracted);
    if(!createdSession) {
        return {message: "Failed to create session"}
    }
    await setRedisCache(
        `formSession:${createdSession?.id}`,
        createdSession,
    )

    return { message: `Redirecting to form Session...`,  id: createdSession.id };
    }catch(error){
    return { message: "Unexpected failure, please try again later" }
    }
    
}