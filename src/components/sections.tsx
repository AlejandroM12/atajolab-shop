import Image from "next/image";
import Link from "next/link";
import { BUY_STEPS, FAQS, QR_NFC } from "@/data/content";
import { getCategories } from "@/lib/catalog";
import type { Faq } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { Container } from "./ui";

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
    <section aria-labelledby="how" className="bg-paper-2 py-10">
      <Container>
        <h2 id="how" className="text-xl font-semibold sm:text-2xl">
          QR y NFC
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[QR_NFC.qr, QR_NFC.nfc].map((t) => (
            <article key={t.title} className="rounded-lg border border-line bg-white p-5">
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="mt-1.5 text-ink-soft">{t.how}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                {t.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span aria-hidden>•</span>
                    {n}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function BuySteps() {
  const steps = BUY_STEPS;
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
  return (
    <section aria-labelledby="buy" className="py-10">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="buy" className="text-xl font-semibold sm:text-2xl">
            Cómo comprar
          </h2>
          <Link href="/como-comprar/" className="text-sm font-semibold underline">
            Ver más
          </Link>
        </div>
        <ol className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {BUY_STEPS.map((s) => (
            <li key={s.title} className="border-t border-ink/20 pt-3">
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
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
          <h2 id="faq" className="text-xl font-semibold sm:text-2xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4">
            <Link href="/preguntas-frecuentes/" className="font-semibold underline">
              Ver todas las preguntas
            </Link>
          </p>
        </div>
        <FaqList faqs={FAQS.slice(0, 4)} />
      </Container>
    </section>
  );
}
