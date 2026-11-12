/**
 * Next.js 16 con `output: "export"` genera los datos de prefetch por segmento en carpetas:
 *
 *   out/productos/__next.productos/__PAGE__.txt
 *   out/productos/x/__next.productos/$d$slug/__PAGE__.txt
 *
 * pero el cliente los pide con puntos en lugar de carpetas:
 *
 *   /productos/__next.productos.__PAGE__.txt
 *   /productos/x/__next.productos.$d$slug.__PAGE__.txt
 *
 * En un host estático (Cloudflare Pages incluido) esas URLs devuelven 404: la navegación sigue
 * funcionando, pero se pierde el prefetch y la consola se llena de errores. Este script copia cada
 * archivo a la ruta que pide el cliente, sin tocar los originales.
 */
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = process.argv[2] ?? "out";
if (!existsSync(OUT)) {
  console.error(`No existe ${OUT}/. Ejecutá primero "next build".`);
  process.exit(1);
}

let copied = 0;

/** Recorre `dir` (dentro de una carpeta `__next.*`) y copia cada .txt con nombre punteado. */
function aliasTree(root, current) {
  for (const name of readdirSync(current)) {
    const full = join(current, name);
    if (statSync(full).isDirectory()) {
      aliasTree(root, full);
    } else if (name.endsWith(".txt")) {
      const parts = relative(root, full).split(sep);
      const alias = join(join(root, ".."), `${root.split(sep).pop()}.${parts.join(".")}`);
      if (!existsSync(alias)) {
        copyFileSync(full, alias);
        copied++;
      }
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) aliasTree(full, full);
    else walk(full);
  }
}

walk(OUT);
console.log(`export-prefetch-aliases: ${copied} archivos de prefetch con nombre punteado`);
