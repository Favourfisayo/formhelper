import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Navbar from "@/components/app/Navbar"

export default function Home() {
  return (
    <main className="flex-1">
      <header>
        <Navbar/>
      </header>
      <div className="container-c flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-10">
        <div className="max-w-3xl text-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-primary mb-4">
              <FileText className="w-12 h-12" />
            </div>
            <h1 className="heading-hero">
              Form
              <span className="text-primary">Helper</span>
            </h1>
          </div>
          <p className="lead">
            Fill forms on the go, powered by{" "}
            <a 
              href="https://spitch.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Spitch
            </a>
          </p>
          <div className="pt-8">
            <Button asChild size="lg" className="px-8 h-12 text-base">
              <Link href="/app/welcome">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
