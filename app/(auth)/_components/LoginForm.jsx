"use client";

import Form from "next/form";
import { useActionState } from "react";
import { loginUser } from "@/app/(auth)/login/action";
import { GoogleIcon, GithubIcon } from "@/components/icons/Icons";
import { signInWithOAuth } from "@/libs/authentication";

import SubmitButton from "./SubmitButton";
import OAuthButton from "./OAuthButton";

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(loginUser, null);

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
			<div>
				<label
					htmlFor="password"
					className="mb-1 block text-sm font-medium text-navy"
				>
					Password
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

			{state?.error && (
				<p className="text-sm text-danger">{state.error}</p>
			)}
			{state?.success && (
				<p className="text-sm text-teal">{state.success}</p>
			)}

			<SubmitButton title="Login" isPending={isPending}/>
			<OAuthButton title={"Google"}
				favicon={<GoogleIcon/>}
				oauth={signInWithOAuth.bind(null, "google")} 
			/>
			<OAuthButton title={"Github"}
				favicon={<GithubIcon/>}
				oauth={signInWithOAuth.bind(null, "github")}
			/>
		</Form>
	);
}
