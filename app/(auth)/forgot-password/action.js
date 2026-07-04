"use server"

import { resetPasswordForEmail } from "@/libs/authentication";

export async function forgotPasswordUser(prevState, formData)
{
	const email = formData.get("email");
	const inputs = { email };

	if (!email)
		return { error: "Email is required.", inputs };
	
	try {
		const res = await resetPasswordForEmail(formData);
		if (res?.error) {
			return { error: res.error, inputs };
		}
		return { success: res.success, inputs };
	} catch (error) {
		return { error: `Something went wrong. Please try again. ${error}`, inputs };
	}
}
