
import { FileText } from "lucide-react"
import Link from "next/link"

export function FormHelperLogo() {
  return (
    <Link 
      href="/"
      className="flex items-center gap-2 text-xl font-semibold text-primary hover:opacity-90 transition-opacity"
      aria-label="FormHelper Home"
    >
      <FileText className="w-6 h-6" aria-hidden="true" />
      <span>FormHelper</span>
    </Link>
  )
}