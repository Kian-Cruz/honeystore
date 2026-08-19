"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useState,
} from "react";
import { UserRound } from "lucide-react";

import {
  loginCustomer,
  registerCustomer,
} from "@/lib/api/customer-auth";

type FormMode = "login" | "register";

const inputClass =
  "h-12 w-full border border-black/20 bg-white px-4 text-sm outline-none transition focus:border-black";

export default function CustomerLoginPage() {
  const router = useRouter();

  const [mode, setMode] =
    useState<FormMode>("login");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const formData = new FormData(
      event.currentTarget
    );

    const email = String(
      formData.get("email") ?? ""
    ).trim();

    const password = String(
      formData.get("password") ?? ""
    );

    try {
      if (mode === "register") {
        const confirmPassword = String(
          formData.get("confirmPassword") ?? ""
        );

        if (password !== confirmPassword) {
          throw new Error(
            "Passwords do not match"
          );
        }

        await registerCustomer({
          name: String(
            formData.get("name") ?? ""
          ).trim(),
          email,
          password,
          phone:
            String(
              formData.get("phone") ?? ""
            ).trim() || undefined,
        });
      } else {
        await loginCustomer(email, password);
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to continue"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: FormMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="bg-[#f7f7f7] px-4 py-16 text-black">
      <section className="mx-auto w-full max-w-md bg-white p-7 shadow-sm sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f4f4]">
            <UserRound
              size={27}
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
            HONEYSTORE Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
            {mode === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            {mode === "login"
              ? "Sign in to access your customer account."
              : "Register to create your HONEYSTORE account."}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 border border-black/15">
          <button
            type="button"
            onClick={() => changeMode("login")}
            className={`h-11 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() =>
              changeMode("register")
            }
            className={`h-11 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Register
          </button>
        </div>

        <form
          key={mode}
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          {mode === "register" && (
            <>
              <FormField
                id="name"
                label="Full Name"
                autoComplete="name"
                placeholder="Your full name"
              />

              <FormField
                id="phone"
                label="Phone Number"
                type="tel"
                autoComplete="tel"
                placeholder="09xxxxxxxxx"
                required={false}
              />
            </>
          )}

          <FormField
            id="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete={
              mode === "login"
                ? "current-password"
                : "new-password"
            }
            placeholder="At least 8 characters"
            minLength={8}
          />

          {mode === "register" && (
            <FormField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter password again"
              minLength={8}
            />
          )}

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
            className="h-12 w-full bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-xs font-medium text-black/45 transition hover:text-black"
        >
          ← Return to store
        </Link>
      </section>
    </main>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
};

function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  placeholder,
  minLength,
  required = true,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        className={inputClass}
      />
    </div>
  );
}