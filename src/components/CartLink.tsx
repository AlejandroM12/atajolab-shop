"use client";

import Link from "next/link";
import { useCart } from "@/lib/useCart";

export function CartLink() {
  const { cart, hydrated } = useCart();
  const count = hydrated ? cart.items.length : 0;
  return (
    <Link
      href="/pedido/"
      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/80 px-3.5 text-sm font-semibold text-ink hover:bg-ink hover:text-on-ink"
    >
      Mi pedido
      {count > 0 && (
        <span
          className="grid min-w-6 place-items-center rounded-md bg-brand px-1.5 text-xs font-semibold text-on-brand"
          aria-label={`${count} ${count === 1 ? "producto" : "productos"} en tu pedido`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
