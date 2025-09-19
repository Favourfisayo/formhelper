import Link from "next/link";

export default function FormSessionPage() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-foreground">
      <h1 className="heading-hero text-primary mb-4 text-center">
        Form Session
      </h1>

      <p className="lead text-center max-w-md">
        Click a session in the sidebar to resume or begin a session
      </p>

      <Link href="/app/welcome" className="btn-primary mt-6 focus-ring">
        Start a New Session
      </Link>
    </section>
  )
}
