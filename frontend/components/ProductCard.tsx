import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    image: string | null;
    category_name?: string; 
    slug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="aspect-square overflow-hidden bg-zinc-800">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
              Sem imagem
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <p className="text-base font-semibold text-white">{product.name}</p>
          <p className="text-sm font-semibold text-fuchsia-400">
            {Number(product.price).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}