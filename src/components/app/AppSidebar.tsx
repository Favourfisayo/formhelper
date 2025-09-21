// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import UserFormSessions from "./UserFormSessions"
// import { Suspense } from "react"
// import { FormSessionSkeleton } from "@/components/ui/form-session-skeleton"

// function FormSessionsLoading() {
//   return (
//     <div className="space-y-1">
//       {[...Array(5)].map((_, i) => (
//         <SidebarMenuItem key={i}>
//           <FormSessionSkeleton />
//         </SidebarMenuItem>
//       ))}
//     </div>
//   )
// }

// export async function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarContent className="mt-20">
//         <SidebarGroup>
//           <SidebarGroupLabel>Your Forms</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <Suspense fallback={<FormSessionsLoading />}>
//                 <UserFormSessions />
//               </Suspense>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }