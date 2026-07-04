import { createClient } from "@/libs/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"

const adminNav = [
	{ label: "Overview", href: "/admin/overview" },
	{ label: "Manage Rooms", href: "/admin/rooms" },
	{ label: "Users", href: "/admin/users" },
]

export default async function AdminLayout({ children }) {
	const supabase = await createClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		redirect("/login")
	}

	const { data: profile, error: queryError } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single()

	if (queryError) {
		console.error("Profile query error:", queryError)
	}

	if (!profile || profile.role !== "admin") {
		redirect("/dashboard")
	}


	return (
		<div>
			<div className="border-b border-border bg-muted/30 px-6">
				<div className="max-w-6xl mx-auto flex items-center gap-1 py-2">
					<span className="text-xs font-bold uppercase tracking-widest text-teal mr-4 select-none">
						Admin
					</span>
					{adminNav.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="px-3 py-1.5 rounded-lg text-sm font-medium text-navy/70 hover:text-navy hover:bg-muted transition-colors"
						>
							{item.label}
						</Link>
					))}
				</div>
			</div>
			{children}
		</div>
	)
}
