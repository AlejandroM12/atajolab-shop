import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { getAllProducts, getCategories } from "@/lib/catalog";

export const dynamic = "force-static";

const STATIC_PATHS = [
  "/",
  "/productos/",
  "/personalizados/",
  "/como-comprar/",
  "/preguntas-frecuentes/",
  "/contacto/",
  "/condiciones-comerciales/",
  "/privacidad/",
  "/menu-digital/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...getCategories().map((c) => `/categorias/${c.slug}/`),
    ...getAllProducts().map((p) => `/productos/${p.slug}/`),
  ];
  return paths.map((path) => ({ url: `${SITE.url}${path}` }));
}
