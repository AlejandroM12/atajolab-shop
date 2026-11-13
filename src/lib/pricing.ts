import type { Selection } from "./selection";
import type { Product } from "./types";

export const QUOTE_LABEL = "Solicitar presupuesto";

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** 12500 -> "$ 12.500" */
export function formatARS(amount: number): string {
  return ars.format(amount);
}

type PricedProduct = Pick<Product, "price" | "variantGroups">;

export type PriceSummary =
  | { kind: "quote" }
  | { kind: "fixed"; amount: number }
  | { kind: "from"; amount: number };

/** Montos válidos: no negativos y finitos (ignora datos corruptos para no mostrar precios falsos). */
const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0;

/**
 * Precio para listados: fijo si todas las opciones valen lo mismo, "desde" si hay opciones con
 * distinto precio, y presupuesto si no hay ningún precio confirmado.
 */
export function priceSummary(product: PricedProduct): PriceSummary {
  const amounts: number[] = [];
  if (valid(product.price?.amount)) amounts.push(product.price.amount);
  for (const group of product.variantGroups ?? []) {
    for (const option of group.options) if (valid(option.price)) amounts.push(option.price);
  }
  if (amounts.length === 0) return { kind: "quote" };
  const min = Math.min(...amounts);
  // "Desde": precio base de un producto que se presupuesta, o variantes con precios distintos.
  const isFrom = product.price?.from === true || amounts.some((a) => a !== min);
  return isFrom ? { kind: "from", amount: min } : { kind: "fixed", amount: min };
}

export function priceLabel(summary: PriceSummary): string {
  if (summary.kind === "quote") return QUOTE_LABEL;
  return summary.kind === "from" ? `Desde ${formatARS(summary.amount)}` : formatARS(summary.amount);
}

/**
 * Precio unitario de una configuración. Una opción con precio reemplaza al precio base; si se
 * eligieron varias opciones con precio se usa la mayor. Devuelve null si hay que presupuestar.
 */
export function unitPrice(product: PricedProduct, variants: Selection["variants"]): number | null {
  let chosen: number | null = null;
  for (const group of product.variantGroups ?? []) {
    const option = group.options.find((o) => o.id === variants[group.id]);
    if (option && valid(option.price)) chosen = chosen === null ? option.price : Math.max(chosen, option.price);
  }
  if (chosen !== null) return chosen;
  // Un precio "desde" es solo una referencia: el importe final se presupuesta.
  if (product.price?.from) return null;
  return valid(product.price?.amount) ? product.price.amount : null;
}

/** Precio base "desde" de un producto que se presupuesta (null si no corresponde). */
export function referencePrice(product: PricedProduct, variants: Selection["variants"]): number | null {
  if (unitPrice(product, variants) !== null) return null;
  return product.price?.from && valid(product.price.amount) ? product.price.amount : null;
}

type Priced = Pick<Selection, "variants" | "quantity">;

/** Subtotal de la línea (unitario x cantidad) o null si requiere presupuesto. */
export function lineTotal(product: PricedProduct, selection: Priced): number | null {
  const unit = unitPrice(product, selection.variants);
  return unit === null ? null : unit * selection.quantity;
}

export interface OrderTotals {
  /** Suma de las líneas con precio. */
  pricedSubtotal: number;
  pricedCount: number;
  quoteCount: number;
  /** Solo existe si TODAS las líneas tienen precio: nunca se presenta un total parcial como total. */
  total: number | null;
}

export function orderTotals(lines: Array<{ product: PricedProduct; selection: Priced }>): OrderTotals {
  let pricedSubtotal = 0;
  let pricedCount = 0;
  let quoteCount = 0;
  for (const { product, selection } of lines) {
    const t = lineTotal(product, selection);
    if (t === null) quoteCount++;
    else {
      pricedSubtotal += t;
      pricedCount++;
    }
  }
  return {
    pricedSubtotal,
    pricedCount,
    quoteCount,
    total: lines.length > 0 && quoteCount === 0 ? pricedSubtotal : null,
  };
}
