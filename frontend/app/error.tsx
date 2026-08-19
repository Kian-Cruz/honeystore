"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Home,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-white text-black">
      <section className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl border border-black/10 bg-[#f7f7f7] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-black text-white">
            <TriangleAlert
              size={28}
              strokeWidth={1.6}
            />
          </div>

          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            HONEYSTORE
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Something went wrong
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-black/50">
            We could not complete your request. This may be
            a temporary connection problem. Please try
            again.
          </p>

          {error.digest && (
            <p className="mt-4 text-[11px] text-black/35">
              Error reference: {error.digest}
            </p>
          )}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 items-center justify-center gap-2 bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              <RefreshCw
                size={17}
                strokeWidth={1.7}
              />

              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 border border-black px-6 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              <Home
                size={17}
                strokeWidth={1.7}
              />

              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
