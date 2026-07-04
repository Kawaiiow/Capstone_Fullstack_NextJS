"use server"

import { signUpWithEmail } from "@/libs/authentication";

export async function registerUser(prevState, formData) {
	const firstname = formData.get("firstname");
	const lastname = formData.get("lastname");
	const email = formData.get("email");
	const password = formData.get("password");
	const inputs = { firstname, lastname, email, password };

	if (!firstname || !lastname || !email || !password)
		return { error: "All field are required.", inputs };

	if (password.length < 8)
		return { error: "Password must be at least 8 characters long.", inputs };
	try {
		const res = await signUpWithEmail(formData);
		if (res?.error) {
			return { error: res.error, inputs };
		}
		console.log(firstname, lastname, "has been successfully registered with", email);
		return { success: "Account created successfully! Please check your email to verify your account." };
	} catch (error) {
		return { error: "Something went wrong. Please try again.", inputs };
	}
}
