import UploadForm from "@/features/session-init/components/UploadForm";

export default async function UploadWelcome() {
    return (
        <main role="main" aria-labelledby="welcome-heading">
            <section className="mx-auto max-w-2xl py-16 sm:py-20 md:py-24">
                <header className="text-center">
                    <h1 id="welcome-heading" className="heading-hero leading-tight text-foreground">
                        Welcome
                    </h1>
                    <p className="lead mt-3">
                        Upload your form to start a filling session. It&apos;s quick and secure.
                    </p>
                </header>

                <div className="mt-10 sm:mt-12 md:mt-14 flex justify-center">
                    <div className="w-full max-w-md" aria-label="Upload form">
                        <UploadForm />
                    </div>
                </div>
            </section>
        </main>
    )
}