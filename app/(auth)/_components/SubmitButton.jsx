"use client"

export default function SubmitButton({ title, isPending })
{
	return (
		<button
			type="submit"
			disabled={isPending}
			className="mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
		>
			{isPending ? 
			(
				<div className="flex justify-center items-center">
					<p>Processing</p>
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
				</div>
			) : title }
		</button>
	);
}
