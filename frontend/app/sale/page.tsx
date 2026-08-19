"use client";

import { useEffect, useMemo, useState } from "react";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/data/products";

type SortOption =
  | "discount"
  | "price-low"
  | "price-high"
  | "newest";

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] =
    useState<SortOption>("discount");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error(error);

        setError(
          "We could not load the sale products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const saleProducts = useMemo(() => {
    const productsOnSale = products.filter(
      (product) =>
        product.compareAtPrice !== undefined &&
        product.compareAtPrice !== null &&
        product.compareAtPrice > product.price
    );

    return [...productsOnSale].sort(
      (firstProduct, secondProduct) => {
        if (sortBy === "price-low") {
          return firstProduct.price - secondProduct.price;
        }

        if (sortBy === "price-high") {
          return secondProduct.price - firstProduct.price;
        }

        if (sortBy === "newest") {
          return Number(secondProduct.newArrival) -
            Number(firstProduct.newArrival);
        }

        const firstOriginalPrice =
          firstProduct.compareAtPrice ??
          firstProduct.price;

        const secondOriginalPrice =
          secondProduct.compareAtPrice ??
          secondProduct.price;

        const firstDiscount =
          ((firstOriginalPrice - firstProduct.price) /
            firstOriginalPrice) *
          100;

        const secondDiscount =
          ((secondOriginalPrice -
            secondProduct.price) /
            secondOriginalPrice) *
          100;

        return secondDiscount - firstDiscount;
      }
    );
  }, [products, sortBy]);

  return (
    <main className="min-h-[70vh] bg-white text-black">
      {/* Sale header */}
      <section className="border-b border-black/10 bg-[#d90000] text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            HONEYSTORE
          </p>

          <h1 className="mt-2 text-5xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
            Sale
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
            Discover selected fashion, footwear, and beauty
            products at reduced prices.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      {!loading && !error && saleProducts.length > 0 && (
        <section className="border-b border-black/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="text-sm text-black/45">
              {saleProducts.length}{" "}
              {saleProducts.length === 1
                ? "sale product"
                : "sale products"}
            </p>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as SortOption
                )
              }
              aria-label="Sort sale products"
              className="h-10 border border-black/20 bg-white px-4 text-sm outline-none transition focus:border-black"
            >
              <option value="discount">
                Biggest Discount
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="newest">
                Newest
              </option>
            </select>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="py-24 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-black" />

            <p className="mt-4 text-sm text-black/45">
              Loading sale products...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-bold">
              Something went wrong
            </h2>

            <p className="mt-3 text-sm text-black/50">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-7 inline-flex h-11 items-center justify-center bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          saleProducts.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d90000]">
                Sale
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                No sale products yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
                Products will appear here when their regular
                price is higher than their current price.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          saleProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {saleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}