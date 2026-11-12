import { buildGeneralInquiryMessage, buildWhatsAppUrl, formatWhatsAppDisplay, getWhatsAppNumber } from "@/lib/whatsapp";

/** Enlace de texto a WhatsApp (sin estado), para footer y páginas informativas. */
export function WhatsAppLink({ message = buildGeneralInquiryMessage(), className = "" }: { message?: string; className?: string }) {
  const number = getWhatsAppNumber();
  if (!number) return null;
  return (
    <a href={buildWhatsAppUrl(number, message)} target="_blank" rel="noopener noreferrer" className={className}>
      {formatWhatsAppDisplay(number)}
    </a>
  );
}
