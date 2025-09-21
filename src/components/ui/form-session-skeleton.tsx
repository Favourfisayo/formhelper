"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function FormSessionSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="flex-shrink-0 w-12 h-12 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}