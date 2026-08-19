import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api/products";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type CategoryMeta = {
  title: string;
  description: string;
  subcategories: {
    label: string;
    slug: string;
  }[];
};

const categoryMeta: Record<string, CategoryMeta> = {
  fashion: {
    title: "Clothing",
    description:
      "Shop everyday clothing essentials, comfortable basics, and easy-to-wear pieces.",
    subcategories: [
      { label: "T-Shirts", slug: "t-shirts" },
      { label: "Shirts", slug: "shirts" },
      { label: "Pants", slug: "pants" },
      { label: "Shorts", slug: "shorts" },
      { label: "Jackets", slug: "jackets" },
    ],
  },

  footwear: {
    title: "Footwear",
    description:
      "Browse comfortable everyday footwear, including Crocs styles and casual essentials.",
    subcategories: [
      { label: "Crocs", slug: "crocs" },
    ],
  },

  beauty: {
    title: "Beauty",
    description:
      "Explore skincare, makeup, body care, and hair care for your everyday routine.",
    subcategories: [
      { label: "Skincare", slug: "skincare" },
      { label: "Makeup", slug: "makeup" },
      { label: "Body Care", slug: "body-care" },
      { label: "Hair Care", slug: "hair-care" },
    ],
  },
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const meta = categoryMeta[slug];

  if (!meta) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">
          Category not found
        </h1>

        <p className="mt-3 text-sm text-black/50">
          This category is currently unavailable.
        </p>

        <Link
          href="/categories"
          className="mt-8 inline-flex h-12 items-center bg-black px-6 text-sm font-semibold text-white"
        >
          View Categories
        </Link>
      </main>
    );
  }

  const products = await getProducts();

  const categoryProducts = products.filter(
    (product) => product.category === slug
  );

  return (
    <main className="bg-white text-black">
      {/* Header */}
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="text-xs font-medium text-black/45 transition hover:text-black"
          >
            ← All Categories
          </Link>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                HONEYSTORE Category
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                {meta.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">
                {meta.description}
              </p>
            </div>

            <p className="text-sm text-black/45">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1
                ? "product"
                : "products"}
            </p>
          </div>
        </div>
      </section>

      {/* Subcategory navigation */}
      <section className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1440px] gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/categories/${slug}`}
            className="whitespace-nowrap border-b-2 border-black py-5 text-sm font-semibold"
          >
            All
          </Link>

          {meta.subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/categories/${slug}/${subcategory.slug}`}
              className="whitespace-nowrap border-b-2 border-transparent py-5 text-sm font-medium text-black/50 transition hover:border-black hover:text-black"
            >
              {subcategory.label}
            </Link>
          ))}
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
              Showing {categoryProducts.length} items
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
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {categoryProducts.map((product) => (
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
              Products for this category will appear here
              after they are added to HONEYSTORE.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}