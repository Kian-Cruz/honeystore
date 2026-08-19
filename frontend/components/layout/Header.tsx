"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  PackageSearch,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { getCurrentCustomer } from "@/lib/api/customer-auth";
import { useCartStore } from "@/stores/cartStore";

export default function Header() {
  const pathname = usePathname();

  const items = useCartStore(
    (state) => state.items
  );

  const [accountHref, setAccountHref] =
    useState("/login");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const customer = getCurrentCustomer();

    setAccountHref(
      customer ? "/account" : "/login"
    );

    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white text-black">
        {/* Announcement */}
        <div className="border-b border-black/10 bg-[#f5f5f5]">
          <div className="mx-auto flex max-w-[1440px] items-center justify-center px-4 py-2.5">
            <p className="text-center text-[10px] font-medium uppercase tracking-[0.18em] text-black/60">
              Authentic fashion, footwear & beauty —
              delivered to you
            </p>
          </div>
        </div>

        {/* Main header */}
        <div className="border-b border-black/10">
          <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="flex h-10 w-10 items-center justify-center transition hover:bg-black/5"
              >
                <Menu
                  size={21}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="text-[20px] font-black tracking-[-0.04em] sm:text-[26px]"
            >
              HONEY STORE
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-8 lg:flex">
              <NavigationLink href="/products">
                New Arrivals
              </NavigationLink>

              <NavigationLink href="/categories/fashion">
                Clothing
              </NavigationLink>

              <NavigationLink href="/categories/footwear">
                Footwear
              </NavigationLink>

              <NavigationLink href="/categories/beauty">
                Beauty
              </NavigationLink>

              <NavigationLink href="/brands">
                Brands
              </NavigationLink>

              <Link
                href="/sale"
                className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#d90000] transition hover:opacity-60"
              >
                Sale
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/search"
                aria-label="Search"
                title="Search"
                className="flex h-10 w-10 items-center justify-center transition hover:bg-black/5"
              >
                <Search
                  size={19}
                  strokeWidth={1.7}
                />
              </Link>

              <Link
                href="/wishlist"
                aria-label="Wishlist"
                title="Wishlist"
                className="hidden h-10 w-10 items-center justify-center transition hover:bg-black/5 sm:flex"
              >
                <Heart
                  size={19}
                  strokeWidth={1.7}
                />
              </Link>

              {/* Track order */}
              <Link
                href="/track-order"
                aria-label="Track order"
                title="Track order"
                className="hidden h-10 w-10 items-center justify-center transition hover:bg-black/5 sm:flex"
              >
                <PackageSearch
                  size={19}
                  strokeWidth={1.7}
                />
              </Link>

              <Link
                href={accountHref}
                aria-label={
                  accountHref === "/account"
                    ? "My account"
                    : "Sign in"
                }
                title={
                  accountHref === "/account"
                    ? "My account"
                    : "Sign in"
                }
                className="hidden h-10 w-10 items-center justify-center transition hover:bg-black/5 sm:flex"
              >
                <User
                  size={19}
                  strokeWidth={1.7}
                />
              </Link>

              <Link
                href="/cart"
                aria-label="Shopping bag"
                title="Shopping bag"
                className="relative flex h-10 w-10 items-center justify-center transition hover:bg-black/5"
              >
                <ShoppingBag
                  size={19}
                  strokeWidth={1.7}
                />

                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop secondary navigation */}
        <div className="hidden border-b border-black/10 lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center gap-7 overflow-x-auto px-8 py-3">
            <CategoryLink
              href="/categories/fashion/t-shirts"
              label="T-Shirts"
            />

            <CategoryLink
              href="/categories/fashion/shirts"
              label="Shirts"
            />

            <CategoryLink
              href="/categories/fashion/pants"
              label="Pants"
            />

            <CategoryLink
              href="/categories/fashion/dresses"
              label="Dresses"
            />

            <CategoryLink
              href="/categories/footwear/crocs"
              label="Crocs"
            />

            <CategoryLink
              href="/categories/beauty/skincare"
              label="Skincare"
            />

            <CategoryLink
              href="/categories/beauty/makeup"
              label="Makeup"
            />

            <CategoryLink
              href="/categories/beauty/body-care"
              label="Body Care"
            />
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Background overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/45"
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 flex h-full w-[88%] max-w-[390px] flex-col overflow-y-auto bg-white text-black shadow-2xl">
            {/* Drawer header */}
            <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-black/10 px-5">
              <Link
                href="/"
                className="text-[22px] font-black tracking-[-0.04em]"
              >
                HONEY STORE
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center transition hover:bg-black/5"
              >
                <X
                  size={22}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            {/* Main links */}
            <nav className="border-b border-black/10 px-5 py-4">
              <MobileMainLink href="/products">
                New Arrivals
              </MobileMainLink>

              <MobileMainLink href="/categories/fashion">
                Clothing
              </MobileMainLink>

              <MobileMainLink href="/categories/footwear">
                Footwear
              </MobileMainLink>

              <MobileMainLink href="/categories/beauty">
                Beauty
              </MobileMainLink>

              <MobileMainLink href="/brands">
                Brands
              </MobileMainLink>

              <Link
                href="/sale"
                className="flex min-h-12 items-center border-b border-black/10 text-sm font-semibold uppercase tracking-[0.08em] text-[#d90000]"
              >
                Sale
              </Link>
            </nav>

            {/* Collections */}
            <div className="border-b border-black/10 px-5 py-6">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                Shop Collections
              </p>

              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <MobileCategoryLink
                  href="/categories/fashion/t-shirts"
                  label="T-Shirts"
                />

                <MobileCategoryLink
                  href="/categories/fashion/shirts"
                  label="Shirts"
                />

                <MobileCategoryLink
                  href="/categories/fashion/pants"
                  label="Pants"
                />

                <MobileCategoryLink
                  href="/categories/fashion/dresses"
                  label="Dresses"
                />

                <MobileCategoryLink
                  href="/categories/footwear/crocs"
                  label="Crocs"
                />

                <MobileCategoryLink
                  href="/categories/beauty/skincare"
                  label="Skincare"
                />

                <MobileCategoryLink
                  href="/categories/beauty/makeup"
                  label="Makeup"
                />

                <MobileCategoryLink
                  href="/categories/beauty/body-care"
                  label="Body Care"
                />
              </div>
            </div>

            {/* Account and utility links */}
            <div className="mt-auto bg-[#f7f7f7] px-5 py-6">
              <Link
                href="/track-order"
                className="flex h-12 items-center gap-3 border-b border-black/10 text-sm font-semibold"
              >
                <PackageSearch
                  size={19}
                  strokeWidth={1.7}
                />

                Track Order
              </Link>

              <Link
                href={accountHref}
                className="flex h-12 items-center gap-3 border-b border-black/10 text-sm font-semibold"
              >
                <User
                  size={19}
                  strokeWidth={1.7}
                />

                {accountHref === "/account"
                  ? "My Account"
                  : "Sign In / Register"}
              </Link>

              <Link
                href="/wishlist"
                className="flex h-12 items-center gap-3 border-b border-black/10 text-sm font-semibold"
              >
                <Heart
                  size={19}
                  strokeWidth={1.7}
                />

                Wishlist
              </Link>

              <Link
                href="/cart"
                className="flex h-12 items-center justify-between text-sm font-semibold"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag
                    size={19}
                    strokeWidth={1.7}
                  />

                  Shopping Bag
                </span>

                {cartCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

type NavigationLinkProps = {
  href: string;
  children: React.ReactNode;
};

function NavigationLink({
  href,
  children,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className="text-[12px] font-semibold uppercase tracking-[0.08em] transition hover:opacity-50"
    >
      {children}
    </Link>
  );
}

type CategoryLinkProps = {
  href: string;
  label: string;
};

function CategoryLink({
  href,
  label,
}: CategoryLinkProps) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap text-[11px] text-black/60 transition hover:text-black"
    >
      {label}
    </Link>
  );
}

function MobileMainLink({
  href,
  children,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center border-b border-black/10 text-sm font-semibold uppercase tracking-[0.08em]"
    >
      {children}
    </Link>
  );
}

function MobileCategoryLink({
  href,
  label,
}: CategoryLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm text-black/60 transition hover:text-black"
    >
      {label}
    </Link>
  );
}