import Link from "next/link";

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Phones, gadgets, accessories, and more.",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, bags, and accessories.",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, cosmetics, and beauty essentials.",
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Everyday products for modern living.",
  },
];

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Browse
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Categories
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Browse products by category and find what you're looking for.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="rounded-2xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {category.name}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {category.description}
            </p>

            <p className="mt-6 text-sm font-semibold text-gray-900">
              Explore products →
            </p>
          </Link>
        ))}
      </div>

    </main>
  );
}