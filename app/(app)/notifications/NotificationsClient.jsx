"use client"

import { useState, useTransition } from "react"
import { markAsRead, markAllAsRead } from "./actions"

export default function NotificationsClient({ initialNotifications }) {
	const [notifications, setNotifications] = useState(initialNotifications || [])
	const [isPending, startTransition] = useTransition()

	const handleMarkAsRead = async (id) => {
		// Optimistic update
		const updated = notifications.map((n) =>
			n.id === id ? { ...n, is_read: true } : n
		)
		setNotifications(updated)

		startTransition(async () => {
			const res = await markAsRead(id)
			if (!res.success) {
				// Revert on failure
				setNotifications(notifications)
			}
		})
	}

	const handleMarkAllAsRead = async () => {
		const updated = notifications.map((n) => ({ ...n, is_read: true }))
		setNotifications(updated)

		startTransition(async () => {
			const res = await markAllAsRead()
			if (!res.success) {
				setNotifications(notifications)
			}
		})
	}

	const unreadCount = notifications.filter((n) => !n.is_read).length

	if (notifications.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-navy/60 bg-white rounded-2xl shadow-sm border border-border/40">
				<div className="text-5xl mb-4 bg-muted w-20 h-20 rounded-full flex items-center justify-center relative">
					<span className="absolute">📬</span>
				</div>
				<h3 className="text-xl font-semibold text-navy">No notifications yet</h3>
				<p className="mt-2 text-center text-sm max-w-sm">When you get updates about your bookings or system activities, they'll show up here.</p>
			</div>
		)
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden">
			<div className="p-6 border-b border-border/40 flex justify-between items-center bg-gray-50/50">
				<div>
					<h2 className="text-lg font-semibold text-navy">Your Notifications</h2>
					<p className="text-sm text-navy/60 mt-1">You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
				</div>
				{unreadCount > 0 && (
					<button
						onClick={handleMarkAllAsRead}
						disabled={isPending}
						className="text-sm px-4 py-2 bg-teal/10 text-teal hover:bg-teal/20 transition-colors rounded-lg font-semibold"
					>
						Mark all as read
					</button>
				)}
			</div>
			<div className="divide-y divide-border/40">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`p-6 transition-colors hover:bg-gray-50/50 flex gap-4 ${!notification.is_read ? 'bg-sky-50/30' : ''}`}
					>
						<div className="mt-1">
							{notification.is_read ? (
								<div className="w-2.5 h-2.5 rounded-full bg-border/80"></div>
							) : (
								<div className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse"></div>
							)}
						</div>
						<div className="flex-1">
							<div className="flex justify-between items-start gap-4">
								<h3 className={`text-base flex-1 ${notification.is_read ? 'font-medium text-navy/80' : 'font-bold text-navy'}`}>
									{notification.title}
								</h3>
								<span suppressHydrationWarning className="text-xs text-navy/40 font-medium whitespace-nowrap">
									{new Date(notification.created_at).toLocaleDateString(undefined, {
										month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
									})}
								</span>
							</div>
							<p className={`mt-2 text-sm leading-relaxed ${notification.is_read ? 'text-navy/60' : 'text-navy/80'}`}>
								{notification.message}
							</p>
							{!notification.is_read && (
								<button
									onClick={() => handleMarkAsRead(notification.id)}
									disabled={isPending}
									className="mt-4 text-xs font-semibold text-teal hover:text-teal/80 transition-colors"
								>
									Mark as read
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
