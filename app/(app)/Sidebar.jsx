"use client"

import { useState } from "react"
import { signOut } from "@/libs/authentication"

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: "D" },
	{ label: "Rooms", href: "/rooms", icon: "R" },
	{ label: "My Bookings", href: "/bookings", icon: "B" },
	{ label: "Notifications", href: "/notifications", icon: "N" },
]

export default function Sidebar({ userRole }) {
	const [expanded, setExpanded] = useState(true)
	const isAdmin = userRole === "admin"

	return (
		<aside
			className={`${expanded ? "w-64" : "w-20"
				} bg-muted text-navy flex flex-col justify-between p-4 transition-all duration-200`}
		>
			<div>
				<div className="flex items-center justify-between mb-10">
					{expanded && <h2 className="text-xl font-sans font-bold">U U BOR</h2>}
					<button
						type="button"
						onClick={() => setExpanded((prev) => !prev)}
						className="p-2 rounded-lg hover:bg-border/60 transition-colors cursor-pointer"
						aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
					>
						{expanded ? "«" : "»"}
					</button>
				</div>

				<nav className="flex flex-col gap-2">
					{navItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							title={!expanded ? item.label : undefined}
							className={`px-4 py-2 rounded-lg text-navy hover:bg-border/60 transition-colors ${expanded ? "" : "flex justify-center"
								}`}
						>
							{expanded ? item.label : item.icon}
						</a>
					))}

					{isAdmin && (
						<a
							href="/admin/overview"
							title={!expanded ? "Admin Panel" : undefined}
							className={`px-4 py-2 rounded-lg text-teal font-semibold hover:bg-teal/10 transition-colors ${expanded ? "" : "flex justify-center"
								}`}
						>
							{expanded ? "Admin Panel" : "A"}
						</a>
					)}
				</nav>
			</div>

			<div className="flex flex-col gap-2">
				<a
					href="/settings"
					title={!expanded ? "settings" : undefined}
					className={`px-4 py-2 rounded-lg text-navy/60 hover:bg-navy/60 hover:text-white ${expanded ? "" : "flex justify-center"
						}`}
				>
					{expanded ? "settings" : "S"}
				</a>
				<button
					type="button"
					title={!expanded ? "sign out" : undefined}
					className={`text-left px-4 py-2 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white cursor-pointer font-medium transition-colors ${expanded ? "w-full" : "flex justify-center"
						}`}
					onClick={signOut}
				>
					{expanded ? "sign out" : "X"}
				</button>
			</div>
		</aside>
	)
}