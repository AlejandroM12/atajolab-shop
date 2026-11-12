import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { MADE_TO_ORDER_TEXT, PAYMENT_TEXT, SHIPPING_BANNER, SHIPPING_TEXT } from "@/data/content";

export const metadata: Metadata = {
  title: "Condiciones comerciales",
  description:
    "Condiciones comerciales de AtajoLab Shop: fabricación por encargo, envíos a todo el país, condiciones de pago acordadas antes de confirmar y puntos a definir.",
  alternates: { canonical: "/condiciones-comerciales/" },
};

/** Puntos que todavía no están definidos. Completar y mover a "definidas" cuando se confirmen. */
const PENDIENTES = [
  "Plazos estándar de fabricación y entrega",
  "Política de cambios, cancelaciones y devoluciones",
  "Garantía de los productos",
  "Condiciones de uso de logos y materiales enviados por el cliente",
];

export default function CondicionesPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" eyebrow="Información" title="Condiciones comerciales" />
      <div className="mt-8 grid max-w-3xl gap-6">
        <section aria-labelledby="definidas" className="rounded-lg border border-line bg-white p-6">
          <h2 id="definidas" className="text-2xl font-semibold">
            Lo que ya está definido
          </h2>
          <ul className="mt-3 space-y-3 text-ink-soft">
            <li>
              <strong className="text-ink">Fabricación por encargo.</strong> Todos los productos son
              personalizados. {MADE_TO_ORDER_TEXT}
            </li>
            <li>
              <strong className="text-ink">{SHIPPING_BANNER}.</strong> {SHIPPING_TEXT}
            </li>
            <li>
              <strong className="text-ink">Condiciones de pago.</strong> {PAYMENT_TEXT}
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
        <section aria-labelledby="pendientes" className="rounded-lg border border-dashed border-line bg-paper-2 p-6">
          <h2 id="pendientes" className="text-2xl font-semibold">
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
