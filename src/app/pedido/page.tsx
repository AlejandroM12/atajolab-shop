import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mi pedido",
  description: "Revisá los productos que elegiste y enviá tu pedido por WhatsApp.",
  alternates: { canonical: "/pedido/" },
  robots: { index: false, follow: true },
};

export default function PedidoPage() {
  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading as="h1" eyebrow="Armá tu pedido" title="Mi pedido">
        Revisá lo que elegiste. Tu pedido se guarda en este dispositivo.
      </SectionHeading>
      <div className="mt-8">
        <CartView />
      </div>
    </Container>
  );
}
