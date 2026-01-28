"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";

import { formatBRL, parsePrice } from "../lib/format";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    image: string | null;
    created_at?: string | null;
    category?: {
      id: number;
      name: string;
      slug: string;
      created_at: string;
    } | null;
    slug: string;
  };
  imagePriority?: boolean;
  imageSizes?: string;
  compareAtPrice?: string | number | null;
  badge?: string | null;
}

const NEW_BADGE_DAYS = 7;

function isWithinLastDays(dateValue: string, days: number) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }
  const now = Date.now();
  const diff = now - parsed.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function ProductCard({
  product,
  imagePriority = false,
  imageSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  compareAtPrice = null,
  badge = null,
}: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const priceValue = useMemo(
    () => parsePrice(product.price),
    [product.price],
  );
  const compareValue = useMemo(
    () => parsePrice(compareAtPrice),
    [compareAtPrice],
  );
  const hasDiscount =
    compareValue !== null &&
    priceValue !== null &&
    compareValue > priceValue;
  const isNew = useMemo(() => {
    if (!product.created_at) {
      return false;
    }
    return isWithinLastDays(product.created_at, NEW_BADGE_DAYS);
  }, [product.created_at]);
  const badgeText = badge ?? (isNew ? "Novo" : null);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-800">
          {product.image ? (
            <>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes={imageSizes}
                priority={imagePriority}
                loading={imagePriority ? "eager" : "lazy"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onLoadingComplete={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 transition-opacity duration-500 ${
                  isImageLoaded ? "opacity-0" : "opacity-100 animate-pulse"
                }`}
                aria-hidden="true"
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-zinc-900/60 text-zinc-500">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-8 w-8 text-white/30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M4 7a2 2 0 0 1 2-2h8l4 4v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
                <path d="M14 5v4h4" />
              </svg>
            </div>
          )}
        </div>
        {badgeText ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/80">
            {badgeText}
          </span>
        ) : null}
        <div className="flex min-h-[72px] flex-col justify-between gap-2 border-t border-white/5 bg-black/20 p-4">
          <p className="line-clamp-2 text-base font-semibold text-white">
            {product.name}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-semibold text-fuchsia-400">
              {priceValue !== null ? formatBRL(priceValue) : product.price}
            </p>
            {hasDiscount ? (
              <span className="text-xs text-zinc-500 line-through">
                {compareValue !== null ? formatBRL(compareValue) : ""}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

const MemoProductCard = memo(ProductCard);
MemoProductCard.displayName = "ProductCard";

export default MemoProductCard;
