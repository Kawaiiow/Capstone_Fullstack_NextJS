"use server"

import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"

export async function updateBookingStatus(id, newStatus) {
	const supabase = await createClient()

	const { data: booking, error } = await supabase
		.from("bookings")
		.update({ status: newStatus })
		.eq("id", id)
		.select("user_id, rooms(name)")
		.single()

	if (error) {
		return { error: error.message }
	}

	if (booking?.user_id) {
		const roomName = booking.rooms?.name || "the room"
		let title = "Booking Updated"
		let message = `Your booking for ${roomName} has been updated to ${newStatus}.`

		if (newStatus === "confirmed") {
			title = "Booking Approved"
			message = `Great news! Your booking for ${roomName} has been approved.`
		} else if (newStatus === "cancelled" || newStatus === "denied") {
			title = "Booking Cancelled"
			message = `Your booking for ${roomName} was cancelled or denied.`
		}

		await supabase.from("notifications").insert({
			user_id: booking.user_id,
			title,
			message
		})
	}

	revalidatePath("/staff/requests")
	revalidatePath("/staff/checkin")
	return { success: `Booking updated to ${newStatus}` }
}
