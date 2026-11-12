export const SITE = {
  name: "AtajoLab Shop",
  tagline: "Productos QR y NFC personalizados",
  description:
    "Soportes, stickers, tarjetas y credenciales con QR y NFC personalizados para negocios, profesionales y eventos. Pedí por WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tienda.atajolab.dev").replace(/\/$/, ""),
  institutionalUrl: "https://atajolab.dev",
  locale: "es_AR",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  startCity: "Formosa",
} as const;

export const NAV_LINKS = [
  { href: "/productos/", label: "Productos" },
  { href: "/personalizados/", label: "Personalizados" },
  { href: "/como-comprar/", label: "Cómo comprar" },
  { href: "/contacto/", label: "Contacto" },
] as const;
