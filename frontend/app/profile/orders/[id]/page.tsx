"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuthStore } from "../../../../store/authStore";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string;
}

interface OrderDetail {
  id: number;
  created_at: string;
  status: string;
  total_amount: string;
  items_detail: OrderItem[];
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

const formatCurrency = (value: string) => {
  const numeric = Number(value);
  const safeValue = Number.isFinite(numeric) ? numeric : 0;
  return safeValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = String(params?.id ?? "");
  const { token, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const [order, setOrder] = useState<OrderDetail | null>(null);
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

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/orders/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar o pedido.");
        }

        const data = await response.json();
        if (isMounted) {
          setOrder(data);
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

    if (orderId) {
      loadOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isHydrated, orderId, router, token]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-zinc-400 transition hover:text-white"
        >
          Voltar
        </button>

        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8">
          {loading && <p className="text-zinc-400">Carregando pedido...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && order && (
            <>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Pedido #{order.id.toString().padStart(3, "0")}
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-white">
                    {formatCurrency(order.total_amount)}
                  </h1>
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

              <div className="mt-8 space-y-4">
                {order.items_detail?.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black/40 p-4"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-900">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {item.product_name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-zinc-300">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
