import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase";

export async function GET(request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// If a 'next' parameter is passed, redirect there, otherwise go to homepage
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = await createClient();

		// Exchange the temporary code for a secure session cookie
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// If something went wrong, send them back to registration with an error
	return NextResponse.redirect(`${origin}/register?error=OAuth authentication failed`);
}
