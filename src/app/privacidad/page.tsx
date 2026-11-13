import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Container, SectionHeading } from "@/components/ui";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos usa AtajoLab Shop: el pedido se guarda solo en tu navegador y los datos que enviás por WhatsApp se usan para responder tu consulta.",
  alternates: { canonical: "/privacidad/" },
};

const h2 = "text-xl font-semibold";
const p = "mt-2 text-ink-soft";

export default function PrivacidadPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" eyebrow="Información" title="Política de privacidad" />
      <div className="mt-8 max-w-3xl space-y-8">
        <section aria-labelledby="que">
          <h2 id="que" className={h2}>
            Qué datos se usan
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-soft">
            <li>
              <strong className="text-ink">Tu pedido se guarda en tu navegador.</strong> Los
              productos, las opciones y los datos opcionales que escribas (nombre, localidad,
              observaciones, textos de personalización) se almacenan en el almacenamiento local de
              tu dispositivo para que no se pierdan al recargar. No se envían a ningún servidor de
              esta tienda. Podés vaciarlos desde &quot;Mi pedido&quot; o borrando los datos del sitio en tu
              navegador.
            </li>
            <li>
              <strong className="text-ink">Lo que enviás por WhatsApp.</strong> Al tocar el botón
              se abre WhatsApp con el mensaje ya escrito; vos decidís si lo enviás. Si lo enviás,
              recibimos ese mensaje y tu número en WhatsApp, y los usamos para responder tu
              consulta, presupuestar y coordinar tu pedido. WhatsApp trata esos datos según sus
              propias políticas.
            </li>
          </ul>
        </section>

        <section aria-labelledby="no">
          <h2 id="no" className={h2}>
            Lo que esta web no hace
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-soft">
            <li>No tiene cuentas de usuario ni pide contraseñas.</li>
            <li>No procesa pagos ni solicita datos de tarjeta.</li>
            <li>
              Su código no incluye herramientas de analítica, publicidad ni cookies de seguimiento
              propias.
            </li>
            <li>No sube archivos: el logo se envía por WhatsApp si hace falta.</li>
          </ul>
        </section>

        <section aria-labelledby="hosting">
          <h2 id="hosting" className={h2}>
            Alojamiento
          </h2>
          <p className={p}>
            El sitio se publica en Cloudflare, que puede registrar datos técnicos de conexión
            (por ejemplo, la dirección IP) para operar y proteger el servicio, según sus propias
            políticas.
          </p>
        </section>

        <section aria-labelledby="derechos">
          <h2 id="derechos" className={h2}>
            Tus datos y cómo contactarnos
          </h2>
          <p className={p}>
            Si nos escribiste y querés saber qué datos tenemos, corregirlos o que los eliminemos,
            escribinos por WhatsApp (<WhatsAppLink className="font-semibold text-ink underline" />)
            {SITE.contactEmail && (
              <>
                {" "}
                o a{" "}
                <a className="font-semibold text-ink underline" href={`mailto:${SITE.contactEmail}`}>
                  {SITE.contactEmail}
                </a>
              </>
            )}
            . Titular del sitio: {SITE.name}, {SITE.startCity} Capital, Formosa, Argentina.
          </p>
        </section>

        <p className="text-sm text-ink-soft">
          Mirá también las{" "}
          <Link href="/condiciones-comerciales/" className="font-semibold underline">
            condiciones comerciales
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
