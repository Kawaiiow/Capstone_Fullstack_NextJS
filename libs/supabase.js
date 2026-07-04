import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Browser client (singleton)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createBrowserClient(supabaseUrl, supabaseKey)

export default supabase

// Server client (cookie-aware, call per-request)
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {

					}
				},
			},
		}
	);
}
