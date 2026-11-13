"use client";

import Link from "next/link";
import { useState } from "react";
import { isOrderable } from "@/lib/catalog";
import { formatARS, lineTotal, priceLabel, priceSummary, referencePrice, unitPrice } from "@/lib/pricing";
import {
  clampQuantity,
  createDefaultSelection,
  FIELD_LIMITS,
  sanitizeSelection,
  validateSelection,
  type Selection,
  type SelectionFields,
} from "@/lib/selection";
import { useCart } from "@/lib/useCart";
import type { Product } from "@/lib/types";
import { buildComingSoonMessage, buildProductInquiryMessage } from "@/lib/whatsapp";
import { buttonClass } from "./ui";
import { WhatsAppButton } from "./WhatsAppButton";

const inputCls =
  "min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2 text-base placeholder:text-ink-soft/60 aria-[invalid=true]:border-danger";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function PriceBlock({ product, selection }: { product: Product; selection: Selection }) {
  const unit = unitPrice(product, selection.variants);
  const total = lineTotal(product, selection);
  const from = referencePrice(product, selection.variants);
  const summary = priceSummary(product);
  return (
    <div className="mb-5" aria-live="polite">
      <p className="text-2xl font-semibold" data-testid="product-price">
        {unit !== null ? formatARS(unit) : priceLabel(summary)}
        {unit !== null && <span className="ml-1.5 text-sm font-normal text-ink-soft">por unidad</span>}
      </p>
      {unit !== null && total !== null && selection.quantity > 1 && (
        <p className="mt-0.5 text-sm text-ink-soft" data-testid="product-subtotal">
          {selection.quantity} unidades: <strong className="text-ink">{formatARS(total)}</strong>
        </p>
      )}
      {unit === null && from !== null && (
        <p className="mt-0.5 text-sm text-ink-soft">El importe final se confirma según tu pedido.</p>
      )}
      {unit === null && from === null && summary.kind !== "quote" && (
        <p className="mt-0.5 text-sm text-ink-soft">Elegí una opción para ver el precio.</p>
      )}
      {product.priceNote && <p className="mt-0.5 text-sm text-ink-soft">{product.priceNote}</p>}
    </div>
  );
}

