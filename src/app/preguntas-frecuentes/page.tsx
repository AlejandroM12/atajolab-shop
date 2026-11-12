import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { FaqList } from "@/components/sections";
import { ContactCta } from "@/components/ContactCta";
import { Container, SectionHeading } from "@/components/ui";
import { FAQS } from "@/data/content";

export const metadata: Metadata = {
  title: "Preguntas frecuentes sobre QR y NFC",
  description:
    "Diferencia entre QR y NFC, personalización, pedidos, anticipo del 50%, envíos y cómo cambiar el enlace de un QR.",
  alternates: { canonical: "/preguntas-frecuentes/" },
};

export default function FaqPage() {
  return (
    <Container className="py-8 sm:py-12">
      <JsonLd data={faqJsonLd(FAQS)} />
      <SectionHeading as="h1" eyebrow="Ayuda" title="Preguntas frecuentes">
        Respondemos lo que ya sabemos. Lo que todavía no está definido, lo decimos.
      </SectionHeading>
      <div className="mt-8 max-w-3xl">
        <FaqList faqs={FAQS} />
      </div>
      <ContactCta id="contacto-faq" />
    </Container>
  );
}
