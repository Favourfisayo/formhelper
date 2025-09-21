import prisma from "@/lib/prisma"
import { FormField } from "@/types/FormField"
import { uploadToStorage } from "@/utils/uploadToStorage"
import { auth } from "@/lib/auth"
export async function createSession(file: File, lang: string, fieldsExtracted: FormField[]) {
        const session = await auth()
        if(!session) return 
        try {
        const fileUrl =  await uploadToStorage(file)
        const createdSession = await prisma.formSession.create({
            data: {
                fields: fieldsExtracted,
                session_lang: lang,
                fileName: `${Date.now()}-${file.name}`,
                fileType: file.type,
                fileUrl,
            },
        })
        return createdSession
    }catch(error) {
        throw new Error(`Failed to create form session: ${error}`)
    }
}