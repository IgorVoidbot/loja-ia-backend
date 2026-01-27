"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { API_URL } from "@/lib/api";

import { useAuthStore } from "../../store/authStore";

interface OrderSummary {
  id: number;
  created_at: string;
  status: string;
  total_amount: string;
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

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

const formatCurrency = (value: string) => {
  const numeric = Number(value);
  const safeValue = Number.isFinite(numeric) ? numeric : 0;
  return safeValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!token || !isAuthenticated) {
      router.push("/login");
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
          throw new Error("Nao foi possivel carregar os pedidos.");
        }

        const data = (await response.json()) as OrderSummary[];
        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
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
  }, [isAuthenticated, isHydrated, router, token]);

  const content = useMemo(() => {
    if (loading) {
      return <p className="text-zinc-400">Carregando pedidos...</p>;
    }

    if (error) {
      return <p className="text-red-400">{error}</p>;
    }

    if (orders.length === 0) {
      return <p className="text-zinc-400">Nenhum pedido encontrado.</p>;
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm text-zinc-500">
                Pedido #{order.id.toString().padStart(3, "0")}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {formatCurrency(order.total_amount)}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {formatDate(order.created_at)}
              </p>
            </div>
            <span
              className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                statusStyles[order.status] ||
                "border-zinc-700 text-zinc-300"
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    );
  }, [error, loading, orders]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-12">
        <h1 className="text-3xl font-semibold">Meus Pedidos</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Acompanhe o status dos seus pedidos mais recentes.
        </p>

        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
          {content}
        </div>
      </section>
    </main>
  );
}