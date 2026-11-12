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

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sí, para habilitar pedidos | Número en formato internacional, solo dígitos (sin `+`, espacios ni guiones). Para Argentina móvil: `54` + `9` + código de área sin 0 + número, p. ej. `549370XXXXXXX`. |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública (canonical, sitemap, Open Graph). Por defecto `https://tienda.atajolab.dev`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Alternativa de contacto si WhatsApp no está configurado. |

Las variables `NEXT_PUBLIC_*` se incorporan **en el build**: después de cambiarlas hay que volver a generar el sitio.

### Qué pasa si falta el número de WhatsApp

No se generan enlaces rotos. Los botones muestran un aviso ("Los pedidos por WhatsApp todavía no están habilitados"), ofrecen enviar el mensaje por email (si `NEXT_PUBLIC_CONTACT_EMAIL` existe) o **copiar el mensaje**, y los botones secundarios llevan a `/contacto/`.

### Cómo habilitar los pedidos por WhatsApp

1. Definir `NEXT_PUBLIC_WHATSAPP_NUMBER` (en `.env.local` para desarrollo y en las variables de entorno de Cloudflare Pages para producción).
2. Volver a hacer el build/deploy.
3. Probar desde la ficha de un producto y desde `/pedido/` que el enlace sea `https://wa.me/<número>?text=...`.

El mensaje nunca se envía solo: se abre WhatsApp con el texto escrito y el cliente lo envía. Abrir WhatsApp **no** vacía el pedido.

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
  visual: "sticker",           // ilustración mientras no haya foto
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

## Cómo agregar imágenes

Mientras no haya fotografías propias, la tienda muestra ilustraciones generadas, etiquetadas como "Imagen ilustrativa". Para reemplazarlas:

1. Copiá la imagen a `public/productos/<slug>/` (por ejemplo `frente.jpg`).
2. En el producto, completá `images`:
   ```ts
   images: [
     { src: "/productos/sticker-qr/frente.jpg", alt: "Sticker QR pegado en una vidriera", illustrative: false },
   ]
   ```
3. Usá `illustrative: true` para renders o ilustraciones y `false` solo para fotografías de productos efectivamente fabricados. Con `src` definido se usa la imagen; sin `src`, la ilustración.

Imagen social por defecto: `public/og-default.png` (1200×630).

## Despliegue en Cloudflare Pages

El sitio es 100% estático; el resultado del build está en `out/`.

1. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elegí `AlejandroM12/atajolab-shop`.
2. Configuración de build:
   - Framework preset: *None* (o *Next.js (Static HTML Export)*)
   - Build command: `npm run build`
   - Build output directory: `out`
   - Variable `NODE_VERSION`: `20` (o superior)
3. Variables de entorno (Production y Preview): `NEXT_PUBLIC_WHATSAPP_NUMBER`, y opcionalmente `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_CONTACT_EMAIL`.
4. Deploy. Verificá primero en la URL `*.pages.dev`.

### Subdominio `tienda.atajolab.dev`

1. En el proyecto de Pages: **Custom domains → Set up a custom domain** → `tienda.atajolab.dev`.
2. Si `atajolab.dev` ya está en Cloudflare, el registro CNAME se crea automáticamente; si no, creá un CNAME `tienda` → `<proyecto>.pages.dev`.
3. Esperá a que el certificado SSL quede activo.

> Este repositorio no modifica DNS ni configuraciones de Cloudflare: esos pasos se hacen manualmente.

`public/_headers` agrega cabeceras de seguridad básicas y caché para los assets de Next.

## Limitaciones del MVP

- Catálogo en archivos locales; sin CMS, base de datos ni panel.
- Sin pagos online, sin carga de archivos (el logo se envía por WhatsApp), sin cuentas de usuario.
- El pedido vive en el navegador del cliente (`localStorage`): no se comparte entre dispositivos.
- Sin precios, materiales, medidas, plazos ni cobertura de envíos definidos.
- Imágenes ilustrativas (no hay fotografías propias todavía).
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
