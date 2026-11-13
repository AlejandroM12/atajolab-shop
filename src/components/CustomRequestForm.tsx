"use client";

import { useState } from "react";
import { buildCustomRequestMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "./WhatsAppButton";

const inputCls =
  "min-h-11 w-full rounded-md border border-line bg-surface px-3 py-2 text-base aria-[invalid=true]:border-danger";

export function CustomRequestForm() {
  const [need, setNeed] = useState("");
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const invalid = need.trim().length < 3;

  return (
    <form
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:p-6"
    >
      <div>
        <label htmlFor="need" className="mb-1 block text-sm font-semibold">
          ¿Qué necesitás?
        </label>
        <textarea
          id="need"
          rows={4}
          maxLength={500}
          className={inputCls}
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          aria-invalid={showError && invalid}
          aria-describedby={showError && invalid ? "need-error" : undefined}
          placeholder="Ej: llaveros con QR para mi local"
        />
        {showError && invalid && (
          <p id="need-error" role="alert" className="mt-1 text-sm font-medium text-danger">
            Contanos brevemente qué necesitás.
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cr-quantity" className="mb-1 block text-sm font-semibold">
            Cantidad (opcional)
          </label>
          <input
            id="cr-quantity"
            className={inputCls}
            maxLength={40}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cr-name" className="mb-1 block text-sm font-semibold">
            Nombre (opcional)
          </label>
          <input
            id="cr-name"
            className={inputCls}
            maxLength={80}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <WhatsAppButton
        label="Enviar consulta por WhatsApp"
        className="w-full"
        message={buildCustomRequestMessage({ need, quantity, name })}
        beforeOpen={() => {
          setShowError(true);
          if (invalid) document.getElementById("need")?.focus();
          return !invalid;
        }}
      />
    </form>
  );
}
