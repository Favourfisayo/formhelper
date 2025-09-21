"use server"
import { FormSessionDataType } from "@/types/FormSessionData";
import { FormField } from "@/types/FormField";
import { spitch_speak, spitch_translate } from "@/services/spitch/spitch";
import { TextTranslateParams } from "spitch/resources";
import { getRedisBinaryCache, getRedisCache, setRedisBinaryCache, setRedisCache } from "@/services/redis/redis";
import {  moveAction, startSession } from "./utils/server/actions";
import prisma from "@/lib/prisma"
import { SessionState } from "@/types/SessionState";

export async function getFormSessionData(formSessionId: string){
    const formSessionData = await prisma.formSession.findUnique({
        where: {
            id: formSessionId
        },
    })
    await setRedisCache(`formSession:${formSessionId}`, formSessionData)
    return formSessionData as FormSessionDataType
}
export async function askQuestion({currentFormField, language, sessionId}: {
    currentFormField: FormField,
    language: TextTranslateParams["source"],
    sessionId: string
    
}) {

    const sessionCacheKey = `formSession:${sessionId}`
    const cachedSession = await getRedisCache(sessionCacheKey) as FormSessionDataType
    let fieldFromCache = cachedSession.fields.find(f => f.id === currentFormField.id)
    
    if(!fieldFromCache) {
        const sessionFromDb = await getFormSessionData(sessionId)
        fieldFromCache = sessionFromDb.fields.find(f => f.id === currentFormField.id)
    }

    if (!fieldFromCache) throw new Error("Field not found in session");

    const audioCacheKey = `formSessionAudio:${sessionId}${fieldFromCache.id}:${language}`;
    const cachedAudio = await getRedisBinaryCache(audioCacheKey);
    if (cachedAudio) {
        return Buffer.from(cachedAudio, "base64");
    }

    let audioBuffer: Buffer;
    const textToSpeak = fieldFromCache.question;
    if (language !== "en") {
        const translatedText = await spitch_translate(language, textToSpeak);
        audioBuffer = await spitch_speak(translatedText,  language);
    } else {
        audioBuffer = await spitch_speak(textToSpeak, language);
    }
    
    const audioBase64 = audioBuffer.toString("base64");
    await setRedisBinaryCache(audioCacheKey, audioBase64);

    return audioBuffer;
}

export async function handleNextField(prevState: {message: string}, formData: FormData) {
    const result =  await moveAction(formData, "next")
    return {message: result.message, session: result.session}
}

export async function handleGoBackAction(prevState: SessionState, formData: FormData) {
   const result =  await moveAction(formData, "back")
    return {message: result.message, session: result.session}
}

export async function handleStartSession(prevState: SessionState, formData: FormData) {
  const sessionId = formData.get('formSessionId') as string;
  const updated = await startSession(sessionId);
  return { message: "Session started", session: updated };
}

