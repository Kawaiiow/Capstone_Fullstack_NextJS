import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg text-navy">U U BOR</span>
      </div>

      <div className="flex gap-6 text-sm text-zinc-600">
        <span>features</span>
        <span>rooms</span>
        <span>contact</span>
      </div>

      <div className="flex gap-2">
        <Link href="/login" className="text-sm px-4 py-2 border border-border text-navy rounded">
          log in
        </Link>
        <Link href="/register" className="text-sm px-4 py-2 bg-navy text-white rounded">
          sign up
        </Link>
      </div>
    </nav>
  );
}
