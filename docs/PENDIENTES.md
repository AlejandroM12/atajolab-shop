# Datos comerciales pendientes de confirmar

Nada de esto se inventó en el MVP. Mientras no esté definido, la web lo comunica como "a confirmar" o "a cotizar".

| Dato | Dónde se refleja hoy | Dónde completarlo |
| --- | --- | --- |
| Número de WhatsApp | Botones de consulta/pedido deshabilitados con aviso | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Email de contacto (opcional) | Alternativa si falta WhatsApp | `NEXT_PUBLIC_CONTACT_EMAIL` |
| Precios | "Precio a cotizar" | `price` en `src/data/products.ts` |
| Materiales y medidas | "A confirmar al presupuestar" | `materials`, `dimensions` |
| Variantes disponibles (tamaños, colores, formatos) | No se muestran selectores | `variantGroups` |
| Stock | No se afirma; "disponible para consultar" no es stock | `status` |
| Plazos de fabricación y entrega | No se prometen | `/condiciones-comerciales/` |
| Cobertura y costo de envíos | "Consultanos tu localidad" | `/condiciones-comerciales/`, FAQ en `src/data/content.ts` |
| Medios de pago y datos para abonar el anticipo | Se coordina por WhatsApp | `/condiciones-comerciales/` |
| Cambios, cancelaciones, devoluciones y garantía | Listado como "pendiente de definir" | `/condiciones-comerciales/` (requiere revisión) |
| Fotografías de productos fabricados | Ilustraciones etiquetadas | `images` de cada producto |
| Cuentas de redes sociales | No se muestran | `src/components/Footer.tsx` |
| Paleta/logo oficial de AtajoLab | Identidad propia provisoria (naranja + azul tinta) | `src/app/globals.css`, `src/components/Logo.tsx` |
