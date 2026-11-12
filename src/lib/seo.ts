import { SITE } from "@/data/site";
import type { Category, Faq, Product } from "./types";

/*
 * Datos estructurados. Intencionalmente NO incluyen precios, disponibilidad, valoraciones
 * ni reseñas: no están definidos y no se deben inventar.
 */

export const absoluteUrl = (path: string) => `${SITE.url}${path}`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    parentOrganization: { "@type": "Organization", name: "AtajoLab", url: SITE.institutionalUrl },
    areaServed: { "@type": "Country", name: "Argentina" },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "es-AR",
  };
}

export function productJsonLd(product: Product, category?: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    url: absoluteUrl(`/productos/${product.slug}/`),
    brand: { "@type": "Brand", name: "AtajoLab" },
    ...(category ? { category: category.name } : {}),
    ...(product.materials?.length ? { material: product.materials.join(", ") } : {}),
    ...(product.images.some((i) => i.src && !i.illustrative)
      ? {
          image: product.images
            .filter((i) => i.src && !i.illustrative)
            .map((i) => absoluteUrl(i.src as string)),
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Serializa JSON-LD evitando cerrar el <script> por accidente. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
