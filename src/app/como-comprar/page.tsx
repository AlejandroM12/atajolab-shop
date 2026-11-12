import type { Metadata } from "next";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { BuySteps } from "@/components/sections";
import { ANTICIPO_TEXT } from "@/data/content";

export const metadata: Metadata = {
  title: "Cómo comprar",
  description:
    "Cómo pedir tus productos QR y NFC personalizados: armás el pedido, lo enviás por WhatsApp, confirmamos presupuesto, anticipo del 50% y fabricación.",
  alternates: { canonical: "/como-comprar/" },
};

export default function ComoComprarPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" eyebrow="Cómo comprar" title="Del pedido a la entrega, paso a paso">
        Todos nuestros productos se fabrican por encargo. No hay pagos online en la web: todo se
        coordina por WhatsApp.
      </SectionHeading>
      <div className="mt-8">
        <BuySteps />
      </div>
      <section aria-labelledby="anticipo" className="mt-12 rounded-lg border border-line bg-white p-6">
        <h2 id="anticipo" className="text-2xl font-semibold">
          Sobre el anticipo
        </h2>
        <p className="mt-2 text-ink-soft">{ANTICIPO_TEXT}</p>
        <p className="mt-2 text-ink-soft">
          El anticipo se coordina por WhatsApp una vez que aceptás el presupuesto. No se paga desde
          esta web.
        </p>
      </section>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/productos/">Ver productos</ButtonLink>
        <ButtonLink href="/condiciones-comerciales/" variant="secondary">
          Condiciones comerciales
        </ButtonLink>
      </div>
    </Container>
  );
}
