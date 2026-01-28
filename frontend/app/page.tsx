import Link from "next/link";

import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

// Mantem o import do Footer sem alterar o layout visual desta pagina
void Footer;

// Isso impede o Next.js de tentar acessar o banco durante o Build
export const dynamic = "force-dynamic";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  image: string;
  created_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    created_at: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Product[];
    return data;
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Category[];
    return data;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <Hero secondaryCtaLabel="Ver destaques" secondaryCtaHref="#highlights" />
      </div>

      <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-12 sm:gap-20 sm:pb-24">
        <div id="highlights" className="scroll-mt-24">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Destaques da Semana
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imagePriority={index === 0}
              />
            ))}
          </div>
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

          {categories.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-sm text-zinc-400">
              <span>Nenhuma categoria disponivel no momento.</span>{" "}
              <Link href="/search" className="font-semibold text-white">
                Ver colecao
              </Link>
            </div>
          ) : (
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
