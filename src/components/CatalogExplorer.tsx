"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  filterProducts,
  filtersToSearchParams,
  parseFilters,
  type CatalogFilters,
} from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { buttonClass } from "./ui";

const chipBase =
  "inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-md border px-3.5 text-sm font-medium transition-colors";
const chipOff = "border-line bg-surface text-ink-soft hover:border-ink/40 hover:text-ink";
const chipOn = "border-ink bg-ink text-on-ink";

export function CatalogExplorer({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams, categories), [searchParams, categories]);

  // El texto se edita localmente para no perder el foco y se sincroniza con la URL.
  const [query, setQuery] = useState(filters.q);
  const [syncedQ, setSyncedQ] = useState(filters.q);
  if (filters.q !== syncedQ) {
    setSyncedQ(filters.q);
    setQuery(filters.q);
  }

  const update = (patch: Partial<CatalogFilters>) => {
    const next = { ...filters, ...patch };
    const qs = filtersToSearchParams(next).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (query === filters.q) return;
    const t = setTimeout(() => update({ q: query }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const results = useMemo(
    () => filterProducts(products, filters, categories),
    [products, filters, categories],
  );

  const showAll = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: query });
        }}
      >
        <label htmlFor="q" className="sr-only">
          Buscar productos
        </label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos…"
          className="min-h-11 w-full rounded-md border border-line bg-surface px-3.5 text-base focus-visible:outline-offset-0"
          autoComplete="off"
        />
      </form>

      <div
        role="group"
        aria-label="Categorías"
        className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          aria-pressed={filters.categoria === null}
          onClick={() => update({ categoria: null })}
          className={`${chipBase} ${filters.categoria === null ? chipOn : chipOff}`}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={filters.categoria === c.slug}
            onClick={() => update({ categoria: c.slug })}
            className={`${chipBase} ${filters.categoria === c.slug ? chipOn : chipOff}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {results.length === 1 ? "1 producto" : `${results.length} productos`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-lg border border-line bg-paper-2 p-8 text-center">
          <h2 className="text-lg font-semibold">No encontramos productos</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-soft">
            Probá con otra palabra o mirá todos los productos. Si no ves lo que necesitás, podemos
            hacerlo a medida.
          </p>
          <button type="button" onClick={showAll} className={buttonClass("secondary", "mt-4")}>
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
}
