import { createClient } from "@/libs/supabase"
import { redirect } from "next/navigation"
import SettingsForm from "./_components/SettingsForm"

export default async function SettingsPage() {
	const supabase = await createClient()

	const { data: { user }, error } = await supabase.auth.getUser()

	if (error || !user) {
		redirect("/login")
	}

	const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
	const initialRole = profile?.role || user.user_metadata?.role || "member"

	return (
		<div className="max-w-4xl mx-auto px-6 py-10 bg-white">
			<p className="text-sm font-medium text-teal mb-1">Account Profile</p>
			<h1 className="font-sans text-3xl font-bold text-navy mb-8">Settings</h1>

			<SettingsForm initialUser={user} initialRole={initialRole} />
		</div>
	)
}
