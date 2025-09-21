import { SidebarProvider } from "@/components/ui/sidebar"

export default function FormSessionLayout({children}: {
    children: React.ReactNode
}) {
    return (
    <SidebarProvider>
      {/* <AppSidebar /> --- After prisma adapter fix, add user's form session in sidebar*/}
      <main className="min-h-screen w-full relative">
        <div className="flex w-full absolute top-20">
        {/* <SidebarTrigger /> */}
        {children}
        </div>
      </main>
    </SidebarProvider>
    )
}