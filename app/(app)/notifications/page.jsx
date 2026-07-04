import { getNotifications } from "./actions"
import NotificationsClient from "./NotificationsClient"

export const metadata = {
	title: "Notifications | U U BOR",
}

export default async function NotificationsPage() {
	const res = await getNotifications()

	const notifications = res.success ? res.data : []

	return (
		<div className="max-w-4xl mx-auto w-full p-4 md:p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold font-sans text-navy">Notifications</h1>
				<p className="text-navy/60 mt-2">Stay updated on your booking status and system announcements.</p>
			</div>

			{!res.success && typeof res.error === 'string' && (
				<div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-200 text-sm font-medium">
					Error fetching notifications: {res.error}
					<div className="text-rose-500 mt-1">Make sure you have run the database migration.</div>
				</div>
			)}

			<NotificationsClient initialNotifications={notifications} />
		</div>
	)
}
