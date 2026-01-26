"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { API_URL } from "@/lib/api";

import { useCartStore } from "../../store/cartStore";

const parsePrice = (value: string) => {
  const cleaned = String(value).replace(/[^0-9.,-]/g, "");
  const normalized =
    cleaned.includes(",") && cleaned.includes(".")
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned.replace(",", ".");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
        0,
      ),
    [items],
  );

  const handleCheckout = async () => {
    if (isProcessing) {
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedEmail || !trimmedAddress) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (items.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const payload = {
        full_name: trimmedName,
        email: trimmedEmail,
        address: trimmedAddress,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`${API_URL}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao finalizar o pedido.");
      }

      clearCart();
      router.push("/checkout/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-12 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold">Delivery Details</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Complete the form to finish your purchase.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Email
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Address
              </label>
              <input
                type="text"
                placeholder="Street and number"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
              />
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {items.length === 0 && (
              <p className="text-sm text-zinc-400">Your cart is empty.</p>
            )}
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-zinc-300">
                  {item.product.price}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-zinc-800 pt-4 text-sm text-zinc-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>Total</span>
              <span>
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-18px_rgba(236,72,153,0.9)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Processing..." : "Pagar Agora"}
          </button>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      </section>
    </main>
  );
}
