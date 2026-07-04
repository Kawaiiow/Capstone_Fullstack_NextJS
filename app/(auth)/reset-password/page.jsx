import AuthPanel from "@/app/(auth)/_components/AuthPanel";
import ResetPasswordForm from "@/app/(auth)/_components/ResetPasswordForm";

export default function ResetPasswordPage() {
	return (
		<AuthPanel title="Reset Password">
			<ResetPasswordForm />
		</AuthPanel>
	);
}
