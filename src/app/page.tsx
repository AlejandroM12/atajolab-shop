import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { ContactCta } from "@/components/ContactCta";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import {
  Benefits,
  CategoryGrid,
  FaqPreview,
  HowItWorks,
  HowToBuy,
  MenuPlatformTeaser,
} from "@/components/sections";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { getFeaturedProducts } from "@/lib/catalog";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildGeneralInquiryMessage } from "@/lib/whatsapp";

export default function Home() {
  const featured = getFeaturedProducts().slice(0, 6);

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <section className="overflow-hidden border-b border-line">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-brand/15 px-3 py-1 text-sm font-bold text-brand-dark">
              Productos QR y NFC · Fabricación por encargo
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Conectá tu negocio con tus clientes.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft sm:text-xl">
              Productos QR y NFC personalizados para conseguir más reseñas, compartir tu menú,
              mostrar tus redes y simplificar la experiencia de tus clientes.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
              <ButtonLink href="/productos/">Explorar productos</ButtonLink>
              <WhatsAppButton
                variant="secondary"
                message={buildGeneralInquiryMessage()}
                label="Consultar por WhatsApp"
                compact
              />
            </div>
          </div>
          <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-3" aria-hidden="true">
            <ProductVisual kind="stand" technology="qr-nfc" accent="#ff6a13" label="" showTag={false} className="aspect-square rounded-3xl" />
            <ProductVisual kind="card" technology="nfc" accent="#d6336c" label="" showTag={false} className="mt-8 aspect-square rounded-3xl" />
            <ProductVisual kind="sticker" technology="qr" accent="#1c7ed6" label="" showTag={false} className="-mt-4 aspect-square rounded-3xl" />
            <ProductVisual kind="menu" technology="qr" accent="#0b8f7e" label="" showTag={false} className="aspect-square rounded-3xl" />
            <p className="col-span-2 text-center text-xs text-ink-soft">Ilustraciones de referencia, no fotografías de productos.</p>
          </div>
        </Container>
      </section>

      <CategoryGrid />

      <section aria-labelledby="featured" className="pb-16">
        <Container>
          <SectionHeading eyebrow="Destacados" title="Para empezar">
            Una selección de productos para negocios, para ir conociendo la tienda.
          </SectionHeading>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/productos/" variant="secondary">
              Ver todo el catálogo
            </ButtonLink>
          </div>
        </Container>
      </section>

      <HowItWorks />
      <Benefits />
      <HowToBuy />
      <MenuPlatformTeaser />
      <FaqPreview />
      <ContactCta />
    </>
  );
}
