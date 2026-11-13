import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { ProductCard } from "@/components/ProductCard";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { ProductGallery } from "@/components/ProductGallery";
import { Container } from "@/components/ui";
import { MADE_TO_ORDER_TEXT, SHIPPING_BANNER, SHIPPING_TEXT } from "@/data/content";
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
  qr: "Escaneá el código con la cámara del celular para abrir el enlace.",
  nfc: "Acercá un celular compatible al producto para abrir el enlace. No todos los celulares tienen NFC.",
  "qr-nfc":
    "Se puede escanear el QR con cualquier celular con cámara, o acercar un celular compatible con NFC.",
} as const;

export default async function ProductoPage({ params }: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  const related = getRelatedProducts(product);
  const personalization = [
    product.customizations.includes("businessName") && "nombre del negocio",
    product.customizations.includes("customText") && (product.customTextLabel ?? "texto personalizado").toLowerCase(),
    product.customizations.includes("destinationUrl") && "enlace de destino",
    product.customizations.includes("color") && "color preferido",
    product.customizations.includes("hasLogo") && "logo",
  ].filter((x): x is string => typeof x === "string");

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

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-xl font-semibold">Descripción</h2>
          <div className="mt-3 space-y-3 text-ink-soft">
            {product.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {product.benefits.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-semibold">Ideal para</h2>
              <ul className="mt-3 space-y-2 text-ink-soft">
                {product.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden className="text-ink">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {product.faqs && product.faqs.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-semibold">Preguntas frecuentes</h2>
              <div className="mt-3 divide-y divide-line rounded-lg border border-line bg-white">
                {product.faqs.map((f) => (
                  <details key={f.question} className="group p-4">
                    <summary className="cursor-pointer font-semibold">{f.question}</summary>
                    <p className="mt-2 text-ink-soft">{f.answer}</p>
                  </details>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-semibold">Características</h2>
            <dl className="mt-2 space-y-3 text-sm">
              <div>
                <dt className="font-semibold">Tecnología</dt>
                <dd className="text-ink-soft">{TECH_EXPLAIN[product.technology]}</dd>
              </div>
              {personalization.length > 0 && (
                <div>
                  <dt className="font-semibold">Personalizable</dt>
                  <dd className="text-ink-soft">
                    {personalization.join(", ").replace(/^./, (c) => c.toUpperCase())}.
                  </dd>
                </div>
              )}
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
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-semibold">{SHIPPING_BANNER}</h2>
            <p className="mt-2 text-sm text-ink-soft">{SHIPPING_TEXT}</p>
            <p className="mt-2 text-sm text-ink-soft">{MADE_TO_ORDER_TEXT}</p>
            <p className="mt-2 text-sm">
              <Link href="/como-comprar/" className="font-semibold underline">
                Ver cómo comprar
              </Link>
            </p>
          </section>
        </aside>
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
