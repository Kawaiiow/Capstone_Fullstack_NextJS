"use server"

import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"

export async function updateBookingStatus(id, newStatus) {
	const supabase = await createClient()

	const { error } = await supabase
		.from("bookings")
		.update({ status: newStatus })
		.eq("id", id)

	if (error) {
		return { error: error.message }
	}

	revalidatePath("/staff/requests")
	revalidatePath("/staff/checkin")
	return { success: `Booking updated to ${newStatus}` }
}
