"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  backgroundImageUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function Hero({
  backgroundImageUrl,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-gradient-to-br from-gray-900 to-black sm:min-h-[62vh] lg:min-h-[66vh]">
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          REDEFINA SEU ESTILO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
          className="mt-4 max-w-2xl text-base text-zinc-300 sm:text-lg"
        >
          Pecas premium com acabamento impecavel para elevar o seu dia a dia.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/collection"
            className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Ver colecao
          </Link>
          {secondaryCtaLabel && secondaryCtaHref ? (
            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white/80 transition hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {secondaryCtaLabel}
            </Link>
          ) : null}
        </motion.div>
        <div className="mt-10 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.35em] text-white/40">
          <span>Estoque limitado</span>
          <span>Frete rapido</span>
          <span>Selecao premium</span>
        </div>
      </div>
    </section>
  );
}
