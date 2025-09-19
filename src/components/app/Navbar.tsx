"use client"
import {FormHelperLogo} from "./FormHelperLogo"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function Navbar() {
    const isAuthenticated = false
    const userName = "John Doe"

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
                    {isAuthenticated ? (
                        <>
                            <span 
                                className="text-sm font-medium hidden sm:inline"
                                aria-label="Logged in as"
                            >
                                {userName}
                            </span>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="shrink-0"
                                aria-label="View profile"
                            >
                                <User className="w-5 h-5" aria-hidden="true" />
                            </Button>
                            <Button 
                                variant="outline" 
                                className="shrink-0"
                                onClick={() => console.log("Sign out")}
                            >
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <Button 
                            onClick={() => console.log("Sign in")}
                            className="shrink-0"
                        >
                            Sign in
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    )
}