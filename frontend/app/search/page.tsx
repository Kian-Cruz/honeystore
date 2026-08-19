"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/data/products";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
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
          "We could not load the products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
      return [];
    }

    return products.filter((product) => {
      const searchableValues = [
        product.name,
        product.brand,
        product.category,
        product.subcategory ?? "",
        product.description,
      ];

      return searchableValues.some((value) =>
        value.toLowerCase().includes(searchTerm)
      );
    });
  }, [products, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <main className="min-h-[70vh] bg-white text-black">
      {/* Header */}
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
            HONEYSTORE
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Search
          </h1>

          <p className="mt-4 text-sm leading-6 text-black/50">
            Search products by name, brand, category, or
            collection.
          </p>
        </div>
      </section>

      {/* Search form */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
          <div className="relative">
            <Search
              size={20}
              strokeWidth={1.7}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
            />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search HONEYSTORE products..."
              aria-label="Search products"
              autoFocus
              className="h-14 w-full border border-black/20 bg-white pl-12 pr-12 text-sm outline-none transition placeholder:text-black/35 focus:border-black"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center transition hover:bg-black/5"
              >
                <X
                  size={18}
                  strokeWidth={1.7}
                />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-black" />

            <p className="mt-4 text-sm text-black/45">
              Loading products...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center">
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

        {!loading && !error && !hasQuery && (
          <div className="py-20 text-center">
            <Search
              size={34}
              strokeWidth={1.4}
              className="mx-auto text-black/30"
            />

            <h2 className="mt-5 text-2xl font-bold">
              What are you looking for?
            </h2>

            <p className="mt-3 text-sm text-black/45">
              Enter a product name, brand, or category above.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          hasQuery &&
          filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold">
                No products found
              </h2>

              <p className="mt-3 text-sm text-black/45">
                We could not find anything matching
                &ldquo;{query.trim()}&rdquo;.
              </p>

              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-7 inline-flex h-11 items-center justify-center border border-black px-6 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                Clear Search
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <>
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-black/10 pb-5">
                <div>
                  <h2 className="text-2xl font-bold">
                    Search Results
                  </h2>

                  <p className="mt-1 text-sm text-black/45">
                    Results for &ldquo;{query.trim()}&rdquo;
                  </p>
                </div>

                <p className="shrink-0 text-sm text-black/45">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
      </section>
    </main>
  );
}