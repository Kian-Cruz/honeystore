"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <main className="bg-white text-black">
        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-8">

          <div className="mx-auto flex min-h-[520px] max-w-xl flex-col items-center justify-center text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f4f4]">
              <ShoppingBag
                size={32}
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
              Shopping Bag
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em]">
              Your bag is empty
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-black/50">
              You haven&apos;t added any products yet.
              Browse clothing, Crocs, skincare, makeup, and more.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center bg-black px-7 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Start Shopping
            </Link>

          </div>

        </section>
      </main>
    );
  }

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="bg-white text-black">

      {/* HEADER */}
      <section className="border-b border-black/10 bg-[#f7f7f7]">

        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-medium text-black/45 transition hover:text-black"
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                Shopping Bag
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                Your Cart
              </h1>

              <p className="mt-3 text-sm text-black/50">
                Review your items before checkout.
              </p>

            </div>

            <p className="text-sm text-black/45">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>

          </div>

        </div>

      </section>


      {/* CART CONTENT */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1fr_390px] lg:items-start">

          {/* ITEMS */}
          <div>

            <div className="border-b border-black/10 pb-4">

              <div className="hidden grid-cols-[1fr_auto] text-xs font-semibold uppercase tracking-[0.1em] text-black/40 sm:grid">

                <span>
                  Product
                </span>

                <span>
                  Total
                </span>

              </div>

            </div>

            <div>

              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                />
              ))}

            </div>

            <div className="mt-8 flex justify-between">

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
              >
                <ArrowLeft size={15} />
                Continue Shopping
              </Link>

            </div>

          </div>


          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-[150px]">

            <CartSummary />

          </aside>

        </div>

      </section>

    </main>
  );
}