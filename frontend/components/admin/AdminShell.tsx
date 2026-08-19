"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import {
  isAdminLoggedIn,
  logoutAdmin,
} from "@/lib/api/auth";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({
  children,
}: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthorized, setIsAuthorized] =
    useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace("/admin/login");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  function handleLogout() {
    logoutAdmin();
    router.replace("/admin/login");
    router.refresh();
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-black/45">
          Checking admin access...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-black/10 bg-black text-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/admin/products"
              className="text-sm font-bold tracking-[0.08em]"
            >
              HONEYSTORE ADMIN
            </Link>

            <nav className="flex items-center gap-5">
              <Link
                href="/admin/products"
                className={
                  pathname.startsWith(
                    "/admin/products"
                  )
                    ? "text-xs font-semibold text-white"
                    : "text-xs text-white/55 transition hover:text-white"
                }
              >
                Products
              </Link>

              <Link
                href="/admin/orders"
                className={
                  pathname.startsWith(
                    "/admin/orders"
                  )
                    ? "text-xs font-semibold text-white"
                    : "text-xs text-white/55 transition hover:text-white"
                }
              >
                Orders
              </Link>

              <Link
                href="/"
                className="text-xs text-white/55 transition hover:text-white"
              >
                View Store
              </Link>
            </nav>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="border border-white/30 px-4 py-2 text-xs font-semibold transition hover:bg-white hover:text-black"
          >
            Sign Out
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}