export function ProductConfigurator({ product }: { product: Product }) {
  const [selection, setSelection] = useState<Selection>(() => createDefaultSelection(product));
  const [showErrors, setShowErrors] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const { errors } = validateSelection(product, selection);
  const visibleErrors = showErrors ? errors : {};
  const has = (f: (typeof product.customizations)[number]) => product.customizations.includes(f);
  const orderable = isOrderable(product);
  // Campo principal de texto: el nombre propio del producto (p. ej. "Nombre y cargo") o el del negocio.
  const primaryField: "customText" | "businessName" | null =
    product.customTextLabel && has("customText") ? "customText" : has("businessName") ? "businessName" : null;
  const primaryLabel = primaryField === "customText" ? product.customTextLabel : "Nombre del negocio";

  const setField = <K extends keyof SelectionFields>(key: K, value: SelectionFields[K]) =>
    setSelection((s) => ({ ...s, fields: { ...s.fields, [key]: value } }));

  const setQuantity = (value: number) =>
    setSelection((s) => ({ ...s, quantity: clampQuantity(value, product.quantity) }));

  if (!orderable) {
    return (
      <>
      <section aria-labelledby="config-title" className="rounded-lg border border-line bg-surface p-5">
        <h2 id="config-title" className="text-xl font-semibold">
          Próximamente
        </h2>
        <p className="mt-2 text-ink-soft">
          Este servicio todavía no está disponible y no se puede pedir. Si te interesa, escribinos y
          te avisamos cuando esté listo.
        </p>
        <div className="mt-4">
          <WhatsAppButton
            message={buildComingSoonMessage(product)}
            label="Avisame cuando esté disponible"
            className="w-full"
          />
        </div>
      </section>
      </>
    );
  }

  return (
    <>
    <PriceBlock product={product} selection={selection} />
    <section aria-labelledby="config-title" className="rounded-lg border border-line bg-surface p-5 sm:p-6">
      <h2 id="config-title" className="text-xl font-semibold">
        Personalizá tu producto
      </h2>

      <form
        className="mt-5 grid gap-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setShowErrors(true);
          setAdded(false);
          const result = validateSelection(product, selection);
          if (!result.valid) {
            const first = Object.keys(result.errors)[0];
            document.getElementById(first)?.focus();
            return;
          }
          add(product, selection);
          setAdded(true);
        }}
      >
        {(product.variantGroups ?? []).map((group) => (
          <Field key={group.id} id={`var-${group.id}`} label={group.label}>
            <select
              id={`var-${group.id}`}
              className={inputCls}
              value={selection.variants[group.id] ?? ""}
              onChange={(e) =>
                setSelection((s) => ({
                  ...s,
                  variants: { ...s.variants, [group.id]: e.target.value },
                }))
              }
            >
              <option value="">Elegir (o lo coordinamos)</option>
              {group.options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                  {o.price !== undefined ? ` · ${formatARS(o.price)}` : ""}
                </option>
              ))}
            </select>
          </Field>
        ))}

        {primaryField && (
          <Field
            id={primaryField}
            label={`${primaryLabel} (opcional)`}
            error={visibleErrors[primaryField]}
          >
            <input
              id={primaryField}
              className={inputCls}
              maxLength={FIELD_LIMITS[primaryField] + 20}
              value={selection.fields[primaryField]}
              onChange={(e) => setField(primaryField, e.target.value)}
              aria-invalid={Boolean(visibleErrors[primaryField])}
              autoComplete={primaryField === "businessName" ? "organization" : "off"}
            />
          </Field>
        )}

        {has("destinationUrl") && (
          <Field
            id="destinationUrl"
            label="Enlace de destino (opcional)"
            error={visibleErrors.destinationUrl}
          >
            <input
              id="destinationUrl"
              type="url"
              inputMode="url"
              className={inputCls}
              placeholder="https://tunegocio.com"
              value={selection.fields.destinationUrl}
              onChange={(e) => setField("destinationUrl", e.target.value)}
              onBlur={() => setShowErrors(true)}
              aria-invalid={Boolean(visibleErrors.destinationUrl)}
            />
          </Field>
        )}

        <Field id="quantity" label="Cantidad" error={visibleErrors.quantity}>
          <div className="flex w-fit items-center gap-2">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-md border border-line text-xl font-semibold hover:bg-paper-2 disabled:opacity-40"
              onClick={() => setQuantity(selection.quantity - 1)}
              disabled={selection.quantity <= product.quantity.min}
              aria-label="Restar una unidad"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              inputMode="numeric"
              min={product.quantity.min}
              max={product.quantity.max}
              className={`${inputCls} w-24 text-center`}
              value={Number.isNaN(selection.quantity) ? "" : selection.quantity}
              onChange={(e) => setSelection((s) => ({ ...s, quantity: e.target.valueAsNumber }))}
              onBlur={() => setQuantity(selection.quantity)}
              aria-invalid={Boolean(visibleErrors.quantity)}
            />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-md border border-line text-xl font-semibold hover:bg-paper-2 disabled:opacity-40"
              onClick={() => setQuantity(selection.quantity + 1)}
              disabled={selection.quantity >= product.quantity.max}
              aria-label="Sumar una unidad"
            >
              +
            </button>
          </div>
        </Field>

        {has("notes") && (
          <Field id="notes" label="Indicaciones adicionales (opcional)" error={visibleErrors.notes}>
            <textarea
              id="notes"
              rows={2}
              className={inputCls}
              placeholder="Colores, textos, logo u otros detalles"
              value={selection.fields.notes}
              onChange={(e) => setField("notes", e.target.value)}
              aria-invalid={Boolean(visibleErrors.notes)}
            />
          </Field>
        )}

        <button type="submit" className={buttonClass("primary", "w-full")}>
          Agregar al pedido
        </button>
        <WhatsAppButton
          variant="secondary"
          className="w-full"
          label="Consultar este producto por WhatsApp"
          message={buildProductInquiryMessage(product, sanitizeSelection(product, selection))}
          beforeOpen={() => {
            setShowErrors(true);
            const result = validateSelection(product, selection);
            if (!result.valid) document.getElementById(Object.keys(result.errors)[0])?.focus();
            return result.valid;
          }}
        />

        <div role="status" aria-live="polite">
          {added && (
            <p className="rounded-md bg-paper-2 p-3 text-sm font-medium text-ink">
              ¡Listo! Agregamos este producto a tu pedido.{" "}
              <Link href="/pedido/" className="font-semibold underline">
                Ver mi pedido
              </Link>{" "}
              ·{" "}
              <Link href="/productos/" className="font-semibold underline">
                Seguir viendo productos
              </Link>
            </p>
          )}
        </div>
      </form>
    </section>
    </>
  );
}
