'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <div className="flex flex-col flex-1 items-center justify-center text-center py-12 px-6 bg-muted">
        <span className="text-xs bg-teal text-navy px-3 py-1 rounded-md mb-4 lowercase">
          404 error
        </span>
        <h1 className="text-3xl font-semibold text-navy max-w-md mb-3 lowercase">
          page not found
        </h1>
        <p className="text-base text-zinc-600 max-w-md mb-6 lowercase">
          we're sorry, but the page you are looking for doesn't exist. it might have been moved, deleted, or the url is incorrect.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="bg-navy text-white text-sm px-5 py-2.5 rounded font-medium lowercase cursor-pointer"
          >
            go back
          </button>
        </div>
      </div>
    </div>
  );
}
