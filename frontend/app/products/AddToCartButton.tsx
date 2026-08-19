"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/data/products";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  function handleAddToCart() {
    console.log("Added to cart:", product.name);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!product.inStock}
      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      <ShoppingCart size={18} />

      {product.inStock
        ? "Add to Cart"
        : "Out of Stock"}
    </button>
  );
}