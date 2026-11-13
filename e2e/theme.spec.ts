import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const KEY = "atajolab-shop:theme";
const theme = (page: Page) => page.evaluate(() => document.documentElement.getAttribute("data-theme"));
const stored = (page: Page) => page.evaluate((k) => localStorage.getItem(k), KEY);
const toggle = (page: Page) => page.locator("[data-theme-pref]");

test.describe("tema: preferencia del sistema", () => {
  test.use({ colorScheme: "dark" });
  test("sin elección sigue al sistema (oscuro)", async ({ page }) => {
    await page.goto("/");
    expect(await theme(page)).toBe("dark");
    expect(await stored(page)).toBeNull();
    await expect(toggle(page)).toHaveAttribute("data-theme-pref", "system");
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(17, 17, 19)");
  });
});

test.describe("tema: claro por defecto", () => {
  test.use({ colorScheme: "light" });

  test("sin elección sigue al sistema (claro) y reacciona a sus cambios", async ({ page }) => {
    await page.goto("/");
    expect(await theme(page)).toBe("light");
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(255, 255, 255)");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect.poll(() => theme(page)).toBe("dark");
    await page.emulateMedia({ colorScheme: "light" });
    await expect.poll(() => theme(page)).toBe("light");
  });

  test("el selector cicla sistema → claro → oscuro → sistema y guarda la preferencia", async ({ page }) => {
    await page.goto("/");
    const t = toggle(page);
    await expect(t).toHaveAttribute("aria-label", /Tema: Sistema/);
    await t.click();
    await expect(t).toHaveAttribute("data-theme-pref", "light");
    expect(await stored(page)).toBe("light");
    await t.click();
    await expect(t).toHaveAttribute("data-theme-pref", "dark");
    expect(await theme(page)).toBe("dark");
    expect(await stored(page)).toBe("dark");
    // persiste al recargar y al navegar
    await page.reload();
    expect(await theme(page)).toBe("dark");
    await expect(t).toHaveAttribute("data-theme-pref", "dark");
    await page.goto("/productos/");
    expect(await theme(page)).toBe("dark");
    await t.click();
    await expect(t).toHaveAttribute("data-theme-pref", "system");
    expect(await stored(page)).toBe("system");
    expect(await theme(page)).toBe("light");
  });

  test("una elección manual manda sobre el sistema", async ({ page }) => {
    await page.addInitScript((k) => localStorage.setItem(k, "dark"), KEY);
    await page.goto("/");
    expect(await theme(page)).toBe("dark");
    await page.emulateMedia({ colorScheme: "light" });
    expect(await theme(page)).toBe("dark");
  });

  test("un valor guardado inválido se trata como sistema", async ({ page }) => {
    await page.addInitScript((k) => localStorage.setItem(k, "violeta"), KEY);
    await page.goto("/");
    expect(await theme(page)).toBe("light");
    await expect(toggle(page)).toHaveAttribute("data-theme-pref", "system");
  });

  test("el tema se aplica antes de hidratar (sin parpadeo) y sin errores de hidratación", async ({ page }) => {
    await page.addInitScript((k) => {
      localStorage.setItem(k, "dark");
      document.addEventListener("DOMContentLoaded", () => {
        (window as unknown as { __early: string | null }).__early = document.documentElement.getAttribute("data-theme");
      });
    }, KEY);
    const problems: string[] = [];
    page.on("console", (m) => {
      if (["error", "warning"].includes(m.type()) && /hydrat|did not match/i.test(m.text())) problems.push(m.text());
    });
    page.on("pageerror", (e) => problems.push(String(e)));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await page.evaluate(() => (window as unknown as { __early: string }).__early)).toBe("dark");
    for (const path of ["/productos/soporte-qr-nfc-resenas/", "/pedido/", "/personalizados/"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(problems).toEqual([]);
  });
});

test.describe("tienda en ambos temas", () => {
  for (const mode of ["light", "dark"] as const) {
    test(`flujo de compra completo en tema ${mode}`, async ({ page }) => {
      await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, mode]);
      await page.goto("/productos/");
      expect(await theme(page)).toBe(mode);
      await page.getByRole("group", { name: "Categorías" }).getByRole("button", { name: "Eventos" }).click();
      await expect(page.getByRole("heading", { level: 3, name: "Colgantes QR" })).toBeVisible();
      await page.goto("/productos/sticker-qr/");
      await page.getByLabel("Nombre del negocio (opcional)").fill("Café Sol");
      await page.getByLabel("Cantidad", { exact: true }).fill("3");
      await page.getByRole("button", { name: "Agregar al pedido" }).click();
      await expect(page.getByText("Agregamos este producto a tu pedido")).toBeVisible();
      await page.goto("/pedido/");
      await expect(page.getByTestId("line-price")).toContainText("7.500");
      const href = await page.getByRole("link", { name: /Enviar pedido por WhatsApp/ }).getAttribute("href");
      expect(href).toContain("https://wa.me/5493705204454?text=");
      expect(await theme(page)).toBe(mode);
    });
  }

  const paths = [
    "/",
    "/productos/",
    "/productos/soporte-qr-nfc-resenas/",
    "/pedido/",
    "/como-comprar/",
    "/personalizados/",
    "/preguntas-frecuentes/",
    "/condiciones-comerciales/",
    "/privacidad/",
    "/contacto/",
  ];
  for (const mode of ["dark", "light"] as const) {
    for (const path of paths) {
      test(`${path}: accesibilidad y contraste en tema ${mode}`, async ({ page }) => {
        await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, mode]);
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        expect(await theme(page)).toBe(mode);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 120)).join(" | ")}`)).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
      });
    }
  }
});

test.describe("favicon e íconos", () => {
  test("el <head> declara íconos válidos y todos cargan", async ({ page, request }) => {
    await page.goto("/");
    const links = await page.evaluate(() =>
      [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')].map((l) => ({
        rel: l.getAttribute("rel"),
        href: (l as HTMLLinkElement).href,
        type: l.getAttribute("type"),
      })),
    );
    const rels = links.map((l) => l.rel);
    expect(rels).toContain("icon");
    expect(rels).toContain("apple-touch-icon");
    expect(rels).toContain("manifest");
    for (const l of links) {
      const res = await request.get(l.href);
      expect(res.status(), l.href).toBe(200);
      const ct = res.headers()["content-type"] ?? "";
      expect(ct, l.href).toMatch(l.rel === "manifest" ? /json/ : /image\//);
    }
  });

  test("favicon.ico es un ICO real con 16, 32 y 48 px; el SVG usa el naranja de la marca", async ({ request }) => {
    const ico = await request.get("/favicon.ico");
    expect(ico.status()).toBe(200);
    const buf = await ico.body();
    expect([...buf.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(buf.readUInt16LE(4)).toBe(3);
    const svg = await (await request.get("/icon.svg")).text();
    expect(svg).toContain("#ff6a13");
  });

  test("el manifest apunta a íconos existentes", async ({ request }) => {
    const m = await (await request.get("/manifest.webmanifest")).json();
    expect(m.name).toBe("AtajoLab Shop");
    for (const icon of m.icons) {
      const res = await request.get(icon.src);
      expect(res.status(), icon.src).toBe(200);
    }
  });
});
