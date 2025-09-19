import prisma from "@/lib/db"
import { setRedisCache } from "@/services/redis/redis"
import { FormSessionDataType } from "@/types/FormSessionData"
import { getFormSessionData } from "../../actions"
import { connectRedis } from "@/lib/redis"

export async function startSession(formSessionId: string): Promise<FormSessionDataType> {
  const updated = await prisma.formSession.update({
    where: { id: formSessionId },
    data: { sessionStarted: true },
  })

  await connectRedis()
  await setRedisCache(`formSession:${formSessionId}`, JSON.stringify(updated))
  return updated as FormSessionDataType
}

export async function updateFieldAndSession({
    formSessionId,
    fieldId,
    value,
}: {
    formSessionId: string,
    fieldId: string
    value: any

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
            currentFieldIndex: {increment: 1}
        },
    })
    await connectRedis()
    await setRedisCache(
    `formSession:${formSessionId}`,
    JSON.stringify(updatedFormSessionData),
    );


    return updatedFormSessionData
}

export async function goBackField(formSessionId: string) {
  await connectRedis();
  const session = await prisma.formSession.findUnique({ where: { id: formSessionId } });
  if (!session) throw new Error("Form session not found");

  const updatedSession = await prisma.formSession.update({
    where: { id: formSessionId },
    data: {currentFieldIndex: {decrement: 1}},
  });
  const cacheKey = `formSession:${formSessionId}`;
  await setRedisCache(cacheKey, JSON.stringify(updatedSession));

  return updatedSession;
}