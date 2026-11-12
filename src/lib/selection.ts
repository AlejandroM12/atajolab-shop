import type { CustomizationField, Product } from "./types";

export interface SelectionFields {
  businessName: string;
  customText: string;
  destinationUrl: string;
  color: string;
  hasLogo: boolean;
  notes: string;
}

/** Configuración elegida por el cliente para un producto. */
export interface Selection {
  productId: string;
  /** groupId -> optionId (vacío = "lo coordinamos"). */
  variants: Record<string, string>;
  quantity: number;
  fields: SelectionFields;
}

export type SelectionErrors = Partial<Record<CustomizationField | "quantity", string>>;

export const FIELD_LIMITS = {
  businessName: 80,
  customText: 120,
  destinationUrl: 300,
  color: 40,
  notes: 500,
} as const;

export function createDefaultSelection(product: Pick<Product, "id" | "quantity">): Selection {
  return {
    productId: product.id,
    variants: {},
    quantity: Math.max(1, product.quantity.min),
    fields: {
      businessName: "",
      customText: "",
      destinationUrl: "",
      color: "",
      hasLogo: false,
      notes: "",
    },
  };
}

export function clampQuantity(value: number, range: { min: number; max: number }): number {
  if (!Number.isFinite(value)) return range.min;
  return Math.min(range.max, Math.max(range.min, Math.floor(value)));
}

/**
 * Normaliza una URL ingresada por el usuario. Acepta "midominio.com" y agrega https://.
 * Devuelve null si no es una URL http(s) válida con un dominio.
 */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw || /\s/.test(raw)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") || url.hostname.startsWith(".") || url.hostname.endsWith(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateSelection(
  product: Pick<Product, "quantity" | "customizations">,
  selection: Selection,
): { valid: boolean; errors: SelectionErrors } {
  const errors: SelectionErrors = {};
  const { quantity, customizations } = product;

  if (
    !Number.isInteger(selection.quantity) ||
    selection.quantity < quantity.min ||
    selection.quantity > quantity.max
  ) {
    errors.quantity = `La cantidad debe estar entre ${quantity.min} y ${quantity.max}.`;
  }

  const f = selection.fields;
  if (customizations.includes("destinationUrl") && f.destinationUrl.trim()) {
    if (f.destinationUrl.length > FIELD_LIMITS.destinationUrl || !normalizeUrl(f.destinationUrl)) {
      errors.destinationUrl = "Ingresá una dirección válida, por ejemplo https://tunegocio.com";
    }
  }
  for (const key of ["businessName", "customText", "color", "notes"] as const) {
    if (customizations.includes(key) && f[key].length > FIELD_LIMITS[key]) {
      errors[key] = `Máximo ${FIELD_LIMITS[key]} caracteres.`;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Descarta datos que el producto no admite (por ejemplo, un cambio de variantes
 * o campos que ya no aplican) para no guardar ni enviar información de más.
 */
export function sanitizeSelection(product: Product, selection: Selection): Selection {
  const fields = { ...createDefaultSelection(product).fields };
  for (const key of product.customizations) {
    if (key === "hasLogo") fields.hasLogo = Boolean(selection.fields.hasLogo);
    else fields[key] = selection.fields[key].trim();
  }
  if (product.customizations.includes("destinationUrl") && fields.destinationUrl) {
    fields.destinationUrl = normalizeUrl(fields.destinationUrl) ?? fields.destinationUrl;
  }
  const variants: Record<string, string> = {};
  for (const group of product.variantGroups ?? []) {
    const chosen = selection.variants[group.id];
    if (chosen && group.options.some((o) => o.id === chosen)) variants[group.id] = chosen;
  }
  return {
    productId: product.id,
    variants,
    quantity: clampQuantity(selection.quantity, product.quantity),
    fields,
  };
}

/** Descripción legible de variantes elegidas: [{ label, value }]. */
export function describeVariants(
  product: Pick<Product, "variantGroups">,
  selection: Pick<Selection, "variants">,
): Array<{ label: string; value: string }> {
  const out: Array<{ label: string; value: string }> = [];
  for (const group of product.variantGroups ?? []) {
    const option = group.options.find((o) => o.id === selection.variants[group.id]);
    if (option) out.push({ label: group.label, value: option.label });
  }
  return out;
}
