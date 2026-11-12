import type { Metadata } from "next";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { BuySteps } from "@/components/sections";
import { MADE_TO_ORDER_TEXT, PAYMENT_TEXT, SHIPPING_BANNER, SHIPPING_TEXT } from "@/data/content";

export const metadata: Metadata = {
  title: "Cómo comprar",
  description:
    "Cómo pedir tus productos QR y NFC personalizados: armás el pedido, lo enviás por WhatsApp, acordamos presupuesto, pago y envío, y fabricamos por encargo. Envíos a todo el país.",
  alternates: { canonical: "/como-comprar/" },
};

export default function ComoComprarPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" eyebrow="Cómo comprar" title="Del pedido a la entrega">
        Todo se coordina por WhatsApp: no hay pagos online en la web.
      </SectionHeading>
      <div className="mt-8">
        <BuySteps />
      </div>
      <section aria-labelledby="envios" className="mt-10 max-w-3xl rounded-lg border border-line bg-white p-6">
        <h2 id="envios" className="text-xl font-semibold">
          {SHIPPING_BANNER}
        </h2>
        <p className="mt-2 text-ink-soft">{SHIPPING_TEXT}</p>
        <p className="mt-2 text-ink-soft">{MADE_TO_ORDER_TEXT}</p>
        <p className="mt-2 text-ink-soft">{PAYMENT_TEXT}</p>
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
