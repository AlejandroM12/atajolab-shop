import { describe, expect, it } from "vitest";
import { addItem, EMPTY_CART } from "./cart";
import { getProduct } from "./catalog";
import { createDefaultSelection } from "./selection";
import {
  buildCustomRequestMessage,
  buildMailtoUrl,
  buildOrderMessage,
  buildProductInquiryMessage,
  buildWhatsAppUrl,
  isMessageTooLong,
  parseWhatsAppNumber,
} from "./whatsapp";

const soporte = getProduct("soporte-qr-nfc-mesa")!;
const sticker = getProduct("sticker-qr")!;

describe("número de WhatsApp", () => {
  it("acepta formato internacional solo con dígitos", () => {
    expect(parseWhatsAppNumber("5493704000000")).toBe("5493704000000");
    expect(parseWhatsAppNumber(" 5493704000000 ")).toBe("5493704000000");
  });
  it("rechaza vacío, signos, espacios y valores cortos", () => {
    for (const v of [undefined, null, "", "+5493704000000", "549 370 4000000", "123", "abc", "0123456789"]) {
      expect(parseWhatsAppNumber(v)).toBeNull();
    }
  });
});

describe("URLs", () => {
  it("usa wa.me y codifica el mensaje", () => {
    const url = buildWhatsAppUrl("5493704000000", "Hola & chau\n¿Cómo? 100%");
    expect(url.startsWith("https://wa.me/5493704000000?text=")).toBe(true);
    expect(url).toContain("Hola%20%26%20chau%0A%C2%BFC%C3%B3mo%3F%20100%25");
    expect(decodeURIComponent(url.split("text=")[1])).toBe("Hola & chau\n¿Cómo? 100%");
  });
  it("arma el mailto alternativo codificado", () => {
    const url = buildMailtoUrl("a@b.com", "Consulta", "Hola mundo");
    expect(url).toBe("mailto:a@b.com?subject=Consulta&body=Hola%20mundo");
  });
  it("detecta mensajes demasiado largos", () => {
    expect(isMessageTooLong("hola")).toBe(false);
    expect(isMessageTooLong("ñ".repeat(2000))).toBe(true);
  });
});

describe("mensaje de pedido", () => {
  const s1 = createDefaultSelection(soporte);
  s1.quantity = 10;
  s1.fields.businessName = "Café Sol";
  s1.fields.hasLogo = true;
  s1.fields.destinationUrl = "https://cafesol.com/carta";
  const s2 = createDefaultSelection(sticker);
  s2.quantity = 5;
  s2.variants = { destino: "resenas" };

  let cart = addItem(EMPTY_CART, soporte, s1);
  cart = addItem(cart, sticker, s2);
  const message = buildOrderMessage({
    items: cart.items.map((item) => ({
      item,
      product: item.selection.productId === soporte.id ? soporte : sticker,
    })),
    customerName: "Juan",
    customerCity: "Formosa",
    notes: "Para el viernes",
  });

  it("incluye tienda, productos, cantidades y personalizaciones", () => {
    expect(message).toContain("AtajoLab Shop");
    expect(message).toContain("1. Soporte QR + NFC de mesa");
    expect(message).toContain("Cantidad: 10");
    expect(message).toContain("Nombre del negocio: Café Sol");
    expect(message).toContain("Destino: https://cafesol.com/carta");
    expect(message).toContain("Logo:");
    expect(message).toContain("2. Sticker QR");
    expect(message).toContain("¿A dónde va a llevar?: Reseñas de Google");
  });
  it("incluye datos del cliente, observaciones y pedido de confirmación", () => {
    expect(message).toContain("Nombre: Juan");
    expect(message).toContain("Localidad: Formosa");
    expect(message).toContain("Observaciones del pedido: Para el viernes");
    expect(message).toContain("confirmar el precio final");
  });
  it("omite datos que no se completaron", () => {
    const m = buildOrderMessage({
      items: [{ product: sticker, item: { selection: createDefaultSelection(sticker) } }],
    });
    expect(m).not.toContain("DATOS");
    expect(m).not.toContain("Nombre del negocio");
    expect(m).not.toContain("Color preferido");
  });
});

describe("consultas individuales", () => {
  it("genera el mensaje del producto con sus opciones", () => {
    const s = createDefaultSelection(sticker);
    s.quantity = 3;
    s.fields.color = "azul";
    const m = buildProductInquiryMessage(sticker, s);
    expect(m).toContain("Sticker QR");
    expect(m).toContain("Cantidad: 3");
    expect(m).toContain("Color preferido: azul");
  });
  it("genera el mensaje de producto personalizado", () => {
    const m = buildCustomRequestMessage({ need: "Llaveros QR", quantity: "50", name: "Ana", city: "Clorinda" });
    expect(m).toContain("Necesito: Llaveros QR");
    expect(m).toContain("Cantidad aproximada: 50");
    expect(m).toContain("Localidad: Clorinda");
  });
});
