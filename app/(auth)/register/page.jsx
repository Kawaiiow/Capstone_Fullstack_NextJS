import AuthPanel from "@/app/(auth)/_components/AuthPanel";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

export default async function RegisterPage() {
	return (
		<AuthPanel title="Registeration">
			<RegisterForm />
		</AuthPanel>
	);
}
