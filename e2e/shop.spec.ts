import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WA = "https://wa.me/5493705204454?text=";

async function waMessage(page: Page, name: string | RegExp): Promise<string> {
  const href = await page.getByRole("link", { name }).first().getAttribute("href");
  expect(href).toContain(WA);
  return decodeURIComponent(href!.split("text=")[1]);
}

test.describe("catálogo", () => {
  test("la búsqueda filtra y se mantiene en la URL al recargar", async ({ page }) => {
    await page.goto("/productos/");
    await page.getByLabel("Buscar productos").fill("tarjeta");
    await expect(page).toHaveURL(/q=tarjeta/);
    await expect(page.getByRole("heading", { level: 3, name: "Tarjeta NFC" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Sticker QR", exact: true })).toHaveCount(0);

    await page.reload();
    await expect(page.getByLabel("Buscar productos")).toHaveValue("tarjeta");
    await expect(page.getByRole("heading", { level: 3, name: "Tarjeta NFC" })).toBeVisible();
  });

  test("filtra por categoría, tecnología y muestra estado vacío", async ({ page }) => {
    await page.goto("/productos/?categoria=eventos&tecnologia=nfc");
    await expect(page.getByText("No encontramos productos con esos filtros")).toBeVisible();

    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await expect(page).toHaveURL(/\/productos\/$/);

    await page.getByLabel("Disponibilidad").selectOption("proximamente");
    await expect(page.getByRole("heading", { level: 3, name: "Carta digital editable" })).toBeVisible();
    await expect(page.getByText("1 producto", { exact: true })).toBeVisible();
  });
});

test.describe("pedido", () => {
  test("agregar, persistir, editar, eliminar y enviar por WhatsApp", async ({ page }) => {
    await page.goto("/productos/sticker-qr/");

    // Validación de URL
    await page.getByLabel("Enlace de destino (opcional)").fill("esto no es una url");
    await page.getByRole("button", { name: "Agregar al pedido" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "dirección válida" })).toBeVisible();

    await page.getByLabel("Enlace de destino (opcional)").fill("https://cafesol.com/carta");
    await page.getByLabel("Nombre del negocio").fill("Café Sol");
    await page.getByLabel("¿A dónde va a llevar?").selectOption({ label: "Carta o menú digital" });
    await page.getByLabel("Cantidad", { exact: true }).fill("5");
    await page.getByRole("button", { name: "Agregar al pedido" }).click();
    await expect(page.getByText("Agregamos este producto a tu pedido")).toBeVisible();
    await expect(page.getByRole("link", { name: /Mi pedido/ }).first()).toContainText("1");

    // Agregar otro producto
    await page.goto("/productos/tarjeta-nfc/");
    await page.getByRole("button", { name: "Agregar al pedido" }).click();

    // Persiste al recargar
    await page.goto("/pedido/");
    await page.reload();
    await expect(page.getByRole("heading", { level: 3, name: "Sticker QR" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Tarjeta NFC" })).toBeVisible();
    await expect(page.getByText("Negocio: Café Sol")).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "2 productos" })).toBeVisible();

    // Cantidad
    await page.getByRole("button", { name: "Sumar una unidad de Sticker QR" }).click();
    await expect(page.getByLabel("Cantidad de Sticker QR")).toHaveValue("6");

    // Mensaje de WhatsApp
    await page.getByLabel("Tu nombre (opcional)").fill("Juan");
    await page.getByLabel("Localidad (opcional)").fill("Formosa");
    const msg = await waMessage(page, /Enviar pedido por WhatsApp/);
    expect(msg).toContain("1. Sticker QR");
    expect(msg).toContain("Cantidad: 6");
    expect(msg).toContain("Nombre del negocio: Café Sol");
    expect(msg).toContain("2. Tarjeta NFC");
    expect(msg).toContain("Nombre: Juan");
    expect(msg).toContain("Localidad: Formosa");

    // Abrir WhatsApp no vacía el pedido
    expect(await page.getByRole("link", { name: /Enviar pedido por WhatsApp/ }).getAttribute("target")).toBe("_blank");
    await expect(page.getByRole("heading", { level: 3, name: "Sticker QR" })).toBeVisible();

    // Eliminar
    await page.getByRole("button", { name: /Eliminar Tarjeta NFC/ }).click();
    await expect(page.getByRole("heading", { level: 3, name: "Tarjeta NFC" })).toHaveCount(0);

    // Vaciar
    await page.getByRole("button", { name: "Vaciar pedido" }).click();
    await page.getByRole("button", { name: "Sí, vaciar" }).click();
    await expect(page.getByText("Todavía no agregaste productos")).toBeVisible();
    await page.reload();
    await expect(page.getByText("Todavía no agregaste productos")).toBeVisible();
  });

  test("consulta individual desde la ficha sin agregar al pedido", async ({ page }) => {
    await page.goto("/productos/soporte-qr-resenas/");
    await page.getByLabel("Nombre del negocio").fill("Peluquería Luna");
    const msg = await waMessage(page, /Consultar este producto por WhatsApp/);
    expect(msg).toContain("Soporte QR para reseñas");
    expect(msg).toContain("Nombre del negocio: Peluquería Luna");
    await page.goto("/pedido/");
    await expect(page.getByText("Todavía no agregaste productos")).toBeVisible();
  });

  test("un producto próximamente no se puede agregar", async ({ page }) => {
    await page.goto("/productos/carta-digital-editable/");
    await expect(page.getByRole("button", { name: "Agregar al pedido" })).toHaveCount(0);
    await expect(page.getByText("Próximamente").first()).toBeVisible();
  });

  test("datos de carrito inválidos no rompen la tienda", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("atajolab-shop:cart", "{roto"));
    await page.goto("/pedido/");
    await expect(page.getByText("Todavía no agregaste productos")).toBeVisible();
  });
});

