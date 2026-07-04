import Link from "next/link";
import { createClient } from "@/libs/supabase";
import { signOut } from "@/libs/authentication";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm px-4 py-2 bg-navy text-white font-medium rounded-full hover:bg-navy/90 transition-colors mr-2 flex items-center justify-center text-center"
            >
              Dashboard
            </Link>
            <details className="relative group">
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer text-sm px-4 py-2 border border-border text-navy rounded-4xl flex items-center gap-2 focus:outline-none select-none">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-border"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-xs font-semibold uppercase">
                    {(user.user_metadata?.firstname?.[0] || user.email?.[0] || "U")}
                  </span>
                )}
                <span>{user.user_metadata?.firstname || "Account"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-zinc-500 transition-transform group-open:rotate-180"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/settings"
                  className="block w-full text-left px-4 py-2 text-sm text-navy hover:bg-muted cursor-pointer font-medium transition-colors"
                >
                  settings
                </Link>
                <hr className="border-border my-1" />
                <form action={signOut} className="w-full">
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-muted cursor-pointer font-medium transition-colors"
                  >
                    sign out
                  </button>
                </form>
              </div>
            </details>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm px-4 py-2 border border-border text-navy rounded">
              log in
            </Link>
            <Link href="/register" className="text-sm px-4 py-2 bg-navy text-white rounded">
              sign up
            </Link>
          </>
        )}
      </div>
    </nav >
  );
}
