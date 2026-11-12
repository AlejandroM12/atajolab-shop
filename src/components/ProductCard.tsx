import Link from "next/link";
import { getCategory, STATUS_LABELS, TECH_LABELS } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categorySlug);
  const image = product.images[0];
  const unavailable = product.status === "proximamente" || product.status === "no-disponible";
  return (
    <article className="group relative flex h-full flex-col">
      <div className="overflow-hidden rounded-lg border border-line transition-colors group-hover:border-ink/40 group-focus-within:border-ink/40">
        <ProductVisual
          kind={product.visual}
          technology={product.technology}
          accent={category?.accent}
          label={image?.alt ?? product.name}
          className="aspect-[4/3]"
          showTag={false}
        />
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <p className="text-xs text-ink-soft">
          {TECH_LABELS[product.technology]}
          {unavailable && ` · ${STATUS_LABELS[product.status]}`}
        </p>
        <h3 className="mt-0.5 text-base font-semibold leading-snug">
          <Link
            href={`/productos/${product.slug}/`}
            className="after:absolute after:inset-0 focus-visible:outline-offset-[-3px]"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{product.shortDescription}</p>
        <p className="mt-auto pt-2 text-sm font-semibold">
          {product.price
            ? `$${product.price.amount.toLocaleString("es-AR")}`
            : "Consultar precio"}
        </p>
      </div>
    </article>
  );
}
