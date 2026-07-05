import { createClient } from "@/libs/supabase"
import { redirect } from "next/navigation"

export default async function AuthLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return children
}s
