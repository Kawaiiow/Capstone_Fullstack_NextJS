import { createClient } from "@/libs/supabase"
import { createAdminClient } from "@/libs/adminClient"
import BookingChart from "./_components/BookingChart"
import TopRooms from "./_components/TopRooms"
import RecentActivity from "./_components/RecentActivity"

function StatCard({ label, value, accent, icon }) {
	return (
		<div className="rounded-2xl border border-border/40 bg-surface p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between">
				<p className="text-sm text-navy/60 font-medium">{label}</p>
				{icon && (
					<span className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center text-navy/40">
						{icon}
					</span>
				)}
			</div>
			<p className={`text-3xl font-bold ${accent ?? "text-navy"}`}>{value}</p>
		</div>
	)
}

export default async function AdminOverviewPage() {
	const supabase = await createClient()
	const adminSupabase = createAdminClient()

	// Fetch rooms
	const { data: rooms } = await supabase
		.from("rooms")
		.select("id, name, room_type, status")

	// Fetch member counts from profiles
	const { count: activeMembers } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.in("role", ["member", "staff", "admin"])

	const { count: awaitingApproval } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.eq("role", "pending")

	const totalRooms = rooms?.length || 0

	// Fetch monthly revenue
	const startOfMonth = new Date()
	startOfMonth.setDate(1)
	startOfMonth.setHours(0, 0, 0, 0)

	const { data: payments } = await adminSupabase
		.from("payments")
		.select("amount")
		.in("status", ["success", "paid", "completed"])
		.gte("created_at", startOfMonth.toISOString())

	const totalRevenue = (payments || []).reduce((sum, p) => sum + parseFloat(p.amount), 0)
	const monthlyRevenue = `฿${totalRevenue.toLocaleString()}`

	// Fetch weekly bookings for the chart
	const today = new Date()
	const day = today.getDay()
	const diffToMon = day === 0 ? -6 : 1 - day

	const monday = new Date(today)
	monday.setDate(today.getDate() + diffToMon)
	monday.setHours(0, 0, 0, 0)

	const nextMonday = new Date(monday)
	nextMonday.setDate(monday.getDate() + 7)

	const { data: weeklyBookingsData } = await adminSupabase
		.from("bookings")
		.select("start_time")
		.gte("start_time", monday.toISOString())
		.lt("start_time", nextMonday.toISOString())

	const weeklyBookings = [0, 0, 0, 0, 0, 0, 0] // Mon, Tue, Wed, Thu, Fri, Sat, Sun
	weeklyBookingsData?.forEach((b) => {
		const date = new Date(b.start_time)
		const d = date.getDay()
		const idx = d === 0 ? 6 : d - 1 // 0-6 corresponding to Mon-Sun
		weeklyBookings[idx]++
	})

	// Fetch top rooms by booking count
	const { data: allBookings } = await adminSupabase
		.from("bookings")
		.select("room_id, rooms(name, room_type)")

	const bookingCounts = {}
	allBookings?.forEach((b) => {
		if (!b.room_id || !b.rooms) return
		if (!bookingCounts[b.room_id]) {
			bookingCounts[b.room_id] = {
				name: b.rooms.name,
				type: b.rooms.room_type === "meeting_room" ? "Meeting Room" : "Desk",
				bookings: 0,
			}
		}
		bookingCounts[b.room_id].bookings++
	})

	const topRooms = Object.values(bookingCounts)
		.sort((a, b) => b.bookings - a.bookings)
		.slice(0, 3)

	// Fetch recent activities (user signups + bookings)
	const { data: { users: authUsers } } = await adminSupabase.auth.admin.listUsers()

	const userActivities = (authUsers || []).map((u) => {
		const firstname = u.user_metadata?.firstname || ""
		const lastname = u.user_metadata?.lastname || ""
		const name = firstname ? `${firstname} ${lastname}` : u.email
		return {
			type: "user",
			message: `New user registered: ${name}`,
			timestamp: new Date(u.created_at),
		}
	})

	const { data: bookingsList } = await adminSupabase
		.from("bookings")
		.select(`
			id,
			status,
			created_at,
			rooms(name),
			user_id
		`)
		.order("created_at", { ascending: false })
		.limit(20)

	const bookingActivities = (bookingsList || []).map((b) => {
		const userObj = authUsers?.find((u) => u.id === b.user_id)
		const firstname = userObj?.user_metadata?.firstname || ""
		const lastname = userObj?.user_metadata?.lastname || ""
		const name = firstname ? `${firstname} ${lastname}` : (userObj?.email || "Unknown User")

		if (b.status === "cancelled") {
			return {
				type: "cancel",
				message: `${b.rooms?.name || "Room"} cancelled by ${name}`,
				timestamp: new Date(b.created_at),
			}
		} else {
			return {
				type: "booking",
				message: `${b.rooms?.name || "Room"} booked by ${name}`,
				timestamp: new Date(b.created_at),
			}
		}
	})

	function getRelativeTime(date) {
		const now = new Date()
		const diffMs = now - date
		const diffSec = Math.floor(diffMs / 1000)
		const diffMin = Math.floor(diffSec / 60)
		const diffHr = Math.floor(diffMin / 60)
		const diffDays = Math.floor(diffHr / 24)

		if (diffSec < 60) return "Just now"
		if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
		if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
	}

	const recentActivities = [...userActivities, ...bookingActivities]
		.sort((a, b) => b.timestamp - a.timestamp)
		.slice(0, 10)
		.map((a) => ({
			type: a.type,
			message: a.message,
			time: getRelativeTime(a.timestamp),
		}))

	return (
		<div className="max-w-6xl mx-auto px-6 py-10">
			<p className="text-sm font-medium text-teal mb-1">Admin</p>
			<h1 className="font-sans text-3xl font-bold text-navy mb-8">Overview</h1>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<StatCard
					label="Total Rooms"
					value={totalRooms}
					icon={
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21" />
						</svg>
					}
				/>
				<StatCard
					label="Revenue (Month)"
					value={monthlyRevenue}
					accent="text-teal"
					icon={
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					}
				/>
				<StatCard
					label="Active Members"
					value={activeMembers || 0}
					icon={
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
						</svg>
					}
				/>
				<StatCard
					label="Awaiting Approval"
					value={awaitingApproval || 0}
					accent="text-warning"
					icon={
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					}
				/>
			</div>

			{/* Chart + Top Rooms */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				<div className="lg:col-span-2">
					<BookingChart data={weeklyBookings} />
				</div>
				<div>
					<TopRooms rooms={topRooms} />
				</div>
			</div>

			{/* Recent Activity */}
			<RecentActivity activities={recentActivities} />
		</div>
	)
}
