"use client"

export default function OAuthButton({ title, favicon, oauth }) {
	return (
		<button
			type="button"
			className="mt-3 flex items-center justify-center gap-2 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-navy transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
			onClick={oauth}
		>
			{favicon ? favicon : null}
			<span>Sign in with {title}</span>
		</button>
	);
}
