import type { Product } from "@/lib/data/products";

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: Product["category"];
  subcategory: string | null;
  brand: string;
  image: string;
  images: string[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
};

function normalizeImagePath(path: string): string {
  const normalized = path
    .trim()
    .replaceAll("\\", "/");

  if (
    normalized.startsWith("/") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }

  return `/${normalized}`;
}

function normalizeProduct(
  product: ApiProduct
): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compareAtPrice:
      product.compareAtPrice ?? undefined,
    category: product.category,
    subcategory: product.subcategory ?? "",
    brand: product.brand,
    image: normalizeImagePath(product.image),
    images: product.images.map(
      normalizeImagePath
    ),
    stock: product.stock,
    inStock: product.stock > 0,
    featured: product.featured,
    newArrival: product.newArrival,
    rating: 0,
    reviewCount: 0,
    sizes: [],
    colors: [],
  };
}

export async function getProducts(): Promise<
  Product[]
> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api";

  const response = await fetch(
    `${apiUrl}/products`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const products: ApiProduct[] =
    await response.json();

  return products.map(normalizeProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api";

  const response = await fetch(
    `${apiUrl}/products/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  const product: ApiProduct =
    await response.json();

  return normalizeProduct(product);
}