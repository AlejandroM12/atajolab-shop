import type { Faq } from "@/lib/types";

export const SHIPPING_BANNER = "Envíos a todo el país";

/** Texto de envíos: solo para Condiciones y Cómo comprar. */
export const SHIPPING_TEXT =
  "El costo y las opciones de envío se informan antes de confirmar el pedido, según destino, cantidad y características del producto.";

/** Solo para Condiciones comerciales. */
export const MADE_TO_ORDER_TEXT =
  "Todo se hace por encargo y no trabajamos con stock: podés pedir cualquier cantidad y el plazo de entrega se informa al confirmar el pedido.";

/** Las condiciones de pago se acuerdan con cada cliente antes de confirmar. */
export const PAYMENT_TEXT =
  "Las condiciones de pago se acuerdan con vos según el pedido, antes de confirmarlo. Esta web no procesa pagos.";

export const BUY_STEPS = [
  { title: "Elegís tus productos", text: "Mirá el catálogo y sumá lo que te interese." },
  { title: "Personalizás tu pedido", text: "Indicá nombre, enlace y cantidad. El resto lo definimos juntos." },
  { title: "Lo enviás por WhatsApp", text: "Con un toque te llega todo preparado." },
  { title: "Coordinamos los detalles", text: "Diseño, pago y entrega a todo el país." },
] as const;

export const QR_NFC = {
  qr: {
    title: "QR",
    how: "Se escanea con la cámara del celular y abre el enlace que elijas.",
    notes: ["Funciona en casi cualquier celular.", "No necesita instalar nada."],
  },
  nfc: {
    title: "NFC",
    how: "Se acerca un celular compatible al producto y abre el enlace.",
    notes: ["Requiere un celular con NFC: no todos lo tienen.", "El chip va dentro del producto."],
  },
} as const;

export const FAQS: Faq[] = [
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Elegí tus productos, personalizalos y enviá el pedido por WhatsApp. Te respondemos para coordinar los detalles.",
  },
  {
    question: "¿Qué diferencia hay entre QR y NFC?",
    answer:
      "El QR se escanea con la cámara del celular y funciona en casi cualquier teléfono. El NFC se activa acercando un celular compatible; no todos lo tienen. Ninguno requiere instalar una aplicación.",
  },
  {
    question: "¿Qué información necesito para el diseño?",
    answer:
      "Con el nombre de tu negocio y el enlace al que querés llevar (reseñas, carta, redes, WhatsApp…) alcanza. Si tenés logo y colores, mejor. Si algo todavía no lo tenés, lo definimos juntos.",
  },
  {
    question: "¿Puedo cambiar el enlace del QR después?",
    answer:
      "Depende de cómo se configure. Si el QR apunta a un enlace o archivo que administrás vos, podés actualizar el contenido sin cambiar el QR. Lo definimos al coordinar tu pedido.",
  },
  {
    question: "¿Cómo recibo el producto?",
    answer:
      "Enviamos a todo el país. Acordamos el medio y el costo del envío antes de confirmar el pedido.",
  },
  {
    question: "¿Cómo se coordina el pago?",
    answer: "Te pasamos el presupuesto por WhatsApp y acordamos la forma de pago antes de confirmar.",
  },
  {
    question: "¿Puedo pedir cualquier cantidad?",
    answer: "Sí, desde una unidad.",
  },
];
