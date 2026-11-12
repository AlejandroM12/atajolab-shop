# AtajoLab Shop

Tienda online de productos físicos personalizados con **QR y NFC** (soportes para reseñas de Google, menús para restaurantes, tarjetas, stickers y credenciales para eventos). Es una unidad comercial de [AtajoLab](https://atajolab.dev), pensada para publicarse en `https://tienda.atajolab.dev`.

Todo pedido se cierra por **WhatsApp**: no hay pagos online, base de datos, backend ni panel administrativo.

## Stack

- Next.js (App Router) con **exportación estática** (`output: "export"`) y TypeScript estricto
- Tailwind CSS v4
- Vitest (tests unitarios) y Playwright + axe (E2E y accesibilidad)
- ESLint

## Requisitos

- Node.js 20 o superior y npm

## Instalación y desarrollo local

```bash
npm install
cp .env.example .env.local   # completar las variables (ver más abajo)
npm run dev                  # http://localhost:3000
```

## Variables de entorno

Todas son **opcionales**: el sitio funciona sin definir ninguna.

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Reemplaza el número comercial. Formato internacional, solo dígitos (sin `+`, espacios ni guiones). Por defecto se usa el número oficial `5493705204454` (+54 9 370 5204454), definido en `src/data/site.ts`. |
| `NEXT_PUBLIC_SITE_URL` | URL pública (canonical, sitemap, Open Graph). Por defecto `https://tienda.atajolab.dev`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Muestra un email de contacto adicional. |

Las variables `NEXT_PUBLIC_*` se incorporan **en el build**: después de cambiarlas hay que volver a generar el sitio.

### WhatsApp

Una sola fuente de verdad: `getWhatsAppNumber()` en `src/lib/whatsapp.ts`. Todos los botones y enlaces (`WhatsAppButton`, `WhatsAppLink`) y los mensajes (`buildProductInquiryMessage`, `buildOrderMessage`, `buildCustomRequestMessage`, `buildGeneralInquiryMessage`) salen de ese módulo. El enlace es `https://wa.me/5493705204454?text=<mensaje codificado>`.

El mensaje nunca se envía solo: se abre WhatsApp con el texto escrito y el cliente lo envía. Abrir WhatsApp **no** vacía el pedido. Si el número configurado fuera inválido, los botones ofrecen copiar el mensaje (o email, si existe).

## Precios

No hay precios cargados: ningún importe fue confirmado, por eso toda la tienda muestra **"Solicitar presupuesto"**. La estructura ya está lista (ver `src/lib/pricing.ts`):

```ts
// src/data/products.ts
price: { amount: 12500, currency: "ARS" },       // precio unitario base
priceNote: "El diseño final se cotiza aparte.",  // opcional

variantGroups: [{
  id: "tamano", label: "Tamaño",
  options: [
    { id: "chico",  label: "Chico",  price: 8000 },   // precio por variante
    { id: "grande", label: "Grande", price: 15000 },
  ],
}],
```

- Con precio base: tarjeta, ficha y pedido muestran el importe; la ficha calcula el subtotal según la cantidad.
- Con variantes con precios distintos: el listado muestra "Desde $ X" y la ficha actualiza el precio al elegir la variante. Si hay varias opciones con precio, se usa la mayor.
- Sin precio (ni variantes con precio): "Solicitar presupuesto".
- El pedido suma subtotales. **El total solo se muestra si todos los productos tienen precio**; si alguno requiere presupuesto se informa el subtotal de los productos con precio y cuántos quedan a presupuestar, sin total.
- Los importes viajan en el mensaje de WhatsApp (precio unitario, subtotal y total estimado). No hay pagos online; el anticipo del 50% se coordina por WhatsApp.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera el sitio estático en `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | Tipos (`next typegen` + `tsc`) |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | E2E + accesibilidad (Playwright; hace build con un número de WhatsApp de prueba y levanta `out/`) |
| `npm run check` | lint + typecheck + tests + build |

Para E2E se usa el Chrome instalado (`channel: "chrome"`). Si no lo tenés: `npx playwright install chromium` y ejecutá `PW_CHANNEL=chromium npm run test:e2e`.

## Estructura

```
src/
  app/            Rutas (App Router), sitemap, robots, 404
  components/     UI reutilizable; Client Components solo donde hay interactividad
  data/           Catálogo, categorías, contenido y configuración (separados de la UI)
  lib/            Lógica pura y testeada: catálogo/filtros, selección, carrito, WhatsApp, SEO
e2e/              Pruebas Playwright
docs/             Documentación técnica (arquitectura futura, datos pendientes)
public/           Imágenes y archivos estáticos
```

Rutas: `/`, `/productos/`, `/productos/[slug]/`, `/categorias/[slug]/`, `/pedido/`, `/como-comprar/`, `/personalizados/`, `/preguntas-frecuentes/`, `/condiciones-comerciales/`, `/contacto/`, `/menu-digital/` (servicio en preparación).

## Cómo agregar productos

Editá `src/data/products.ts` y agregá un objeto `Product` (tipo en `src/lib/types.ts`). No hay que tocar componentes ni lógica.

```ts
{
  id: "p-021",                 // único
  slug: "mi-producto",         // URL: /productos/mi-producto/
  name: "Mi producto",
  categorySlug: "stickers-etiquetas",   // ver src/data/categories.ts
  shortDescription: "...",
  description: ["Párrafo 1", "Párrafo 2"],
  benefits: ["..."],
  images: [{ alt: "Descripción", illustrative: true }],
  technology: "qr",            // "qr" | "nfc" | "qr-nfc"
  visual: "sticker",           // silueta de respaldo si no hay imagen
  customizations: ["businessName", "destinationUrl", "notes"],  // solo los campos que apliquen
  quantity: { min: 1, max: 500 },
  status: "por-encargo",       // "consultar" | "por-encargo" | "proximamente" | "no-disponible"
  featured: false,
  order: 21,
}
```

- `materials`, `dimensions` y `price` son **opcionales** y hoy no están definidos: agregalos solo cuando estén confirmados. Si faltan, la ficha dice "A confirmar al presupuestar" y "Precio a cotizar".
- `variantGroups` solo debe contener opciones confirmadas como disponibles.
- Los estados `proximamente` y `no-disponible` no se pueden agregar al pedido (solo consultar).
- Nuevas categorías: `src/data/categories.ts`.

## Imágenes

Todas las imágenes de producto, categoría y portada son **renders ilustrativos originales** (modelos 3D generados con three.js; los códigos QR codifican `https://atajolab.dev`). **No son fotografías de productos fabricados.** Se muestran con la aclaración "Imagen ilustrativa. El diseño final puede variar." en la portada y en las fichas, y en el pie del sitio.

Están en `public/productos/<slug>.webp`, `public/categorias/<slug>.webp` y `public/hero.webp` (WebP, 1200×900 / 1600×1000).

Para reemplazar un render por una fotografía real:

1. Guardá la foto en `public/productos/<slug>.webp` (o `.jpg`), proporción 4:3.
2. En el producto, ajustá `images` en `src/data/products.ts`:
   ```ts
   images: [{ src: "/productos/sticker-qr.webp", alt: "Sticker QR pegado en una vidriera", illustrative: false }],
   ```
   Con `illustrative: false` desaparece la aclaración sobre la imagen. Usá `true` solo para renders o ilustraciones.
3. Sumá más imágenes al arreglo para armar la galería (frente, detalle, uso).

Si un producto no define `src`, se muestra una silueta neutra como último recurso (`ProductVisual`).

Los renders se pueden regenerar con el código de [`tools/renders`](tools/renders/README.md) (three.js; herramienta independiente, no forma parte del build).

Imagen social por defecto: `public/og-default.png` (1200×630).

## Despliegue en Cloudflare Pages

El sitio es 100% estático; el resultado del build está en `out/` (`npm run build`). `.node-version` fija Node 22 y `wrangler.toml` declara `pages_build_output_dir = "out"`.

### Opción A: conectar el repositorio (recomendada)

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → `AlejandroM12/atajolab-shop`.
2. Build command: `npm run build` · Build output directory: `out` · Production branch: `main`.
3. No hace falta ninguna variable de entorno (el número de WhatsApp ya está configurado). Opcionales: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`.
4. Deploy y verificar primero en la URL `*.pages.dev`.

### Opción B: subida directa desde tu máquina

```bash
npx wrangler login          # abre el navegador para autorizar
npm run deploy              # build + wrangler pages deploy out
```

La primera vez, Wrangler pregunta si crear el proyecto `atajolab-shop`.

### Dominio `tienda.atajolab.dev`

1. En el proyecto de Pages: **Custom domains → Set up a custom domain** → `tienda.atajolab.dev`.
2. Si `atajolab.dev` ya está en Cloudflare, el CNAME se crea solo; si no, creá `tienda` → `<proyecto>.pages.dev`.
3. Esperá a que el certificado SSL quede activo.

> Este repositorio no modifica DNS ni configuraciones de Cloudflare: esos pasos se hacen manualmente.

### Verificación posterior al despliegue

- `https://tienda.atajolab.dev/` carga con imágenes y sin errores en consola.
- `/sitemap.xml` y `/robots.txt` responden y apuntan al dominio final.
- Un botón de WhatsApp abre `https://wa.me/5493705204454?text=...` con el mensaje precompletado.
- Agregar un producto, recargar `/pedido/` y comprobar que el pedido persiste.
- `/personalizados/`: "Crear mi QR" abre `https://qr.atajolab.dev`.
- Una URL inexistente muestra la página 404 de la tienda.

`public/_headers` agrega cabeceras de seguridad básicas y caché para los assets de Next.

## Limitaciones del MVP

- Catálogo en archivos locales; sin CMS, base de datos ni panel.
- Sin pagos online, sin carga de archivos (el logo se envía por WhatsApp), sin cuentas de usuario.
- El pedido vive en el navegador del cliente (`localStorage`): no se comparte entre dispositivos.
- Sin precios, materiales, medidas, plazos ni cobertura de envíos confirmados (la estructura de precios ya está lista).
- Imágenes: renders ilustrativos; faltan fotografías propias de productos fabricados.
- Solo español (argentino). La estructura permite sumar otros idiomas, pero no hay selector.
- Carta digital editable y validación de accesos para eventos: **no implementados** (ver `docs/`).

## Datos comerciales pendientes de confirmar

Ver [`docs/PENDIENTES.md`](docs/PENDIENTES.md).

## Próximas funcionalidades

1. Fotografías propias de productos y reemplazo de ilustraciones.
2. Precios, materiales, medidas y plazos confirmados.
3. Política de envíos y de cambios/devoluciones (completar `/condiciones-comerciales/`).
4. Plataforma de **carta digital editable** (ver [`docs/ARQUITECTURA-MENU-DIGITAL.md`](docs/ARQUITECTURA-MENU-DIGITAL.md)).
5. Productos para eventos con registro de invitados y check-in por QR.
6. Inglés y otros idiomas.

## Notas de despliegue estático (Next.js 16)

Con `output: "export"`, Next.js genera los datos de prefetch por segmento en carpetas (`out/productos/__next.productos/__PAGE__.txt`), pero el cliente los pide con puntos (`/productos/__next.productos.__PAGE__.txt`). En cualquier host estático esas URLs daban 404 (la navegación funcionaba, sin prefetch y con errores en consola). `npm run build` ejecuta `scripts/export-prefetch-aliases.mjs` después de `next build` y copia cada archivo al nombre que pide el cliente. No requiere configuración en Cloudflare.
