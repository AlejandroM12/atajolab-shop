import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import type { Category, CommercialStatus, Product, Technology } from "./types";

export const STATUS_LABELS: Record<CommercialStatus, string> = {
  "por-encargo": "Por encargo",
  proximamente: "Próximamente",
};

export const TECH_LABELS: Record<Technology, string> = {
  qr: "QR",
  nfc: "NFC",
  "qr-nfc": "QR + NFC",
};

/** El catálogo solo se filtra por texto y por categoría. */
export interface CatalogFilters {
  q: string;
  categoria: string | null;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  q: "",
  categoria: null,
};

/** Todo se hace por encargo: no hay stock. Solo lo "próximamente" queda fuera del pedido. */
export function isOrderable(product: Pick<Product, "status">): boolean {
  return product.status === "por-encargo";
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const byOrder = (a: Product, b: Product) => a.order - b.order;

export function getCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllProducts(): Product[] {
  return [...PRODUCTS].sort(byOrder);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getAllProducts().filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return getAllProducts()
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

function searchText(product: Product, categories: Category[]): string {
  const category = categories.find((c) => c.slug === product.categorySlug);
  return normalizeText(
    [
      product.name,
      product.shortDescription,
      category?.name ?? "",
      TECH_LABELS[product.technology],
      ...(product.keywords ?? []),
    ].join(" "),
  );
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
  categories: Category[] = CATEGORIES,
): Product[] {
  const terms = normalizeText(filters.q).split(/\s+/).filter(Boolean);

  const result = products.filter((p) => {
    if (filters.categoria && p.categorySlug !== filters.categoria) return false;
    if (terms.length) {
      const haystack = searchText(p, categories);
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  return sortProducts(result);
}

/** Orden fijo: destacados primero y después el orden del catálogo. */
export function sortProducts(products: Product[]): Product[] {
  const list = [...products];
  return list.sort((a, b) => Number(b.featured) - Number(a.featured) || byOrder(a, b));
}

/** Lee filtros desde parámetros de URL, ignorando valores inválidos. */
export function parseFilters(
  params: { get(name: string): string | null },
  categories: Category[] = CATEGORIES,
): CatalogFilters {
  const categoria = params.get("categoria");
  return {
    q: (params.get("q") ?? "").slice(0, 80),
    categoria: categories.some((c) => c.slug === categoria) ? categoria : null,
  };
}

/** Serializa filtros omitiendo los valores por defecto. */
export function filtersToSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.categoria) params.set("categoria", filters.categoria);
  return params;
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return filters.q.trim() !== "" || filters.categoria !== null;
}
