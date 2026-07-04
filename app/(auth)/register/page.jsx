import AuthPanel from "@/app/(auth)/_components/AuthPanel";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

export default async function RegisterPage({ searchParams }) {
	const params = await searchParams;
	const error = params?.error;
	return (
		<AuthPanel title="Registeration">
			<RegisterForm error={error} />
		</AuthPanel>
	);
}
