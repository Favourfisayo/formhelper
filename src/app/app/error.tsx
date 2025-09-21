"use client"

import { Button } from "@/components/ui/button"
import { AlertOctagon } from "lucide-react"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <AlertOctagon className="w-12 h-12 text-destructive" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Something went wrong!</h1>
          <p className="text-foreground/70">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            onClick={() => reset()}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}