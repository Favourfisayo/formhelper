import { ContentListUnion, GenerateContentConfig, GoogleGenAI } from "@google/genai";

const model = new GoogleGenAI({})

export async function generateAIContent(AI_model: string, contents: ContentListUnion, config?: GenerateContentConfig | undefined) {
    const response = await model.models.generateContent({
        model: AI_model,
        contents: contents,
        config: config,
    })

    return response
}