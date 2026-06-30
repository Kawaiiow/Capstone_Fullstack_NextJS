import Link from "next/link";

export default function NavButton({ title, target })
{
	return (
		<li className="font-medium">
			<Link href={target}>
				{title}
			</Link>
		</li>
	);
}
