import type { Metadata } from "next";
import { CustomRequestForm } from "@/components/CustomRequestForm";
import { ButtonLink, Container } from "@/components/ui";
import { QR_TOOL_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Productos QR y NFC a medida y QR online",
  description:
    "¿Tenés una idea que no aparece en el catálogo? Contanos qué necesitás y vemos cómo podemos hacerlo con QR y NFC.",
  alternates: { canonical: "/personalizados/" },
};

export default function PersonalizadosPage() {
  return (
    <Container className="py-8 sm:py-12">
      <h1 className="text-2xl font-semibold sm:text-3xl">A medida</h1>
      <p className="mt-2 text-base text-ink-soft">
        Dos caminos, según lo que necesites: un QR digital que armás vos, o un producto físico
        hecho a pedido.
      </p>

      <section
        aria-labelledby="qr-online"
        className="mt-6 flex flex-col gap-4 rounded-lg bg-paper-2 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="max-w-2xl">
          <h2 id="qr-online" className="text-lg font-semibold">
            Personalizá tu QR online
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Creá tu código QR online con AtajoLab QR. Elegí un diseño, personalizá textos, colores
            e imágenes y descargalo en PNG, SVG o PDF para utilizarlo donde quieras.
          </p>
          <p className="mt-1.5 text-xs text-ink-soft">
            Es una herramienta aparte de la tienda y entrega archivos digitales: no incluye el
            producto físico. El primer QR es gratis y los siguientes tienen costo; los detalles
            están en la herramienta.
          </p>
        </div>
        <ButtonLink href={QR_TOOL_URL} variant="secondary" external className="shrink-0">
          Crear mi QR
        </ButtonLink>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            ¿Tenés una idea que no aparece en nuestro catálogo?
          </h2>
          <p className="mt-2 text-base text-ink-soft">
            Contanos qué necesitás y vemos cómo podemos hacerlo.
          </p>
          <ol className="mt-6 list-decimal space-y-2 pl-5 text-ink-soft marker:font-semibold marker:text-ink">
            <li>Completás el formulario con lo que sepas hoy.</li>
            <li>Se abre WhatsApp con tu consulta preparada.</li>
            <li>Te respondemos con la viabilidad, opciones y presupuesto.</li>
          </ol>
          <p className="mt-6 text-sm text-ink-soft">
            Todo se fabrica por encargo. Antes de confirmar te informamos el presupuesto, las
            condiciones de pago y las opciones de envío a todo el país.
          </p>
        </div>
        <CustomRequestForm />
      </div>
    </Container>
  );
}