test("productos sin precio cerrado: presupuesto y sin total ficticio", async ({ page }) => {
  await page.goto("/productos/sticker-qr/");
  await expect(page.getByTestId("product-price")).toHaveText("Solicitar presupuesto");
  await page.getByRole("button", { name: "Agregar al pedido" }).click();
  await page.goto("/pedido/");
  await expect(page.getByTestId("line-price")).toContainText("A presupuestar");
  await expect(page.getByTestId("order-totals")).not.toContainText(/total/i);
  await expect(page.getByText("no mostramos un total")).toBeVisible();
  const msg = await waMessage(page, /Enviar pedido por WhatsApp/);
  expect(msg).toContain("Precio: a presupuestar");
  expect(msg).not.toContain("TOTAL");
});

test("el prefetch estático de Next.js no genera 404", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.url().includes("__next") && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(1000);
  await page.getByRole("link", { name: "Productos", exact: true }).first().click();
  await expect(page).toHaveURL(/\/productos\/$/);
  expect(failed).toEqual([]);
});

test("todos los enlaces de WhatsApp usan el número oficial", async ({ page }) => {
  for (const path of ["/", "/contacto/", "/productos/sticker-qr/", "/personalizados/"]) {
    await page.goto(path);
    const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    expect(hrefs.length, path).toBeGreaterThan(0);
    for (const h of hrefs) expect(h.startsWith(WA), `${path}: ${h}`).toBe(true);
  }
});

test("A medida ofrece AtajoLab QR (enlace externo) y el formulario de producto físico", async ({ page }) => {
  await page.goto("/personalizados/");
  const qr = page.getByRole("link", { name: "Crear mi QR", exact: true });
  await expect(qr).toHaveAttribute("href", "https://qr.atajolab.dev");
  await expect(qr).toHaveAttribute("target", "_blank");
  await expect(qr).toHaveAttribute("rel", /noopener/);
  await expect(page.getByRole("heading", { name: "¿Tenés una idea que no aparece en nuestro catálogo?" })).toBeVisible();
  await expect(page.getByText("anticipo del 50% para comenzar")).toBeVisible();
});

test("formulario de productos personalizados genera el mensaje", async ({ page }) => {
  await page.goto("/personalizados/");
  await page.getByLabel("¿Qué necesitás?").fill("Llaveros con QR");
  await page.getByLabel("Cantidad aproximada").fill("30");
  await page.getByLabel("Localidad").fill("Clorinda");
  const msg = await waMessage(page, /Enviar consulta por WhatsApp/);
  expect(msg).toContain("Necesito: Llaveros con QR");
  expect(msg).toContain("Cantidad aproximada: 30");
  expect(msg).toContain("Localidad: Clorinda");
});

test.describe("accesibilidad y responsive", () => {
  const paths = [
    "/",
    "/productos/",
    "/productos/soporte-qr-nfc-mesa/",
    "/categorias/eventos/",
    "/pedido/",
    "/como-comprar/",
    "/personalizados/",
    "/preguntas-frecuentes/",
    "/condiciones-comerciales/",
    "/contacto/",
    "/menu-digital/",
  ];
  for (const path of paths) {
    test(`${path}: sin violaciones axe ni desborde horizontal`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(" | ")}`)).toEqual([]);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
    });
  }
});

test("SEO: metadata, canonical y JSON-LD sin precios", async ({ page, request }) => {
  await page.goto("/productos/sticker-qr/");
  await expect(page).toHaveTitle(/Sticker QR \| AtajoLab Shop/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://tienda.atajolab.dev/productos/sticker-qr/",
  );
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join("")).toContain('"@type":"Product"');
  expect(ld.join("")).not.toContain("offers");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://tienda.atajolab.dev/productos/sticker-qr/");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://tienda.atajolab.dev/sitemap.xml");
});
