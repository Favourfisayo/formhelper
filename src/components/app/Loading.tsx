"use client"

import { ClipLoader } from "react-spinners"

interface LoadingProps {
  text?: string
  size?: number
  color?: string
}

export default function Loading({ text, size = 40, color = "#3B82F6" }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <ClipLoader
        size={size}
        color={color}
        aria-label="Loading"
      />
      {text && <p className="loading-text" role="status">{text}</p>}
    </div>
  )
}