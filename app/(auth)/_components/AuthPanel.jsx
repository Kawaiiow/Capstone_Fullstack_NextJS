
export default async function AuthPanel({ title, children }) {
	return (
		<div className="flex flex-col flex-1 items-center justify-center bg-muted font-sans">
			<div className="w-full max-w-md px-10 py-10 rounded-2xl bg-surface border border-border shadow-sm">
				<h2 className="mb-6 text-center text-3xl font-semibold text-navy">{title}</h2>
				{children}
			</div>
		</div>
	);
}
