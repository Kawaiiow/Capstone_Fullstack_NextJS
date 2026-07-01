import { createClient } from "@/utils/supabase/server";

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
		return redirect(`/register?error=${encodeURIComponent(error.message)}`);
	}
	
	if (data.url) {
		return redirect(data.url);
	}
}

export async function signOut()
{
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error)
		return console.log(error.message);
	redirect("/");
}
