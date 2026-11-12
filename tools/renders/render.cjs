/**
 * Renderiza escenas 3D (scene.js) con Chrome y guarda PNG en ./out.
 *
 *   npm run render -- p-001 p-002          escenas puntuales
 *   npm run render -- hero:800:500         escena con tamaño (ancho:alto base, se renderiza a 2x)
 *   npm run render:all                     las 26 imágenes del sitio
 *
 * Variable N = cantidad de cuadros acumulados para las sombras suaves (por defecto 24).
 */
const { chromium } = require("playwright");
const fs = require("fs");
const http = require("http");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "out");
const FRAMES = process.env.N || 24;

/** Escenas del sitio. Tamaño base 800x600 (4:3) salvo la portada (800x500). */
const ALL = [
  ...Array.from({ length: 20 }, (_, i) => `p-${String(i + 1).padStart(3, "0")}`),
  "hero:800:500",
  "cat-resenas",
  "cat-menus",
  "cat-eventos",
  "cat-tarjetas",
  "cat-stickers",
];

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json" };

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const file = path.join(ROOT, decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

(async () => {
  const args = process.argv.slice(2);
  const ids = args.includes("--all") ? ALL : args;
  if (ids.length === 0) {
    console.error("Indicá escenas (p-001, hero:800:500, cat-menus…) o usá --all.");
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || "chrome",
    // WebGL por software: no requiere GPU.
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  try {
    for (const id of ids) {
      const [scene, w, h] = id.split(":");
      const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
      page.on("pageerror", (e) => console.error("ERROR", id, e.message));
      const t = Date.now();
      await page.goto(`http://localhost:${port}/index.html?s=${scene}&w=${w || 800}&h=${h || 600}&n=${FRAMES}`);
      await page.waitForFunction("window.__done===true", null, { timeout: 280000 });
      const data = await page.evaluate(() => document.querySelectorAll("canvas")[0].toDataURL("image/png"));
      fs.writeFileSync(path.join(OUT, `${scene}.png`), Buffer.from(data.split(",")[1], "base64"));
      console.log(scene, `${((Date.now() - t) / 1000).toFixed(1)}s`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
})();
