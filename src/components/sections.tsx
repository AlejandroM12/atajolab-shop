import Link from "next/link";
import { ANTICIPO_TEXT, BENEFITS, BUY_STEPS, FAQS, QR_NFC } from "@/data/content";
import { getCategories } from "@/lib/catalog";
import type { Faq } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { Container, SectionHeading } from "./ui";

export function CategoryGrid() {
  const categories = getCategories();
  return (
    <section aria-labelledby="cats" className="py-16">
      <Container>
        <SectionHeading eyebrow="Categorías" title="¿Qué querés resolver?">
          Elegí según lo que necesite tu negocio.
        </SectionHeading>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/categorias/${c.slug}/`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg"
              >
                <ProductVisual
                  kind={c.visual}
                  technology="qr"
                  accent={c.accent}
                  label=""
                  showTag={false}
                  className="aspect-[16/9]"
                />
                <span className="flex flex-1 flex-col p-4">
                  <span className="text-lg font-bold group-hover:underline">{c.name}</span>
                  <span className="mt-1 text-sm text-ink-soft">{c.benefit}</span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/personalizados/"
              className="flex h-full min-h-48 flex-col justify-between rounded-2xl bg-ink p-6 text-white transition-colors hover:bg-ink-soft"
            >
              <span className="text-lg font-bold">Productos personalizados</span>
              <span className="mt-2 text-sm text-white/80">
                ¿Tenés una idea que no aparece en el catálogo? Contanos qué necesitás.
              </span>
              <span className="mt-4 font-semibold text-brand">Pedir a medida →</span>
            </Link>
          </li>
        </ul>
      </Container>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section aria-labelledby="how" className="bg-paper-2 py-16">
      <Container>
        <SectionHeading eyebrow="QR y NFC" title="Así funcionan, sin vueltas">
          Dos formas de abrir un enlace desde un objeto físico.
        </SectionHeading>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[QR_NFC.qr, QR_NFC.nfc].map((t) => (
            <article key={t.title} className="rounded-2xl border border-line bg-white p-6">
              <h3 className="text-2xl font-bold">{t.title}</h3>
              <p className="mt-2 text-lg">{t.how}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {t.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span aria-hidden className="text-brand-dark">•</span>
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
    <section aria-labelledby="benefits" className="py-16">
      <Container>
        <SectionHeading eyebrow="Para tu negocio" title="Cosas simples que hacen la diferencia" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b.title} className="rounded-2xl border border-line bg-white p-5">
              <h3 className="text-lg font-bold">{b.title}</h3>
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
        <li key={s.title} className="relative rounded-2xl border border-line bg-white p-5">
          <span
            aria-hidden
            className="font-display text-4xl font-extrabold text-brand"
          >
            {i + 1}
          </span>
          <h3 className="mt-2 text-lg font-bold leading-snug">{s.title}</h3>
          <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function HowToBuy() {
  return (
    <section aria-labelledby="buy" className="bg-paper-2 py-16">
      <Container>
        <SectionHeading eyebrow="Cómo comprar" title="Armá tu pedido y lo coordinamos por WhatsApp">
          No hay pagos online en la web: todo se confirma con una persona.
        </SectionHeading>
        <div className="mt-8">
          <BuySteps compact />
        </div>
        <p className="mt-6 max-w-3xl text-ink-soft">{ANTICIPO_TEXT}</p>
        <p className="mt-4">
          <Link href="/como-comprar/" className="font-semibold underline">
            Ver el proceso completo
          </Link>
        </p>
      </Container>
    </section>
  );
}

export function FaqList({ faqs = FAQS }: { faqs?: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
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
    <section aria-labelledby="faq" className="py-16">
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
    <section aria-labelledby="menu-digital" className="py-16">
      <Container>
        <div className="grid items-center gap-8 rounded-3xl bg-teal p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal">
              En preparación
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">Carta digital editable</h2>
            <p className="mt-3 max-w-xl text-lg text-white/90">
              Estamos pensando un servicio para que bares y restaurantes editen su carta desde el
              celular y mantengan el mismo QR cuando cambien los precios. Todavía no está
              disponible.
            </p>
            <p className="mt-5">
              <Link href="/menu-digital/" className="font-semibold underline">
                Conocer la idea
              </Link>
            </p>
          </div>
          <ProductVisual
            kind="menu"
            technology="qr-nfc"
            accent="#ffffff"
            label="Ilustración conceptual de un soporte de mesa con QR y NFC"
            className="aspect-[4/3] rounded-2xl"
          />
        </div>
      </Container>
    </section>
  );
}
