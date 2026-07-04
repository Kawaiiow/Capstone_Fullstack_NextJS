import AuthPanel from "@/app/(auth)/_components/AuthPanel";
import LoginForm from "@/app/(auth)/_components/LoginForm";

export default async function LoginPage({ searchParams })
{	
	const params = await searchParams;
	const error = params?.error;
	const success = params?.success;
	return (
		<AuthPanel title="Login">
			<LoginForm error={error} success={success} />
		</AuthPanel>
	);
}
