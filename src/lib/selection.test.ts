import { describe, expect, it } from "vitest";
import { getProduct } from "./catalog";
import {
  clampQuantity,
  createDefaultSelection,
  describeVariants,
  normalizeUrl,
  sanitizeSelection,
  validateSelection,
} from "./selection";

const sticker = getProduct("sticker-qr")!;
const credencial = getProduct("credenciales-qr")!;

describe("normalizeUrl", () => {
  it("acepta URLs http(s)", () => {
    expect(normalizeUrl("https://tunegocio.com/menu")).toBe("https://tunegocio.com/menu");
  });
  it("agrega https:// cuando falta", () => {
    expect(normalizeUrl("tunegocio.com")).toBe("https://tunegocio.com/");
  });
  it("rechaza valores inválidos", () => {
    expect(normalizeUrl("")).toBeNull();
    expect(normalizeUrl("hola")).toBeNull();
    expect(normalizeUrl("hola que tal.com")).toBeNull();
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("ftp://sitio.com")).toBeNull();
  });
});

describe("cantidades", () => {
  it("respeta mínimo y máximo", () => {
    const range = { min: 1, max: 10 };
    expect(clampQuantity(0, range)).toBe(1);
    expect(clampQuantity(99, range)).toBe(10);
    expect(clampQuantity(3.7, range)).toBe(3);
    expect(clampQuantity(NaN, range)).toBe(1);
  });
  it("valida la cantidad de la selección", () => {
    const s = createDefaultSelection(sticker);
    expect(validateSelection(sticker, s).valid).toBe(true);
    expect(validateSelection(sticker, { ...s, quantity: 0 }).errors.quantity).toBeDefined();
    expect(validateSelection(sticker, { ...s, quantity: sticker.quantity.max + 1 }).valid).toBe(false);
  });
});

describe("personalización", () => {
  it("no exige ningún dato opcional", () => {
    expect(validateSelection(sticker, createDefaultSelection(sticker)).valid).toBe(true);
  });
  it("valida la URL solo si se completó", () => {
    const s = createDefaultSelection(sticker);
    s.fields.destinationUrl = "no es url";
    expect(validateSelection(sticker, s).errors.destinationUrl).toBeDefined();
    s.fields.destinationUrl = "https://goo.gl/maps/abc";
    expect(validateSelection(sticker, s).valid).toBe(true);
  });
  it("limita la longitud de los textos", () => {
    const s = createDefaultSelection(sticker);
    s.fields.businessName = "x".repeat(200);
    expect(validateSelection(sticker, s).errors.businessName).toBeDefined();
  });
  it("sanitiza campos y variantes que no corresponden", () => {
    const s = createDefaultSelection(credencial);
    s.fields.color = "rojo";
    s.fields.destinationUrl = " tunegocio.com ";
    s.variants = { inexistente: "x" };
    const clean = sanitizeSelection(credencial, s);
    expect(clean.fields.color).toBe("rojo");
    expect(clean.fields.destinationUrl).toBe("https://tunegocio.com/");
    expect(clean.variants).toEqual({});
  });
  it("descarta campos que el producto no ofrece", () => {
    const carta = getProduct("carta-digital-editable")!;
    const s = createDefaultSelection(carta);
    s.fields.color = "azul";
    expect(sanitizeSelection(carta, s).fields.color).toBe("");
  });
});

describe("variantes", () => {
  it("describe solo variantes válidas", () => {
    const group = sticker.variantGroups![0];
    const out = describeVariants(sticker, { variants: { [group.id]: group.options[0].id } });
    expect(out).toEqual([{ label: group.label, value: group.options[0].label }]);
    expect(describeVariants(sticker, { variants: { [group.id]: "nope" } })).toEqual([]);
  });
  it("sanitiza variantes inválidas", () => {
    const s = createDefaultSelection(sticker);
    const group = sticker.variantGroups![0];
    s.variants = { [group.id]: "nope" };
    expect(sanitizeSelection(sticker, s).variants).toEqual({});
    s.variants = { [group.id]: group.options[1].id };
    expect(sanitizeSelection(sticker, s).variants).toEqual({ [group.id]: group.options[1].id });
  });
});
