export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;

  price: number;
  compareAtPrice?: number;
  originalPrice?: number;

  category: "fashion" | "footwear" | "beauty";
  subcategory: string;
  brand: string;

  image: string;
  images: string[];

  sizes?: string[];
  colors?: string[];

  stock: number;
  inStock: boolean;

  featured: boolean;
  newArrival: boolean;

  rating: number;
  reviewCount: number;
};

export const products: Product[] = [
  // =========================================================
  // CLOTHING
  // =========================================================

  {
    id: "1",
    name: "AIRism Cotton Oversized T-Shirt",
    slug: "airism-cotton-oversized-t-shirt",
    description:
      "A clean oversized everyday T-shirt with a comfortable relaxed silhouette.",
    price: 590,
    originalPrice: 790,
    category: "fashion",
    subcategory: "t-shirts",
    brand: "Uniqlo",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Beige"],
    stock: 24,
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 128,
  },

  {
    id: "2",
    name: "Mini Short Sleeve T-Shirt",
    slug: "mini-short-sleeve-t-shirt",
    description:
      "A simple fitted short-sleeve T-shirt designed for everyday styling.",
    price: 490,
    category: "fashion",
    subcategory: "t-shirts",
    brand: "Uniqlo",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Black", "Grey"],
    stock: 18,
    inStock: true,
    featured: true,
    newArrival: true,
    rating: 4.7,
    reviewCount: 84,
  },

  {
    id: "3",
    name: "Oxford Long Sleeve Shirt",
    slug: "oxford-long-sleeve-shirt",
    description:
      "A versatile long-sleeve shirt with a clean finish for casual and smart outfits.",
    price: 990,
    category: "fashion",
    subcategory: "shirts",
    brand: "Uniqlo",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue"],
    stock: 15,
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 61,
  },

  {
    id: "4",
    name: "Wide Straight Jeans",
    slug: "wide-straight-jeans",
    description:
      "Relaxed straight-leg denim designed for comfortable everyday wear.",
    price: 1290,
    originalPrice: 1490,
    category: "fashion",
    subcategory: "pants",
    brand: "Uniqlo",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    ],
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Blue", "Dark Blue"],
    stock: 12,
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 96,
  },

  {
    id: "5",
    name: "Relaxed Chino Shorts",
    slug: "relaxed-chino-shorts",
    description:
      "Comfortable casual shorts with a simple silhouette for warm everyday wear.",
    price: 790,
    category: "fashion",
    subcategory: "shorts",
    brand: "Uniqlo",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Black", "Olive"],
    stock: 20,
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 43,
  },

  {
    id: "6",
    name: "Lightweight Utility Jacket",
    slug: "lightweight-utility-jacket",
    description:
      "A lightweight outer layer designed for easy everyday styling.",
    price: 1490,
    category: "fashion",
    subcategory: "jackets",
    brand: "Uniqlo",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive"],
    stock: 9,
    inStock: true,
    featured: true,
    newArrival: true,
    rating: 4.7,
    reviewCount: 52,
  },

  // =========================================================
  // CROCS / FOOTWEAR
  // =========================================================

  {
    id: "7",
    name: "Classic Clog",
    slug: "classic-clog",
    description:
      "Lightweight casual clogs with an easy slip-on design for everyday comfort.",
    price: 1890,
    category: "footwear",
    subcategory: "crocs",
    brand: "Crocs",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
    colors: ["White", "Black", "Bone"],
    stock: 30,
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.9,
    reviewCount: 211,
  },

  {
    id: "8",
    name: "Platform Clog",
    slug: "platform-clog",
    description:
      "A platform-style casual clog combining comfort with a more elevated silhouette.",
    price: 2290,
    category: "footwear",
    subcategory: "crocs",
    brand: "Crocs",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f",
    ],
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["White", "Black"],
    stock: 16,
    inStock: true,
    featured: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 74,
  },

  {
    id: "9",
    name: "Classic Slide",
    slug: "classic-slide",
    description:
      "Simple slip-on slides made for casual everyday comfort.",
    price: 1290,
    category: "footwear",
    subcategory: "crocs",
    brand: "Crocs",
    image:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1",
    images: [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1",
    ],
    sizes: ["37", "38", "39", "40", "41", "42"],
    colors: ["Black", "White"],
    stock: 22,
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 39,
  },

  // =========================================================
  // SKINCARE
  // =========================================================

  {
    id: "10",
    name: "Hydrating Facial Cleanser",
    slug: "hydrating-facial-cleanser",
    description:
      "A gentle daily cleanser designed to remove impurities while keeping skin comfortable.",
    price: 690,
    category: "beauty",
    subcategory: "skincare",
    brand: "Beauty Select",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
    ],
    stock: 35,
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 113,
  },

  {
  id: "11",
  name: "Daily Hydrating Serum",
  slug: "daily-hydrating-serum",
  description:
    "A lightweight facial serum made for a simple everyday skincare routine.",
  price: 890,
  category: "beauty",
  subcategory: "skincare",
  brand: "Beauty Select",
  image: "/products/anessa.jpg",
  images: [
    "/products/anessa.jpg",
  ],
  stock: 28,
  inStock: true,
  featured: true,
  newArrival: true,
  rating: 4.9,
  reviewCount: 147,
},
  {
    id: "12",
    name: "Daily Moisture Cream",
    slug: "daily-moisture-cream",
    description:
      "A simple moisturizing cream designed for everyday hydration and comfort.",
    price: 790,
    category: "beauty",
    subcategory: "skincare",
    brand: "Beauty Select",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
    ],
    stock: 19,
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 68,
  },

  // =========================================================
  // MAKEUP
  // =========================================================

  {
    id: "13",
    name: "Velvet Lip Tint",
    slug: "velvet-lip-tint",
    description:
      "A lightweight lip tint with a soft velvet finish for everyday makeup looks.",
    price: 490,
    category: "beauty",
    subcategory: "makeup",
    brand: "Beauty Select",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
    ],
    colors: ["Rose", "Coral", "Berry", "Nude"],
    stock: 42,
    inStock: true,
    featured: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 176,
  },

  {
    id: "14",
    name: "Natural Glow Cushion",
    slug: "natural-glow-cushion",
    description:
      "A lightweight complexion cushion designed for a fresh and natural-looking finish.",
    price: 990,
    category: "beauty",
    subcategory: "makeup",
    brand: "Beauty Select",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    ],
    colors: ["Light", "Natural", "Warm"],
    stock: 21,
    inStock: true,
    featured: true,
    newArrival: false,
    rating: 4.7,
    reviewCount: 93,
  },

  {
    id: "15",
    name: "Everyday Blush",
    slug: "everyday-blush",
    description:
      "A soft powder blush for adding natural-looking color to everyday makeup.",
    price: 590,
    category: "beauty",
    subcategory: "makeup",
    brand: "Beauty Select",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    ],
    colors: ["Peach", "Rose", "Pink"],
    stock: 26,
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 57,
  },

  // =========================================================
  // BODY / HAIR CARE
  // =========================================================

  {
    id: "16",
    name: "Daily Body Lotion",
    slug: "daily-body-lotion",
    description:
      "A lightweight body lotion for simple everyday moisturization.",
    price: 590,
    category: "beauty",
    subcategory: "body-care",
    brand: "Beauty Select",
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
    ],
    stock: 31,
    inStock: true,
    featured: false,
    newArrival: false,
    rating: 4.7,
    reviewCount: 81,
  },

  {
    id: "17",
    name: "Repair Hair Treatment",
    slug: "repair-hair-treatment",
    description:
      "An everyday hair treatment designed to leave hair feeling smooth and manageable.",
    price: 790,
    category: "beauty",
    subcategory: "hair-care",
    brand: "Beauty Select",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388",
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388",
    ],
    stock: 17,
    inStock: true,
    featured: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 49,
  },
];

// =========================================================
// HELPERS
// =========================================================

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: Product["category"]) {
  return products.filter((product) => product.category === category);
}

export function getProductsBySubcategory(subcategory: string) {
  return products.filter(
    (product) => product.subcategory === subcategory
  );
}

export function getProductsByBrand(brand: string) {
  return products.filter(
    (product) =>
      product.brand.toLowerCase() === brand.toLowerCase()
  );
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getNewArrivals() {
  return products.filter((product) => product.newArrival);
}