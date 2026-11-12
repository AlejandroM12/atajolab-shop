import type { Faq } from "@/lib/types";

export const ANTICIPO_TEXT =
  "Trabajamos con productos personalizados por encargo. Una vez confirmado el presupuesto y las condiciones, solicitamos un anticipo del 50% para comenzar la fabricación.";

export const BUY_STEPS = [
  {
    title: "Elegí tus productos",
    text: "Explorá el catálogo, personalizá cada producto y agregalo a tu pedido.",
  },
  {
    title: "Enviá tu pedido por WhatsApp",
    text: "Se abre WhatsApp con tu pedido ya escrito. Vos lo revisás y lo enviás.",
  },
  {
    title: "Confirmamos disponibilidad y presupuesto",
    text: "Te respondemos con el presupuesto y las condiciones.",
  },
  {
    title: "Coordinamos personalización y diseño",
    text: "Definimos textos, enlace de destino y diseño. Si tenés logo, lo enviás por el chat.",
  },
  {
    title: "Anticipo del 50%",
    text: "Con el presupuesto confirmado, solicitamos un anticipo del 50% del precio acordado.",
  },
  {
    title: "Aprobás el diseño",
    text: "Te mostramos el diseño y lo aprobás antes de fabricar.",
  },
  {
    title: "Fabricamos",
    text: "Producimos tu pedido por encargo.",
  },
  {
    title: "Saldo y entrega",
    text: "Coordinamos el pago del saldo y la entrega.",
  },
] as const;

export const BENEFITS = [
  {
    title: "Más reseñas, sin pedirlas una por una",
    text: "Un QR a la vista en tu mostrador facilita que tus clientes dejen su opinión en Google.",
  },
  {
    title: "Tu menú, en el celular de tus clientes",
    text: "Soportes y stickers que abren tu carta con un escaneo o un toque.",
  },
  {
    title: "Tu marca, en un objeto real",
    text: "Cada producto se personaliza con el nombre, los colores y el enlace de tu negocio.",
  },
  {
    title: "Simple para quien lo usa",
    text: "El QR se escanea con la cámara. El NFC funciona acercando un celular compatible.",
  },
  {
    title: "Atención directa",
    text: "Coordinás todo por WhatsApp, de persona a persona, desde la consulta hasta la entrega.",
  },
  {
    title: "Pensado para crecer con vos",
    text: "AtajoLab desarrolla herramientas digitales: la tienda está preparada para sumar nuevos servicios.",
  },
] as const;

export const QR_NFC = {
  qr: {
    title: "QR",
    how: "Escaneá el código con la cámara del celular para abrir el enlace.",
    notes: [
      "Funciona en casi cualquier celular con cámara.",
      "No necesita chip: un QR impreso no incluye necesariamente un chip NFC.",
    ],
  },
  nfc: {
    title: "NFC",
    how: "Acercá un celular compatible al producto para abrir el enlace.",
    notes: [
      "Requiere un celular compatible: no todos tienen NFC.",
      "Es un chip dentro del producto, no se ve a simple vista.",
    ],
  },
  footer:
    "Según el producto que elijas, lleva QR, NFC o ambos. En los productos con QR + NFC, el QR sirve como alternativa para quienes no tienen NFC.",
} as const;

export const FAQS: Faq[] = [
  {
    question: "¿Qué diferencia hay entre QR y NFC?",
    answer:
      "El QR se escanea con la cámara del celular para abrir un enlace. El NFC funciona acercando un celular compatible al producto. El QR funciona en casi cualquier celular; el NFC requiere compatibilidad y no todos los teléfonos la tienen. Un QR impreso no incluye necesariamente un chip: depende del producto que elijas.",
  },
  {
    question: "¿Necesito una aplicación para usarlo?",
    answer:
      "Para escanear un QR alcanza con la cámara de la mayoría de los celulares actuales. Para el NFC, el celular debe ser compatible y tener la función activada; según el modelo puede variar cómo se abre el enlace.",
  },
  {
    question: "¿Puedo personalizar el producto?",
    answer:
      "Sí. Según el producto podés indicar el nombre de tu negocio, un texto, el enlace de destino, un color preferido y si tenés un logo. Los colores y detalles disponibles se confirman al presupuestar.",
  },
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Armás tu pedido en la web y lo enviás por WhatsApp. Nosotros confirmamos disponibilidad y presupuesto, coordinamos el diseño y avanzamos con la fabricación. No hay pagos online en la web.",
  },
  {
    question: "¿Cómo funciona el anticipo?",
    answer: `${ANTICIPO_TEXT} El anticipo se coordina por WhatsApp; no se paga desde la web.`,
  },
  {
    question: "¿Puedo comprar varias unidades?",
    answer:
      "Sí, en cada producto podés indicar la cantidad que necesitás. El precio final se confirma en el presupuesto.",
  },
  {
    question: "¿Hacen envíos?",
    answer:
      "Estamos comenzando desde Formosa y recibimos consultas de todo el país. Todavía no tenemos definida una cobertura de envíos; consultanos tu localidad y coordinamos la entrega. No asumimos envíos gratuitos.",
  },
  {
    question: "¿Puedo cambiar el enlace del QR?",
    answer:
      "Depende de cómo se configure. Un QR con la URL directa guarda esa dirección y no se puede modificar una vez impreso. Un QR con enlace administrado apunta a una dirección intermedia que permite cambiar el destino sin reimprimir. Antes de fabricar definimos con vos cuál necesitás; no todos los QR son editables.",
  },
  {
    question: "¿Qué pasa si quiero modificar mi menú?",
    answer:
      "Si tu QR apunta a un enlace o archivo que vos administrás, podés actualizar el contenido sin cambiar el QR. Si el menú está impreso en el propio producto, habría que fabricarlo de nuevo. Además, estamos preparando un servicio de carta digital editable, que todavía no está disponible.",
  },
];
