import { check_form_prompt } from "@/prompts/check_is_form"
import { fileToBase64 } from "@/utils/fileHandling/fileToBase64"
import { generateAIContent } from "@/utils/model"
import { ContentListUnion, Type } from "@google/genai"

export async function isForm(file: File) {
    try {
        const contents: ContentListUnion = [
            {
            inlineData: {
                data: await fileToBase64(file),
                mimeType: file.type,
            },
            },
            {text: check_form_prompt}
        ]
        const configs = {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    is_form: {type: Type.BOOLEAN}
                }
                
            }
        }
        const res = await generateAIContent("gemini-2.5-flash", contents, configs) 
        if(!res) return
        const isForm = JSON.parse(res.text ?? "") 
        console.log(isForm)
        return {success: true, data: isForm}
    }catch(error) {
        console.log("Error checking is_form: ", error)
        return {error: {message: "Error checking is_form"}}
        }
}