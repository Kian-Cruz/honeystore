import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api/products";

type SubcategoryPageProps = {
  params: Promise<{
    slug: string;
    subcategory: string;
  }>;
};

const categoryTitles: Record<string, string> = {
  fashion: "Clothing",
  footwear: "Footwear",
  beauty: "Beauty",
};

const subcategoryTitles: Record<string, string> = {
  "t-shirts": "T-Shirts",
  shirts: "Shirts",
  pants: "Pants",
  shorts: "Shorts",
  jackets: "Jackets",
  crocs: "Crocs",
  skincare: "Skincare",
  makeup: "Makeup",
  "body-care": "Body Care",
  "hair-care": "Hair Care",
};

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { slug, subcategory } = await params;

  const categoryTitle = categoryTitles[slug];
  const subcategoryTitle =
    subcategoryTitles[subcategory];

  if (!categoryTitle || !subcategoryTitle) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">
          Collection not found
        </h1>

        <p className="mt-3 text-sm text-black/50">
          This collection is currently unavailable.
        </p>

        <Link
          href="/categories"
          className="mt-8 inline-flex h-12 items-center bg-black px-6 text-sm font-semibold text-white"
        >
          Browse Categories
        </Link>
      </main>
    );
  }

  const products = await getProducts();

  const filteredProducts = products.filter(
    (product) =>
      product.category === slug &&
      product.subcategory === subcategory
  );

  return (
    <main className="bg-white text-black">
      {/* Breadcrumb */}
      <div className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-4 py-4 text-xs text-black/45 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="transition hover:text-black"
          >
            Categories
          </Link>

          <span>/</span>

          <Link
            href={`/categories/${slug}`}
            className="transition hover:text-black"
          >
            {categoryTitle}
          </Link>

          <span>/</span>

          <span className="text-black/70">
            {subcategoryTitle}
          </span>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
            {categoryTitle}
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                {subcategoryTitle}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">
                Browse HONEYSTORE&apos;s selected{" "}
                {subcategoryTitle.toLowerCase()} products.
              </p>
            </div>

            <p className="text-sm text-black/45">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </p>
          </div>
        </div>
      </section>

      {/* Category navigation */}
      <section className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1440px] gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/categories/${slug}`}
            className="whitespace-nowrap border-b-2 border-transparent py-5 text-sm font-medium text-black/50 transition hover:border-black hover:text-black"
          >
            All {categoryTitle}
          </Link>

          <span className="whitespace-nowrap border-b-2 border-black py-5 text-sm font-semibold">
            {subcategoryTitle}
          </span>
        </div>
      </section>

      {/* Toolbar */}
      <section className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <span className="text-sm font-medium">
              Products
            </span>

            <span className="text-black/20">|</span>

            <p className="text-sm text-black/45">
              Showing {filteredProducts.length} items
            </p>
          </div>

          <select
            defaultValue="featured"
            aria-label="Sort products"
            className="h-10 border border-black/20 bg-white px-4 text-sm outline-none transition focus:border-black"
          >
            <option value="featured">
              Featured
            </option>

            <option value="newest">Newest</option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>
          </select>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-bold">
              No products yet
            </h2>

            <p className="mt-3 text-sm text-black/45">
              Products for this collection will appear
              here after they are added to HONEYSTORE.
            </p>

            <Link
              href={`/categories/${slug}`}
              className="mt-7 inline-flex h-11 items-center border border-black px-5 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              View All {categoryTitle}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}