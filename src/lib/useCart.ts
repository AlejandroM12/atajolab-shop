"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  addItem,
  clearCart,
  countUnits,
  removeItem,
  updateQuantity,
  type CartState,
} from "./cart";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeCart,
  updateCart,
} from "./cartStore";
import type { Selection } from "./selection";
import type { Product } from "./types";

const noopSubscribe = () => () => {};

/** false durante el render del servidor y la hidratación; true luego en el cliente. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useCart() {
  const cart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const hydrated = useHydrated();

  const add = useCallback(
    (product: Product, selection: Selection) => updateCart((c) => addItem(c, product, selection)),
    [],
  );
  const setQuantity = useCallback(
    (id: string, q: number) => updateCart((c) => updateQuantity(c, id, q)),
    [],
  );
  const remove = useCallback((id: string) => updateCart((c) => removeItem(c, id)), []);
  const clear = useCallback(() => updateCart((c) => clearCart(c)), []);
  const patch = useCallback(
    (p: Partial<Pick<CartState, "notes" | "customerName" | "customerCity">>) =>
      updateCart((c) => ({ ...c, ...p })),
    [],
  );

  return useMemo(
    () => ({ cart, hydrated, units: countUnits(cart), add, setQuantity, remove, clear, patch }),
    [cart, hydrated, add, setQuantity, remove, clear, patch],
  );
}
