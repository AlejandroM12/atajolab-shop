/**
 * Convierte los PNG de ./out a WebP y los copia a /public con los nombres que usa el catálogo.
 *   npm run optimize
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "out");
const PUBLIC = path.join(__dirname, "..", "..", "public");

const PRODUCTS = {
  "p-001": "soporte-qr-resenas",
  "p-002": "soporte-qr-nfc-resenas",
  "p-003": "sticker-qr-nfc-resenas",
  "p-004": "cartel-mostrador-personalizado",
  "p-005": "soporte-qr-mesa",
  "p-006": "soporte-qr-nfc-mesa",
  "p-007": "sticker-qr-mesas",
  "p-008": "cartel-menu-personalizado",
  "p-009": "carta-digital-editable",
  "p-010": "colgantes-qr",
  "p-011": "credenciales-qr",
  "p-012": "identificadores-personalizados",
  "p-013": "tarjetas-qr-invitados",
  "p-014": "tarjeta-qr-contacto",
  "p-015": "tarjeta-nfc",
  "p-016": "tarjeta-qr-nfc",
  "p-017": "sticker-qr",
  "p-018": "sticker-nfc",
  "p-019": "etiqueta-qr-personalizada",
  "p-020": "adhesivo-qr-nfc-vidrieras",
};
const CATEGORIES = {
  "cat-resenas": "resenas-google",
  "cat-menus": "menus-restaurantes",
  "cat-eventos": "eventos",
  "cat-tarjetas": "tarjetas-digitales",
  "cat-stickers": "stickers-etiquetas",
};

const jobs = [
  ...Object.entries(PRODUCTS).map(([k, v]) => [k, `productos/${v}.webp`, 1200, 900]),
  ...Object.entries(CATEGORIES).map(([k, v]) => [k, `categorias/${v}.webp`, 1200, 900]),
  ["hero", "hero.webp", 1600, 1000],
];

(async () => {
  let total = 0;
  for (const [key, dest, w, h] of jobs) {
    const input = path.join(SRC, `${key}.png`);
    if (!fs.existsSync(input)) continue; // permite optimizar solo lo que se renderizó
    const out = path.join(PUBLIC, dest);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(input).resize(w, h).webp({ quality: 82, effort: 5 }).toFile(out);
    const size = fs.statSync(out).size;
    total += size;
    console.log(dest, `${Math.round(size / 1024)} KB`);
  }
  console.log("total", `${Math.round(total / 1024)} KB`);
})();
