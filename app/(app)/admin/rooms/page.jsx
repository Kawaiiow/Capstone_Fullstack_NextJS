import { createClient } from "@/libs/supabase"
import RoomTable from "./_components/RoomTable"

export default async function AdminRoomsPage() {
	const supabase = await createClient()

	const [roomsRes, amenitiesRes] = await Promise.all([
		supabase
			.from("rooms")
			.select(`
				id, name, room_type, capacity, status,
				room_amenities(amenity_id)
			`)
			.order("name"),
		supabase
			.from("amenities")
			.select("id, name")
			.order("name")
	])

	if (roomsRes.error) {
		return <div className="p-10 text-danger">Error: {roomsRes.error.message}</div>
	}
	if (amenitiesRes.error) {
		return <div className="p-10 text-danger">Error: {amenitiesRes.error.message}</div>
	}

	return (
		<div className="max-w-6xl mx-auto px-6 py-10">
			<p className="text-sm font-medium text-teal mb-1">Admin</p>
			<h1 className="font-sans text-3xl font-bold text-navy mb-8">
				Room Management
			</h1>

			<RoomTable
				rooms={roomsRes.data || []}
				amenities={amenitiesRes.data || []}
			/>
		</div>
	)
}

