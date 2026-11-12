import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogExplorer } from "@/components/CatalogExplorer";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { getAllProducts, getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Productos QR y NFC personalizados",
  description:
    "Catálogo de soportes QR para reseñas, menús para restaurantes, tarjetas NFC, stickers y credenciales para eventos. Fabricación por encargo.",
  alternates: { canonical: "/productos/" },
};

export default function ProductosPage() {
  return (
    <Container className="py-8 sm:py-10">
      <SectionHeading as="h1" title="Productos">
        Elegí un producto, personalizalo y armá tu pedido. Todo se fabrica por encargo y se
        confirma por WhatsApp. Envíos a todo el país. Las imágenes son ilustrativas: el diseño
        final puede variar.
      </SectionHeading>
      <div className="mt-8">
        <Suspense fallback={<p className="py-10 text-ink-soft">Cargando catálogo…</p>}>
          <CatalogExplorer products={getAllProducts()} categories={getCategories()} />
        </Suspense>
      </div>
      <div className="mt-12 flex flex-col items-start gap-3 rounded-lg bg-paper-2 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">¿No encontrás lo que necesitás?</h2>
          <p className="mt-1 text-ink-soft">Contanos tu idea y vemos cómo hacerla.</p>
        </div>
        <ButtonLink href="/personalizados/">Pedir algo a medida</ButtonLink>
      </div>
    </Container>
  );
}
