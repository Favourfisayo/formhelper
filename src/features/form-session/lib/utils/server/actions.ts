import prisma from "@/lib/prisma"
import { setRedisCache } from "@/services/redis/redis"
import { FormSessionDataType } from "@/types/FormSessionData"
import { getFormSessionData } from "../../actions"

export async function startSession(formSessionId: string): Promise<FormSessionDataType> {
  const updated = await prisma.formSession.update({
    where: { id: formSessionId },
    data: { sessionStarted: true },
  })

  await setRedisCache(`formSession:${formSessionId}`, updated)
  return updated as FormSessionDataType
}

export async function updateFieldAndSession({
    formSessionId,
    fieldId,
    value,
    increment
}: {
    formSessionId: string,
    fieldId: string
    value: any
    increment: boolean

}) {
    const formSessionData = await getFormSessionData(formSessionId)
    if (!formSessionData) throw new Error("Form session not found");
    const fields = formSessionData.fields;

    const updatedFields = fields.map(field =>
    field.id === fieldId ? { ...field, value } : field);

    const updatedFormSessionData = await prisma.formSession.update({
        where: {id: formSessionId},
        data: {
            fields: updatedFields,
            currentFieldIndex: increment ? {increment: 1} : {decrement: 1}
        },
    })
    await setRedisCache(
    `formSession:${formSessionId}`,
     updatedFormSessionData,
    );


    return updatedFormSessionData
}

export async function moveAction(formData: FormData, move: "back" |"next") {
    const formSessionId =  formData.get("formSessionId") as string

    const formEntries = Array.from(formData.entries())

    const [fieldId, value] = formEntries.find(([key]) => key !== "formSessionId") || []

    if (!fieldId) return { message: "No field submitted" };

    try {
    const updatedFormSession = await updateFieldAndSession({
      formSessionId,
      fieldId,
      value,
      increment: move === "next" ? true : false
    });

    return { message: "OK", session: updatedFormSession as FormSessionDataType };
    }catch(error) {
    return { message: "Error updating field" };
    }
}