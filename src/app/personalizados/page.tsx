import type { Metadata } from "next";
import { CustomRequestForm } from "@/components/CustomRequestForm";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Productos QR y NFC personalizados a medida",
  description:
    "¿Tenés una idea que no aparece en el catálogo? Contanos qué necesitás y vemos cómo podemos hacerlo con QR y NFC.",
  alternates: { canonical: "/personalizados/" },
};

export default function PersonalizadosPage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading as="h1" eyebrow="A medida" title="¿Tenés una idea que no aparece en nuestro catálogo?">
            Contanos qué necesitás y vemos cómo podemos hacerlo.
          </SectionHeading>
          <ul className="mt-6 space-y-2 text-ink-soft">
            <li>• Completás el formulario con lo que sepas hoy.</li>
            <li>• Se abre WhatsApp con tu consulta ya escrita.</li>
            <li>• Te respondemos si es posible, cómo lo haríamos y con qué presupuesto.</li>
          </ul>
          <p className="mt-6 text-sm text-ink-soft">
            Todo se fabrica por encargo. Una vez confirmado el presupuesto, solicitamos un anticipo
            del 50% para comenzar.
          </p>
        </div>
        <CustomRequestForm />
      </div>
    </Container>
  );
}
