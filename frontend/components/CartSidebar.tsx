"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { useCartStore } from "../store/cartStore";

const parsePrice = (value: string) => {
  const cleaned = String(value).replace(/[^0-9.,-]/g, "");
  const normalized =
    cleaned.includes(",") && cleaned.includes(".")
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned.replace(",", ".");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function CartSidebar() {
  const { items, isOpen, addItem, removeItem, toggleCart } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="cart-sidebar"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.35 }}
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
            <button
              type="button"
              onClick={toggleCart}
              className="text-sm font-semibold text-zinc-400 transition hover:text-white"
              aria-label="Close cart"
            >
              X
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {items.length === 0 && (
              <p className="text-sm text-zinc-400">Your cart is empty.</p>
            )}

            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 border-b border-zinc-800 pb-4"
              >
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-800">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-zinc-400">{item.product.price}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="h-7 w-7 rounded-full border border-zinc-700 text-sm text-white transition hover:border-white/70"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center text-sm text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => addItem(item.product)}
                      className="h-7 w-7 rounded-full border border-zinc-700 text-sm text-white transition hover:border-white/70"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm text-zinc-300">
              <span>Total</span>
              <span className="text-base font-semibold text-white">
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_20px_40px_-18px_rgba(236,72,153,0.9)] transition hover:scale-[1.01]"
            >
              Finalizar Compra
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
