import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { SITE } from "@/data/site";
import { buildGeneralInquiryMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Consultanos por WhatsApp sobre productos QR y NFC personalizados. Atendemos consultas de todo el país, empezando desde Formosa.",
  alternates: { canonical: "/contacto/" },
};

export default function ContactoPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" eyebrow="Contacto" title="Hablemos de tu negocio">
        La forma más rápida de consultar es por WhatsApp.
      </SectionHeading>
      <div className="mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
        <section aria-labelledby="wa" className="rounded-lg border border-line bg-white p-6">
          <h2 id="wa" className="text-xl font-semibold">
            WhatsApp
          </h2>
          <p className="mt-2 mb-4 text-sm text-ink-soft">
            Se abre el chat con un mensaje inicial; vos decidís si lo enviás.
          </p>
          <WhatsAppButton message={buildGeneralInquiryMessage()} className="w-full" />
        </section>
        <section aria-labelledby="otros" className="rounded-lg border border-line bg-white p-6">
          <h2 id="otros" className="text-xl font-semibold">
            Otros medios
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-ink-soft">
            {SITE.contactEmail && (
              <li>
                Email:{" "}
                <a className="font-semibold underline" href={`mailto:${SITE.contactEmail}`}>
                  {SITE.contactEmail}
                </a>
              </li>
            )}
            <li>
              Sitio de{" "}
              <a className="font-semibold underline" href={SITE.institutionalUrl}>
                AtajoLab
              </a>
            </li>
            <li>Base en {SITE.startCity}, Argentina. Recibimos consultas de todo el país.</li>
          </ul>
        </section>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/productos/" variant="secondary">
          Ver productos
        </ButtonLink>
        <ButtonLink href="/personalizados/" variant="secondary">
          Pedir algo a medida
        </ButtonLink>
      </div>
    </Container>
  );
}
