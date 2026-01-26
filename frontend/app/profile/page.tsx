"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { API_URL } from "@/lib/api";

import { useAuthStore } from "../../store/authStore";

interface Order {
  id: number;
  created_at: string;
  status: string;
  total_amount: string;
}

const formatDate = (value: string) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  shipped: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const parseTokenEmail = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return decoded.email || decoded.username || "";
  } catch {
    return "";
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { token, isAuthenticated, user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Cliente");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }
    if (user?.name) {
      setUserName(user.name);
      return;
    }
    const email = user?.email || parseTokenEmail(token);
    if (email) {
      setUserName(email.split("@")[0]);
    }
  }, [isAuthenticated, isHydrated, router, token, user]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar seus pedidos.");
        }

        const data = await response.json();
        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erro inesperado.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Ola, {userName}</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Aqui voce acompanha seus pedidos e atualizacoes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-zinc-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:border-white/70 hover:text-white"
          >
            Sair
          </button>
        </div>

        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Meus pedidos</h2>
          </div>

          {loading && isAuthenticated && (
            <p className="text-zinc-400">Carregando pedidos...</p>
          )}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && !hasOrders && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
              Voce ainda nao fez nenhum pedido.
            </div>
          )}

          {!loading && !error && hasOrders && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm text-zinc-500">
                      Pedido #{order.id.toString().padStart(3, "0")}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {order.total_amount}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        statusStyles[order.status] ||
                        "border-zinc-700 text-zinc-300"
                      }`}
                    >
                      {order.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => router.push(`/profile/orders/${order.id}`)}
                      className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:border-white/70 hover:text-white"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
