"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { API_URL } from "@/lib/api";

import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

// --- CORREÇÃO IMPORTANTE AQUI ---
// Isso impede o Next.js de tentar acessar o banco durante o Build (que é o que está dando erro)
export const dynamic = "force-dynamic"; 

interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null;
  category_name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_URL}/api/products/`),
          fetch(`${API_URL}/api/categories/`),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Falha ao carregar produtos");
        }

        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json(),
        ]);

        if (isMounted) {
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erro inesperado");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-20">
        <Hero />
      </div>

      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-12">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Destaques da Semana
            </h2>
          </div>

          {loading && <p className="text-zinc-400">Carregando produtos...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-10 text-center">
          <h3 className="text-3xl font-semibold">Colecao Completa</h3>
          <p className="mt-3 text-sm text-zinc-400">
            Explore todas as pecas selecionadas para esta temporada.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-18px_rgba(236,72,153,0.9)] transition hover:scale-[1.01]"
          >
            Ver colecao
          </Link>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Navegue por Categoria
            </h2>
          </div>

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {categories.slice(0, 3).map((category) => (
                <Link
                  key={category.id}
                  href={`/search?category=${category.slug}`}
                  className="group rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8 transition hover:border-white/40"
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                    Categoria
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Descubra pecas premium e exclusivas.
                  </p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-white/80 transition group-hover:text-white">
                    {"Explorar ->"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}