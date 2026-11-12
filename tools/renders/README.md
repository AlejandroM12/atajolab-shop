# Renders ilustrativos de AtajoLab Shop

Código fuente para **regenerar** las 26 imágenes de producto, categoría y portada (`public/productos`, `public/categorias`, `public/hero.webp`). Son modelos 3D originales hechos con [three.js](https://threejs.org) y renderizados en Chrome con WebGL por software; no son fotografías de productos fabricados. Los QR codifican `https://atajolab.dev`.

Es una herramienta **independiente** de la tienda: tiene su propio `package.json` y no se instala con el proyecto principal ni forma parte del build.

## Contenido

| Archivo | Qué hace |
| --- | --- |
| `scene.js` | Escenas, modelos (soportes de acrílico, carpas, stickers, tarjetas, colgantes, credenciales…), materiales PBR, diseños impresos (canvas 2D), luces y acumulación de cuadros para sombras suaves |
| `index.html` | Página que carga three.js y `qrcode-generator` desde `node_modules` |
| `render.cjs` | Levanta un servidor local, abre Chrome con Playwright y guarda PNG en `out/` |
| `optimize.cjs` | Convierte `out/*.png` a WebP y los copia a `public/` con los nombres del catálogo |

## Uso

Requiere Node.js 20+ y Google Chrome instalado (o `PW_CHANNEL=chromium` con `npx playwright install chromium`).

```bash
cd tools/renders
npm ci

npm run render -- p-001 p-005        # escenas puntuales (ver ids abajo)
npm run render:all                   # las 26 imágenes (varios minutos)
npm run optimize                     # PNG -> WebP en ../../public
```

Variable opcional `N`: cuadros acumulados para las sombras (por defecto 24; usá `N=8` para previsualizar rápido).

## Escenas

- `p-001` … `p-020`: un render por producto, en el orden del catálogo (`src/data/products.ts`).
- `hero` (`hero:800:500`): composición de portada.
- `cat-resenas`, `cat-menus`, `cat-eventos`, `cat-tarjetas`, `cat-stickers`: categorías.

El tamaño base es 800×600 y se renderiza a 2× (1600×1200); `optimize.cjs` lo reduce a 1200×900 (portada 1600×1000).

## Cómo modificar

- **Texto y diseño de una pieza:** funciones `printDesign(...)` en `scene.js` (`review`, `menu`, `sticker`, `badge`, `invite`…).
- **Pose, cámara y composición:** objeto `SCENES`; cada escena define el modelo, su posición y `cam = { pos, target, fov, zoom }`.
- **Materiales:** objeto `M` (acrílico, PVC, metal…).
- **Destino del QR:** constante `QR_URL`.

Si cambia una imagen, el nombre de archivo debe mantenerse (lo referencia `src/data/products.ts` y `src/data/categories.ts`).

## Transparencia

Las imágenes se muestran en el sitio como "Imagen ilustrativa. El diseño final puede variar." Al reemplazarlas por fotografías reales, usá `illustrative: false` en `images` del producto.
