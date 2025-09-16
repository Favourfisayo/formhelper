export type FormField = {
  id: string
  label: string
  type:
    | "text"
    | "textarea"
    | "radio"
    | "checkbox"
    | "select"
    | "date"
    | "number"
    | "email"
    | "phone"
  options?: string[]
  value: string,
  question: string
}
