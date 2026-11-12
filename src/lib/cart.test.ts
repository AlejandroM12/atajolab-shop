import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addItem,
  CART_STORAGE_KEY,
  CART_VERSION,
  clearCart,
  countUnits,
  EMPTY_CART,
  MAX_CART_ITEMS,
  parseCart,
  removeItem,
  serializeCart,
  updateQuantity,
} from "./cart";
import { getProduct } from "./catalog";
import { createDefaultSelection } from "./selection";
import {
  getCartSnapshot,
  resetCartStoreForTests,
  subscribeCart,
  updateCart,
} from "./cartStore";

const sticker = getProduct("sticker-qr")!;
const tarjeta = getProduct("tarjeta-nfc")!;

const sel = (p = sticker, quantity = 1, businessName = "") => {
  const s = createDefaultSelection(p);
  s.quantity = quantity;
  s.fields.businessName = businessName;
  return s;
};

describe("carrito", () => {
  it("agrega productos con cantidades y personalización", () => {
    let cart = addItem(EMPTY_CART, sticker, sel(sticker, 5, "Café Sol"));
    cart = addItem(cart, tarjeta, sel(tarjeta, 2));
    expect(cart.items).toHaveLength(2);
    expect(cart.items[0].selection.fields.businessName).toBe("Café Sol");
    expect(countUnits(cart)).toBe(7);
  });

  it("suma cantidades de configuraciones idénticas", () => {
    let cart = addItem(EMPTY_CART, sticker, sel(sticker, 3));
    cart = addItem(cart, sticker, sel(sticker, 4));
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].selection.quantity).toBe(7);
  });

  it("mantiene líneas separadas si cambia la personalización", () => {
    let cart = addItem(EMPTY_CART, sticker, sel(sticker, 1, "A"));
    cart = addItem(cart, sticker, sel(sticker, 1, "B"));
    expect(cart.items).toHaveLength(2);
  });

  it("no supera la cantidad máxima al sumar", () => {
    let cart = addItem(EMPTY_CART, sticker, sel(sticker, sticker.quantity.max));
    cart = addItem(cart, sticker, sel(sticker, 10));
    expect(cart.items[0].selection.quantity).toBe(sticker.quantity.max);
  });

  it("modifica cantidades dentro de los límites", () => {
    const cart = addItem(EMPTY_CART, sticker, sel());
    const id = cart.items[0].id;
    expect(updateQuantity(cart, id, 12).items[0].selection.quantity).toBe(12);
    expect(updateQuantity(cart, id, 0).items[0].selection.quantity).toBe(sticker.quantity.min);
    expect(updateQuantity(cart, id, 99999).items[0].selection.quantity).toBe(sticker.quantity.max);
  });

  it("elimina productos", () => {
    let cart = addItem(EMPTY_CART, sticker, sel(sticker, 1, "A"));
    cart = addItem(cart, tarjeta, sel(tarjeta));
    const next = removeItem(cart, cart.items[0].id);
    expect(next.items).toHaveLength(1);
    expect(next.items[0].selection.productId).toBe(tarjeta.id);
  });

  it("vacía el pedido y las observaciones", () => {
    const cart = { ...addItem(EMPTY_CART, sticker, sel()), notes: "hola" };
    const cleared = clearCart(cart);
    expect(cleared.items).toEqual([]);
    expect(cleared.notes).toBe("");
  });

  it("limita la cantidad de líneas", () => {
    let cart = EMPTY_CART;
    for (let i = 0; i < MAX_CART_ITEMS + 5; i++) cart = addItem(cart, sticker, sel(sticker, 1, `n${i}`));
    expect(cart.items).toHaveLength(MAX_CART_ITEMS);
  });
});

describe("persistencia: parseCart", () => {
  it("recupera lo serializado", () => {
    const cart = addItem(EMPTY_CART, sticker, sel(sticker, 4, "Bar"));
    const back = parseCart(serializeCart({ ...cart, customerCity: "Formosa" }));
    expect(back.items[0].selection.quantity).toBe(4);
    expect(back.items[0].selection.fields.businessName).toBe("Bar");
    expect(back.customerCity).toBe("Formosa");
  });

  it("tolera datos inválidos", () => {
    expect(parseCart(null)).toEqual(EMPTY_CART);
    expect(parseCart("no es json")).toEqual(EMPTY_CART);
    expect(parseCart("123")).toEqual(EMPTY_CART);
    expect(parseCart('{"version":1,"items":"x"}')).toEqual(EMPTY_CART);
  });

  it("descarta versiones anteriores", () => {
    expect(parseCart(JSON.stringify({ version: 0, items: [{ id: "x" }] }))).toEqual(EMPTY_CART);
  });

  it("descarta productos inexistentes y corrige cantidades fuera de rango", () => {
    const raw = JSON.stringify({
      version: CART_VERSION,
      items: [
        { id: "a", selection: { productId: "nope", quantity: 1, fields: {}, variants: {} } },
        { id: "b", selection: { productId: sticker.id, quantity: 999999, fields: { color: 5 }, variants: { x: "y" } } },
        null,
        { id: 3 },
      ],
    });
    const cart = parseCart(raw);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].selection.quantity).toBe(sticker.quantity.max);
    expect(cart.items[0].selection.fields.color).toBe("");
    expect(cart.items[0].selection.variants).toEqual({});
  });
});

describe("store con localStorage", () => {
  let data: Record<string, string>;
  beforeEach(() => {
    data = {};
    resetCartStoreForTests();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => (k in data ? data[k] : null),
      setItem: (k: string, v: string) => {
        data[k] = v;
      },
    });
  });

  it("persiste y recupera tras 'recargar' el store", () => {
    updateCart((c) => addItem(c, sticker, sel(sticker, 6)));
    expect(JSON.parse(data[CART_STORAGE_KEY]).items).toHaveLength(1);
    resetCartStoreForTests(); // simula recarga de página
    expect(getCartSnapshot().items[0].selection.quantity).toBe(6);
  });

  it("notifica a los suscriptores", () => {
    const fn = vi.fn();
    const unsubscribe = subscribeCart(fn);
    updateCart((c) => addItem(c, sticker, sel()));
    expect(fn).toHaveBeenCalledTimes(1);
    unsubscribe();
    updateCart((c) => clearCart(c));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("funciona en memoria si el almacenamiento falla", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("bloqueado");
      },
      setItem: () => {
        throw new Error("bloqueado");
      },
    });
    updateCart((c) => addItem(c, sticker, sel(sticker, 2)));
    expect(getCartSnapshot().items[0].selection.quantity).toBe(2);
  });
});
