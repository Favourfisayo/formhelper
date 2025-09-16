"use server"
import prisma from "@/lib/db"
import { FormSessionDataType } from "@/types/FormSessionData";
import { FormField } from "@/types/FormField";
import { generateAIContent } from "@/utils/model";
import { spitch_speak, spitch_translate } from "@/services/spitch/spitch";
import { TextTranslateParams } from "spitch/resources";
import { QuestionPrompt } from "@/prompts/questionPrompt";

export async function getFormSessionData(formSessionId: string){
    const formSessionData = await prisma.formSession.findUnique({
        where: {
            id: formSessionId
        },
    })

    return formSessionData as FormSessionDataType
}

export async function startSession(formSessionId: string): Promise<FormSessionDataType> {
  const updated = await prisma.formSession.update({
    where: { id: formSessionId },
    data: { sessionStarted: true },
  })
  return updated as FormSessionDataType
}

export async function askQuestion({currentFormField, language}: {
    currentFormField: FormField,
    language: TextTranslateParams["source"]
    
}) {


    console.log("📝 askQuestion start:", { field: currentFormField.label, language });
    const question = (await frameQuestion(currentFormField)).text
     console.log("🤖 AI framed question:", question);

     let spoken
    if(language !== "en") {
    const translated_question = question && await spitch_translate(language, question)
    console.log("🌍 Translated question:", translated_question);
    spoken = translated_question && await spitch_speak(translated_question, "femi", language)
    } else {
        spoken = question && await spitch_speak(question, "jude", language);
    }

    return spoken
}


async function frameQuestion(currentFormField: FormField) {
    const prompt = QuestionPrompt(currentFormField)
    return generateAIContent("gemini-2.5-flash", 
    {text: prompt},)
}


 async function updateFieldAndSession({
    formSessionId,
    fieldId,
    value,
}: {
    formSessionId: string,
    fieldId: string
    value: any

}) {
    const formSessionData = await getFormSessionData(formSessionId)
    
    if (!formSessionData) throw new Error("Form session not found");

    const fields = formSessionData.fields;

    const updatedFields = fields.map(field =>
    field.id === fieldId ? { ...field, value } : field);

    const updatedFormSessionData = await prisma.formSession.update({
        where: {id: formSessionId},
        data: {
            fields: updatedFields,
            currentFieldIndex: {increment: 1}
        },
    })


    return updatedFormSessionData
}

export async function handleNext(prevState: {message: string}, formData: FormData) {
    const formSessionId =  formData.get("formSessionId") as string

    const formEntries = Array.from(formData.entries())
    console.log("Form entries received:", formEntries);

    const [fieldId, value] = formEntries.find(([key]) => key !== "formSessionId") || []

    if (!fieldId) return { message: "No field submitted" };

    try {
    const updatedFormSession = await updateFieldAndSession({
      formSessionId,
      fieldId,
      value,
    });
    console.log("Updated form session data: ", updatedFormSession)

    return { message: "OK", session: updatedFormSession as FormSessionDataType };
    }catch(error) {
    console.error(error);
    return { message: "Error updating field" };
    }


}