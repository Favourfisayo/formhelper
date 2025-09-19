"use server"
import { FormSessionDataType } from "@/types/FormSessionData";
import { FormField } from "@/types/FormField";
import { spitch_speak, spitch_translate } from "@/services/spitch/spitch";
import { TextTranslateParams } from "spitch/resources";
import { getRedisCache, setRedisCache } from "@/services/redis/redis";
import {  goBackField, startSession, updateFieldAndSession } from "./utils/server/actions";
import prisma from "@/lib/db"
import { SessionState } from "@/types/SessionState";
import { connectRedis } from "@/lib/redis";

export async function getFormSessionData(formSessionId: string){
    const formSessionData = await prisma.formSession.findUnique({
        where: {
            id: formSessionId
        },
    })
    await connectRedis()
    await setRedisCache(`formSession:${formSessionId}`, JSON.stringify(formSessionData))
    return formSessionData as FormSessionDataType
}
export async function askQuestion({currentFormField, language, sessionId}: {
    currentFormField: FormField,
    language: TextTranslateParams["source"],
    sessionId: string
    
}) {
    await connectRedis()

    const sessionCacheKey = `formSession:${sessionId}`
    const cachedSessionStr = await getRedisCache(sessionCacheKey)

    let fieldFromCache: FormField | undefined

    if(cachedSessionStr) {
        const cachedSession = JSON.parse(cachedSessionStr) as FormSessionDataType

        fieldFromCache = cachedSession.fields.find(f => f.id === currentFormField.id)
    }

    if(!fieldFromCache) {
        console.log("⚠️ Field not found in cache, fetching from DB");
        const sessionFromDb = await getFormSessionData(sessionId)
        fieldFromCache = sessionFromDb.fields.find(f => f.id === currentFormField.id)
    }

    if (!fieldFromCache) throw new Error("Field not found in session");

    const audioCacheKey = `formSessionAudio:${sessionId}${fieldFromCache.id}:${language}`;
    const cachedAudio = await getRedisCache(audioCacheKey);
    if (cachedAudio) {
        console.log("🔹 Using cached audio for field:", fieldFromCache.label);
        return Buffer.from(cachedAudio, "base64");
    }

    let audioBuffer: Buffer;
    const textToSpeak = fieldFromCache.question;

    if (language !== "en") {
        const translatedText = await spitch_translate(language, textToSpeak);
        audioBuffer = await spitch_speak(translatedText, "femi", language);
    } else {
        audioBuffer = await spitch_speak(textToSpeak, "jude", language);
    }

    const audioBase64 = audioBuffer.toString("base64");
    await setRedisCache(audioCacheKey, audioBase64);

    return audioBuffer;
}

export async function handleNextField(prevState: {message: string}, formData: FormData) {
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



export async function handleStartSession(prevState: SessionState, formData: FormData) {
  const sessionId = formData.get('formSessionId') as string;
  const updated = await startSession(sessionId);
  return { message: "Session started", session: updated };
}

export async function handleGoBackAction(prevState: SessionState, formData: FormData) {
  const formSessionId = formData.get('formSessionId') as string;
  if (!prevState.session || prevState.session.currentFieldIndex === 0) {
    return prevState;
  }
  const updated = await goBackField(formSessionId);
  return { message: "", session: updated as FormSessionDataType };
}