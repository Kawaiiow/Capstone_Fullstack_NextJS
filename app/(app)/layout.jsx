import { createClient } from "@/libs/supabase"
import Sidebar from "./Sidebar"

export default async function AppLayout({ children }) {
	let userRole = null

	try {
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (user) {
			const { data: profile } = await supabase
				.from("profiles")
				.select("role")
				.eq("id", user.id)
				.single()

			userRole = profile?.role || null
		}
	} catch (err) {
		console.error("AppLayout auth check error:", err)
	}

	return (
		<div className="flex min-h-screen">
			<Sidebar userRole={userRole} />

			<main className="flex-1 bg-white">{children}</main>
		</div>
	)
}
