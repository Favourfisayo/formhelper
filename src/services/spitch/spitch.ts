import Spitch from "spitch"
import { SpeechGenerateParams, TextTranslateParams } from "spitch/resources.js"
const spitchClient = new Spitch({apiKey: process.env.SPITCH_API_KEY})

export async function spitch_translate(target: TextTranslateParams["target"], text: string ): Promise<string> {
    console.log("Calling translate…");
     const res = await spitchClient.text.translate({
        source: "en",
        target: target,
        text: text
    })
    console.log("Calling toneMark…");
    const translated_text = await spitchClient.text.toneMark({
        text: res.text,
        language: target
    })

    return translated_text.text
}

export async function spitch_speak(text: string, voice:SpeechGenerateParams["voice"]="femi", language: SpeechGenerateParams["language"]) {
    console.log("🗣️ Calling spitch_speak with:", { text, voice, language });
    console.log("Calling speech.generate…");
    try {
    const res = await spitchClient.speech.generate({
        text,
        language,
        voice
    })

    return Buffer.from(await (await res.blob()).arrayBuffer());
}catch(err: any) {
    console.error("❌ Spitch speak failed:", err.message, err.stack);
    throw err;
}
}