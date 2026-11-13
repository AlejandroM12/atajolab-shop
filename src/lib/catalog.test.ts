import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTERS,
  filterProducts,
  filtersToSearchParams,
  getAllProducts,
  getCategories,
  getProduct,
  isOrderable,
  normalizeText,
  parseFilters,
} from "./catalog";

const all = getAllProducts();

describe("catálogo", () => {
  it("tiene productos con slugs e ids únicos", () => {
    expect(new Set(all.map((p) => p.slug)).size).toBe(all.length);
    expect(new Set(all.map((p) => p.id)).size).toBe(all.length);
  });

  it("cada producto pertenece a una categoría existente", () => {
    const slugs = getCategories().map((c) => c.slug);
    for (const p of all) expect(slugs).toContain(p.categorySlug);
  });

  it("no declara materiales ni medidas sin confirmar", () => {
    for (const p of all) {
      expect(p.materials).toBeUndefined();
      expect(p.dimensions).toBeUndefined();
    }
  });

  it("los precios publicados son enteros positivos en ARS; sin precio = presupuesto", () => {
    const sinPrecio = all.filter((p) => !p.price).map((p) => p.slug).sort();
    expect(sinPrecio).toEqual(["carta-digital-editable", "identificadores-personalizados", "tarjetas-qr-invitados"]);
    for (const p of all.filter((x) => x.price)) {
      expect(p.price!.currency).toBe("ARS");
      expect(Number.isInteger(p.price!.amount) && p.price!.amount > 0).toBe(true);
    }
  });

  it("los productos con precio 'desde' son solo los que se presupuestan", () => {
    const desde = all.filter((p) => p.price?.from).map((p) => p.slug).sort();
    expect(desde).toEqual([
      "cartel-menu-personalizado",
      "cartel-mostrador-personalizado",
      "colgantes-qr",
      "credenciales-qr",
      "etiqueta-qr-personalizada",
    ]);
  });

  it("no hay lógica de stock: ningún producto lo declara", () => {
    for (const p of all) expect(["por-encargo", "proximamente"]).toContain(p.status);
  });

  it("encuentra productos por slug", () => {
    expect(getProduct("sticker-qr")?.name).toBe("Sticker QR");
    expect(getProduct("no-existe")).toBeUndefined();
  });

  it("todo se pide por encargo (sin stock); solo lo próximamente queda fuera", () => {
    expect(isOrderable({ status: "por-encargo" })).toBe(true);
    expect(isOrderable({ status: "proximamente" })).toBe(false);
    const fuera = getAllProducts().filter((p) => !isOrderable(p)).map((p) => p.slug);
    expect(fuera).toEqual(["carta-digital-editable"]);
  });
});

describe("búsqueda y filtros", () => {
  it("normaliza acentos y mayúsculas", () => {
    expect(normalizeText("  Reseñas  DE Google ")).toBe("resenas de google");
  });

  it("busca sin importar acentos", () => {
    const r = filterProducts(all, { ...DEFAULT_FILTERS, q: "resenas" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.categorySlug === "resenas-google" || /resena/.test(normalizeText(p.name)))).toBe(true);
  });

  it("exige todos los términos de la búsqueda", () => {
    const r = filterProducts(all, { ...DEFAULT_FILTERS, q: "soporte mesa" });
    expect(r.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["soporte-qr-mesa", "soporte-qr-nfc-mesa"]),
    );
    expect(r.every((p) => /soporte/i.test(p.name) && /mesa/i.test(p.name))).toBe(true);
  });

  it("devuelve vacío cuando no hay coincidencias", () => {
    expect(filterProducts(all, { ...DEFAULT_FILTERS, q: "zzzz" })).toEqual([]);
  });

  it("filtra por categoría", () => {
    const r = filterProducts(all, { ...DEFAULT_FILTERS, categoria: "eventos" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.categorySlug === "eventos")).toBe(true);
  });

  it("combina texto y categoría", () => {
    const r = filterProducts(all, { q: "sticker", categoria: "stickers-etiquetas" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.categorySlug === "stickers-etiquetas")).toBe(true);
    expect(r.length).toBeLessThan(filterProducts(all, { q: "", categoria: "stickers-etiquetas" }).length + 1);
    expect(filterProducts(all, { q: "sticker", categoria: "eventos" })).toEqual([]);
  });

  it("ignora los filtros eliminados (tecnología, orden, estado) en la URL", () => {
    const f = parseFilters(new URLSearchParams("tecnologia=nfc&orden=nombre&estado=agotado"));
    expect(f).toEqual(DEFAULT_FILTERS);
    expect(Object.keys(DEFAULT_FILTERS).sort()).toEqual(["categoria", "q"]);
  });

  it("ordena destacados primero", () => {
    const r = filterProducts(all, DEFAULT_FILTERS);
    const firstNonFeatured = r.findIndex((p) => !p.featured);
    expect(r.slice(firstNonFeatured).some((p) => p.featured)).toBe(false);
  });
});

describe("filtros en la URL", () => {
  it("ida y vuelta conserva los filtros", () => {
    const filters = {
      q: "soporte",
      categoria: "eventos",
    };
    const params = filtersToSearchParams(filters);
    expect(parseFilters(new URLSearchParams(params.toString()))).toEqual(filters);
  });

  it("omite valores por defecto", () => {
    expect(filtersToSearchParams(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("ignora valores inválidos", () => {
    const f = parseFilters(
      new URLSearchParams("categoria=xx&tecnologia=zz"),
    );
    expect(f).toEqual(DEFAULT_FILTERS);
  });
});
