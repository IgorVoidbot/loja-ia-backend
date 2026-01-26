"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  image: string | null;
  description?: string;
  slug?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id,
        );

        if (existingIndex >= 0) {
          const nextItems = [...currentItems];
          const existing = nextItems[existingIndex];
          nextItems[existingIndex] = {
            ...existing,
            quantity: existing.quantity + 1,
          };
          set({ items: nextItems });
          return;
        }

        set({
          items: [...currentItems, { product, quantity: 1 }],
        });
      },
      removeItem: (productId) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === productId,
        );

        if (existingIndex < 0) {
          return;
        }

        const existing = currentItems[existingIndex];
        if (existing.quantity <= 1) {
          set({
            items: currentItems.filter((item) => item.product.id !== productId),
          });
          return;
        }

        const nextItems = [...currentItems];
        nextItems[existingIndex] = {
          ...existing,
          quantity: existing.quantity - 1,
        };
        set({ items: nextItems });
      },
      clearCart: () => {
        set({ items: [] });
      },
      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },
    }),
    {
      name: "loja-ia-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
