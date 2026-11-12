import type { Metadata } from "next";
import Link from "next/link";
import { ContactCta } from "@/components/ContactCta";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Carta digital editable (en preparación)",
  description:
    "Estamos preparando un servicio de carta digital editable para bares y restaurantes, vinculado a los soportes QR/NFC de AtajoLab Shop.",
  alternates: { canonical: "/menu-digital/" },
};

const IDEAS = [
  "Cargar tu logo, categorías, platos y bebidas, con descripciones y precios.",
  "Cambiar la disponibilidad y reordenar productos desde el celular.",
  "Publicar los cambios y mantener la misma URL (y el mismo QR) cuando cambian los precios.",
  "Vincular varios soportes físicos a la misma carta.",
  "Descargar la carta en PDF para imprimir, en A4 y A5, con diferentes diseños.",
];

export default function MenuDigitalPage() {
  return (
    <Container className="py-8 sm:py-12">
      <p className="mb-4 inline-flex rounded bg-paper-2 px-2 py-0.5 text-xs font-semibold text-ink-soft">
        Servicio en preparación · todavía no disponible
      </p>
      <SectionHeading as="h1" title="Carta digital editable para bares y restaurantes">
        Una carta que actualizás vos, conectada a tus soportes QR y NFC.
      </SectionHeading>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="idea">
          <h2 id="idea" className="text-2xl font-semibold">
            Lo que estamos pensando
          </h2>
          <p className="mt-3 text-ink-soft">
            Es una idea en desarrollo; las funciones pueden cambiar hasta que el servicio esté
            listo.
          </p>
          <ul className="mt-4 space-y-3">
            {IDEAS.map((i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-1 text-ink-soft">✓</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="hoy" className="rounded-lg border border-line bg-white p-6">
          <h2 id="hoy" className="text-2xl font-semibold">
            Qué podés hacer hoy
          </h2>
          <p className="mt-3 text-ink-soft">
            Hoy podés pedir soportes, stickers y carteles con QR o NFC que apunten a tu carta
            actual (un PDF, una página web o la herramienta que ya uses). Si tu carta vive en un
            enlace que vos administrás, podés cambiar su contenido sin cambiar el QR.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/categorias/menus-restaurantes/">Ver productos para menús</ButtonLink>
            <ButtonLink href="/productos/carta-digital-editable/" variant="secondary">
              Consultar por el servicio
            </ButtonLink>
          </div>
        </section>
      </div>

      <p className="mt-10 text-sm text-ink-soft">
        Esta página no es un panel ni un producto a la venta.{" "}
        <Link href="/productos/" className="font-semibold underline">
          Volver al catálogo
        </Link>
      </p>
      <ContactCta id="contacto-menu" />
    </Container>
  );
}
