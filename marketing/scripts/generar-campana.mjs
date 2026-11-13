// Genera la campaña de lanzamiento (3 piezas x 2 formatos) a partir de los renders originales de public/productos.
// Uso: node marketing/scripts/generar-campana.mjs
// No forma parte del código de producción de la tienda.
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "../..");
const PRODUCTOS = join(RAIZ, "public/productos");
const FUENTE = pathToFileURL(join(AQUI, "fuentes/Inter-latin.woff2")).href;
const OUT_IG = join(RAIZ, "marketing/lanzamiento-instagram");
const OUT_TT = join(RAIZ, "marketing/lanzamiento-tiktok");
mkdirSync(OUT_IG, { recursive: true });
mkdirSync(OUT_TT, { recursive: true });

const NARANJA = "#ff6a13";
const render = (n) => pathToFileURL(join(PRODUCTOS, `${n}.webp`)).href;

const logo = (x, y, s) => `
  <div class="logo" style="left:${x}px;top:${y}px;font-size:${s * 0.68}px">
    <span class="iso" style="width:${s}px;height:${s}px;padding:${s * 0.21}px;gap:${s * 0.11}px;border-radius:${s * 0.21}px">
      <i></i><i class="d"></i><i class="d"></i><i></i>
    </span>
    <span>AtajoLab <b>Shop</b></span>
  </div>`;

const tile = (img, x, y, w, h, pos = "50% 50%", chip = "") => `
  <div class="tile" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
    <img src="${render(img)}" style="object-position:${pos}" />
    ${chip ? `<span class="chip">${chip}</span>` : ""}
  </div>`;

const texto = (cls, x, y, w, size, html, extra = "") =>
  `<div class="${cls}" style="left:${x}px;top:${y}px;width:${w}px;font-size:${size}px;${extra}">${html}</div>`;

const flecha = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const cta = (x, y, w, h) => `
  <div class="cta" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
    <span>tienda.atajolab.dev</span>${flecha}
  </div>`;
const pildora = (x, y, s) =>
  `<div class="pill" style="left:${x}px;top:${y}px;font-size:${s}px"><i></i>Ya disponible</div>`;

const css = (W, H) => `
@font-face{font-family:Inter;src:url("${FUENTE}") format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#0e0e11;font-family:Inter,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.fondo{position:absolute;inset:0;background:
  radial-gradient(900px 700px at 100% 0%,rgba(255,106,19,.22),transparent 65%),
  radial-gradient(800px 700px at 0% 100%,rgba(255,106,19,.10),transparent 65%),
  linear-gradient(180deg,#131317,#0b0b0e)}
.logo{position:absolute;display:flex;align-items:center;gap:.5em;font-weight:600;letter-spacing:-.01em;white-space:nowrap}
.logo b{color:${NARANJA};font-weight:600}
.iso{display:grid;grid-template-columns:1fr 1fr;background:${NARANJA}}
.iso i{display:block;background:#fff;border-radius:18%}
.iso i.d{background:rgba(255,255,255,.4)}
.h{position:absolute;font-weight:800;letter-spacing:-.035em;line-height:1.02}
.h em{font-style:normal;color:${NARANJA}}
.s{position:absolute;font-weight:500;color:#c9c9d1;letter-spacing:-.01em;line-height:1.3}
.tile{position:absolute;border-radius:36px;overflow:hidden;background:#e9e4de;box-shadow:0 36px 70px -20px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.09)}
.tile img{width:100%;height:100%;object-fit:cover;display:block}
.chip{position:absolute;left:22px;bottom:22px;padding:9px 20px;border-radius:999px;background:#0e0e11;color:#fff;font-weight:700;font-size:25px;letter-spacing:-.01em}
.pill{position:absolute;display:flex;align-items:center;gap:.6em;padding:.55em 1.1em;border-radius:999px;border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);font-weight:600;white-space:nowrap}
.pill i{width:.55em;height:.55em;border-radius:50%;background:${NARANJA};box-shadow:0 0 0 .22em rgba(255,106,19,.25)}
.cta{position:absolute;display:flex;align-items:center;justify-content:center;gap:24px;border-radius:999px;background:${NARANJA};color:#1a1a1a;font-weight:800;font-size:56px;letter-spacing:-.025em;box-shadow:0 24px 50px -16px rgba(255,106,19,.6)}
`;

const pagina = (W, H, cuerpo) =>
  `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css(W, H)}</style></head><body><div class="fondo"></div>${cuerpo}</body></html>`;

// ---------- 4:5 (1080 x 1350) ----------
const ig = {
  "01": pagina(1080, 1350, [
    logo(70, 78, 56), pildora(748, 84, 26),
    texto("h", 70, 196, 940, 112, "Tu negocio,<br><em>más conectado.</em>"),
    texto("s", 70, 450, 940, 46, "Conocé AtajoLab Shop."),
    tile("soporte-qr-nfc-resenas", 70, 580, 520, 700, "40% 50%"),
    tile("tarjeta-qr-nfc", 620, 580, 390, 335, "50% 52%"),
    tile("soporte-qr-nfc-mesa", 620, 945, 390, 335, "60% 50%"),
  ].join("")),
  "02": pagina(1080, 1350, [
    logo(70, 78, 56),
    texto("h", 70, 190, 960, 94, "Un toque.<br><em>Más posibilidades.</em>"),
    texto("s", 70, 400, 960, 37, "Reseñas de Google, menús, tarjetas y mucho más."),
    tile("soporte-qr-nfc-resenas", 70, 560, 458, 344, "42% 50%", "Reseñas"),
    tile("soporte-qr-nfc-mesa", 552, 560, 458, 344, "62% 50%", "Menús"),
    tile("tarjeta-nfc", 70, 928, 458, 344, "50% 55%", "Tarjetas"),
    tile("colgantes-qr", 552, 928, 458, 344, "50% 68%", "Eventos"),
  ].join("")),
  "03": pagina(1080, 1350, [
    logo(70, 78, 56),
    texto("h", 70, 190, 940, 118, "Elegí.<br>Personalizá.<br><em>Conectá.</em>"),
    texto("s", 70, 566, 940, 44, "Descubrí nuestra tienda online."),
    tile("soporte-qr-nfc-mesa", 70, 664, 458, 344, "58% 50%"),
    tile("tarjeta-qr-nfc", 552, 664, 458, 344, "50% 55%"),
    cta(70, 1090, 940, 124),
  ].join("")),
};

