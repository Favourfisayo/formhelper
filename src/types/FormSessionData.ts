import { TextTranslateParams } from "spitch/resources"
import { FormField } from "./FormField"

export type FormSessionDataType = {
  currentFieldIndex: number
  fields: FormField[]
  session_lang: TextTranslateParams["source"]
  sessionStarted: boolean
  id: string
  createdAt: Date
  fileName: string
  fileType: string
  fileUrl: string
  userId: string
}