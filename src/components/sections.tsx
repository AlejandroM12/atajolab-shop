import Image from "next/image";
import Link from "next/link";
import { BENEFITS, BUY_STEPS, FAQS, QR_NFC, SHIPPING_BANNER } from "@/data/content";
import { getCategories } from "@/lib/catalog";
import type { Faq } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { Container, SectionHeading } from "./ui";

export function CategoryGrid() {
  const categories = getCategories();
  return (
    <section aria-labelledby="cats" className="py-10">
      <Container>
        <h2 id="cats" className="text-xl font-semibold sm:text-2xl">
          Categorías
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/categorias/${c.slug}/`} className="group block">
                <span className="block overflow-hidden rounded-lg border border-line transition-colors group-hover:border-ink/40">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt=""
                      width={1200}
                      height={900}
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <ProductVisual kind={c.visual} label="" showTag={false} className="aspect-[4/3]" />
                  )}
                </span>
                <span className="mt-2 block text-sm font-semibold group-hover:underline">
                  {c.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-soft">
          ¿Necesitás algo que no aparece?{" "}
          <Link href="/personalizados/" className="font-semibold text-ink underline">
            Pedí un producto a medida
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section aria-labelledby="how" className="bg-paper-2 py-12">
      <Container>
        <SectionHeading eyebrow="QR y NFC" title="Así funcionan, sin vueltas">
          Dos formas de abrir un enlace desde un objeto físico.
        </SectionHeading>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[QR_NFC.qr, QR_NFC.nfc].map((t) => (
            <article key={t.title} className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-2xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-lg">{t.how}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {t.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span aria-hidden className="text-ink-soft">•</span>
                    {n}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-ink-soft">{QR_NFC.footer}</p>
      </Container>
    </section>
  );
}

export function Benefits() {
  return (
    <section aria-labelledby="benefits" className="py-12">
      <Container>
        <SectionHeading eyebrow="Para tu negocio" title="Cosas simples que hacen la diferencia" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b.title} className="rounded-lg border border-line bg-white p-5">
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{b.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function BuySteps({ compact = false }: { compact?: boolean }) {
  const steps = compact ? BUY_STEPS.slice(0, 4) : BUY_STEPS;
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-lg border border-line bg-white p-5">
          <span
            aria-hidden
            className="font-display text-2xl font-semibold text-brand"
          >
            {i + 1}
          </span>
          <h3 className="mt-2 text-lg font-semibold leading-snug">{s.title}</h3>
          <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function HowToBuy() {
  const points = [
    { title: "Pedís por WhatsApp", text: "Armás tu pedido en la web y lo enviás. No hay pagos online." },
    {
      title: "Acordamos los detalles",
      text: "Te respondemos con el presupuesto, las condiciones de pago y las opciones de envío.",
    },
    { title: SHIPPING_BANNER, text: "Producción por encargo y envío a donde estés." },
  ];
  return (
    <section aria-labelledby="buy" className="bg-paper-2 py-10">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="buy" className="text-xl font-semibold sm:text-2xl">
            Comprar es simple
          </h2>
          <Link href="/como-comprar/" className="text-sm font-semibold underline">
            Cómo comprar
          </Link>
        </div>
        <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-3">
          {points.map((p) => (
            <li key={p.title} className="border-t border-ink/20 pt-3">
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function FaqList({ faqs = FAQS }: { faqs?: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.question} className="group p-5">
          <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {f.question}
            <span aria-hidden className="text-xl text-brand-dark transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-ink-soft">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqPreview() {
  return (
    <section aria-labelledby="faq" className="py-12">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que nos preguntan seguido" />
          <p className="mt-4">
            <Link href="/preguntas-frecuentes/" className="font-semibold underline">
              Ver todas las preguntas
            </Link>
          </p>
        </div>
        <FaqList faqs={FAQS.slice(0, 5)} />
      </Container>
    </section>
  );
}

export function MenuPlatformTeaser() {
  return (
    <section aria-labelledby="menu-digital" className="py-12">
      <Container>
        <div className="flex flex-col gap-4 rounded-lg border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
              En preparación
            </p>
            <h2 id="menu-digital" className="mt-1 text-xl font-semibold">
              Carta digital editable
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Estamos pensando un servicio para que bares y restaurantes editen su carta desde el
              celular y mantengan el mismo QR cuando cambien los precios. Todavía no está
              disponible.
            </p>
          </div>
          <Link href="/menu-digital/" className="shrink-0 text-sm font-semibold underline">
            Conocer la idea
          </Link>
        </div>
      </Container>
    </section>
  );
}
