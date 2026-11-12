import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import Link from "next/link";
import { ContactCta } from "@/components/ContactCta";
import { ProductCard } from "@/components/ProductCard";
import Image from "next/image";
import {
  CategoryGrid,
  FaqPreview,
  HowItWorks,
  HowToBuy,
  MenuPlatformTeaser,
} from "@/components/sections";
import { ButtonLink, Container } from "@/components/ui";
import { getFeaturedProducts } from "@/lib/catalog";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SHIPPING_BANNER } from "@/data/content";
import { buildGeneralInquiryMessage } from "@/lib/whatsapp";

export default function Home() {
  const featured = getFeaturedProducts().slice(0, 6);

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <section className="border-b border-line">
        <Container className="grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:py-12">
          <div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Productos QR y NFC para tu negocio
            </h1>
            <p className="mt-3 max-w-xl text-base text-ink-soft sm:text-lg">
              Soportes, tarjetas, stickers y productos personalizados para compartir tus redes,
              recibir reseñas y mostrar tu menú.
            </p>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
              <ButtonLink href="/productos/">Ver productos</ButtonLink>
              <WhatsAppButton
                variant="secondary"
                message={buildGeneralInquiryMessage()}
                label="Consultar por WhatsApp"
                compact
              />
            </div>
            <p className="mt-5 text-sm text-ink-soft">
              <strong className="font-semibold text-ink">{SHIPPING_BANNER}.</strong> Se fabrican por
              encargo y se piden por WhatsApp.{" "}
              <Link href="/como-comprar/" className="font-medium text-ink underline">
                Cómo comprar
              </Link>
            </p>
          </div>
          <div className="hidden overflow-hidden rounded-lg border border-line lg:block">
            <Image
              src="/hero.webp"
              alt="Render ilustrativo de un soporte para reseñas, un cartel de mesa, un sticker y una tarjeta NFC con QR"
              width={1600}
              height={1000}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[16/10] w-full object-cover"
            />

          </div>
        </Container>
      </section>

      <CategoryGrid />

      <section aria-labelledby="featured" className="pb-12">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="featured" className="text-xl font-semibold sm:text-2xl">
              Productos destacados
            </h2>
            <Link href="/productos/" className="text-sm font-semibold underline">
              Ver todo
            </Link>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
            {featured.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <HowItWorks />
      <HowToBuy />
      <MenuPlatformTeaser />
      <FaqPreview />
      <ContactCta />
    </>
  );
}
