# Arquitectura propuesta: carta digital editable (no implementada)

> Estado: **en preparación**. Este documento describe una posible arquitectura. Nada de esto existe todavía en el código; la tienda solo presenta el servicio como "próximamente" (`/menu-digital/`, producto `carta-digital-editable`).

## Visión

Un bar o restaurante compra soportes físicos QR/NFC y contrata una carta digital que edita desde el celular. El QR impreso **no cambia** aunque cambien platos y precios, porque apunta a una URL estable administrada por AtajoLab.

## Alcance

Dentro: negocio, logo, categorías, platos y bebidas, descripciones, precios, imágenes, disponibilidad, orden, publicación, URL pública estable, PDF imprimible (A4/A5, varios diseños), varios soportes → una carta.

Fuera (por ahora): pedidos desde la mesa, pagos, comandas, mozos, facturación, stock.

## Componentes sugeridos

```
tienda.atajolab.dev      Tienda estática (este repo)
carta.atajolab.dev/<slug>  Carta pública (lectura, sin autenticación)  ← URL que codifica el QR
panel.atajolab.dev       Panel privado del dueño (autenticado)
API + base de datos      Datos multi-negocio
Almacenamiento           Logos e imágenes
```

- **Carta pública**: render en servidor o estático regenerado (ISR/revalidación bajo demanda) para que los cambios publicados se vean rápido y la página cargue instantáneamente en el celular.
- **Panel**: PWA mobile-first con autenticación (email + enlace mágico o proveedor OAuth).
- **Backend**: Cloudflare Workers + D1 (SQLite) + R2 (imágenes) es una opción coherente con el despliegue actual; Postgres gestionado es otra.

## Modelo de datos (borrador)

```
Business   id, ownerId, name, slug (único, estable), logoUrl, theme
User       id, email, ...  ·  Membership(userId, businessId, role)
Menu       id, businessId, status(draft|published), publishedAt, version
Section    id, menuId, name, position
Item       id, sectionId, name, description, priceCents, currency, imageUrl, available, position
Tag        (opcional) vegano, sin TACC, picante…
Device     id, businessId, menuId, label, kind(qr|nfc), shortCode   ← un soporte físico
```

Reglas clave:

- **Aislamiento por negocio**: toda consulta filtra por `businessId` derivado de la sesión (y, si la base lo permite, políticas a nivel de fila).
- **Borrador vs. publicado**: se edita un borrador y se publica una versión inmutable; la carta pública solo lee la versión publicada.
- **URL estable**: el QR codifica `https://carta.atajolab.dev/<slug>` o un `shortCode` de `Device` que redirige. Cambiar de carta, de diseño o de slug interno no obliga a reimprimir.
- **Varios soportes**: `Device.menuId` permite vincular muchos soportes a la misma carta y reasignarlos.

## PDF imprimible

Generación del lado del servidor desde la versión publicada (HTML → PDF con un renderizador headless, o librería PDF), plantillas por formato (A4/A5) y diseño, con fuentes embebidas y márgenes de impresión. Incluir el QR de la carta como opción.

## Seguridad y privacidad

Autenticación con sesiones seguras, validación de entrada, límites de tamaño/tipo de imágenes, sanitización de textos, backups, y logs sin datos personales innecesarios.

## Relación con la tienda

- El producto `carta-digital-editable` pasa de `proximamente` a `por-encargo` (o a una suscripción) cuando exista el servicio.
- Los soportes (`soporte-qr-mesa`, `soporte-qr-nfc-mesa`) podrán ofrecer como destino "Carta de AtajoLab" configurando el `shortCode`.

## Eventos (futuro)

Credenciales QR únicas, registro de invitados y check-in requieren backend propio (lista de asistentes, tokens firmados y de un solo uso, app/vista de escaneo). Hoy la tienda solo ofrece los productos físicos y **no** afirma validación de accesos.

## Etapas sugeridas

1. Definir modelo comercial (precio/suscripción) y validar con 2–3 negocios.
2. MVP: autenticación, un menú por negocio, editor móvil, carta pública, QR estable.
3. PDF imprimible y vinculación de múltiples soportes.
4. Diseños, imágenes y mejoras de edición.
