import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { ANTICIPO_TEXT } from "@/data/content";

export const metadata: Metadata = {
  title: "Condiciones comerciales",
  description:
    "Condiciones comerciales de AtajoLab Shop: fabricación por encargo, anticipo del 50% y puntos a definir.",
  alternates: { canonical: "/condiciones-comerciales/" },
};

/** Puntos que todavía no están definidos. Completar y mover a "definidas" cuando se confirmen. */
const PENDIENTES = [
  "Plazos de fabricación y entrega",
  "Cobertura, costos y modalidades de envío",
  "Medios de pago aceptados y datos para abonar",
  "Política de cambios, cancelaciones y devoluciones",
  "Garantía de los productos",
  "Condiciones de uso de logos y materiales enviados por el cliente",
];

export default function CondicionesPage() {
  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading as="h1" eyebrow="Información" title="Condiciones comerciales" />
      <div className="mt-8 grid max-w-3xl gap-6">
        <section aria-labelledby="definidas" className="rounded-2xl border border-line bg-white p-6">
          <h2 id="definidas" className="text-2xl font-bold">
            Lo que ya está definido
          </h2>
          <ul className="mt-3 space-y-3 text-ink-soft">
            <li>
              <strong className="text-ink">Fabricación por encargo.</strong> Todos los productos son
              personalizados y se fabrican después de confirmar el pedido.
            </li>
            <li>
              <strong className="text-ink">Anticipo del 50%.</strong> {ANTICIPO_TEXT}
            </li>
            <li>
              <strong className="text-ink">Presupuesto confirmado por WhatsApp.</strong> Los
              productos del catálogo son &quot;disponibles para consultar&quot;: no implican stock ni
              precio hasta que lo confirmemos.
            </li>
            <li>
              <strong className="text-ink">Sin pagos online.</strong> Esta web no procesa pagos ni
              solicita datos de tarjeta.
            </li>
          </ul>
        </section>
        <section aria-labelledby="pendientes" className="rounded-2xl border border-dashed border-line bg-paper-2 p-6">
          <h2 id="pendientes" className="text-2xl font-bold">
            Pendiente de definir
          </h2>
          <p className="mt-2 text-ink-soft">
            Todavía no establecimos estos puntos. Hasta entonces se acuerdan caso por caso por
            WhatsApp:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-soft">
            {PENDIENTES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
