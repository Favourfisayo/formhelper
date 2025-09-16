import { FormField } from "@/types/FormField";

export function QuestionPrompt(currentFormField: FormField) {
    const prompt = `
    You are given a form label: "${currentFormField.label}".

    Your task: Rewrite it as a natural, conversational question you would actively ask a user to collect that information, like 
    they are filling the form currently and make sure you ask it like a clear question, not some ambiguous question.

    Constraints:
    - Respond with the question only.
    - Do not add explanations, formatting, or extra words.
    - Keep it short and clear, but not ambiguous.
    `
    return prompt
}