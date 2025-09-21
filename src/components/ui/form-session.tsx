"use client"

import { format } from "date-fns"
import { FileText } from "lucide-react"

interface FormSessionProps {
  fileName: string
  imageUrl: string
  createdAt: string | Date
}

export function FormSession({ fileName, imageUrl, createdAt }: FormSessionProps) {
  return (
    <div className="group flex items-start gap-3 p-5 rounded-lg hover:bg-white/5 transition-colors">
      <div className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-white/5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Thumbnail for ${fileName}`}
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <FileText className="w-6 h-6 text-primary/60" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground">
          {fileName}
        </h3>
        <p className="text-xs text-foreground/60">
          {format(new Date(createdAt), "MMM dd, yyyy, hh:mm a")}
        </p>
      </div>
    </div>
  )
}