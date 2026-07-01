"use client";

import Form from "next/form";
import { useActionState } from "react";
import { registerUser } from "@/app/(auth)/register/action";
import { redirect } from "next/navigation";
import { GoogleIcon, GithubIcon } from "@/components/icons/Icons";

import SubmitButton from "./SubmitButton";
import OAuthButton from "./OAuthButton";
import { signInWithOAuth } from "../../../libs/authentication";

export default function RegisterForm() {
	const [state, formAction, isPending] = useActionState(registerUser, null);

	return (
		<div>
			<Form action={formAction} className="space-y-4">
				<div>
					<label
						htmlFor="firstname"
						className="mb-1 block text-sm font-medium text-amber-50"
					>
						Firstname
					</label>
					<input
						type="text"
						name="firstname"
						id="firstname"
						required
						defaultValue={state?.inputs?.firstname || ""}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="John"
					/>
				</div>
				<div>
					<label
						htmlFor="lastname"
						className="mb-1 block text-sm font-medium text-amber-50"
					>
						Lastname
					</label>
					<input
						type="text"
						name="lastname"
						id="lastname"
						required
						defaultValue={state?.inputs?.surname || ""}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="Doe"
					/>
				</div>
				<div>
					<label
						htmlFor="email"
						className="mb-1 block text-sm font-medium text-amber-50"
					>
						Email
					</label>
					<input
						type="email"
						name="email"
						id="email"
						required
						defaultValue={state?.inputs?.email || ""}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="John.Doe@example.com"
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="mb-1 block text-sm font-medium text-amber-50"
					>
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						required
						defaultValue={state?.inputs?.password || ""}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="••••••••"
					/>
				</div>

				{state?.error && (
					<p className="text-center text-sm text-red-600">{state.error}</p>
				)}
				{state?.success && (
					<p className="text-center text-sm text-green-600">{state.success}</p>
				)}

				<SubmitButton title={"Register"} isPending={isPending}/>
				<OAuthButton title={"Google"}
					favicon={<GoogleIcon/>}
					oauth={signInWithOAuth.bind(null, "google")}
				/>
				<OAuthButton title={"Github"}
					favicon={<GithubIcon/>}
					oauth={signInWithOAuth.bind(null, "github")}
				/>
			</Form>
		</div>
	);
}
