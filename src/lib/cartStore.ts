import { CART_STORAGE_KEY, EMPTY_CART, parseCart, serializeCart, type CartState } from "./cart";

/*
 * Store externo (compatible con useSyncExternalStore). Persiste en localStorage y,
 * si el almacenamiento no está disponible, mantiene el pedido en memoria.
 */

const listeners = new Set<() => void>();
let memoryRaw: string | null = null;
let cache: { raw: string | null; state: CartState } = { raw: null, state: EMPTY_CART };

function readRaw(): string | null {
  try {
    const stored = globalThis.localStorage?.getItem(CART_STORAGE_KEY);
    if (stored !== undefined && stored !== null) return stored;
  } catch {
    /* almacenamiento bloqueado: se usa memoria */
  }
  return memoryRaw;
}

function writeRaw(raw: string): void {
  memoryRaw = raw;
  try {
    globalThis.localStorage?.setItem(CART_STORAGE_KEY, raw);
  } catch {
    /* cuota o bloqueo: queda en memoria */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getCartSnapshot(): CartState {
  const raw = readRaw();
  if (raw === cache.raw) return cache.state;
  cache = { raw, state: parseCart(raw) };
  return cache.state;
}

export function getServerCartSnapshot(): CartState {
  return EMPTY_CART;
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY || e.key === null) listener();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

export function updateCart(fn: (cart: CartState) => CartState): void {
  const next = fn(getCartSnapshot());
  const raw = serializeCart(next);
  writeRaw(raw);
  cache = { raw, state: next };
  emit();
}

/** Solo para tests. */
export function resetCartStoreForTests(): void {
  memoryRaw = null;
  cache = { raw: null, state: EMPTY_CART };
  listeners.clear();
}
