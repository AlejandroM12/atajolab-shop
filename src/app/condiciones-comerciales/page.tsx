import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Container, SectionHeading } from "@/components/ui";
import { MADE_TO_ORDER_TEXT, PAYMENT_TEXT, SHIPPING_BANNER, SHIPPING_TEXT } from "@/data/content";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Condiciones comerciales",
  description:
    "Condiciones comerciales de AtajoLab Shop: pedidos por encargo y sin stock, precios de referencia, envíos a todo el país y condiciones de pago acordadas antes de confirmar.",
  alternates: { canonical: "/condiciones-comerciales/" },
};

const card = "rounded-lg border border-line bg-surface p-6";

export default function CondicionesPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" eyebrow="Información" title="Condiciones comerciales" />
      <div className="mt-8 grid max-w-3xl gap-6">
        <section aria-labelledby="como" className={card}>
          <h2 id="como" className="text-xl font-semibold">
            Cómo funcionan los pedidos
          </h2>
          <ul className="mt-3 space-y-3 text-ink-soft">
            <li>
              <strong className="text-ink">Por encargo, sin stock.</strong> {MADE_TO_ORDER_TEXT}
            </li>
            <li>
              <strong className="text-ink">Solicitud por WhatsApp.</strong> Elegís productos,
              opciones y cantidades y enviás la solicitud por WhatsApp. Enviarla no es una compra
              confirmada: antes coordinamos la personalización, el presupuesto, el pago y el envío.
            </li>
            <li>
              <strong className="text-ink">Precios de referencia.</strong> Los precios publicados
              son de referencia. El importe final se confirma antes de cerrar el pedido, según la
              personalización, la cantidad y el envío. Los productos con &quot;Desde&quot; o
              &quot;Solicitar presupuesto&quot; se presupuestan en cada caso.
            </li>
            <li>
              <strong className="text-ink">Imágenes.</strong> Las imágenes del catálogo son
              ilustrativas: el diseño final se acuerda con vos antes de producir.
            </li>
            <li>
              <strong className="text-ink">{SHIPPING_BANNER}.</strong> {SHIPPING_TEXT}
            </li>
            <li>
              <strong className="text-ink">Condiciones de pago.</strong> {PAYMENT_TEXT}
            </li>
          </ul>
        </section>

        <section aria-labelledby="derechos" className={card}>
          <h2 id="derechos" className="text-xl font-semibold">
            Cambios, devoluciones, garantía y arrepentimiento
          </h2>
          <p className="mt-3 text-ink-soft">
            Las condiciones de cambios, devoluciones y garantía, y cómo ejercer el derecho de
            arrepentimiento que corresponda a tu pedido, se te informan por escrito antes de
            confirmar la compra. Para consultar o ejercer cualquier derecho que te asista como
            consumidor, escribinos por WhatsApp (
            <WhatsAppLink className="font-semibold text-ink underline" />).
          </p>
          <p className="mt-3 text-ink-soft">
            Esta información no limita los derechos que la ley reconoce a los consumidores.
          </p>
        </section>

        <section aria-labelledby="vendedor" className={card}>
          <h2 id="vendedor" className="text-xl font-semibold">
            Quién vende
          </h2>
          <ul className="mt-3 space-y-1 text-ink-soft">
            <li>
              <strong className="text-ink">Nombre comercial:</strong> {SITE.name}, una unidad de{" "}
              <a className="underline" href={SITE.institutionalUrl}>
                AtajoLab
              </a>
              .
            </li>
            <li>
              <strong className="text-ink">Ubicación:</strong> {SITE.startCity} Capital, Formosa,
              Argentina.
            </li>
            <li>
              <strong className="text-ink">Contacto:</strong> WhatsApp{" "}
              <WhatsAppLink className="underline" />
              {SITE.contactEmail && (
                <>
                  {" "}
                  ·{" "}
                  <a className="underline" href={`mailto:${SITE.contactEmail}`}>
                    {SITE.contactEmail}
                  </a>
                </>
              )}
            </li>
          </ul>
        </section>

        <p className="text-sm text-ink-soft">
          Esta web no procesa pagos ni solicita datos de tarjeta. Mirá también la{" "}
          <Link href="/privacidad/" className="font-semibold underline">
            política de privacidad
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
