export type Technology = "qr" | "nfc" | "qr-nfc";

/**
 * Estado comercial. No se maneja stock: todo producto físico se hace por encargo.
 * "proximamente" = servicio todavía no disponible (queda fuera del pedido).
 */
export type CommercialStatus = "por-encargo" | "proximamente";

/** Ilustración usada mientras no existan fotografías propias. */
export type VisualKind =
  | "stand"
  | "sticker"
  | "card"
  | "sign"
  | "lanyard"
  | "badge"
  | "label"
  | "menu";

export type CustomizationField =
  | "businessName"
  | "customText"
  | "destinationUrl"
  | "color"
  | "hasLogo"
  | "notes";

export interface Faq {
  question: string;
  answer: string;
}

export interface ProductImage {
  /** Ruta bajo /public. Si falta, se muestra la ilustración del producto. */
  src?: string;
  alt: string;
  /** true = render o ilustración, no una fotografía de un producto fabricado. */
  illustrative: boolean;
}

export interface VariantOption {
  id: string;
  label: string;
  /** Precio unitario en ARS cuando se elige esta opción. Solo si está confirmado. */
  price?: number;
}

export interface VariantGroup {
  id: string;
  label: string;
  options: VariantOption[];
}

export interface Category {
  slug: string;
  name: string;
  benefit: string;
  description: string;
  visual: VisualKind;
  /** Imagen representativa bajo /public. */
  image?: string;
  /** Color de acento de las ilustraciones (hex). */
  accent: string;
  order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  /** Párrafos de la descripción completa. */
  description: string[];
  benefits: string[];
  images: ProductImage[];
  technology: Technology;
  visual: VisualKind;
  /** Solo si están confirmados. Si no existen, la interfaz los omite. */
  materials?: string[];
  dimensions?: string;
  /** Solo opciones confirmadas como disponibles. */
  variantGroups?: VariantGroup[];
  customizations: CustomizationField[];
  /** Etiqueta propia para el campo de texto personalizado. */
  customTextLabel?: string;
  quantity: { min: number; max: number };
  /**
   * Precio unitario base en ARS. Opcional: no se inventan precios. Sin precio (ni opciones con
   * precio) el producto se vende "a presupuesto".
   */
  price?: { amount: number; currency: "ARS"; from?: boolean };
  /** Aclaración comercial junto al precio (p. ej. qué incluye o qué se cotiza aparte). */
  priceNote?: string;
  status: CommercialStatus;
  featured: boolean;
  order: number;
  faqs?: Faq[];
  keywords?: string[];
}

export type SortKey = "destacados" | "nombre";
