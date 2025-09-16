import prisma from "@/lib/db"
import { FormField } from "@/types/FormField"
import { uploadToStorage } from "@/utils/uploadToStorage"

export async function createSession(file: File, lang: string, fieldsExtracted: FormField[]) {
        try {
        const fileUrl =  await uploadToStorage(file)
        const {id} = await prisma.formSession.create({
            data: {
                fields: fieldsExtracted,
                session_lang: lang,
                fileName: file.name,
                fileType: file.type,
                fileUrl
            },

            select: {
                id: true
            }
        })
        return id
    }catch(error) {
        throw new Error(`Failed to create form session: ${error}`)
    }
}