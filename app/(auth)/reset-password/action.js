"use server"

import { updateUserPassword } from "@/libs/authentication";
import { redirect } from "next/navigation";

export async function resetPassword(prevState, formData)
{
	const password = formData.get("password");
	const confirmPassword = formData.get("confirmPassword");
	const inputs = { password, confirmPassword };

	if (!password || !confirmPassword)
		return { error: "All fields are required.", inputs };
	
	if (password !== confirmPassword) {
		return { error: "Passwords do not match.", inputs };
	}
	
	if (password.length < 6) {
		return { error: "Password must be at least 6 characters long.", inputs };
	}

	try {
		const res = await updateUserPassword(formData);
		if (res?.error) {
			return { error: res.error, inputs };
		}
	} catch (error) {
		return { error: `Something went wrong. Please try again. ${error}`, inputs };
	}
	redirect("/login?success=Password updated successfully. Please login with your new password.");
}
