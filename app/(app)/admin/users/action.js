"use server"

import { createAdminClient } from "@/libs/adminClient"
import { createClient } from "@/libs/supabase"
import { revalidatePath } from "next/cache"

const VALID_ROLES = ["pending", "member", "staff", "admin"]

export async function updateUserRole(prevState, formData) {
	const userId = formData.get("userId")
	const newRole = formData.get("role")

	if (!userId || !newRole) {
		return { error: "User ID and role are required." }
	}

	if (!VALID_ROLES.includes(newRole)) {
		return { error: "Invalid role specified." }
	}

	// Verify the current user is admin
	const supabase = await createClient()
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { error: "You must be logged in." }
	}

	const { data: adminProfile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single()

	if (!adminProfile || adminProfile.role !== "admin") {
		return { error: "Insufficient permissions." }
	}

	// Prevent admin from changing their own role
	if (userId === user.id) {
		return { error: "You cannot change your own role." }
	}

	// Update role in profiles table using admin client
	const adminSupabase = createAdminClient()

	const { error } = await adminSupabase
		.from("profiles")
		.update({ role: newRole })
		.eq("id", userId)

	if (error) return { error: error.message }

	revalidatePath("/admin/users")
	return { success: `Role updated to ${newRole} successfully!` }
}
