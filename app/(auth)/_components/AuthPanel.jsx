
export default async function	AuthPanel({ title, children })
{
	return (
		<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<div className="px-16 py-14 rounded-2xl bg-stone-100 dark:bg-gray-900">
				<h2 className="mb-3 text-center text-4xl font-semibold">{title}</h2>
				<hr className="mb-3"/>
				{children}
			</div>
		</div>
	);
}
