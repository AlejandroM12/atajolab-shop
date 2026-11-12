import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import type { Category, CommercialStatus, Product, SortKey, Technology } from "./types";

export const STATUS_LABELS: Record<CommercialStatus, string> = {
  consultar: "Disponible para consultar",
  "por-encargo": "Fabricación por encargo",
  proximamente: "Próximamente",
  "no-disponible": "No disponible",
};

export const TECH_LABELS: Record<Technology, string> = {
  qr: "QR",
  nfc: "NFC",
  "qr-nfc": "QR + NFC",
};

export const SORT_LABELS: Record<SortKey, string> = {
  destacados: "Destacados",
  nombre: "Nombre (A-Z)",
};

export type TechFilter = "qr" | "nfc";

export interface CatalogFilters {
  q: string;
  categoria: string | null;
  /** "qr" = productos que incluyen QR; "nfc" = productos que incluyen NFC. */
  tecnologia: TechFilter | null;
  estado: CommercialStatus | null;
  orden: SortKey;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  q: "",
  categoria: null,
  tecnologia: null,
  estado: null,
  orden: "destacados",
};

/** Un producto se puede agregar al pedido solo si no es "próximamente" ni "no disponible". */
export function isOrderable(product: Pick<Product, "status">): boolean {
  return product.status === "consultar" || product.status === "por-encargo";
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function techIncludes(product: Pick<Product, "technology">, tech: TechFilter): boolean {
  return product.technology === tech || product.technology === "qr-nfc";
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
    if (filters.tecnologia && !techIncludes(p, filters.tecnologia)) return false;
    if (filters.estado && p.status !== filters.estado) return false;
    if (terms.length) {
      const haystack = searchText(p, categories);
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  return sortProducts(result, filters.orden);
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  if (sort === "nombre") return list.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return list.sort((a, b) => Number(b.featured) - Number(a.featured) || byOrder(a, b));
}

const STATUSES: CommercialStatus[] = ["consultar", "por-encargo", "proximamente", "no-disponible"];

/** Lee filtros desde parámetros de URL, ignorando valores inválidos. */
export function parseFilters(
  params: { get(name: string): string | null },
  categories: Category[] = CATEGORIES,
): CatalogFilters {
  const categoria = params.get("categoria");
  const tecnologia = params.get("tecnologia");
  const estado = params.get("estado");
  const orden = params.get("orden");
  return {
    q: (params.get("q") ?? "").slice(0, 80),
    categoria: categories.some((c) => c.slug === categoria) ? categoria : null,
    tecnologia: tecnologia === "qr" || tecnologia === "nfc" ? tecnologia : null,
    estado: STATUSES.includes(estado as CommercialStatus) ? (estado as CommercialStatus) : null,
    orden: orden === "nombre" ? "nombre" : "destacados",
  };
}

/** Serializa filtros omitiendo los valores por defecto. */
export function filtersToSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.tecnologia) params.set("tecnologia", filters.tecnologia);
  if (filters.estado) params.set("estado", filters.estado);
  if (filters.orden !== DEFAULT_FILTERS.orden) params.set("orden", filters.orden);
  return params;
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.categoria !== null ||
    filters.tecnologia !== null ||
    filters.estado !== null
  );
}
