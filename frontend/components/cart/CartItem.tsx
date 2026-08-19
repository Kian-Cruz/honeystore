"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { formatPrice } from "@/lib/utils/currency";
import type { CartItem as CartItemType } from "@/stores/cartStore";
import { useCartStore } from "@/stores/cartStore";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({
  item,
}: CartItemProps) {
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <article className="border-b border-black/10 py-6">
      <div className="grid gap-5 sm:grid-cols-[150px_1fr]">
        {/* Product image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f4]"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-300 hover:scale-[1.02]"
            sizes="150px"
          />
        </Link>

        {/* Product details */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/40">
                {product.brand}
              </p>

              <Link
                href={`/products/${product.slug}`}
                className="mt-1 block"
              >
                <h2 className="text-base font-semibold leading-6 transition hover:underline">
                  {product.name}
                </h2>
              </Link>

              <p className="mt-2 text-xs capitalize text-black/45">
                {product.subcategory
                  ? product.subcategory.replaceAll("-", " ")
                  : product.category}
              </p>
            </div>

            {/* MMK price */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold">
                {formatPrice(itemTotal)}
              </p>

              {quantity > 1 && (
                <p className="mt-1 text-[11px] text-black/40">
                  {formatPrice(product.price)} each
                </p>
              )}
            </div>
          </div>

          {/* Product options */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-black/45">
            {product.colors &&
              product.colors.length > 0 && (
                <span>
                  Color: {product.colors[0]}
                </span>
              )}

            {product.sizes && product.sizes.length > 0 && (
              <span>
                Size: {product.sizes[0]}
              </span>
            )}

            <span>Stock: {product.stock}</span>
          </div>

          {/* Quantity and remove */}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/40">
                Quantity
              </p>

              <div className="flex h-10 items-center border border-black/20">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      product.id,
                      quantity - 1
                    )
                  }
                  disabled={quantity <= 1}
                  className="flex h-full w-10 items-center justify-center transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={1.7} />
                </button>

                <span className="flex w-10 items-center justify-center text-sm font-medium">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      product.id,
                      quantity + 1
                    )
                  }
                  disabled={quantity >= product.stock}
                  className="flex h-full w-10 items-center justify-center transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} strokeWidth={1.7} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeItem(product.id)}
              className="inline-flex items-center gap-2 text-xs font-medium text-black/45 transition hover:text-[#d90000]"
            >
              <Trash2 size={15} strokeWidth={1.6} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}