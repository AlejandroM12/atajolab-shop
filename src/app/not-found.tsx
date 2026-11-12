import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <SectionHeading as="h1" eyebrow="Error 404" title="No encontramos esa página">
        Puede que el enlace haya cambiado. Volvé al catálogo o al inicio.
      </SectionHeading>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/productos/">Ver productos</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Ir al inicio
        </ButtonLink>
      </div>
    </Container>
  );
}
