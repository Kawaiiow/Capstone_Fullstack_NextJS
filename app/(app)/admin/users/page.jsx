import { createClient } from "@/libs/supabase"
import { createAdminClient } from "@/libs/adminClient"
import UserTable from "./_components/UserTable"

export default async function AdminUsersPage() {
	const supabase = await createClient()

	// Get current user for "You" indicator
	const {
		data: { user: currentUser },
	} = await supabase.auth.getUser()

	// Use admin client to list all users
	const adminSupabase = createAdminClient()
	const {
		data: { users: authUsers },
		error: usersError,
	} = await adminSupabase.auth.admin.listUsers()

	if (usersError) {
		return (
			<div className="p-10 text-danger">
				Error loading users: {usersError.message}
			</div>
		)
	}

	// Get all profiles
	const { data: profiles } = await adminSupabase
		.from("profiles")
		.select("id, role")

	const profileMap = {}
	for (const p of profiles || []) {
		profileMap[p.id] = p.role
	}

	// Merge auth users with profile roles
	const users = (authUsers || []).map((u) => ({
		id: u.id,
		email: u.email,
		firstname: u.user_metadata?.firstname || "",
		lastname: u.user_metadata?.lastname || "",
		role: profileMap[u.id] || "pending",
		created_at: u.created_at,
	}))

	return (
		<div className="max-w-6xl mx-auto px-6 py-10">
			<p className="text-sm font-medium text-teal mb-1">Admin</p>
			<h1 className="font-sans text-3xl font-bold text-navy mb-8">
				User Management
			</h1>

			<UserTable users={users} currentUserId={currentUser?.id} />
		</div>
	)
}
