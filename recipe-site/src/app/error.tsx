"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="text-6xl mb-6" aria-hidden>😵</div>
      <h1 className="font-outfit text-4xl font-black mb-3">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We hit an unexpected error. Try refreshing — if the issue continues, the recipe API may be unreachable.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-secondary text-foreground px-6 py-3 rounded-full font-bold hover:bg-secondary/80 transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
