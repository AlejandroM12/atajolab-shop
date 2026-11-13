# Datos comerciales pendientes de confirmar

Nada de esto se inventó en el MVP. Mientras no esté definido, la web lo comunica como "a confirmar" o "a cotizar".

| Dato | Dónde se refleja hoy | Dónde completarlo |
| --- | --- | --- |
| ~~Número de WhatsApp~~ | Resuelto: +54 9 370 5204454 | `src/data/site.ts` (o `NEXT_PUBLIC_WHATSAPP_NUMBER`) |
| Email de contacto (opcional) | Alternativa si falta WhatsApp | `NEXT_PUBLIC_CONTACT_EMAIL` |
| Precios (ARS) | Precios de lanzamiento de referencia cargados; "Desde" y "Solicitar presupuesto" para lo que se presupuesta | `price` y `variantGroups[].options[].price` en `src/data/products.ts` |
| Materiales y medidas | "A confirmar al presupuestar" | `materials`, `dimensions` |
| Variantes disponibles (tamaños, colores, formatos) | No se muestran selectores | `variantGroups` |
| Stock | No se afirma; "disponible para consultar" no es stock | `status` |
| Plazos de fabricación y entrega | No se prometen | `/condiciones-comerciales/` |
| Cobertura y costo de envíos | "Consultanos tu localidad" | `/condiciones-comerciales/`, FAQ en `src/data/content.ts` |
| Medios de pago aceptados y datos para abonar | Se acuerdan con cada cliente antes de confirmar el pedido (no hay un anticipo fijo) | `/condiciones-comerciales/` |
| Tarifas, transportistas y plazos de envío (envíos a todo el país) | "Envíos a todo el país"; el costo se informa antes de confirmar | `/condiciones-comerciales/` |
| Precios en ARS | Cargados como precios de lanzamiento de referencia (sujetos a revisión); sin escalas por cantidad | `src/data/products.ts` |
| Cambios, cancelaciones, devoluciones y garantía | Listado como "pendiente de definir" | `/condiciones-comerciales/` (requiere revisión) |
| Fotografías de productos fabricados | Ilustraciones etiquetadas | `images` de cada producto |
| Cuentas de redes sociales | No se muestran | `src/components/Footer.tsx` |
| Paleta/logo oficial de AtajoLab | Identidad propia provisoria (naranja + azul tinta) | `src/app/globals.css`, `src/components/Logo.tsx` |

## Antes de comercializar: datos del vendedor y legales (completar)

La tienda **no publica ningún dato fiscal ni legal que no esté confirmado**. Antes de recibir pedidos reales conviene completar y revisar con un contador y, si corresponde, un abogado (el sitio **no** promete excepciones legales):

| # | Dato / decisión | Dónde se refleja | Estado |
| --- | --- | --- | --- |
| 1 | Razón social o nombre y apellido del titular | `/condiciones-comerciales/` ("Quién vende"), `/privacidad/` | **Falta** |
| 2 | CUIT/CUIL y condición frente al IVA (monotributo/responsable inscripto) | Ídem y facturación | **Falta** |
| 3 | Domicilio legal / dirección comercial (hoy solo "Formosa Capital") | Ídem | **Falta** |
| 4 | Email de contacto (`NEXT_PUBLIC_CONTACT_EMAIL`) | Contacto, condiciones, privacidad | Opcional; **falta** |
| 5 | Tipo de comprobante y forma de facturar | Condiciones | **Falta** |
| 6 | Política escrita de **cambios, devoluciones y garantía** | `/condiciones-comerciales/` (hoy dice que se informa antes de confirmar) | **Falta definir** |
| 7 | **Derecho de arrepentimiento**: verificar si corresponde un botón/enlace en el sitio y cómo se atiende, y si aplican excepciones a productos personalizados | Condiciones | **Verificar con asesor** |
| 8 | Leyendas o enlaces obligatorios de **Defensa del Consumidor** y requisitos de información al consumidor en ventas a distancia | Footer / condiciones | **Verificar con asesor** |
| 9 | Registro/obligaciones por tratamiento de datos personales (nombre, teléfono y mensajes recibidos por WhatsApp) | `/privacidad/` | **Verificar con asesor** |
| 10 | Plazos estándar de producción y entrega | Condiciones | **Falta** |
| 11 | Medios de pago y datos para abonar (se acuerdan por pedido) | Condiciones | **Falta confirmar** |
| 12 | Tarifas y transportistas de envío (el sitio solo dice que se informan antes de confirmar) | Condiciones | **Falta** |
| 13 | Uso de logos y materiales del cliente | Condiciones | **Falta** |
