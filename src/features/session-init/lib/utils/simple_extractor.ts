import { ContentListUnion, Type } from "@google/genai";
import { generateAIContent } from "../../../../utils/model"
import { FormField } from "@/types/FormField";
import { simpleExtractorPrompt as prompt } from "@/prompts/simpleExtractor";
import { fileToBase64 } from "../../../../utils/fileHandling/fileToBase64";

export async function simple_extractor(file: File) {

const contents: ContentListUnion = [
  {
    inlineData: {
      mimeType: file.type,
      data: await fileToBase64(file),
    },
  },
  { text: prompt },
];

const config = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            label: { type: Type.STRING },
            type: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            value: { type: Type.STRING },
            question: { type: Type.STRING }
          },
          required: ["id", "label", "type", "value", "options"],
        },
      },


}
const response = await generateAIContent("gemini-2.5-pro", contents, config)

const extractedFields:FormField[] = JSON.parse(response.text ?? "[]")
return extractedFields
}