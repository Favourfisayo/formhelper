"use client"

import { Button } from "@/components/ui/button"
import { FormSessionDataType } from "@/types/FormSessionData"
import { useActionState } from "react"
import { exportForm } from "../lib/actions"
import { useEffect, useRef } from "react"

export default function ExportForm({ sessionData }: { sessionData: FormSessionDataType }) {
  const exportFormWithData = exportForm.bind(null)
  const [state, formAction, isPending] = useActionState(exportFormWithData, {
    message: "",
    fileUrl: null as string | null,
  })

  const downloadRef = useRef<HTMLAnchorElement>(null)

  // Auto-download effect
  useEffect(() => {
    if (state.fileUrl && downloadRef.current) {
      downloadRef.current.href = state.fileUrl
      downloadRef.current.download = "form.pdf"
      downloadRef.current.click()
    }
  }, [state.fileUrl])

  return (
    <form action={formAction}>
      <input type="hidden" name="sessionData" value={JSON.stringify(sessionData)} />

      <div className="text-center p-6">
        <h2 className="text-xl font-semibold mb-4">Form Completed!</h2>
        <Button disabled={isPending}>
          {isPending ? "Exporting..." : "Export"}
        </Button>
        {state.message && <p className="mt-2 text-sm text-gray-500">{state.message}</p>}
      </div>

      {/* hidden anchor for download */}
      <a ref={downloadRef} style={{ display: "none" }} />
    </form>
  )
}
