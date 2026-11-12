import { SITE } from "@/data/site";
import { buildGeneralInquiryMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "./WhatsAppButton";
import { Container } from "./ui";

export function ContactCta({ id = "contacto" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} id={id} className="py-16">
      <Container>
        <div className="rounded-3xl bg-ink p-8 text-white sm:p-12">
          <h2 id={`${id}-title`} className="max-w-2xl text-3xl font-bold sm:text-4xl">
            ¿Hablamos de tu negocio?
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Contanos qué querés lograr y te ayudamos a elegir. Atendemos consultas de todo el país,
            empezando desde {SITE.startCity}.
          </p>
          <div className="mt-6 max-w-md">
            <WhatsAppButton message={buildGeneralInquiryMessage()} label="Consultar por WhatsApp" compact />
          </div>
        </div>
      </Container>
    </section>
  );
}
