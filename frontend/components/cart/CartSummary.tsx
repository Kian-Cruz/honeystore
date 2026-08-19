"use client";

import Link from "next/link";

import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/stores/cartStore";

const FREE_SHIPPING_THRESHOLD = 200000;
const STANDARD_SHIPPING_FEE = 5000;

export default function CartSummary() {
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const qualifiesForFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD;

  const shipping =
    subtotal === 0 || qualifiesForFreeShipping
      ? 0
      : STANDARD_SHIPPING_FEE;

  const total = subtotal + shipping;

  const amountUntilFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - subtotal,
    0
  );

  return (
    <div className="border border-black/10 bg-[#f7f7f7] p-6 sm:p-7">
      <h2 className="text-xl font-bold tracking-[-0.02em]">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between gap-5 text-sm">
          <span className="text-black/50">
            Subtotal
          </span>

          <span className="font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between gap-5 text-sm">
          <span className="text-black/50">
            Shipping
          </span>

          <span className="font-medium">
            {shipping === 0
              ? "Free"
              : formatPrice(shipping)}
          </span>
        </div>

        {/* Total */}
        <div className="border-t border-black/10 pt-4">
          <div className="flex items-center justify-between gap-5">
            <span className="text-sm font-semibold">
              Total
            </span>

            <span className="text-xl font-bold">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping message */}
      <div className="mt-5 bg-white px-4 py-3">
        {qualifiesForFreeShipping ? (
          <p className="text-xs leading-5 text-black/55">
            You qualify for free shipping.
          </p>
        ) : (
          <p className="text-xs leading-5 text-black/55">
            Spend another{" "}
            <span className="font-semibold text-black">
              {formatPrice(amountUntilFreeShipping)}
            </span>{" "}
            to receive free shipping.
          </p>
        )}
      </div>

      {/* Checkout */}
      <Link
        href="/checkout"
        className="mt-6 flex h-12 items-center justify-center bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
      >
        Proceed to Checkout
      </Link>

      <p className="mt-4 text-center text-[11px] leading-5 text-black/40">
        Shipping fees and payment details will be confirmed
        during checkout.
      </p>
    </div>
  );
}