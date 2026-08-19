import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Truck,
} from "lucide-react";

import AddToCartButton from "@/components/product/AddToCartButton";
import { getProductBySlug } from "@/lib/api/products";
import { formatPrice } from "@/lib/utils/currency";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">
          Product not found
        </h1>

        <p className="mt-3 text-sm text-black/50">
          This product is currently unavailable.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center bg-black px-6 text-sm font-semibold text-white"
        >
          Back to Shop
        </Link>
      </main>
    );
  }

  const discount =
    product.compareAtPrice &&
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) /
            product.compareAtPrice) *
            100
        )
      : null;

  const subcategory = product.subcategory
    ? product.subcategory.replaceAll("-", " ")
    : "General";

  return (
    <main className="bg-white text-black">
      {/* Breadcrumb */}
      <div className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-4 text-xs text-black/45 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="flex items-center gap-2 transition hover:text-black"
          >
            <ArrowLeft size={14} />
            Shop
          </Link>

          <span>/</span>

          <span className="capitalize">
            {product.category}
          </span>

          <span>/</span>

          <span className="truncate text-black/70">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main product area */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          {/* Product image */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f4]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.newArrival && (
                  <span className="bg-black px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                    New
                  </span>
                )}

                {discount && (
                  <span className="bg-[#d90000] px-3 py-1.5 text-[9px] font-semibold text-white">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product information */}
          <div className="lg:py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">
              {product.brand}
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              {product.reviewCount > 0 ? (
                <>
                  <span>★ {product.rating}</span>

                  <span className="text-black/25">|</span>

                  <span className="text-black/45">
                    {product.reviewCount} reviews
                  </span>
                </>
              ) : (
                <span className="text-black/45">
                  No reviews yet
                </span>
              )}
            </div>

            {/* MMK price */}
            <div className="mt-7 flex flex-wrap items-end gap-3">
              <span className="text-2xl font-bold">
                {formatPrice(product.price)}
              </span>

              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="pb-0.5 text-sm text-black/35 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}

              {discount && (
                <span className="pb-0.5 text-xs font-semibold text-[#d90000]">
                  SAVE {discount}%
                </span>
              )}
            </div>

            <p className="mt-7 max-w-xl text-sm leading-7 text-black/60">
              {product.description}
            </p>

            <div className="my-8 border-t border-black/10" />

            {/* Colors */}
            {product.colors &&
              product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Color
                    </p>

                    <p className="text-xs text-black/40">
                      Select a color
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="min-w-[74px] border border-black/20 px-4 py-2.5 text-xs transition hover:border-black"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    Size
                  </p>

                  <button
                    type="button"
                    className="text-xs text-black/45 underline underline-offset-4"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className="flex min-w-[50px] items-center justify-center border border-black/20 px-4 py-2.5 text-xs transition hover:border-black"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="mt-7">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  In stock — {product.stock} available
                </div>
              ) : (
                <div className="text-xs font-medium text-[#d90000]">
                  Currently sold out
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <AddToCartButton product={product} />

              <button
                type="button"
                aria-label="Add to wishlist"
                className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/20 transition hover:border-black"
              >
                <Heart size={19} strokeWidth={1.6} />
              </button>
            </div>

            {/* Service information */}
            <div className="mt-8 border-t border-black/10">
              <div className="flex gap-4 border-b border-black/10 py-5">
                <Truck
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Delivery
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/45">
                    Delivery fees and estimated arrival will
                    be calculated during checkout.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border-b border-black/10 py-5">
                <ShieldCheck
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Secure ordering
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/45">
                    Your order and payment information will
                    be handled securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product details */}
      <section className="border-t border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
              Product Information
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Details
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-black/55">
              {product.description}
            </p>
          </div>

          <div className="border-t border-black/10">
            <DetailRow
              label="Brand"
              value={product.brand}
            />

            <DetailRow
              label="Category"
              value={product.category}
              capitalize
            />

            <DetailRow
              label="Type"
              value={subcategory}
              capitalize
            />

            <DetailRow
              label="Availability"
              value={
                product.inStock
                  ? `${product.stock} in stock`
                  : "Sold out"
              }
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-black/10">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
            Reviews
          </p>

          {product.reviewCount > 0 ? (
            <div className="mt-4 flex items-end gap-4">
              <p className="text-4xl font-bold">
                {product.rating}
              </p>

              <div className="pb-1">
                <p className="text-sm">★★★★★</p>

                <p className="mt-1 text-xs text-black/45">
                  Based on {product.reviewCount} reviews
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-black/45">
              This product has no reviews yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  capitalize?: boolean;
};

function DetailRow({
  label,
  value,
  capitalize = false,
}: DetailRowProps) {
  return (
    <div className="flex justify-between gap-6 border-b border-black/10 py-4 text-sm">
      <span className="text-black/45">{label}</span>

      <span
        className={`text-right font-medium ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}