import { TextTranslateParams } from "spitch/resources";
import { FormField } from "@/types/FormField";
import { askQuestion } from "../../actions";
import { FormSessionDataType } from "@/types/FormSessionData";

export async function askQuestionFunction(
  currentFormField: FormField,
  language: TextTranslateParams["source"],
  sessionId: string
): Promise<string | null> {
  const buffer = await askQuestion({ currentFormField, language, sessionId });
  if (!buffer) return null;
  const uint8Array = new Uint8Array(buffer);

  const blob = new Blob([uint8Array], { type: "audio/wav" });
  return URL.createObjectURL(blob);

}



export async function prefetchNextAudio(
  currentIndex: number,
  session: FormSessionDataType,
) {
  const nextField = session.fields[currentIndex + 1];
  if (!nextField) return;

  try {
    await askQuestion({
        currentFormField: nextField,
        language: session.session_lang,
        sessionId: session.id
    });
  } catch (err) {
    return null
  }
}