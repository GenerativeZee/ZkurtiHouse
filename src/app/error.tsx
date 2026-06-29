"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-6xl font-serif text-brand-charcoal">Oops</h1>
          <p className="text-lg text-brand-charcoal/60">Something went wrong</p>
          <p className="text-sm text-brand-charcoal/40">{error.message || "An unexpected error occurred."}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary px-8 py-3"
          >
            Try Again
          </button>
          <Link href="/" className="btn-outline px-8 py-3">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
