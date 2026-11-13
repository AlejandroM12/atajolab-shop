import type { Metadata } from "next";
import { CustomRequestForm } from "@/components/CustomRequestForm";
import { ButtonLink, Container } from "@/components/ui";
import { QR_TOOL_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Productos QR y NFC a medida y QR online",
  description:
    "¿Tenés una idea que no aparece en el catálogo? Contanos qué necesitás. O creá tu propio código QR online.",
  alternates: { canonical: "/personalizados/" },
};

export default function PersonalizadosPage() {
  return (
    <Container className="py-8 sm:py-12">
      <section aria-labelledby="a-medida" className="max-w-xl">
        <h1 id="a-medida" className="text-2xl font-semibold leading-tight sm:text-3xl">
          ¿Tenés una idea que no aparece en nuestro catálogo?
        </h1>
        <p className="mt-2 text-base text-ink-soft">
          Contanos qué necesitás y te ayudamos a hacerlo realidad.
        </p>
        <div className="mt-6">
          <CustomRequestForm />
        </div>
      </section>

      <section
        aria-labelledby="qr-online"
        className="mt-14 flex flex-col gap-5 rounded-lg bg-paper-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div className="max-w-xl">
          <h2 id="qr-online" className="text-xl font-semibold sm:text-2xl">
            Personalizá tu QR online
          </h2>
          <p className="mt-2 text-base text-ink-soft">
            Creá tu propio código QR. Elegí un diseño, personalizá colores y textos, y descargalo
            listo para usar.
          </p>
        </div>
        <ButtonLink href={QR_TOOL_URL} external className="shrink-0">
          Crear mi QR
        </ButtonLink>
      </section>
    </Container>
  );
}
