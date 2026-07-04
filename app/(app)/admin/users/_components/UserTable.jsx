"use client"

import { useState, useTransition } from "react"
import { updateUserRole } from "../action"

const roleBadge = {
	pending: "bg-warning/15 text-amber-700 border-warning/30",
	member: "bg-teal/10 text-teal border-teal/20",
	staff: "bg-navy/10 text-navy border-navy/20",
	admin: "bg-danger/10 text-danger border-danger/20",
}

const ROLES = ["pending", "member", "staff", "admin"]

export default function UserTable({ users, currentUserId }) {
	const [search, setSearch] = useState("")
	const [isPending, startTransition] = useTransition()
	const [changingId, setChangingId] = useState(null)
	const [feedback, setFeedback] = useState(null)

	const filtered = users.filter((u) => {
		const term = search.toLowerCase()
		const name = `${u.firstname || ""} ${u.lastname || ""}`.toLowerCase()
		return name.includes(term) || (u.email || "").toLowerCase().includes(term)
	})

	const handleRoleChange = (userId, newRole) => {
		setChangingId(userId)
		setFeedback(null)

		const formData = new FormData()
		formData.set("userId", userId)
		formData.set("role", newRole)

		startTransition(async () => {
			const result = await updateUserRole(null, formData)
			setChangingId(null)
			if (result?.error) {
				setFeedback({ type: "error", message: result.error })
			} else if (result?.success) {
				setFeedback({ type: "success", message: result.success })
			}
			setTimeout(() => setFeedback(null), 3000)
		})
	}

	return (
		<div>
			{/* Toolbar */}
			<div className="mb-6">
				<input
					type="text"
					placeholder="Search by name or email..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full max-w-md border border-border/50 rounded-lg px-4 py-2.5 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 transition-shadow bg-surface"
				/>
			</div>

			{/* Feedback toast */}
			{feedback && (
				<div
					className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-xs font-medium ${feedback.type === "error"
						? "bg-danger/5 border border-danger/20 text-danger"
						: "bg-teal/5 border border-teal/20 text-teal"
						}`}
				>
					{feedback.message}
				</div>
			)}

			{/* Table */}
			<div className="border border-border/40 rounded-2xl overflow-hidden shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/60 text-left">
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">User</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">Email</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">Role</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider">Joined</th>
								<th className="px-5 py-3 font-semibold text-navy/70 text-xs uppercase tracking-wider text-right">Change Role</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/20">
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-5 py-10 text-center text-navy/50 text-sm">
										No users found.
									</td>
								</tr>
							) : (
								filtered.map((user) => {
									const badge = roleBadge[user.role] || roleBadge.member
									const isCurrentUser = user.id === currentUserId
									const isChanging = changingId === user.id

									return (
										<tr
											key={user.id}
											className={`hover:bg-muted/30 transition-colors ${isChanging ? "opacity-50" : ""}`}
										>
											<td className="px-5 py-4">
												<div className="flex items-center gap-3">
													<span className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-semibold uppercase shrink-0">
														{user.firstname?.[0] || user.email?.[0] || "?"}
													</span>
													<div>
														<p className="font-medium text-navy">
															{user.firstname || user.lastname
																? `${user.firstname || ""} ${user.lastname || ""}`.trim()
																: "—"}
														</p>
														{isCurrentUser && (
															<span className="text-[10px] text-teal font-semibold">(You)</span>
														)}
													</div>
												</div>
											</td>
											<td className="px-5 py-4 text-navy/70">{user.email}</td>
											<td className="px-5 py-4">
												<span
													className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${badge}`}
												>
													{user.role}
												</span>
											</td>
											<td className="px-5 py-4 text-navy/50 text-xs">
												{user.created_at
													? new Date(user.created_at).toLocaleDateString("en-US", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})
													: "—"}
											</td>
											<td className="px-5 py-4 text-right">
												{isCurrentUser ? (
													<span className="text-xs text-navy/30">—</span>
												) : (
													<select
														value={user.role}
														disabled={isChanging}
														onChange={(e) => handleRoleChange(user.id, e.target.value)}
														className="rounded-lg border border-border/50 bg-surface px-2 py-1.5 text-xs text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40 cursor-pointer disabled:opacity-50"
													>
														{ROLES.map((r) => (
															<option key={r} value={r}>
																{r}
															</option>
														))}
													</select>
												)}
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			<div className="mt-4 text-xs text-navy/50 px-1">
				Showing {filtered.length} of {users.length} users
			</div>
		</div>
	)
}
