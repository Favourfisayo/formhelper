"use client"
import { useActionState, useEffect, useRef, useState, useTransition } from "react"
import { initializeSession } from "@/features/session-init/lib/actions"
import SelectLanguage from "@/features/session-init/components/SelectLanguage"
import Loading from "@/components/app/Loading"
import { UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"

export type uploadState = {
    message: string,
    id?: string
}

export default function UploadForm() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const initialstate: uploadState = {message: ""}
    const [state, formAction, isPending] = useActionState(initializeSession, initialstate)
    const [isPendingTransition, startTransition] = useTransition();
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    useEffect(() => {
        if(state.id) {
            startTransition(() => {
                router.replace(`/app/form-session/${state.id}`);
            });
        }
    }, [state.id, router])

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0])
    }
    }

    return (
        <form className="form-container" action={formAction}>
            <input 
                ref={fileInputRef}
                type="file" 
                name="file" 
                accept=".pdf,.jpg,.png,.jpeg"
                className="sr-only"
                aria-label="Upload form document"
                onChange={handleFileChange}
                required
            />
            
            <div
                className="upload-area focus-ring"
                onClick={handleUploadClick}
                onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
                role="button"
                tabIndex={0}
                aria-label="Click to upload form document"
            >
                <UploadCloud className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                {selectedFile ? (
                    <p className="text-base text-center mb-2">{selectedFile.name}</p>
                ) : (
                    <p className="text-base text-center mb-2">Click to upload your form</p>
                )}
                <p className="text-sm text-foreground/70">PDF, JPG, PNG up to 10MB</p>
            </div>

            <SelectLanguage/>
            
            <button 
                disabled={isPending || isPendingTransition}
                className="btn-primary focus-ring"
                aria-busy={isPending || isPendingTransition}
            >
                Begin Session
            </button>

            {state.message && (
                <p className="text-sm text-center" role="status">{state.message}</p>
            )}
            
            {(isPending || isPendingTransition) && (
                <Loading text="Processing your form..." />
            )}
        </form>
    )
}