"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Search, ShoppingBag, User, X } from "lucide-react";

import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { items, toggleCart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-[100] border-b border-white/10 bg-zinc-950/90 text-white backdrop-blur-md transition-all duration-300">
      <div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="cursor-pointer text-white transition-colors hover:text-gray-300"
            onClick={() => setIsSearchOpen(false)}
          >
            <span className="text-2xl font-extrabold tracking-tight">
              LOJA.IA
            </span>
          </Link>
          <div className="flex items-center gap-5 text-white/80">
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setIsSearchOpen(false);
                      setSearchValue("");
                      return;
                    }
                    if (event.key === "Enter") {
                      const term = searchValue.trim();
                      if (term) {
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                      } else {
                        router.push("/search");
                      }
                      setIsSearchOpen(false);
                    }
                  }}
                  placeholder="Buscar..."
                  className="w-64 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white outline-none transition focus:border-fuchsia-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchValue("");
                  }}
                  className="p-4 text-gray-400 transition hover:text-white"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/"
                  className="transition hover:text-gray-300"
                  aria-label="Home"
                >
                  <Home className="h-6 w-6" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="transition hover:text-gray-300"
                  aria-label="Open search"
                >
                  <Search className="h-6 w-6" />
                </button>
                {isHydrated ? (
                  isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => router.push("/profile")}
                        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-xs font-semibold text-emerald-200 transition hover:border-emerald-300"
                        aria-label="Open profile"
                      >
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400" />
                        {user?.name?.[0] || user?.email?.[0] || "U"}
                      </button>
                      <button
                        type="button"
                        onClick={logout}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:text-white"
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-white"
                    >
                      <User className="h-5 w-5" />
                      Entrar
                    </button>
                  )
                ) : (
                  <div className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
                )}
                <button
                  type="button"
                  onClick={toggleCart}
                  className="relative transition hover:text-white"
                  aria-label="Open cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {items.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-semibold text-white">
                      {items.length}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
