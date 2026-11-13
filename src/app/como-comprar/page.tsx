import type { Metadata } from "next";
import Link from "next/link";
import { BuySteps } from "@/components/sections";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { SHIPPING_BANNER } from "@/data/content";

export const metadata: Metadata = {
  title: "Cómo comprar",
  description:
    "Elegí tus productos QR y NFC, personalizá tu pedido, enviálo por WhatsApp y coordinamos los detalles y la entrega. Envíos a todo el país.",
  alternates: { canonical: "/como-comprar/" },
};

export default function ComoComprarPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" title="Cómo comprar" />
      <div className="mt-8">
        <BuySteps />
      </div>
      <p className="mt-8 text-ink-soft">
        <strong className="text-ink">{SHIPPING_BANNER}.</strong> Los detalles de envío y pago los
        acordamos con vos antes de confirmar. Más información en las{" "}
        <Link href="/condiciones-comerciales/" className="font-semibold underline">
          condiciones comerciales
        </Link>
        .
      </p>
      <div className="mt-8">
        <ButtonLink href="/productos/">Ver productos</ButtonLink>
      </div>
    </Container>
  );
}
