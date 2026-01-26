"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex h-[80vh] items-center bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto w-full max-w-6xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl"
        >
          REDEFINA SEU ESTILO
        </motion.h1>
        <motion.div whileHover={{ scale: 1.05 }} className="mt-8 inline-flex">
          <Link
            href="/search"
            className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black"
          >
            Ver Colecao
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
