"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import type { Product } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/currency";
import { useWishlistStore } from "@/stores/wishlistStore";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const toggleItem = useWishlistStore(
    (state) => state.toggleItem
  );

  const isWishlisted = useWishlistStore(
    (state) =>
      state.items.some(
        (item) => item.id === product.id
      )
  );

  const discount =
    product.compareAtPrice &&
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice -
            product.price) /
            product.compareAtPrice) *
            100
        )
      : null;

  return (
    <article className="group">
      <div className="relative">
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f4]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.newArrival && (
            <span className="bg-black px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
              New
            </span>
          )}

          {discount && (
            <span className="bg-[#d90000] px-2.5 py-1 text-[9px] font-semibold text-white">
              -{discount}%
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          onClick={() => toggleItem(product)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/90 transition hover:bg-white ${
            isWishlisted
              ? "text-[#d90000]"
              : "text-black"
          }`}
        >
          <Heart
            size={18}
            strokeWidth={1.6}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-black/45">
              {product.brand}
            </p>

            <Link
              href={`/products/${product.slug}`}
            >
              <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-black transition group-hover:underline">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-black">
            {formatPrice(product.price)}
          </span>

          {product.compareAtPrice && (
            <span className="text-xs text-black/35 line-through">
              {formatPrice(
                product.compareAtPrice
              )}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-black/45">
            ★ {product.rating} (
            {product.reviewCount})
          </p>

          {!product.inStock && (
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#d90000]">
              Sold out
            </span>
          )}
        </div>
      </div>
    </article>
  );
}