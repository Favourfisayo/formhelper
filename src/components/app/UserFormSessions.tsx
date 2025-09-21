// import { getAllFormSessionData } from "@/features/form-session/lib/actions"
// import { FormSession } from "@/components/ui/form-session"
// import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
// import Link from "next/link"

// export default async function UserFormSessions() {
//   const userFormSessions = await getAllFormSessionData()

//   return (
//     <div className="space-y-1">
//       {userFormSessions.map(session => (
//         <SidebarMenuItem key={session.id}>
//           <SidebarMenuButton asChild>
//             <Link href={`/app/form-session/${session.id}`}>
//               <FormSession
//                 fileName={session.fileName}
//                 imageUrl={session.fileUrl}
//                 createdAt={session.createdAt}
//               />
//             </Link>
//           </SidebarMenuButton>
//         </SidebarMenuItem>
//       ))}
//     </div>
//   )
// }