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
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="heading-hero mb-3">Form Session</h1>
                    <p className="lead">Complete your form with voice assistance</p>
                </header>

                <main>
                    <div className="bg-white/5 rounded-lg border border-foreground/10 p-6">
                        <InteractiveForm formSessionData={formSessionData as FormSessionDataType} />
                    </div>
                </main>
            </div>
        </div>
    )
}