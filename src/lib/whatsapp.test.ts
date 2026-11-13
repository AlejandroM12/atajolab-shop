import { describe, expect, it } from "vitest";
import { addItem, EMPTY_CART } from "./cart";
import { getProduct } from "./catalog";
import { createDefaultSelection } from "./selection";
import {
  buildComingSoonMessage,
  buildCustomRequestMessage,
  buildMailtoUrl,
  buildOrderMessage,
  buildProductInquiryMessage,
  buildWhatsAppUrl,
  isMessageTooLong,
  formatWhatsAppDisplay,
  getWhatsAppNumber,
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

describe("número oficial", () => {
  it("el número configurado tiene formato wa.me válido", () => {
    expect(getWhatsAppNumber()).toBe("5493705204454");
  });
  it("se muestra con el formato +54 9 370 5204454", () => {
    expect(formatWhatsAppDisplay("5493705204454")).toBe("+54 9 370 5204454");
    expect(formatWhatsAppDisplay("14155550100")).toBe("+14155550100");
  });
  it("los enlaces apuntan al número oficial con el mensaje precompletado", () => {
    const url = buildWhatsAppUrl(getWhatsAppNumber()!, buildProductInquiryMessage(sticker, createDefaultSelection(sticker)));
    expect(url.startsWith("https://wa.me/5493705204454?text=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("Hola, quiero consultar por el producto Sticker QR.");
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
  const stickerConDestino = {
    ...sticker,
    variantGroups: [{ id: "destino", label: "¿A dónde va a llevar?", options: [{ id: "resenas", label: "Reseñas de Google" }] }],
  };
  const s2 = createDefaultSelection(stickerConDestino);
  s2.quantity = 5;
  s2.variants = { destino: "resenas" };

  let cart = addItem(EMPTY_CART, soporte, s1);
  cart = addItem(cart, stickerConDestino, s2);
  const message = buildOrderMessage({
    items: cart.items.map((item) => ({
      item,
      product: item.selection.productId === soporte.id ? soporte : stickerConDestino,
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

describe("mensajes con precios", () => {
  const priced = {
    name: "Soporte de prueba",
    price: { amount: 10000, currency: "ARS" as const },
    variantGroups: [{ id: "t", label: "Tamaño", options: [{ id: "g", label: "Grande", price: 15000 }] }],
  };
  const quote = { name: "Producto a medida", variantGroups: [], price: undefined };
  const sel = (quantity: number, variants: Record<string, string> = {}) => ({ selection: { ...createDefaultSelection(sticker), quantity, variants } });
  const flat = (m: string) => m.replace(/\s/g, " ");

  it("la consulta incluye precio unitario y subtotal si hay precio", () => {
    const m = flat(buildProductInquiryMessage(priced, { ...createDefaultSelection(sticker), quantity: 2, variants: { t: "g" } }));
    expect(m).toContain("Hola, quiero consultar por el producto Soporte de prueba.");
    expect(m).toContain("Precio unitario de referencia: $ 15.000");
    expect(m).toContain("Subtotal de referencia: $ 30.000");
    expect(m).toContain("Los importes son de referencia");
  });
  it("sin precio indica que se presupuesta", () => {
    expect(buildProductInquiryMessage(quote, createDefaultSelection(sticker))).toContain("Precio: a presupuestar");
  });
  it("el pedido con todo cotizado informa el total", () => {
    const m = flat(buildOrderMessage({ items: [{ product: priced, item: sel(2) }, { product: priced, item: sel(1, { t: "g" }) }] }));
    expect(m).toContain("TOTAL DE REFERENCIA: $ 35.000");
  });
  it("el pedido mixto no informa total y detalla lo que se presupuesta", () => {
    const m = flat(buildOrderMessage({ items: [{ product: priced, item: sel(1) }, { product: quote, item: sel(3) }] }));
    expect(m).not.toContain("TOTAL");
    expect(m).toContain("Subtotal de referencia de los productos con precio: $ 10.000");
    expect(m).toContain("Productos a presupuestar: 1");
  });
  it("el pedido sin precios no muestra importes", () => {
    const m = buildOrderMessage({ items: [{ product: quote, item: sel(1) }] });
    expect(m).not.toContain("$");
  });
});

describe("productos con precio base 'desde'", () => {
  const desde = { name: "Cartel a medida", price: { amount: 22900, currency: "ARS" as const, from: true }, variantGroups: [] };
  const flat = (m: string) => m.replace(/\s/g, " ");
  it("no suma como total ni como $0: se presupuesta y muestra el 'desde' como referencia", () => {
    const sel = { ...createDefaultSelection(sticker), quantity: 3 };
    const one = flat(buildProductInquiryMessage(desde, sel));
    expect(one).toContain("a presupuestar (desde $ 22.900, importe de referencia)");
    expect(one).not.toContain("Subtotal");
    const order = flat(buildOrderMessage({ items: [{ product: desde, item: { selection: sel } }] }));
    expect(order).not.toContain("TOTAL");
    expect(order).toContain("Los importes son de referencia");
  });
  it("el aviso 'próximamente' no es un pedido", () => {
    const m = buildComingSoonMessage({ name: "Carta digital editable" });
    expect(m).toContain("Carta digital editable");
    expect(m).toContain("cuando esté disponible");
    expect(m).not.toContain("Precio");
  });
});
