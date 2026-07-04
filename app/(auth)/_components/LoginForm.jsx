"use client";

import Link from "next/link";
import Form from "next/form";
import { useActionState } from "react";
import { loginUser } from "@/app/(auth)/login/action";
import { GoogleIcon, GithubIcon } from "@/components/icons/Icons";
import { signInWithOAuth } from "@/libs/authentication";

import SubmitButton from "./SubmitButton";
import OAuthButton from "./OAuthButton";

export default function LoginForm({ error, success }) {
	const [state, formAction, isPending] = useActionState(loginUser, null);
	const displayError = state?.error || error;
	const displaySuccess = state?.success || success;

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
					className="mb-1 flex justify-between text-sm font-medium text-navy"
				>
					<span>Password</span>
					<Link href="/forgot-password" className="text-sm font-medium text-teal hover:underline" tabIndex={-1}>
						Forgot Password?
					</Link>
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

			{displayError && (
				<p className="text-sm text-danger">{displayError}</p>
			)}
			{displaySuccess && (
				<p className="text-sm text-teal">{displaySuccess}</p>
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
			<div className="mt-6 text-center text-sm text-zinc-600">
				Don&apos;t have an account?{" "}
				<Link href="/register" className="font-medium text-teal hover:underline">
					Sign up
				</Link>
			</div>
		</Form>
	);
}
