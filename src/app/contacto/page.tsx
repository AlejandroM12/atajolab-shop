import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Container, SectionHeading } from "@/components/ui";
import { SITE } from "@/data/site";
import { buildGeneralInquiryMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos por WhatsApp y te ayudamos a elegir tus productos QR y NFC personalizados.",
  alternates: { canonical: "/contacto/" },
};

export default function ContactoPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" title="Hablemos de tu negocio">
        Contanos qué necesitás y te ayudamos a elegir.
      </SectionHeading>
      <div className="mt-6 max-w-sm">
        <WhatsAppButton message={buildGeneralInquiryMessage()} label="Conversar por WhatsApp" className="w-full" />
        <p className="mt-4 text-sm text-ink-soft">
          <a className="font-medium underline" href={SITE.institutionalUrl}>
            Conocé AtajoLab
          </a>
        </p>
      </div>
    </Container>
  );
}
