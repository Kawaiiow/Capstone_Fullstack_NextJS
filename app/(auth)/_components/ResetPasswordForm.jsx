"use client";

import Form from "next/form";
import { useActionState } from "react";
import { resetPassword } from "@/app/(auth)/reset-password/action";
import SubmitButton from "./SubmitButton";

export default function ResetPasswordForm() {
	const [state, formAction, isPending] = useActionState(resetPassword, null);

	return (
		<Form action={formAction} className="space-y-4">
			<div>
				<label
					htmlFor="password"
					className="mb-1 block text-sm font-medium text-navy"
				>
					New Password
				</label>
				<input
					type="password"
					name="password"
					id="password"
					required
					defaultValue={state?.inputs?.password || ""}
					className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
					placeholder="••••••••"
				/>
			</div>
			
			<div>
				<label
					htmlFor="confirmPassword"
					className="mb-1 block text-sm font-medium text-navy"
				>
					Confirm New Password
				</label>
				<input
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					required
					defaultValue={state?.inputs?.confirmPassword || ""}
					className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
					placeholder="••••••••"
				/>
			</div>

			{state?.error && (
				<p className="text-sm text-danger">{state.error}</p>
			)}

			<SubmitButton title="Reset Password" isPending={isPending}/>
		</Form>
	);
}
