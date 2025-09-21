import Spitch from "spitch"
import { SpeechGenerateParams, TextTranslateParams } from "spitch/resources.js"
const spitchClient = new Spitch({apiKey: process.env.SPITCH_API_KEY})

export async function spitch_translate(target: TextTranslateParams["target"], text: string ): Promise<string> {
     const res = await spitchClient.text.translate({
        source: "en",
        target: target,
        text: text
    })
    if(target === "yo") {
        const toneMarkRes = await spitch_tonemark(res, target)
        return toneMarkRes.text
    }
    return res.text
}
export async function spitch_tonemark(res: Spitch.Text.TextTranslateResponse, language: TextTranslateParams["target"]){
    const toneMarkRes =  await spitchClient.text.toneMark({
        text: res.text,
        language
    })
    return toneMarkRes
}
export async function spitch_speak(text: string, language: SpeechGenerateParams["language"]) {
    let voice: SpeechGenerateParams["voice"]
    switch(language) {
        case "yo":
            voice = "femi" ;
            break;
        case "ig":
            voice = "obinna";
            break;
        case "ha":
            voice = "amina";
            break;
        default:
            voice = "jude";
            break;
    }
    try {
    const res = await spitchClient.speech.generate({
        text,
        language,
        voice
    })

    return Buffer.from(await (await res.blob()).arrayBuffer());
}catch(err: any) {
    throw err;
}
}