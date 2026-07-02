"use server"

import { signInWithEmail } from "@/libs/authentication";
import { redirect } from "next/navigation";

export async function loginUser(prevState, formData)
{
	const email =  formData.get("email");
	const password = formData.get("password");
	const inputs = {email, password};

	if (!email || !password)
		return { error : "All field are required." , inputs};
	try {
		await signInWithEmail(formData);
		console.log("Login successfully:", inputs);
	} catch (error) {
		return { error: `Something went wrong. Please try again. ${error}`, inputs };
	}
	redirect("/");
}
