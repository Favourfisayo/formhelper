"use client"

import { format } from "date-fns"
import { File } from "lucide-react"

interface FormSessionProps {
  id: string
  fileName: string
}

export default function FormSession({ id, fileName }: FormSessionProps) {
  return (
    <div 
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => console.log(`Navigate to session ${id}`)}
      onKeyDown={(e) => e.key === "Enter" && console.log(`Navigate to session ${id}`)}
    >
      <File className="w-4 h-4 mt-1 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium truncate">{fileName}</h3>
        <p className="text-xs text-foreground/70">
          {/* {format(createdAt, "MMM d, yyyy 'at' h:mm a")} */}
        </p>
      </div>
    </div>
  )
}