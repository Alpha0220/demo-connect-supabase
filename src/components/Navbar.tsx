import Link from "next/link";

function HomeIcon() {
	return (
		<svg
			className="h-5 w-5 text-sky-600"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3 10.75 12 4l9 6.75M5.25 9V19a.75.75 0 0 0 .75.75h3.75V14.5h4.5v5.25H18a.75.75 0 0 0 .75-.75V9"
			/>
		</svg>
	);
}

const links = [
	{ href: "/employees", label: "View Employees" },
	{ href: "/employees/new", label: "Add Employee" },
];

export function Navbar() {
	return (
		<header className="sticky top-0 z-40 border-b border-sky-100/70 bg-white/80 backdrop-blur-sm">
			<nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
				<Link href="/" className="flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 transition hover:bg-sky-100">
					<HomeIcon />
					<span className="text-sm font-medium text-sky-700">Back to Home</span>
				</Link>
				<ul className="flex items-center gap-3 text-sm font-medium text-slate-600">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className="rounded-full px-3 py-1.5 transition hover:bg-sky-100 hover:text-sky-700"
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}


