"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { useCartStore } from "../../../store/cartStore";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null;
  description?: string;
  slug?: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = useMemo(() => String(params?.slug ?? ""), [params]);
  const { addItem, toggleCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products/");
        if (!response.ok) {
          throw new Error("Failed to load product");
        }
        const data = (await response.json()) as Product[];
        const found =
          data.find((item) => item.slug === slug) ??
          data.find(
            (item) =>
              item.name?.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase(),
          ) ??
          null;
        if (isMounted) {
          setProduct(found);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unexpected error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      load();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-12 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full min-h-[360px] w-full object-cover md:min-h-[520px]"
            />
          ) : (
            <div className="flex h-full min-h-[360px] w-full items-center justify-center text-sm text-zinc-400 md:min-h-[520px]">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-6">
          {loading && <p className="text-zinc-400">Loading product...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && product && (
            <>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                {product.name}
              </h1>
              <p className="text-3xl font-semibold text-emerald-300">
                {product.price}
              </p>
              <p className="text-base leading-relaxed text-zinc-300">
                {product.description ||
                  "Premium materials, sleek finish, and a refined daily experience."}
              </p>
              <button
                type="button"
                onClick={() => {
                  addItem(product);
                  toggleCart();
                }}
                className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-18px_rgba(236,72,153,0.9)] transition hover:scale-[1.01]"
              >
                Adicionar ao Carrinho
              </button>
            </>
          )}

          {!loading && !error && !product && (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
              <p className="text-zinc-300">Product not found.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Check the URL and try again.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
