"use server"

import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"

export async function createRoom(prevState, formData) {
	const name = formData.get("name")?.trim()
	const room_type = formData.get("room_type")
	const capacity = parseInt(formData.get("capacity"), 10)
	const status = formData.get("status")
	const selectedAmenities = formData.getAll("amenities")

	if (!name || !room_type || !capacity) {
		return { error: "All fields are required." }
	}

	const supabase = await createClient()

	// Insert room row and select the created ID
	const { data: room, error } = await supabase
		.from("rooms")
		.insert({
			name,
			room_type,
			capacity,
			status: status || "available",
		})
		.select("id")
		.single()

	if (error) return { error: error.message }

	// Insert associated amenities
	if (selectedAmenities.length > 0) {
		const relations = selectedAmenities.map((amenityId) => ({
			room_id: room.id,
			amenity_id: amenityId,
		}))
		const { error: relError } = await supabase
			.from("room_amenities")
			.insert(relations)

		if (relError) {
			return { error: `Room created but amenities failed: ${relError.message}` }
		}
	}

	revalidatePath("/admin/rooms")
	return { success: "Room created successfully!" }
}

export async function updateRoom(prevState, formData) {
	const id = formData.get("id")
	const name = formData.get("name")?.trim()
	const room_type = formData.get("room_type")
	const capacity = parseInt(formData.get("capacity"), 10)
	const status = formData.get("status")
	const selectedAmenities = formData.getAll("amenities")

	if (!id || !name || !room_type || !capacity) {
		return { error: "All fields are required." }
	}

	const supabase = await createClient()

	// Update room details
	const { error } = await supabase
		.from("rooms")
		.update({ name, room_type, capacity, status })
		.eq("id", id)

	if (error) return { error: error.message }

	// Sync amenities (delete old relations first)
	const { error: deleteError } = await supabase
		.from("room_amenities")
		.delete()
		.eq("room_id", id)

	if (deleteError) {
		return { error: `Details saved but failed to update old amenities: ${deleteError.message}` }
	}

	// Insert new relations
	if (selectedAmenities.length > 0) {
		const relations = selectedAmenities.map((amenityId) => ({
			room_id: id,
			amenity_id: amenityId,
		}))
		const { error: relError } = await supabase
			.from("room_amenities")
			.insert(relations)

		if (relError) {
			return { error: `Details saved but failed to add new amenities: ${relError.message}` }
		}
	}

	revalidatePath("/admin/rooms")
	return { success: "Room updated successfully!" }
}


export async function deleteRoom(id) {
	const supabase = await createClient()

	const { error } = await supabase.from("rooms").delete().eq("id", id)

	if (error) return { error: error.message }

	revalidatePath("/admin/rooms")
	return { success: "Room deleted successfully!" }
}
