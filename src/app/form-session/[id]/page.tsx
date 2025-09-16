import InteractiveForm from "@/features/form-session/components/InteractiveForm"
import { getFormSessionData } from "@/features/form-session/lib/actions"
import { FormSessionDataType } from "@/types/FormSessionData"

export default async function page({params}: {
    params: Promise<{id: string}>
}) {
    const {id: formSessionId} = await params
    const formSessionData = await getFormSessionData(formSessionId)
    if(!formSessionData) return
    return (
        <>
            <div>
                <h1>Form Session</h1>
                <InteractiveForm formSessionData = {formSessionData as FormSessionDataType } />
            </div>
        </>
    )
}