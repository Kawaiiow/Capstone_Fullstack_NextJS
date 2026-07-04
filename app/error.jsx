'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <div className="flex flex-col flex-1 items-center justify-center text-center py-12 px-6 bg-muted">
        <span className="text-xs bg-danger text-white px-3 py-1 rounded-md mb-4 lowercase">
          unexpected error
        </span>
        <h1 className="text-3xl font-semibold text-navy max-w-md mb-3 lowercase">
          something went wrong
        </h1>
        <p className="text-base text-zinc-600 max-w-md mb-6 lowercase">
          we apologize for the inconvenience. an unexpected error has occurred on our end. please try again or return home.
        </p>
        
        {/* Show technical details only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 text-red-800 text-xs p-4 rounded-md mb-6 max-w-2xl text-left overflow-auto border border-red-200 w-full mb-6 max-h-[30vh]">
            <p className="font-mono break-all">{error.message || 'unknown error'}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="bg-navy text-white text-sm px-5 py-2.5 rounded font-medium cursor-pointer lowercase"
          >
            try again
          </button>
          <button
            onClick={() => router.back()}
            className="border border-navy text-navy text-sm px-5 py-2.5 rounded hover:bg-zinc-100 transition-colors lowercase cursor-pointer"
          >
            go back
          </button>
        </div>
      </div>
    </div>
  );
}
