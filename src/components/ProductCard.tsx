import Link from "next/link";
import { getCategory, STATUS_LABELS, TECH_LABELS } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { Badge } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categorySlug);
  const image = product.images[0];
  const unavailable = product.status === "proximamente" || product.status === "no-disponible";
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow focus-within:shadow-lg hover:shadow-lg">
      <ProductVisual
        kind={product.visual}
        technology={product.technology}
        accent={category?.accent ?? "#ff6a13"}
        label={image?.alt ?? product.name}
        className="aspect-[4/3]"
        showTag={image?.illustrative ?? true}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="brand">{TECH_LABELS[product.technology]}</Badge>
          <Badge tone={unavailable ? "muted" : "teal"}>{STATUS_LABELS[product.status]}</Badge>
        </div>
        <h3 className="text-lg font-bold leading-snug">
          <Link
            href={`/productos/${product.slug}/`}
            className="after:absolute after:inset-0 focus-visible:outline-offset-[-3px]"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-ink-soft">{product.shortDescription}</p>
        <p className="mt-auto pt-1 text-sm font-semibold text-brand-dark">
          {product.price
            ? `$${product.price.amount.toLocaleString("es-AR")}`
            : "Precio a cotizar"}
        </p>
      </div>
    </article>
  );
}
