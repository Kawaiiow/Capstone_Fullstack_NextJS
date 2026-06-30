"use server"

import Link from "next/link";

export default async function Navbar({ children })
{
	return (
		<nav className="h-20 px-16 flex items-center justify-between w-full mx-auto absolute">
			<Link href="/">
				<h1 className="dark:text-amber-50 text-3xl font-semibold text-transparent bg-clip-text select-none">Home</h1>
			</Link>
			<ul className="flex gap-5">
				{children}
			</ul>
		</nav>
	);
}
