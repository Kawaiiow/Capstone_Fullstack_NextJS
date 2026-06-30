
export async function registerUser(prevState, formData)
{
	const firstname = formData.get("firstname"); 
	const surname =  formData.get("surname");
	const email =  formData.get("email");
	const password = formData.get("password");
	const inputs = {firstname, surname, email, password};

	// await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: Remove this in production

	if (!firstname || !surname || !email || !password)
		return { error : "All field are required." , inputs};
	if (email == "error")
		return { error : "Email is invalid." , inputs};
	try {
		console.log("Registering:", { firstname, surname, email, password });

		await new Promise((resolve) => setTimeout(resolve, 1000));

		return { success: "Account created successfully!" };
	} catch (error) {
		return { error: "Something went wrong. Please try again.", inputs};
	}
}
