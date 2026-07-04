import { createClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase client with the service_role key.
 * Use ONLY in server actions for admin operations.
 * Never expose this client to the browser.
 */
export function createAdminClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}
	)
}
