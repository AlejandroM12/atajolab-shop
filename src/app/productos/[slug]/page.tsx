import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { ProductCard } from "@/components/ProductCard";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { ProductGallery } from "@/components/ProductGallery";
import { Container } from "@/components/ui";
import { SHIPPING_BANNER } from "@/data/content";
import {
  getAllProducts,
  getCategory,
  getProduct,
  getRelatedProducts,
  STATUS_LABELS,
  TECH_LABELS,
} from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/productos/${slug}/` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
      // Si el producto no tiene imagen propia se hereda la imagen social por defecto del layout.
      ...(product.images[0]?.src
        ? { images: [{ url: product.images[0].src, width: 1200, height: 900, alt: product.images[0].alt }] }
        : {}),
    },
  };
}

const TECH_EXPLAIN = {
  qr: "Se escanea con la cámara del celular.",
  nfc: "Se acerca un celular con NFC; no todos los celulares lo tienen.",
  "qr-nfc": "QR para cualquier celular con cámara y NFC para celulares compatibles.",
} as const;

export default async function ProductoPage({ params }: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  const related = getRelatedProducts(product);

  return (
    <Container className="py-8 sm:py-12">
      <JsonLd
        data={[
          productJsonLd(product, category),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos/" },
            ...(category ? [{ name: category.name, path: `/categorias/${category.slug}/` }] : []),
            { name: product.name, path: `/productos/${product.slug}/` },
          ]),
        ]}
      />
      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-ink-soft">
        <Link href="/productos/" className="underline hover:text-ink">
          Productos
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/categorias/${category.slug}/`} className="underline hover:text-ink">
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-20 lg:self-start">
        <ProductGallery
          images={product.images}
          kind={product.visual}
          technology={product.technology}
          accent={category?.accent ?? "#ff6a13"}
        />
        </div>

        <div>
          <p className="text-sm text-ink-soft">
            {TECH_LABELS[product.technology]}
            {product.status === "proximamente" &&
              ` · ${STATUS_LABELS[product.status]}`}
          </p>
          <h1 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-base text-ink-soft">{product.shortDescription}</p>
          <p className="mt-2 text-sm font-medium text-ink">{SHIPPING_BANNER}</p>
          <div className="mt-6">
            <ProductConfigurator product={product} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid max-w-5xl gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="desc">
          <h2 id="desc" className="text-xl font-semibold">
            Descripción
          </h2>
          <div className="mt-3 space-y-3 text-ink-soft">
            {product.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="carac">
          <h2 id="carac" className="text-xl font-semibold">
            Características
          </h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">Tecnología</dt>
              <dd className="text-ink-soft">{TECH_EXPLAIN[product.technology]}</dd>
            </div>
            {product.materials?.length ? (
              <div>
                <dt className="font-semibold">Materiales</dt>
                <dd className="text-ink-soft">{product.materials.join(", ")}</dd>
              </div>
            ) : null}
            {product.dimensions ? (
              <div>
                <dt className="font-semibold">Medidas</dt>
                <dd className="text-ink-soft">{product.dimensions}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related">
          <h2 id="related" className="text-xl font-semibold">
            También te puede interesar
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
