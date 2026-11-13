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
    "Cómo pedir, qué diferencia hay entre QR y NFC, qué información necesitás para el diseño, cómo recibir tu producto y cómo se coordina el pago.",
  alternates: { canonical: "/preguntas-frecuentes/" },
};

export default function FaqPage() {
  return (
    <Container className="py-8 sm:py-12">
      <JsonLd data={faqJsonLd(FAQS)} />
      <SectionHeading as="h1" title="Preguntas frecuentes" />
      <div className="mt-8 max-w-3xl">
        <FaqList faqs={FAQS} />
      </div>
      <ContactCta id="contacto-faq" />
    </Container>
  );
}
