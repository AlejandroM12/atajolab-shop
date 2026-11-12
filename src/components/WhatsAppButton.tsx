"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/data/site";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  getWhatsAppNumber,
  isMessageTooLong,
} from "@/lib/whatsapp";
import { buttonClass, type ButtonVariant } from "./ui";

export function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1.100 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

/**
 * Abre WhatsApp con un mensaje prearmado (el usuario lo envía manualmente).
 * Si no hay número configurado, ofrece email (si existe) o copiar el mensaje.
 * `beforeOpen` permite validar: si devuelve false no se abre nada.
 */
export function WhatsAppButton({
  message,
  label = "Consultar por WhatsApp",
  variant = "whatsapp",
  className = "",
  beforeOpen,
  disabled = false,
  compact = false,
}: {
  message: string;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
  beforeOpen?: () => boolean;
  disabled?: boolean;
  /** Sin WhatsApp configurado, enlaza a /contacto/ en lugar de mostrar el aviso completo. */
  compact?: boolean;
}) {
  const [copied, setCopied] = useState<"ok" | "error" | null>(null);
  const number = getWhatsAppNumber();
  const cls = buttonClass(variant, className);

  const guard = (e: React.MouseEvent) => {
    if (beforeOpen && !beforeOpen()) e.preventDefault();
  };

  const tooLong = isMessageTooLong(message) ? (
    <p className="mt-2 text-xs text-ink-soft">
      El mensaje es muy largo y podría cortarse. Reducí las observaciones o enviá el pedido en
      partes.
    </p>
  ) : null;

  if (number) {
    return (
      <div>
        {disabled ? (
          <button type="button" className={cls} disabled>
            <WhatsAppIcon /> {label}
          </button>
        ) : (
          <a
            href={buildWhatsAppUrl(number, message)}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
            onClick={guard}
          >
            <WhatsAppIcon /> {label}
          </a>
        )}
        {tooLong}
      </div>
    );
  }

  if (compact) {
    return (
      <Link href="/contacto/" className={cls}>
        {label}
      </Link>
    );
  }

  const copy = async () => {
    if (beforeOpen && !beforeOpen()) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied("ok");
    } catch {
      setCopied("error");
    }
  };

  return (
    <div>
      <div className="rounded-xl border border-dashed border-line bg-paper-2 p-3 text-sm">
        <p className="font-semibold">Los pedidos por WhatsApp todavía no están habilitados.</p>
        <p className="mt-1 text-ink-soft">
          {SITE.contactEmail
            ? "Mientras tanto, podés escribirnos por email con el mismo mensaje."
            : "Podés copiar el mensaje y enviarlo por el medio de contacto que te hayamos pasado."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SITE.contactEmail && (
            <a
              href={buildMailtoUrl(SITE.contactEmail, `Consulta en ${SITE.name}`, message)}
              className={buttonClass("secondary", "!min-h-11")}
              onClick={guard}
            >
              Enviar por email
            </a>
          )}
          <button type="button" className={buttonClass("secondary", "!min-h-11")} onClick={copy} disabled={disabled}>
            Copiar mensaje
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 text-xs">
          {copied === "ok" && "Mensaje copiado."}
          {copied === "error" && "No pudimos copiar el mensaje. Seleccionalo manualmente."}
        </p>
      </div>
      {tooLong}
    </div>
  );
}
