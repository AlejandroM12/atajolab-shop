import { SITE } from "@/data/site";
import type { CartItem } from "./cart";
import { describeVariants, type Selection } from "./selection";
import { formatARS, lineTotal, orderTotals, unitPrice } from "./pricing";
import type { Product } from "./types";

/**
 * Número de WhatsApp en formato internacional, solo dígitos (E.164 sin "+").
 * Devuelve null si falta o es inválido, para no generar enlaces rotos.
 */
export function parseWhatsAppNumber(raw: string | undefined | null): string | null {
  const value = (raw ?? "").trim();
  if (!/^[1-9]\d{7,14}$/.test(value)) return null;
  return value;
}

/**
 * Número comercial. Única fuente de verdad: todos los enlaces lo obtienen de acá.
 * Las variables NEXT_PUBLIC_* se reemplazan en el build, por eso se lee el nombre literal.
 * Si la variable falta o es inválida se usa el número oficial de `SITE`.
 */
export function getWhatsAppNumber(): string | null {
  return (
    parseWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ??
    parseWhatsAppNumber(SITE.whatsappNumber)
  );
}

/** "5493705204454" -> "+54 9 370 5204454" (celulares de Argentina); otros: "+<dígitos>". */
export function formatWhatsAppDisplay(number: string): string {
  const ar = /^549(\d{3})(\d{7})$/.exec(number);
  return ar ? `+54 9 ${ar[1]} ${ar[2]}` : `+${number}`;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(email: string, subject: string, message: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

/** Los enlaces de WhatsApp muy largos pueden truncarse en algunos navegadores. */
export const MAX_ENCODED_MESSAGE_LENGTH = 3500;

export function isMessageTooLong(message: string): boolean {
  return encodeURIComponent(message).length > MAX_ENCODED_MESSAGE_LENGTH;
}

type ProductLike = Pick<Product, "name" | "variantGroups" | "customTextLabel" | "price">;

function selectionLines(product: ProductLike, selection: Selection): string[] {
  const f = selection.fields;
  const lines = [`Cantidad: ${selection.quantity}`];
  for (const v of describeVariants(product, selection)) lines.push(`${v.label}: ${v.value}`);
  if (f.businessName.trim()) lines.push(`Nombre del negocio: ${f.businessName.trim()}`);
  if (f.customText.trim()) lines.push(`${product.customTextLabel ?? "Texto personalizado"}: ${f.customText.trim()}`);
  if (f.destinationUrl.trim()) lines.push(`Destino: ${f.destinationUrl.trim()}`);
  if (f.color.trim()) lines.push(`Color preferido: ${f.color.trim()}`);
  if (f.hasLogo) lines.push("Logo: tengo un logo para enviar por este chat");
  if (f.notes.trim()) lines.push(`Observaciones: ${f.notes.trim()}`);
  const unit = unitPrice(product, selection.variants);
  if (unit === null) {
    lines.push("Precio: a presupuestar");
  } else {
    lines.push(`Precio unitario: ${formatARS(unit)}`);
    lines.push(`Subtotal: ${formatARS(lineTotal(product, selection)!)}`);
  }
  return lines;
}

const CLOSING = "Quisiera confirmar el precio final, el diseño y las opciones de entrega.";

export function buildProductInquiryMessage(product: ProductLike, selection: Selection): string {
  return [
    `Hola, quiero consultar por el producto ${product.name}.`,
    "",
    ...selectionLines(product, selection),
    "",
    CLOSING,
  ].join("\n");
}

export interface OrderMessageInput {
  items: Array<{ product: ProductLike; item: Pick<CartItem, "selection"> }>;
  customerName?: string;
  customerCity?: string;
  notes?: string;
}

export function buildOrderMessage({ items, customerName, customerCity, notes }: OrderMessageInput): string {
  const lines: string[] = [`Hola, quiero consultar por un pedido en ${SITE.name}.`, "", "PRODUCTOS", ""];
  items.forEach(({ product, item }, i) => {
    lines.push(`${i + 1}. ${product.name}`, ...selectionLines(product, item.selection), "");
  });

  const totals = orderTotals(items.map(({ product, item }) => ({ product, selection: item.selection })));
  if (totals.total !== null) {
    lines.push(`TOTAL ESTIMADO: ${formatARS(totals.total)}`, "");
  } else if (totals.pricedCount > 0) {
    lines.push(
      `Subtotal de productos con precio: ${formatARS(totals.pricedSubtotal)}`,
      `Productos a presupuestar: ${totals.quoteCount}`,
      "",
    );
  }

  const data: string[] = [];
  if (customerName?.trim()) data.push(`Nombre: ${customerName.trim()}`);
  if (customerCity?.trim()) data.push(`Localidad: ${customerCity.trim()}`);
  if (notes?.trim()) data.push(`Observaciones del pedido: ${notes.trim()}`);
  if (data.length) lines.push("DATOS", "", ...data, "");

  lines.push(CLOSING);
  return lines.join("\n");
}

export interface CustomRequestInput {
  need: string;
  quantity?: string;
  name?: string;
  city?: string;
  notes?: string;
}

export function buildCustomRequestMessage(input: CustomRequestInput): string {
  const lines = [
    `Hola, quiero consultar por un producto personalizado en ${SITE.name}.`,
    "",
    `Necesito: ${input.need.trim()}`,
  ];
  if (input.quantity?.trim()) lines.push(`Cantidad aproximada: ${input.quantity.trim()}`);
  if (input.name?.trim()) lines.push(`Nombre: ${input.name.trim()}`);
  if (input.city?.trim()) lines.push(`Localidad: ${input.city.trim()}`);
  if (input.notes?.trim()) lines.push(`Observaciones: ${input.notes.trim()}`);
  lines.push("", CLOSING);
  return lines.join("\n");
}

export function buildGeneralInquiryMessage(): string {
  return `Hola, quiero hacer una consulta sobre los productos de ${SITE.name}.`;
}
