
export async function loginUser(prevState, formData)
{
	const email =  formData.get("email");
	const password = formData.get("password");
	const inputs = {email, password};

	// await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: Remove this in production

	if (!email || !password)
		return { error : "All field are required." , inputs};
	if (email == "error")
		return { error : "Email is invalid." , inputs};
	try {
		console.log("Login:", inputs);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		return { success: "Login successfully!" };
	} catch (error) {
		return { error: "Something went wrong. Please try again.", inputs};
	}
}
