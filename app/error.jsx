'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-danger/10 text-danger rounded-full p-6 mb-6 animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-navy mb-4">
        Oops! Something went wrong
      </h2>
      <p className="text-foreground/70 max-w-md mx-auto mb-8">
        We apologize for the inconvenience. An unexpected error has occurred on
        our end. Please try again or return to the friendly confines of the
        homepage.
      </p>
      
      {/* Show technical details only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-red-50 text-red-800 text-sm p-4 rounded-md mb-8 max-w-2xl text-left overflow-auto border border-red-200">
          <p className="font-mono break-all">{error.message || 'Unknown error'}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="px-6 py-3 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors shadow-sm cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-surface text-navy border border-border font-medium rounded-lg hover:bg-muted transition-colors shadow-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
