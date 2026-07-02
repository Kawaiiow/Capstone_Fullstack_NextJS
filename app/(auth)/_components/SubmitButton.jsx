"use client"

export default function SubmitButton({ title, isPending }) {
	return (
		<button
			type="submit"
			disabled={isPending}
			className="mt-3 w-full rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 disabled:opacity-50"
		>
			{isPending ?
				(
					<div className="flex justify-center items-center gap-2">
						<p>Processing</p>
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
					</div>
				) : title}
		</button>
	);
}
