"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_FILTERS,
  filterProducts,
  filtersToSearchParams,
  hasActiveFilters,
  parseFilters,
  SORT_LABELS,
  type CatalogFilters,
} from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const selectCls =
  "min-h-11 w-full rounded-xl border border-line bg-white px-3 text-base focus-visible:outline-offset-0";

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

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: query });
        }}
        className="grid grid-cols-2 gap-3 rounded-lg bg-paper-2 p-3 sm:p-4 lg:grid-cols-4"
      >
        <div className="col-span-2 lg:col-span-4">
          <label htmlFor="q" className="mb-1 block text-sm font-semibold">
            Buscar productos
          </label>
          <input
            id="q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: soporte para reseñas, sticker NFC, menú…"
            className={selectCls}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="categoria" className="mb-1 block text-sm font-semibold">
            Categoría
          </label>
          <select
            id="categoria"
            className={selectCls}
            value={filters.categoria ?? ""}
            onChange={(e) => update({ categoria: e.target.value || null })}
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tecnologia" className="mb-1 block text-sm font-semibold">
            Tecnología
          </label>
          <select
            id="tecnologia"
            className={selectCls}
            value={filters.tecnologia ?? ""}
            onChange={(e) =>
              update({ tecnologia: (e.target.value || null) as CatalogFilters["tecnologia"] })
            }
          >
            <option value="">QR y NFC</option>
            <option value="qr">Incluye QR</option>
            <option value="nfc">Incluye NFC</option>
          </select>
        </div>
        <div>
          <label htmlFor="orden" className="mb-1 block text-sm font-semibold">
            Ordenar por
          </label>
          <select
            id="orden"
            className={selectCls}
            value={filters.orden}
            onChange={(e) => update({ orden: e.target.value as CatalogFilters["orden"] })}
          >
            {(Object.keys(SORT_LABELS) as Array<keyof typeof SORT_LABELS>).map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex items-end lg:col-span-1">
          <button
            type="button"
            disabled={!hasActiveFilters(filters) && filters.orden === DEFAULT_FILTERS.orden}
            onClick={() => {
              setQuery("");
              router.replace(pathname, { scroll: false });
            }}
            className="min-h-11 w-full rounded-md border border-ink/80 bg-white px-3 text-sm font-semibold hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            Limpiar filtros
          </button>
        </div>
      </form>

      <p className="mt-6 text-sm text-ink-soft" role="status" aria-live="polite">
        {results.length === 1 ? "1 producto" : `${results.length} productos`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-line bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">No encontramos productos con esos filtros</h2>
          <p className="mt-2 text-ink-soft">
            Probá con otra búsqueda o limpiá los filtros. Si no ves lo que necesitás, podemos
            hacerlo a medida.
          </p>
        </div>
      )}
    </div>
  );
}
