import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api/products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="bg-white text-black">
      {/* HEADER */}
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
            HONEYSTORE Collection
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                Shop All Products
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">
                Browse fashion, footwear, skincare, beauty
                products, and new arrivals from HONEYSTORE.
              </p>
            </div>

            <p className="text-sm text-black/45">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORY NAVIGATION */}
      <section className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1440px] gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="whitespace-nowrap border-b-2 border-black py-5 text-sm font-semibold"
          >
            All Products
          </Link>

          <Link
            href="/categories/fashion"
            className="whitespace-nowrap border-b-2 border-transparent py-5 text-sm font-medium text-black/50 transition hover:border-black hover:text-black"
          >
            Fashion
          </Link>

          <Link
            href="/categories/footwear"
            className="whitespace-nowrap border-b-2 border-transparent py-5 text-sm font-medium text-black/50 transition hover:border-black hover:text-black"
          >
            Footwear
          </Link>

          <Link
            href="/categories/beauty"
            className="whitespace-nowrap border-b-2 border-transparent py-5 text-sm font-medium text-black/50 transition hover:border-black hover:text-black"
          >
            Beauty
          </Link>
        </div>
      </section>

      {/* TOOLBAR */}
      <section className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <span className="text-sm font-medium">
              Products
            </span>

            <span className="text-black/20">|</span>

            <p className="text-sm text-black/45">
              Showing {products.length} items
            </p>
          </div>

          <select
            defaultValue="newest"
            aria-label="Sort products"
            className="h-10 border border-black/20 bg-white px-4 text-sm outline-none transition focus:border-black"
          >
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
            <option value="price-low">
              Price: Low to High
            </option>
            <option value="price-high">
              Price: High to Low
            </option>
          </select>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-bold">
              No products available
            </h2>

            <p className="mt-3 text-sm text-black/45">
              New HONEYSTORE products will appear here soon.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}