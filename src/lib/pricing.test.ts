import { describe, expect, it } from "vitest";
import { getAllProducts } from "./catalog";
import { formatARS, lineTotal, orderTotals, priceLabel, priceSummary, QUOTE_LABEL, unitPrice } from "./pricing";
import type { Product } from "./types";

type P = Pick<Product, "price" | "variantGroups">;

const none: P = {};
const fixed: P = { price: { amount: 12500, currency: "ARS" } };
const sized: P = {
  variantGroups: [
    {
      id: "tamano",
      label: "Tamaño",
      options: [
        { id: "s", label: "Chico", price: 8000 },
        { id: "l", label: "Grande", price: 15000 },
        { id: "x", label: "A medida" },
      ],
    },
  ],
};
const sizedWithBase: P = { ...sized, price: { amount: 10000, currency: "ARS" } };
const nbsp = (s: string) => s.replace(/\s/g, " ");

describe("formatARS", () => {
  it("formatea en pesos argentinos sin decimales", () => {
    expect(nbsp(formatARS(12500))).toBe("$ 12.500");
    expect(nbsp(formatARS(1250000))).toBe("$ 1.250.000");
  });
});

describe("priceSummary / priceLabel", () => {
  it("sin precios confirmados pide presupuesto", () => {
    expect(priceSummary(none)).toEqual({ kind: "quote" });
    expect(priceLabel(priceSummary(none))).toBe(QUOTE_LABEL);
  });
  it("precio único", () => {
    expect(priceSummary(fixed)).toEqual({ kind: "fixed", amount: 12500 });
    expect(nbsp(priceLabel(priceSummary(fixed)))).toBe("$ 12.500");
  });
  it("precio desde cuando las variantes tienen distinto precio", () => {
    expect(priceSummary(sized)).toEqual({ kind: "from", amount: 8000 });
    expect(nbsp(priceLabel(priceSummary(sized)))).toBe("Desde $ 8.000");
  });
  it("variantes con el mismo precio no son 'desde'", () => {
    const same: P = {
      variantGroups: [
        { id: "c", label: "C", options: [{ id: "a", label: "A", price: 5000 }, { id: "b", label: "B", price: 5000 }] },
      ],
    };
    expect(priceSummary(same)).toEqual({ kind: "fixed", amount: 5000 });
  });
  it("ignora importes inválidos", () => {
    const bad: P = {
      price: { amount: -1, currency: "ARS" },
      variantGroups: [{ id: "c", label: "C", options: [{ id: "a", label: "A", price: Number.NaN }] }],
    };
    expect(priceSummary(bad)).toEqual({ kind: "quote" });
  });
  it("los productos sin precio declarado en el catálogo se muestran a presupuesto", () => {
    for (const p of getAllProducts()) {
      const hasPrice = p.price || p.variantGroups?.some((g) => g.options.some((o) => o.price !== undefined));
      if (!hasPrice) expect(priceSummary(p)).toEqual({ kind: "quote" });
    }
  });
});

describe("unitPrice / lineTotal", () => {
  it("usa el precio base", () => {
    expect(unitPrice(fixed, {})).toBe(12500);
    expect(lineTotal(fixed, { variants: {}, quantity: 3 })).toBe(37500);
  });
  it("cambia al elegir otra variante", () => {
    expect(unitPrice(sized, { tamano: "s" })).toBe(8000);
    expect(unitPrice(sized, { tamano: "l" })).toBe(15000);
    expect(lineTotal(sized, { variants: { tamano: "l" }, quantity: 2 })).toBe(30000);
  });
  it("una variante sin precio o sin elegir requiere presupuesto si no hay base", () => {
    expect(unitPrice(sized, { tamano: "x" })).toBeNull();
    expect(unitPrice(sized, {})).toBeNull();
    expect(lineTotal(sized, { variants: {}, quantity: 5 })).toBeNull();
  });
  it("una variante sin precio usa el precio base si existe", () => {
    expect(unitPrice(sizedWithBase, { tamano: "x" })).toBe(10000);
    expect(unitPrice(sizedWithBase, { tamano: "s" })).toBe(8000);
  });
  it("con varias opciones con precio usa la mayor", () => {
    const two: P = {
      variantGroups: [
        { id: "a", label: "A", options: [{ id: "1", label: "1", price: 100 }] },
        { id: "b", label: "B", options: [{ id: "2", label: "2", price: 300 }] },
      ],
    };
    expect(unitPrice(two, { a: "1", b: "2" })).toBe(300);
  });
});

describe("orderTotals", () => {
  const line = (product: P, quantity: number, variants: Record<string, string> = {}) => ({
    product,
    selection: { variants, quantity },
  });
  it("suma subtotales y total cuando todo tiene precio", () => {
    expect(orderTotals([line(fixed, 2), line(sized, 1, { tamano: "s" })])).toEqual({
      pricedSubtotal: 33000,
      pricedCount: 2,
      quoteCount: 0,
      total: 33000,
    });
  });
  it("no muestra total si algún producto requiere presupuesto", () => {
    const t = orderTotals([line(fixed, 1), line(none, 4)]);
    expect(t.total).toBeNull();
    expect(t.pricedSubtotal).toBe(12500);
    expect(t.quoteCount).toBe(1);
  });
  it("un pedido vacío o sin precios no tiene total", () => {
    expect(orderTotals([]).total).toBeNull();
    expect(orderTotals([line(none, 1)])).toMatchObject({ total: null, pricedSubtotal: 0, quoteCount: 1 });
  });
});
