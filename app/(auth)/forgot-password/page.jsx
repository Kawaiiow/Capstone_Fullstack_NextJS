import AuthPanel from "@/app/(auth)/_components/AuthPanel";
import ForgotPasswordForm from "@/app/(auth)/_components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
	return (
		<AuthPanel title="Forgot Password">
			<ForgotPasswordForm />
		</AuthPanel>
	);
}
