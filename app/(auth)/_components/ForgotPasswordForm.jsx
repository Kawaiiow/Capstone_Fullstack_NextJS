"use client";

import Link from "next/link";
import Form from "next/form";
import { useActionState } from "react";
import { forgotPasswordUser } from "@/app/(auth)/forgot-password/action";
import SubmitButton from "./SubmitButton";

export default function ForgotPasswordForm() {
	const [state, formAction, isPending] = useActionState(forgotPasswordUser, null);

	return (
		<Form action={formAction} className="space-y-4">
			<div>
				<label
					htmlFor="email"
					className="mb-1 block text-sm font-medium text-navy"
				>
					Email
				</label>
				<input
					type="email"
					name="email"
					id="email"
					required
					defaultValue={state?.inputs?.email || ""}
					className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-zinc-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
					placeholder="John.Doe@example.com"
				/>
			</div>

			{state?.error && (
				<p className="text-sm text-danger">{state.error}</p>
			)}
			{state?.success && (
				<p className="text-sm text-teal">{state.success}</p>
			)}

			<SubmitButton title="Send Reset Link" isPending={isPending}/>
			
			<div className="mt-4 text-center text-sm text-zinc-600">
				Remember your password?{" "}
				<Link href="/login" className="font-medium text-teal hover:underline">
					Back to login
				</Link>
			</div>
		</Form>
	);
}
