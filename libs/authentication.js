"use server"

import { createClient } from "@/libs/supabase";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signUpWithEmail(formData) {
	const supabase = await createClient();
	const firstname = formData.get("firstname");
	const lastname = formData.get("lastname");
	const email = formData.get("email");
	const password = formData.get("password");

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				firstname: firstname,
				lastname: lastname,
				role: "member",
			},
		},
	});

	if (error)
		return { error: error.message };
	if (data.user?.identities?.length === 0)
		return { error: "This email is already registered, Please sign in" };
	return { success: "Account created!" };
}

export async function signInWithEmail(formData) {
	const supabase = await createClient();
	const email = formData.get("email");
	const password = formData.get("password");

	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password,
	});

	if (error)
		return { error: error.message };

	return { success: "Login successfully" };
}

export async function signInWithOAuth(provider) {
	const supabase = await createClient();
	const headerList = await headers();
	const origin = headerList.get("origin");

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		const referer = headerList.get("referer");
		let redirectPath = "/login";
		if (referer) {
			try {
				redirectPath = new URL(referer).pathname;
			} catch (e) {
				// ignore
			}
		}
		return redirect(`${redirectPath}?error=${encodeURIComponent(error.message)}`);
	}

	if (data.url) {
		return redirect(data.url);
	}
}

export async function signOut() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error)
		return console.log(error.message);
	redirect("/");
}

export async function resetPasswordForEmail(formData) {
	const supabase = await createClient();
	const email = formData.get("email");
	const headerList = await headers();
	const origin = headerList.get("origin");

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?next=/reset-password`,
	});

	if (error)
		return { error: error.message };

	return { success: "Password reset instructions have been sent to your email" };
}

export async function updateUserPassword(formData) {
	const supabase = await createClient();
	const password = formData.get("password");

	const { error } = await supabase.auth.updateUser({
		password: password
	});

	if (error)
		return { error: error.message };

	return { success: "Password updated successfully!" };
}
