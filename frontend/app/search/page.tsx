"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";

import ProductCard from "../../components/ProductCard";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null;
  slug: string;
  category?: ProductCategory | null;
  category_slug?: string;
  category_name?: string;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const categoriesResponse = await fetch(
          "http://127.0.0.1:8000/api/categories/",
        );

        if (!categoriesResponse.ok) {
          throw new Error("Falha ao carregar categorias");
        }

        const categoriesData = await categoriesResponse.json();

        if (isMounted) {
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

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (queryParam.trim()) {
          params.set("search", queryParam.trim());
        }
        if (categoryParam !== "all") {
          params.set("category", categoryParam);
        }

        const url =
          params.toString().length > 0
            ? `http://127.0.0.1:8000/api/products/?${params.toString()}`
            : "http://127.0.0.1:8000/api/products/";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao carregar produtos");
        }
        const data = await response.json();
        if (isMounted) {
          setProducts(data);
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

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [queryParam, categoryParam]);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    if (queryParam) {
      params.set("q", queryParam);
    }

    const next = params.toString();
    router.push(next ? `/search?${next}` : "/search");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 pt-12 md:flex-row">
        <aside className="w-full md:w-64 md:shrink-0">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 md:sticky md:top-24">
            <h2 className="text-lg font-semibold text-white">Filtros</h2>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Categorias
              </p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={categoryParam === "all"}
                    onChange={() => handleCategoryChange("all")}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-fuchsia-500"
                  />
                  Todas
                </label>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <input
                      type="checkbox"
                      checked={categoryParam === category.slug}
                      onChange={() => handleCategoryChange(category.slug)}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-fuchsia-500"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {(queryParam || categoryParam !== "all") && (
              <button
                type="button"
                onClick={() => router.push("/search")}
                className="mt-6 w-full rounded-full border border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:border-white/70 hover:text-white"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Colecao</h1>
              <p className="mt-2 text-sm text-zinc-400">
                {products.length} produto(s) encontrados
              </p>
            </div>
            {(queryParam || categoryParam !== "all") && (
              <button
                type="button"
                onClick={() => router.push("/search")}
                className="rounded-full border border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:border-white/70 hover:text-white"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {loading && <p className="text-zinc-400">Carregando produtos...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-10 text-center text-zinc-400">
              <SearchX className="h-10 w-10 text-zinc-500" />
              <p className="text-base font-semibold text-white">
                Nenhum produto encontrado
              </p>
              <p className="text-sm text-zinc-500">
                Ajuste os filtros ou tente uma nova busca.
              </p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
