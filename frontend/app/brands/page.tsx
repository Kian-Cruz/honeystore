"use client";

import { useEffect, useMemo, useState } from "react";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/data/products";

export default function BrandsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] =
    useState<string>("All");
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
          "We could not load the brands. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const brands = useMemo(() => {
    const brandNames = products
      .map((product) => product.brand.trim())
      .filter(Boolean);

    return Array.from(new Set(brandNames)).sort(
      (firstBrand, secondBrand) =>
        firstBrand.localeCompare(secondBrand)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedBrand === "All") {
      return products;
    }

    return products.filter(
      (product) => product.brand === selectedBrand
    );
  }, [products, selectedBrand]);

  return (
    <main className="min-h-[70vh] bg-white text-black">
      {/* Header */}
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
            HONEYSTORE
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Shop by Brand
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">
            Explore authentic fashion, footwear, and beauty
            products from the brands available at HONEYSTORE.
          </p>
        </div>
      </section>

      {/* Brand navigation */}
      {!loading && !error && brands.length > 0 && (
        <section className="border-b border-black/10">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 overflow-x-auto py-6">
              <button
                type="button"
                onClick={() => setSelectedBrand("All")}
                className={`h-10 shrink-0 border px-5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                  selectedBrand === "All"
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-white text-black hover:border-black"
                }`}
              >
                All Brands
              </button>

              {brands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() =>
                    setSelectedBrand(brand)
                  }
                  className={`h-10 shrink-0 border px-5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                    selectedBrand === brand
                      ? "border-black bg-black text-white"
                      : "border-black/20 bg-white text-black hover:border-black"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="py-24 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-black" />

            <p className="mt-4 text-sm text-black/45">
              Loading brands...
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
          products.length === 0 && (
            <div className="py-24 text-center">
              <h2 className="text-2xl font-bold">
                No brands available
              </h2>

              <p className="mt-3 text-sm text-black/45">
                Brands will appear here after products are
                added.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <>
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-black/10 pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                    Brand
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {selectedBrand === "All"
                      ? "All Brands"
                      : selectedBrand}
                  </h2>
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