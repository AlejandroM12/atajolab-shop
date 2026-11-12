import type { Category } from "@/lib/types";

export const CATEGORIES: Category[] = [
  {
    slug: "resenas-google",
    name: "Reseñas de Google",
    benefit: "Facilitá que tus clientes dejen una reseña en Google.",
    description:
      "Soportes, stickers y carteles con QR (y NFC opcional) que llevan a tus clientes directo al lugar donde dejar su opinión sobre tu negocio.",
    visual: "stand",
    accent: "#ff6a13",
    order: 1,
  },
  {
    slug: "menus-restaurantes",
    name: "Menús para restaurantes y bares",
    benefit: "Mostrá tu carta desde el celular de tus clientes.",
    description:
      "Soportes de mesa, stickers y carteles con QR o NFC que abren tu menú digital, tu PDF o la página que prefieras.",
    visual: "menu",
    accent: "#0b8f7e",
    order: 2,
  },
  {
    slug: "eventos",
    name: "Eventos",
    benefit: "Compartí información y organizá mejor la identificación de tus invitados.",
    description:
      "Colgantes, credenciales y tarjetas con QR para identificar invitados y compartir información de tu evento.",
    visual: "lanyard",
    accent: "#5b4bdb",
    order: 3,
  },
  {
    slug: "tarjetas-digitales",
    name: "Tarjetas digitales",
    benefit: "Compartí tus datos de contacto con un escaneo o un toque.",
    description:
      "Tarjetas con QR, NFC o ambos para que te agenden, te escriban o vean tus redes sin teclear nada.",
    visual: "card",
    accent: "#d6336c",
    order: 4,
  },
  {
    slug: "stickers-etiquetas",
    name: "Stickers y etiquetas",
    benefit: "Llevá cualquier enlace a cualquier superficie.",
    description:
      "Stickers y etiquetas con QR o NFC para vidrieras, mostradores, productos y packaging.",
    visual: "sticker",
    accent: "#1c7ed6",
    order: 5,
  },
];
