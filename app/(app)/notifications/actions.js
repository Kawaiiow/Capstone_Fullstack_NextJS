"use server"

import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
	const supabase = await createClient()

	const { data: { user }, error: userError } = await supabase.auth.getUser()
	if (userError || !user) {
		return { success: false, error: "Unauthorized" }
	}

	const { data, error } = await supabase
		.from("notifications")
		.select("*")
		.order("created_at", { ascending: false })

	if (error) {
		console.error("Error fetching notifications:", error)
		return { success: false, error: error.message }
	}

	return { success: true, data }
}

export async function markAsRead(id) {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()
	
	if (!user) {
		return { success: false, error: "Unauthorized" }
	}

	const { error } = await supabase
		.from("notifications")
		.update({ is_read: true })
		.eq("id", id)
		.eq("user_id", user.id)

	if (error) {
		return { success: false, error: error.message }
	}

	revalidatePath("/notifications")
	return { success: true }
}

export async function markAllAsRead() {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()
	
	if (!user) {
		return { success: false, error: "Unauthorized" }
	}

	const { error } = await supabase
		.from("notifications")
		.update({ is_read: true })
		.eq("user_id", user.id)
		.eq("is_read", false)

	if (error) {
		return { success: false, error: error.message }
	}

	revalidatePath("/notifications")
	return { success: true }
}
