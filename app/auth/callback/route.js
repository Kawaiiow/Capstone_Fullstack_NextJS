import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase";

import { getURL } from "@/libs/authentication";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const origin = getURL();
	const code = searchParams.get("code");
	// If a 'next' parameter is passed, redirect there, otherwise go to homepage
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = await createClient();

		// Exchange the temporary code for a secure session cookie
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			const user = data?.user;
			if (user && !user.user_metadata?.firstname) {
				const fullName =
					user.user_metadata?.full_name || user.user_metadata?.name || "Unknown";
				const nameParts = fullName.trim().split(" ");
				const firstname = nameParts[0] || "Unknown";
				const lastname = nameParts.slice(1).join(" ") || "Unknown";

				await supabase.auth.updateUser({
					data: {
						firstname,
						lastname,
						role: "member",
					},
				});
			}

			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// If something went wrong, send them back to registration with an error
	return NextResponse.redirect(`${origin}/register?error=OAuth authentication failed`);
}
