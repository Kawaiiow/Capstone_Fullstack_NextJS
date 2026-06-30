"use client"

export default function OAuthButton({ title, favicon, oauth })
{
	return (
		<button
		type="button"
			className="mt-3 flex space-x-2 justify-center w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
			onClick={oauth}
		>
			<p>Sign in with {title}</p>{favicon ? favicon : ""} 
		</button>
	);
}
