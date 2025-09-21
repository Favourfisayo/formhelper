"use client"
import {FormHelperLogo} from "./FormHelperLogo"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { Skeleton } from "../ui/skeleton"
export default function Navbar() {
    const {data: session, status} = useSession()
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-foreground/10">
            <nav 
                className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-4">
                    <FormHelperLogo />
                </div>

                <div className="flex items-center gap-4">
                    {status === "loading" ? (
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-32 h-5 hidden sm:block" />
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <Skeleton className="w-20 h-10" />
                        </div>
                    ) : session ? (
                        <>
                            <span 
                                className="text-sm font-medium hidden sm:inline"
                                aria-label="Logged in as"
                            >
                                {session.user?.name}
                            </span>
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-accent">
                                {session.user?.image ? (
                                    <img 
                                        src={session.user.image}
                                        alt={`${session.user.name}'s profile`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary">
                                            {session.user?.name?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Button 
                                variant="outline" 
                                className="shrink-0"
                                onClick={() => signOut()}
                            >
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <Button 
                            onClick={() => signIn()}
                            className="shrink-0"
                        >
                           Sign In
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    )
}