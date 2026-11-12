"use client";

import Link from "next/link";
import { useCart } from "@/lib/useCart";

export function CartLink() {
  const { cart, hydrated } = useCart();
  const count = hydrated ? cart.items.length : 0;
  return (
    <Link
      href="/pedido/"
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-ink-soft"
    >
      Mi pedido
      {count > 0 && (
        <span
          className="grid min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold text-ink"
          aria-label={`${count} ${count === 1 ? "producto" : "productos"} en tu pedido`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
