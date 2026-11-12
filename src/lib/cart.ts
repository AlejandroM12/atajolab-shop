import { getAllProducts } from "./catalog";
import { clampQuantity, sanitizeSelection, type Selection } from "./selection";
import type { Product } from "./types";

export const CART_STORAGE_KEY = "atajolab-shop:cart";
export const CART_VERSION = 1;
export const MAX_CART_ITEMS = 50;

export interface CartItem {
  /** Identificador de la línea del pedido. */
  id: string;
  selection: Selection;
}

export interface CartState {
  version: typeof CART_VERSION;
  items: CartItem[];
  /** Observaciones generales del pedido. */
  notes: string;
  customerName: string;
  customerCity: string;
}

export const EMPTY_CART: CartState = {
  version: CART_VERSION,
  items: [],
  notes: "",
  customerName: "",
  customerCity: "",
};

type ProductLookup = (productId: string) => Product | undefined;

const byId: ProductLookup = (id) => getAllProducts().find((p) => p.id === id);

function newId(): string {
  const c = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && "randomUUID" in c) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sameConfiguration(a: Selection, b: Selection): boolean {
  return (
    a.productId === b.productId &&
    JSON.stringify(a.variants) === JSON.stringify(b.variants) &&
    JSON.stringify(a.fields) === JSON.stringify(b.fields)
  );
}

/** Agrega una selección ya validada. Si es idéntica a una existente, suma la cantidad. */
export function addItem(cart: CartState, product: Product, selection: Selection): CartState {
  const clean = sanitizeSelection(product, selection);
  const existing = cart.items.find((i) => sameConfiguration(i.selection, clean));
  if (existing) {
    return {
      ...cart,
      items: cart.items.map((i) =>
        i === existing
          ? {
              ...i,
              selection: {
                ...i.selection,
                quantity: clampQuantity(i.selection.quantity + clean.quantity, product.quantity),
              },
            }
          : i,
      ),
    };
  }
  if (cart.items.length >= MAX_CART_ITEMS) return cart;
  return { ...cart, items: [...cart.items, { id: newId(), selection: clean }] };
}

export function updateQuantity(cart: CartState, itemId: string, quantity: number): CartState {
  return {
    ...cart,
    items: cart.items.map((item) => {
      if (item.id !== itemId) return item;
      const product = byId(item.selection.productId);
      if (!product) return item;
      return {
        ...item,
        selection: { ...item.selection, quantity: clampQuantity(quantity, product.quantity) },
      };
    }),
  };
}

export function removeItem(cart: CartState, itemId: string): CartState {
  return { ...cart, items: cart.items.filter((i) => i.id !== itemId) };
}

export function clearCart(cart: CartState): CartState {
  return { ...cart, items: [], notes: "" };
}

export function countUnits(cart: CartState): number {
  return cart.items.reduce((sum, i) => sum + i.selection.quantity, 0);
}

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.slice(0, max) : "");

/**
 * Interpreta el contenido guardado. Cualquier dato inválido, de otra versión o con
 * productos que ya no existen se descarta sin romper la aplicación.
 */
export function parseCart(raw: string | null, lookup: ProductLookup = byId): CartState {
  if (!raw) return EMPTY_CART;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY_CART;
  }
  if (!data || typeof data !== "object") return EMPTY_CART;
  const obj = data as Record<string, unknown>;
  if (obj.version !== CART_VERSION || !Array.isArray(obj.items)) return EMPTY_CART;

  const items: CartItem[] = [];
  for (const entry of obj.items.slice(0, MAX_CART_ITEMS)) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    const sel = e.selection as Record<string, unknown> | undefined;
    if (typeof e.id !== "string" || !sel || typeof sel.productId !== "string") continue;
    const product = lookup(sel.productId);
    if (!product) continue;
    const f = (sel.fields ?? {}) as Record<string, unknown>;
    const variants: Record<string, string> = {};
    if (sel.variants && typeof sel.variants === "object") {
      for (const [k, v] of Object.entries(sel.variants as Record<string, unknown>)) {
        if (typeof v === "string") variants[k] = v;
      }
    }
    const candidate: Selection = {
      productId: product.id,
      variants,
      quantity: typeof sel.quantity === "number" ? sel.quantity : product.quantity.min,
      fields: {
        businessName: str(f.businessName, 80),
        customText: str(f.customText, 120),
        destinationUrl: str(f.destinationUrl, 300),
        color: str(f.color, 40),
        hasLogo: f.hasLogo === true,
        notes: str(f.notes, 500),
      },
    };
    items.push({ id: e.id.slice(0, 64), selection: sanitizeSelection(product, candidate) });
  }

  return {
    version: CART_VERSION,
    items,
    notes: str(obj.notes, 1000),
    customerName: str(obj.customerName, 80),
    customerCity: str(obj.customerCity, 80),
  };
}

export function serializeCart(cart: CartState): string {
  return JSON.stringify(cart);
}
