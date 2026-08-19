"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useState,
} from "react";

import { loginAdmin } from "@/lib/api/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);

      router.replace("/admin/products");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f7f7] px-4 py-16">
      <div className="w-full max-w-md bg-white p-7 shadow-sm sm:p-10">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
            HONEYSTORE
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em]">
            Admin Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Sign in to manage your store products.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className="h-12 w-full border border-black/20 px-4 text-sm outline-none transition focus:border-black"
              placeholder="admin@honeystore.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              className="h-12 w-full border border-black/20 px-4 text-sm outline-none transition focus:border-black"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-xs font-medium text-black/45 transition hover:text-black"
        >
          ← Return to store
        </Link>
      </div>
    </main>
  );
}