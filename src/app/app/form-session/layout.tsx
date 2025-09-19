import { AppSidebar } from "@/components/app/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function FormSessionLayout({children}: {
    children: React.ReactNode
}) {
    return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full relative">
        <div className="flex w-full absolute top-20">
        <SidebarTrigger />
        {children}
        </div>
      </main>
    </SidebarProvider>
    )
}