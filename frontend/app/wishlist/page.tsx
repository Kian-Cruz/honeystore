"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingBag,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import ProductCard from "@/components/product/ProductCard";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function WishlistPage() {
  const items = useWishlistStore(
    (state) => state.items
  );

  const [hasMounted, setHasMounted] =
    useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <main className="flex min-h-[600px] items-center justify-center">
        <p className="text-sm text-black/45">
          Loading wishlist...
        </p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="bg-white text-black">
        <section className="mx-auto flex min-h-[650px] max-w-xl flex-col items-center justify-center px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f4f4]">
            <Heart
              size={32}
              strokeWidth={1.5}
            />
          </div>

          <h1 className="mt-7 text-4xl font-bold tracking-[-0.03em]">
            Your wishlist is empty
          </h1>

          <p className="mt-4 text-sm leading-7 text-black/50">
            Save products you like by selecting the
            heart button.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex h-12 items-center gap-2 bg-black px-7 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            <ShoppingBag size={16} />
            Browse Products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
            Saved Products
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                Wishlist
              </h1>

              <p className="mt-3 text-sm text-black/50">
                Products you saved for later.
              </p>
            </div>

            <p className="text-sm text-black/45">
              {items.length}{" "}
              {items.length === 1
                ? "product"
                : "products"}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>
    </main>
  );
}