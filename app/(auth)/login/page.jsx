import AuthPanel from "@/app/(auth)/_components/AuthPanel";
import LoginForm from "@/app/(auth)/_components/LoginForm";

export default async function LoginPage()
{	
	return (
		<AuthPanel title="Login">
			<LoginForm/>
		</AuthPanel>
	);
}
