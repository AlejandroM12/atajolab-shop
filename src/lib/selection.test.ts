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
  // El catálogo actual no tiene variantes: se prueba la lógica con un producto de ejemplo.
  const conVariantes = {
    ...sticker,
    variantGroups: [
      {
        id: "tamano",
        label: "Tamaño",
        options: [
          { id: "chico", label: "Chico" },
          { id: "grande", label: "Grande" },
        ],
      },
    ],
  };
  it("describe solo variantes válidas", () => {
    expect(describeVariants(conVariantes, { variants: { tamano: "chico" } })).toEqual([{ label: "Tamaño", value: "Chico" }]);
    expect(describeVariants(conVariantes, { variants: { tamano: "nope" } })).toEqual([]);
  });
  it("sanitiza variantes inválidas", () => {
    const s = createDefaultSelection(conVariantes);
    s.variants = { tamano: "nope" };
    expect(sanitizeSelection(conVariantes, s).variants).toEqual({});
    s.variants = { tamano: "grande" };
    expect(sanitizeSelection(conVariantes, s).variants).toEqual({ tamano: "grande" });
  });
});
