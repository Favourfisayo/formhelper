"use client"
import Navbar from "@/components/app/Navbar"
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>
        <Navbar/>
        {children}
      </main>
    </>
  )
}