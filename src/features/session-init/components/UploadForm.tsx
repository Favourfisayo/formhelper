"use client"
import { useActionState, useEffect, useState } from "react"
import { initializeSession } from "@/features/session-init/lib/actions"
import SelectLanguage from "@/features/form-session/components/SelectLanguage"
import { useRouter } from "next/navigation"
export type uploadState = {
    message: string,
    id?: string
}
export default function UploadForm() {
    const router = useRouter()
    const initialstate: uploadState = {message: ""}
    const [state, formAction, isPending] = useActionState(initializeSession, initialstate)
    useEffect(() => {
        if(state.id) {
            router.push(`/form-session/${state.id}`)
        }
    }, [state.id])
    return (
        <form className="flex flex-col gap-4 max-w-96" action={formAction}>
            <input className="border" type="file" name="file" accept=".pdf,.jpg,.png,.jpeg" />
            <SelectLanguage/>
            <button disabled={isPending} className={`border ${isPending && 'cursor-not-allowed'} `} type="submit">Begin Session</button>
            {state.message && <p>{state.message}</p>}
            {isPending && <p>Loading</p>}
        </form>
    )
}