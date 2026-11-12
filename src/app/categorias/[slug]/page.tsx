import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ProductCard } from "@/components/ProductCard";
import { Container, SectionHeading } from "@/components/ui";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categorias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.benefit} ${category.description}`,
    alternates: { canonical: `/categorias/${slug}/` },
  };
}

export default async function CategoriaPage({ params }: PageProps<"/categorias/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = getProductsByCategory(slug);

  return (
    <Container className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Productos", path: "/productos/" },
          { name: category.name, path: `/categorias/${slug}/` },
        ])}
      />
      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-ink-soft">
        <Link href="/productos/" className="underline hover:text-ink">
          Productos
        </Link>{" "}
        / <span aria-current="page">{category.name}</span>
      </nav>
      <SectionHeading as="h1" eyebrow="Categoría" title={category.name}>
        {category.benefit} {category.description}
      </SectionHeading>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-ink-soft">
        <Link href="/productos/" className="font-semibold underline">
          Ver todo el catálogo
        </Link>
      </p>
    </Container>
  );
}
