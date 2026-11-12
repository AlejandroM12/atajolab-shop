"use client";

import Link from "next/link";
import { useState } from "react";
import { getCategory, getAllProducts, TECH_LABELS } from "@/lib/catalog";
import { describeVariants } from "@/lib/selection";
import { useCart } from "@/lib/useCart";
import type { CartItem } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { buildOrderMessage } from "@/lib/whatsapp";
import { ButtonLink, buttonClass } from "./ui";
import { WhatsAppButton } from "./WhatsAppButton";

const inputCls = "min-h-11 w-full rounded-xl border border-line bg-white px-3 py-2 text-base";

function itemDetails(product: Product, item: CartItem): string[] {
  const f = item.selection.fields;
  const lines: string[] = [];
  for (const v of describeVariants(product, item.selection)) lines.push(`${v.label}: ${v.value}`);
  if (f.businessName) lines.push(`Negocio: ${f.businessName}`);
  if (f.customText) lines.push(`${product.customTextLabel ?? "Texto"}: ${f.customText}`);
  if (f.destinationUrl) lines.push(`Destino: ${f.destinationUrl}`);
  if (f.color) lines.push(`Color preferido: ${f.color}`);
  if (f.hasLogo) lines.push("Tiene logo para enviar por WhatsApp");
  if (f.notes) lines.push(`Observaciones: ${f.notes}`);
  return lines;
}

export function CartView() {
  const { cart, hydrated, units, setQuantity, remove, clear, patch } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const products = getAllProducts();
  const orderMessage = buildOrderMessage({
    items: cart.items.flatMap((item) => {
      const product = products.find((p) => p.id === item.selection.productId);
      return product ? [{ product, item }] : [];
    }),
    customerName: cart.customerName,
    customerCity: cart.customerCity,
    notes: cart.notes,
  });

  if (!hydrated) {
    return <p className="py-10 text-ink-soft">Cargando tu pedido…</p>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">Todavía no agregaste productos</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Explorá el catálogo, personalizá lo que te interese y armá tu pedido.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/productos/">Ver productos</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <section aria-labelledby="items-title">
        <h2 id="items-title" className="sr-only">
          Productos de tu pedido
        </h2>
        <ul className="space-y-4">
          {cart.items.map((item) => {
            const product = products.find((p) => p.id === item.selection.productId);
            if (!product) return null;
            const category = getCategory(product.categorySlug);
            const details = itemDetails(product, item);
            const qtyId = `qty-${item.id}`;
            return (
              <li key={item.id} className="flex gap-4 rounded-lg border border-line bg-white p-4">
                <ProductVisual
                  kind={product.visual}
                  technology={product.technology}
                  accent={category?.accent ?? "#ff6a13"}
                  label=""
                  showTag={false}
                  className="hidden h-24 w-32 shrink-0 rounded-xl sm:block"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-snug">
                    <Link href={`/productos/${product.slug}/`} className="hover:underline">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs font-semibold text-brand-dark">
                    {TECH_LABELS[product.technology]}
                  </p>
                  {details.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-sm text-ink-soft">
                      {details.map((d) => (
                        <li key={d} className="break-words">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.selection.quantity - 1)}
                        disabled={item.selection.quantity <= product.quantity.min}
                        aria-label={`Restar una unidad de ${product.name}`}
                        className="grid h-11 w-11 place-items-center rounded-md border border-line text-xl font-semibold hover:bg-paper-2 disabled:opacity-40"
                      >
                        −
                      </button>
                      <label htmlFor={qtyId} className="sr-only">
                        Cantidad de {product.name}
                      </label>
                      <input
                        id={qtyId}
                        type="number"
                        inputMode="numeric"
                        min={product.quantity.min}
                        max={product.quantity.max}
                        value={item.selection.quantity}
                        onChange={(e) => {
                          if (Number.isFinite(e.target.valueAsNumber))
                            setQuantity(item.id, e.target.valueAsNumber);
                        }}
                        className="min-h-11 w-20 rounded-xl border border-line bg-white px-2 text-center text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.selection.quantity + 1)}
                        disabled={item.selection.quantity >= product.quantity.max}
                        aria-label={`Sumar una unidad de ${product.name}`}
                        className="grid h-11 w-11 place-items-center rounded-md border border-line text-xl font-semibold hover:bg-paper-2 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="min-h-11 rounded-md px-3 text-sm font-semibold text-red-700 underline hover:bg-red-50"
                    >
                      Eliminar<span className="sr-only"> {product.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href="/productos/" variant="secondary">
            Seguir comprando
          </ButtonLink>
          {confirmClear ? (
            <span className="flex items-center gap-2" role="group" aria-label="Confirmar vaciado">
              <span className="text-sm font-semibold">¿Vaciar todo el pedido?</span>
              <button
                type="button"
                className={buttonClass("ghost", "!min-h-11 !px-4 text-red-700")}
                onClick={() => {
                  clear();
                  setConfirmClear(false);
                }}
              >
                Sí, vaciar
              </button>
              <button
                type="button"
                className={buttonClass("ghost", "!min-h-11 !px-4")}
                onClick={() => setConfirmClear(false)}
              >
                Cancelar
              </button>
            </span>
          ) : (
            <button
              type="button"
              className={buttonClass("ghost", "!min-h-11 !px-4 text-red-700")}
              onClick={() => setConfirmClear(true)}
            >
              Vaciar pedido
            </button>
          )}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-line bg-white p-5 lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold">Resumen</h2>
        <p className="mt-2 text-sm text-ink-soft" role="status">
          {cart.items.length} {cart.items.length === 1 ? "producto" : "productos"} · {units}{" "}
          {units === 1 ? "unidad" : "unidades"}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Precio final a confirmar: te pasamos el presupuesto por WhatsApp.
        </p>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="customerName" className="mb-1 block text-sm font-semibold">
              Tu nombre (opcional)
            </label>
            <input
              id="customerName"
              className={inputCls}
              maxLength={80}
              autoComplete="name"
              value={cart.customerName}
              onChange={(e) => patch({ customerName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="customerCity" className="mb-1 block text-sm font-semibold">
              Localidad (opcional)
            </label>
            <input
              id="customerCity"
              className={inputCls}
              maxLength={80}
              autoComplete="address-level2"
              value={cart.customerCity}
              onChange={(e) => patch({ customerCity: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="orderNotes" className="mb-1 block text-sm font-semibold">
              Observaciones generales (opcional)
            </label>
            <textarea
              id="orderNotes"
              rows={3}
              maxLength={1000}
              className={inputCls}
              value={cart.notes}
              onChange={(e) => patch({ notes: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6">
          <WhatsAppButton
            message={orderMessage}
            label="Enviar pedido por WhatsApp"
            className="w-full"
          />
          <p className="mt-3 text-xs text-ink-soft">
            Se abre WhatsApp con tu pedido ya escrito; vos lo enviás. Tu pedido se mantiene acá
            hasta que lo vacíes. Trabajamos por encargo con un anticipo del 50% una vez confirmado
            el presupuesto.
          </p>
        </div>
      </aside>
    </div>
  );
}
