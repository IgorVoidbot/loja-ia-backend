"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { API_URL } from "@/lib/api";

import ProductCard from "../../components/ProductCard";

export const dynamic = "force-dynamic"; 

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

const parsePrice = (value: string) => {
  const cleaned = String(value).replace(/[^0-9.,-]/g, "");
  const normalized =
    cleaned.includes(",") && cleaned.includes(".")
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned.replace(",", ".");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    Number.POSITIVE_INFINITY,
  ]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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
          throw new Error("Falha ao carregar catalogo");
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

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchTerm(query);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const productCategory =
        product.category?.slug ||
        product.category_slug ||
        product.category_name ||
        "";
      const matchesCategory =
        selectedCategory === "all" || productCategory === selectedCategory;
      const matchesSearch =
        term.length === 0 || product.name.toLowerCase().includes(term);
      const price = parsePrice(product.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, priceRange]);

  const handlePriceChange = (value: string) => {
    if (value === "0-200") {
      setPriceRange([0, 200]);
      return;
    }
    if (value === "200-500") {
      setPriceRange([200, 500]);
      return;
    }
    if (value === "500+") {
      setPriceRange([500, Number.POSITIVE_INFINITY]);
      return;
    }
    setPriceRange([0, Number.POSITIVE_INFINITY]);
  };

  const FiltersContent = (
    <div className="space-y-6">
      <div>
        <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Search
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Busque por nome"
          className="mt-3 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-white">Categorias</p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
              selectedCategory === "all"
                ? "border-fuchsia-400 text-white"
                : "border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.slug)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                selectedCategory === category.slug
                  ? "border-fuchsia-400 text-white"
                  : "border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Faixa de preco
        </label>
        <select
          onChange={(event) => handlePriceChange(event.target.value)}
          className="mt-3 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
        >
          <option value="all">Todas</option>
          <option value="0-200">Ate R$ 200</option>
          <option value="200-500">R$ 200 - R$ 500</option>
          <option value="500+">Acima de R$ 500</option>
        </select>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 pt-12 md:flex-row">
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setIsFiltersOpen((prev) => !prev)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
          >
            {isFiltersOpen ? "Fechar filtros" : "Abrir filtros"}
          </button>
          {isFiltersOpen && (
            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              {FiltersContent}
            </div>
          )}
        </div>

        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <h2 className="text-lg font-semibold text-white">Filtros</h2>
            <div className="mt-6">{FiltersContent}</div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Colecao</h1>
              <p className="mt-2 text-sm text-zinc-400">
                {filteredProducts.length} produto(s) encontrados
              </p>
            </div>
          </div>

          {loading && <p className="text-zinc-400">Carregando produtos...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
              Nenhum produto encontrado
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
