"use server"

import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"

export async function checkInGuest(id) {
	const supabase = await createClient()

	const { error } = await supabase
		.from("bookings")
		.update({ status: "checked_in" })
		.eq("id", id)

	if (error) {
		return { error: error.message }
	}

	revalidatePath("/staff/checkin")
	revalidatePath("/bookings")
	return { success: "Guest checked in successfully" }
}

export async function cancelBookingFromCheckIn(id) {
	const supabase = await createClient()

	const { error } = await supabase
		.from("bookings")
		.update({ status: "cancelled" })
		.eq("id", id)

	if (error) {
		return { error: error.message }
	}

	revalidatePath("/staff/checkin")
	revalidatePath("/bookings")
	return { success: "Reservation cancelled successfully" }
}

