import { describe, expect, it } from "vitest";
import { getAllProducts, getCategory } from "./catalog";
import { FAQS } from "@/data/content";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  productJsonLd,
  serializeJsonLd,
} from "./seo";

describe("datos estructurados", () => {
  it("el producto no incluye precio, disponibilidad ni valoraciones", () => {
    for (const p of getAllProducts()) {
      const ld = productJsonLd(p, getCategory(p.categorySlug)) as Record<string, unknown>;
      expect(ld["@type"]).toBe("Product");
      expect(ld).not.toHaveProperty("offers");
      expect(ld).not.toHaveProperty("aggregateRating");
      expect(ld).not.toHaveProperty("review");
      expect(ld).not.toHaveProperty("image"); // solo hay ilustraciones, no fotos
    }
  });

  it("arma breadcrumbs con posiciones y URLs absolutas", () => {
    const ld = breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Productos", path: "/productos/" },
    ]);
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(ld.itemListElement[1].item).toBe("https://tienda.atajolab.dev/productos/");
  });

  it("arma FAQPage con todas las preguntas", () => {
    expect(faqJsonLd(FAQS).mainEntity).toHaveLength(FAQS.length);
  });

  it("organización con nombre y URL", () => {
    expect(organizationJsonLd().url).toBe("https://tienda.atajolab.dev");
  });

  it("escapa '<' para no cerrar el script", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});
