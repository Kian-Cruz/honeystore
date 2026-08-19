import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/lib/data/products";

type WishlistState = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
};

export const useWishlistStore =
  create<WishlistState>()(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product) => {
          const exists = get().items.some(
            (item) => item.id === product.id
          );

          if (exists) {
            return;
          }

          set((state) => ({
            items: [...state.items, product],
          }));
        },

        removeItem: (productId) => {
          set((state) => ({
            items: state.items.filter(
              (item) => item.id !== productId
            ),
          }));
        },

        toggleItem: (product) => {
          const exists = get().items.some(
            (item) => item.id === product.id
          );

          if (exists) {
            get().removeItem(product.id);
          } else {
            get().addItem(product);
          }
        },

        isWishlisted: (productId) => {
          return get().items.some(
            (item) => item.id === productId
          );
        },
      }),
      {
        name: "honeystore-wishlist",
      }
    )
  );