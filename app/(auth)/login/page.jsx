import AuthPanel from "@/app/(auth)/_components/AuthPanel";
import LoginForm from "@/app/(auth)/_components/LoginForm";

export default async function LoginPage({ searchParams })
{	
	const params = await searchParams;
	const error = params?.error;
	return (
		<AuthPanel title="Login">
			<LoginForm error={error}/>
		</AuthPanel>
	);
}
