import { signOut } from "@/libs/authentication"
import Sidebar from "./Sidebar"

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-white">{children}</main>
    </div>
  )
}