// ---------- 9:16 (1080 x 1920) · zonas seguras: 260 arriba, 340 abajo ----------
const tt = {
  "01": pagina(1080, 1920, [
    logo(70, 270, 60), pildora(748, 278, 26),
    texto("h", 70, 390, 940, 114, "Tu negocio,<br><em>más conectado.</em>"),
    texto("s", 70, 650, 940, 48, "Conocé AtajoLab Shop."),
    tile("soporte-qr-nfc-resenas", 70, 790, 560, 790, "40% 50%"),
    tile("tarjeta-qr-nfc", 660, 790, 350, 380, "46% 52%"),
    tile("soporte-qr-nfc-mesa", 660, 1200, 350, 380, "62% 50%"),
  ].join("")),
  "02": pagina(1080, 1920, [
    logo(70, 270, 60),
    texto("h", 70, 390, 960, 96, "Un toque.<br><em>Más posibilidades.</em>"),
    texto("s", 70, 610, 960, 38, "Reseñas de Google, menús, tarjetas y mucho más."),
    tile("soporte-qr-nfc-resenas", 70, 760, 458, 400, "42% 50%", "Reseñas"),
    tile("soporte-qr-nfc-mesa", 552, 760, 458, 400, "62% 50%", "Menús"),
    tile("tarjeta-nfc", 70, 1184, 458, 400, "50% 55%", "Tarjetas"),
    tile("colgantes-qr", 552, 1184, 458, 400, "50% 68%", "Eventos"),
  ].join("")),
  "03": pagina(1080, 1920, [
    logo(70, 270, 60),
    texto("h", 70, 390, 940, 132, "Elegí.<br>Personalizá.<br><em>Conectá.</em>"),
    texto("s", 70, 810, 940, 48, "Descubrí nuestra tienda online."),
    tile("soporte-qr-nfc-mesa", 70, 930, 458, 400, "58% 50%"),
    tile("tarjeta-qr-nfc", 552, 930, 458, 400, "50% 55%"),
    cta(70, 1410, 940, 136),
  ].join("")),
};

const navegador = await chromium.launch({ channel: "chrome" });
const salidas = [];
for (const [carpeta, piezas, W, H, prefijo] of [
  [OUT_IG, ig, 1080, 1350, "instagram"],
  [OUT_TT, tt, 1080, 1920, "tiktok"],
]) {
  const contexto = await navegador.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const p = await contexto.newPage();
  for (const [n, html] of Object.entries(piezas)) {
    const tmp = join(carpeta, `.tmp-${n}.html`);
    writeFileSync(tmp, html);
    await p.goto(pathToFileURL(tmp).href);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
    // Ningún texto debe desbordar su caja ni salirse del lienzo.
    const desborde = await p.evaluate((ancho) => {
      const malos = [];
      for (const el of document.querySelectorAll(".h,.s,.logo,.cta,.pill,.chip")) {
        const r = el.getBoundingClientRect();
        if (r.right > ancho - 60 || r.left < 60 - 1 || el.scrollWidth > el.clientWidth + 1 && !el.classList.contains("logo") && !el.classList.contains("pill")) {
          malos.push(el.textContent.trim().slice(0, 30) + ` (${Math.round(r.left)}-${Math.round(r.right)})`);
        }
      }
      return malos;
    }, W);
    if (desborde.length) console.warn(`${prefijo}-${n}: posible desborde`, desborde);
    const archivo = join(carpeta, `${prefijo}-${n}.png`);
    await p.screenshot({ path: archivo, type: "png" });
    salidas.push(archivo);
  }
  await contexto.close();
}
await navegador.close();

// Vista previa conjunta del carrusel (fila 4:5 arriba, fila 9:16 abajo).
const ancho = 360;
const fila = async (archivos, alto, top) =>
  Promise.all(
    archivos.map(async (f, i) => ({
      input: await sharp(f).resize(ancho, alto).png().toBuffer(),
      left: 30 + i * (ancho + 30),
      top,
    })),
  );
const h45 = 450;
const h916 = 640;
const piezas = [...(await fila(salidas.slice(0, 3), h45, 30)), ...(await fila(salidas.slice(3), h916, h45 + 60))];
await sharp({
  create: { width: 30 + 3 * (ancho + 30), height: h45 + h916 + 90, channels: 3, background: "#2a2a30" },
})
  .composite(piezas)
  .png()
  .toFile(join(RAIZ, "marketing/vista-previa-carrusel.png"));

for (const f of salidas) {
  const m = await sharp(f).metadata();
  console.log(f.replace(RAIZ, "").replaceAll("\\", "/"), `${m.width}x${m.height}`);
}
