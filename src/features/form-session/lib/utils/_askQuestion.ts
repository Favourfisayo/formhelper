import { TextTranslateParams } from "spitch/resources";
import { FormField } from "@/types/FormField";
import { askQuestion } from "../actions";

// ✅ Only fetch & return the audio Blob URL
export async function askQuestionFunction(
  currentFormField: FormField,
  language: TextTranslateParams["source"],
): Promise<string | null> {
  const buffer = await askQuestion({ currentFormField, language });
  if (!buffer) return null;

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}
