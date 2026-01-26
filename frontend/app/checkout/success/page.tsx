"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 rounded-full border border-emerald-400/30 bg-emerald-500/10 p-6"
        >
          <CheckCircle className="h-16 w-16 text-emerald-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-3xl font-semibold md:text-4xl"
        >
          Pedido Confirmado!
        </motion.h1>
        <p className="mt-3 text-sm text-zinc-400">
          Your payment was successful and your order is on the way.
        </p>

        <Link
          href="/"
          className="mt-10 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/70"
        >
          Voltar para a Loja
        </Link>
      </div>
    </main>
  );
}
