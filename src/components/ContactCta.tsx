import { buildGeneralInquiryMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "./WhatsAppButton";
import { Container } from "./ui";

export function ContactCta({ id = "contacto" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} id={id} className="py-12">
      <Container>
        <div className="rounded-lg bg-paper-2 p-6 sm:p-10">
          <h2 id={`${id}-title`} className="max-w-2xl text-xl font-semibold sm:text-2xl">
            ¿Hablamos de tu negocio?
          </h2>
          <p className="mt-2 max-w-2xl text-base text-ink-soft">
            Contanos qué necesitás y te ayudamos a elegir.
          </p>
          <div className="mt-6 max-w-md">
            <WhatsAppButton message={buildGeneralInquiryMessage()} label="Consultar por WhatsApp" compact />
          </div>
        </div>
      </Container>
    </section>
  );
}
