import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { ProductGallery } from "@/components/ProductGallery";
import { Badge, Container } from "@/components/ui";
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
    openGraph: { title: product.name, description: product.shortDescription, type: "website" },
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

  return (
    <Container className="py-8 sm:py-12">
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
        <ProductGallery
          images={product.images}
          kind={product.visual}
          technology={product.technology}
          accent={category?.accent ?? "#ff6a13"}
        />

        <div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="brand">{TECH_LABELS[product.technology]}</Badge>
            <Badge tone={product.status === "proximamente" || product.status === "no-disponible" ? "muted" : "teal"}>
              {STATUS_LABELS[product.status]}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg text-ink-soft">{product.shortDescription}</p>
          <p className="mt-4 text-lg font-bold text-brand-dark">
            {product.price
              ? `$${product.price.amount.toLocaleString("es-AR")}`
              : "Precio a cotizar"}
          </p>
          <div className="mt-6">
            <ProductConfigurator product={product} />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-2xl font-bold">Sobre este producto</h2>
          <div className="mt-3 space-y-3 text-ink-soft">
            {product.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-bold">Beneficios</h2>
          <ul className="mt-3 space-y-2">
            {product.benefits.map((b) => (
              <li key={b} className="flex gap-2">
                <span aria-hidden className="mt-1 text-teal">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {product.faqs && product.faqs.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-bold">Preguntas sobre este producto</h2>
              <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
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
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Tecnología</h2>
            <p className="mt-2 text-sm text-ink-soft">{TECH_EXPLAIN[product.technology]}</p>
          </section>
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Características</h2>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="font-semibold">Materiales</dt>
                <dd className="text-ink-soft">
                  {product.materials?.length ? product.materials.join(", ") : "A confirmar al presupuestar."}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Medidas</dt>
                <dd className="text-ink-soft">{product.dimensions ?? "A confirmar al presupuestar."}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Fabricación</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Trabajamos con productos personalizados por encargo. Una vez confirmado el presupuesto
              y las condiciones, solicitamos un anticipo del 50% para comenzar la fabricación.
              Plazos y entrega se coordinan en cada caso.
            </p>
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
          <h2 id="related" className="text-2xl font-bold">
            También te puede interesar
          </h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
