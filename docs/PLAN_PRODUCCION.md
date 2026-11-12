# Plan de producción — AtajoLab Shop (modelo híbrido)

> **Estado: propuesta de trabajo. No modifica precios ni contenido público.**
> Relevamiento y cálculos del **12/11/2026**. Complementa [`ESTUDIO_PRECIOS_ARGENTINA.md`](ESTUDIO_PRECIOS_ARGENTINA.md).

## 1. Decisión y alcance

**Modelo híbrido:** AtajoLab conserva el control del **diseño, la personalización, las especificaciones y la calidad**. Los pedidos pequeños se personalizan internamente; los grandes se encargan a fabricantes o imprentas que produzcan **según nuestras especificaciones**.

Reglas de comunicación:

- No se explica públicamente cómo se organiza la producción.
- **No se afirma tener una fábrica propia.** Evitar frases como "fabricamos nosotros", "nuestra fábrica" o "fabricación propia en Formosa". Sí se puede decir "producción por encargo", "diseñamos y personalizamos cada pedido".
- Cada pieza entregada debe cumplir la especificación de este documento, la haya producido AtajoLab o un tercero.

Productos prioritarios (8 productos del catálogo, 6 diseños de producción):

| Prioridad | Producto del catálogo | Diseño de producción |
| --- | --- | --- |
| 1 | Soporte QR para reseñas (p-001) | **A** · Soporte de acrílico con QR |
| 1 | Soporte QR + NFC para reseñas (p-002) | **B** · Soporte de acrílico con QR + NFC |
| 2 | Sticker QR (p-017) | **C** · Sticker de vinilo con QR |
| 2 | Sticker QR/NFC para reseñas (p-003) | **D** · Sticker con QR + NFC |
| 3 | Tarjeta NFC (p-015) | **E** · Tarjeta PVC con chip NFC |
| 3 | Tarjeta QR + NFC personalizada (p-016) | **F** · Tarjeta PVC con QR + chip NFC |
| 4 | Soporte QR de mesa (p-005) | **A** con diseño de carta |
| 4 | Soporte QR + NFC de mesa (p-006) | **B** con diseño de carta |

## 2. Cómo leer los datos

| Marca | Significado |
| --- | --- |
| **V** | **Verificado**: precio o dato visto en la página del proveedor el 12/11/2026 (con enlace). Puede haber cambiado. |
| **E** | **Estimación** del plan: supuesto propio, **sin fuente**. Hay que reemplazarlo por una cotización. |
| **P** | **Pendiente**: no se encontró dato; requiere cotización. |

Las páginas se consultaron con herramientas que resumen el contenido; **conviene verificar cada cifra V en la fuente** antes de comprar. **Mercado Libre no es accesible** para consultas automáticas (error 403) y no se intentó evadirlo: sus precios no se usan como V.

Supuestos de trabajo (todos **E**, ajustables):

- Mano de obra valorizada: **$5.000/hora**.
- Embalaje por pieza: soportes **$1.200**, stickers **$300** (por pedido), tarjetas **$800**.
- Rendimiento de la plancha de acrílico: **70 %** (desperdicio de corte).
- Diseño/preparación del archivo por pedido: **10 minutos** ($833).
- No incluyen: **envío al cliente, envío desde proveedores, impuestos, comisiones de cobro ni costos fijos.** Ver sección 12.

## 3. Especificaciones físicas iniciales

> Las medidas son **orientativas** y todavía **no están confirmadas** en el catálogo público (no se muestran medidas ni materiales). Definirlas y probarlas con muestras antes de publicarlas.

### A · Soporte de acrílico con QR (p-001, p-005)

| Atributo | Especificación inicial |
| --- | --- |
| Materiales | Acrílico **cristal 3 mm**; inserto de **vinilo autoadhesivo impreso, laminado mate** (protegido detrás del acrílico). |
| Dimensiones | Panel **10 × 15 cm** (referencia comercial: Argentina NFC vende 15 × 10 cm con pie). Base de apoyo ≈ 10 × 5 cm. |
| Armado | Panel + base unidos con adhesivo para acrílico (cemento solvente). Alternativa: soporte en L plegado en caliente (requiere plegadora). |
| Terminación | Bordes lijados/pulidos, esquinas redondeadas. |
| Personalización | Nombre/logo, colores, QR al enlace del cliente, texto ("Dejanos tu reseña", "Escaneá la carta"). |
| Corte | Cortes rectos: viable **a mano** con cutter de acrílico en tiradas chicas; corte láser para series. |

### B · Soporte de acrílico con QR + NFC (p-002, p-006)

Igual que **A**, más un **sticker/inlay NFC (NTAG213, ≈ 25–30 mm)** pegado detrás del inserto de vinilo, centrado. Se define el enlace, se **graba y se bloquea** (solo lectura) antes del armado. Verificar que el acrílico de 3 mm + vinilo no degrade la lectura (sección 9).

### C · Sticker de vinilo con QR (p-017)

| Atributo | Especificación inicial |
| --- | --- |
| Materiales | Vinilo autoadhesivo (base blanco brillante, mate o transparente), laminado. |
| Dimensiones | **5 × 5 cm**, troquelado (referencia: Sofite). |
| Personalización | QR al enlace elegido + texto corto + marca. Un QR distinto por cliente. |

### D · Sticker QR + NFC (p-003)

| Atributo | Especificación inicial |
| --- | --- |
| Materiales | Vinilo impreso con **inlay NFC NTAG213** integrado. |
| Dimensiones | **10 × 10 cm** (referencia: Argentina NFC) o menor, a definir. |
| Observación | Integrar el chip en el sticker requiere proceso de fábrica; se recomienda **tercerizar**. |

### E · Tarjeta PVC con chip NFC (p-015)

| Atributo | Especificación inicial |
| --- | --- |
| Materiales | Tarjeta **PVC CR80** (≈ 85,6 × 54 × 0,8 mm) con chip **NTAG213/215**. |
| Personalización | Diseño/logo impreso y enlace grabado. **No incluye perfil digital editable.** |
| Terminación | Mate o brillo. Primeras unidades: vinilo impreso laminado pegado sobre tarjeta blanca (calidad inferior a la impresión directa sobre PVC). |

### F · Tarjeta PVC con QR + NFC (p-016)

Igual que **E**, con QR impreso en una de las caras (el QR no se ve afectado por el chip).

## 4. Proveedores relevados

### 4.1 Materiales y productos base

| Proveedor | Qué ofrece | Dato | Estado |
| --- | --- | --- | --- |
| [Mebac — sucursal Jujuy](https://mebac.com.ar/jujuy/producto/acrilico-cristal-3-mm-122x244cm/) (también Salta) | Acrílico cristal 3 mm, placa 122 × 244 cm | **$167.989** por placa entera (no indica IVA). Cristal 2 mm: $107.767. Hay existencias. Vende "por placa entera"; corte a medida no mencionado. | **V** |
| [Laser House (Rosario)](https://www.laserhouseshop.com.ar/MLA-899848697-acrilico-plancha-transparente-placa-cristal-3mm-122x244-cm-_JM) | Placa acrílico 122 × 244 × 3 mm; porta menús | $199.610,49 por placa (retiro en fábrica de Rosario, según la búsqueda). Porta menú 13 × 18 cm: $7.086,57. | Fragmento de búsqueda, **no verificado en la ficha** |
| [Argentina NFC](https://argentinanfc.com) | Chips NFC NTAG213 sueltos | **desde $390 c/u, mín. 100** | **V** |
| [Todomicro](https://www.todomicro.com.ar/999-tarjeta-1356-mhz-nfc-ntag215.html) | Tarjeta NFC NTAG215 de PVC blanco, 85,5 × 54 × 0,8 mm, 504 bytes útiles (marca Duaitek) | $4.185 (1 u.) · **$2.790 (10+)** · **$2.565 (50+)** · **$2.385 (100+)**. **Sin stock** al consultar. Fecha del precio no indicada. | **V** (stock **P**) |
| [IDSHOP](https://www.idshop.com.ar/productos/etiquetas-circulares-nfc-ntag213-pack-100-un/) | Etiquetas circulares NFC NTAG213, 30 mm, 128 bytes | Pack 100: $321.176 ($265.434,71 sin impuestos) ≈ $3.212/u. Pack 10: $46.055. **Sin stock.** | **V** (no competitivo; sin stock) |
| GoToTags, ShopNFC / NFCStock, ABC RFID (exterior) | Stickers y tarjetas NFC al por mayor | Stickers NTAG213 25 mm: US$ 0,42–0,48 (GoToTags), € 0,22 a 1.000 u. (ShopNFC), US$ 0,30 (ABC RFID). Tarjeta PVC NTAG213 impresa (NFCStock): € 0,86 a 1.000 u.; **mínimo 500**. | Importación: **costos de courier e impuestos P** |

### 4.2 Impresión y productos terminados

| Proveedor | Qué ofrece | Dato | Estado |
| --- | --- | --- | --- |
| [Sofite](https://sofite.com.ar/productos/stickers-personalizados-5-x-5cm-por-100-unidades/) | Stickers troquelados 5 × 5 cm, vinilo (blanco brillante, mate o transparente), hasta 4 diseños por lote | **$16.200 por 100** (IVA incl.) = $162/u. Stickers 7 × 7 cm ×100: $30.500. Envío por código postal; **gratis desde $300.000**; costo a Formosa **P**. Contacto por WhatsApp según su sitio. | **V** |
| [Blear](https://blear.ar/imprenta/_item/stickers-personalizados) | Stickers en vinilo impreso UV | $467,89 (50) … $446,87 (1.000) por unidad; troquelados **mín. 100**; planchas mín. 25. No indica IVA. | **V** |
| [Argentina NFC](https://argentinanfc.com) | **Productos terminados (reventa)** | Acrílico con pie 15 × 10 cm: **$11.500 / $10.000 / $8.500** (10–24 / 25–99 / 100–999). Sticker NFC + QR 10 × 10 cm: **$5.000 / $4.000 / $3.000**. Mín. 10 u. Diseños: Google, Instagram o WhatsApp; blanco o negro. | **V** (personalización a medida: **P**) |
| [Coloz NFC](https://coloznfc.com/) | Placas y exhibidores NFC + QR (fabricación argentina, según su sitio) | Venta al público: exhibidor $39.000, placa $29.000; no publica mayorista. | **P** (consultar si producen a medida) |
| [Tapp](https://tapp.ar/precios), [Tap4r](https://tap4r.com) | Tarjetas NFC y soluciones para reseñas | Tapp: tarjeta PVC $30.000 con perfil digital. Tap4r (Buenos Aires): no publica precios. | **P** (consultar si venden sin plataforma) |
| Kire Impresiones, Impresiongrafik, Rotularte (tiendas de Mercado Libre) | Stickers troquelados personalizados | Aparecen en búsquedas; **no verificados** (Mercado Libre bloqueado). | **P** |
| Impresión de **tarjetas PVC** con chip | — | **No se encontró un proveedor argentino verificado.** (La Fábrica de Tarjetas PVC es de España; no se considera.) | **P** |
| Corte láser / impresión UV sobre acrílico | — | **No se encontraron proveedores en Formosa** ni precios publicados en Argentina. | **P** |
| Packaging (cajas, bolsas, rellenos) | — | Sin datos. | **P** |

### 4.3 Proveedores en Formosa

No se identificó ninguno de forma verificable. Buscar en Google Maps/redes: "grabado láser Formosa", "imprenta Formosa", "gráfica Formosa", "vidriería/acrílicos Formosa", "cartelería Formosa". Un taller local para corte láser reduciría **flete y tiempos de iteración**.

## 5. Fabricar/personalizar internamente vs. tercerizar

| Diseño | Internamente | Tercerizando | Recomendación |
| --- | --- | --- | --- |
| **A/B · Soportes de acrílico** | Control total del diseño. Viable con cortes rectos a mano para 10–25 u. Requiere herramientas y tiempo; la calidad del borde mejora con láser. | Argentina NFC (soporte con NFC): $10.000 en 25–99 u. Diseño limitado a sus plantillas salvo acuerdo a medida (**P**). | **Interno hasta ~25 u.**; para 50+ u., cotizar corte láser + armado con un taller. |
| **C · Sticker QR** | Requiere impresora de vinilo + laminado + corte (inversión **P**). | Sofite/Blear: $162–468/u, **lotes de 100** (no sirven para tiradas de 10). | **Tercerizar la impresión**; vender desde 25 u. salvo diseño repetido. |
| **D · Sticker QR + NFC** | Integrar inlay y laminar: proceso complejo. | Argentina NFC: $3.000–5.000/u (mín. 10). | **Tercerizar** (cotizar a medida). |
| **E/F · Tarjetas PVC + NFC** | Comprar tarjetas NFC en blanco (Todomicro) y aplicar vinilo laminado. Calidad aceptable para muestras, inferior a PVC impreso. | Sin proveedor argentino verificado de impresión directa sobre PVC con chip. | **Interno para validar**; buscar impresor de tarjetas PVC (**P**) para 50+ u. |

**Tareas a controlar internamente (siempre):** diseño y preparación de archivos, generación y prueba de los **QR**, **grabado y bloqueo de los chips NFC**, **control de calidad**, empaque y despacho, atención al cliente.
**Tareas a tercerizar (cuando convenga):** impresión de vinilo, troquelado, corte láser, ensamblado en serie, impresión sobre PVC.

## 6. Precios por cantidad (1, 10, 25, 50 y 100 unidades)

Solo se muestran precios **V** de insumos o producto terminado de terceros. Un guion indica que no hay dato.

| Ítem (fuente) | 1 | 10 | 25 | 50 | 100 |
| --- | --- | --- | --- | --- | --- |
| Acrílico cristal 3 mm 122 × 244 (Mebac) — por **placa**, no por pieza | $167.989 | — | — | — | — |
| Chip NFC suelto (Argentina NFC) | — | — | — | — | **$390** (mín. 100) |
| Tarjeta NFC NTAG215 PVC en blanco (Todomicro) | $4.185 | $2.790 | $2.790 | $2.565 | $2.385 |
| Stickers 5 × 5 cm vinilo (Sofite) — lote de 100 | — | — | — | — | $162/u ($16.200) |
| Stickers UV (Blear) — troquelado | — | — | — | — | $457,38 |
| Soporte acrílico con NFC 15 × 10 (Argentina NFC) | — | $11.500 | $10.000 | $10.000 | $8.500 |
| Sticker NFC + QR 10 × 10 (Argentina NFC) | — | $5.000 | $4.000 | $4.000 | $3.000 |

**Sin dato (P):** corte láser por pieza, impresión de insertos de vinilo de 10 × 15 cm, impresión sobre PVC, packaging y fletes.

## 7. Costos unitarios y márgenes

Fórmulas: costo unitario = materiales + personalización + embalaje + mano de obra (valorizada). Los precios de venta son los **propuestos** (no publicados) del estudio de precios. **Sin envío, impuestos ni comisiones.**

### 7.1 Soportes de acrílico — producción interna, 10 unidades

| Concepto | A (QR) | B (QR + NFC) | Origen |
| --- | --- | --- | --- |
| Acrílico: 200 cm² × $5,64/cm² ÷ 70 % | $1.612 | $1.612 | Precio de placa **V**; rendimiento **E** |
| Adhesivo para acrílico | $100 | $100 | **E** |
| Inserto de vinilo impreso (imprenta, 10 u.) | $1.250 | $1.250 | **E** (escalado de Sofite; sin cotización) |
| Chip NFC | — | $390 | **V** (Argentina NFC, mín. 100) |
| Embalaje | $1.200 | $1.200 | **E** |
| Mano de obra: 30 min (+ 5 min de prueba NFC) | $2.500 | $2.917 | **E** |
| **Costo unitario** | **$6.662** | **$7.469** | |
| Precio propuesto 1 u. / 10–24 u. (reseñas) | $18.900 / $16.900 | $29.900 / $26.900 | Estudio |
| **Margen (10–24 u.)** | **60,6 %** | **72,2 %** | **Estimado** |
| Precio propuesto 1 u. / 10–24 u. (mesa) | $12.900 / $10.900 | $19.900 / $17.500 | Estudio |
| **Margen mesa (10–24 u.)** | **38,9 %** | **57,3 %** | **Estimado** |
| Margen mesa en 25+ u. ($9.500 / $15.900) | 29,9 % | 53,0 % | **Estimado** |

> El soporte de mesa QR **solo** deja ~30–39 % con producción interna valorizando la mano de obra: conviene **revisar su precio** o producirlo en serie con terceros.

### 7.2 Sticker QR (C) — proveedor con lote de 100 (Sofite, $162/u **V**)

Costo unitario = $16.200 ÷ cantidad pedida + costos por pedido ($833 de preparación + $300 de embalaje, **E**) ÷ cantidad.

| Cantidad del pedido | 1 | 10 | 25 | 50 | 100 |
| --- | --- | --- | --- | --- | --- |
| Costo unitario | $17.333 | $1.733 | $693 | $347 | $173 |
| Precio propuesto | $2.500 | $1.800 | $1.300 | $1.300 | $1.000 |
| Margen | **negativo** | **3,7 %** | **46,7 %** | **73,3 %** | **82,7 %** |

> Con un proveedor de lote de 100, **vender menos de 25 stickers con QR distinto no cierra** salvo que se reutilice el excedente. Opciones: mínimo de 25 u. para stickers a medida, un diseño repetible para stock, o imprimir internamente (inversión en equipo **P**).

### 7.3 Sticker QR + NFC (D) — tercerizado (Argentina NFC, **V**)

Costo = precio mayorista + embalaje $300 + manipulación $417 (**E**) + flete de entrada (**P**).

| Cantidad | 10 | 25 | 50 | 100 |
| --- | --- | --- | --- | --- |
| Costo unitario (sin flete) | $5.717 | $4.717 | $4.717 | $3.717 |
| Precio propuesto | $8.500 | $7.500 | $7.500 | $7.500 |
| Margen | **32,7 %** | **37,1 %** | **37,1 %** | **50,4 %** |

### 7.3b Tarjetas PVC con NFC (E y F) — tarjeta blanca NTAG215 + vinilo laminado

| Concepto | E (NFC) / F (QR + NFC) | Origen |
| --- | --- | --- |
| Tarjeta NFC en blanco | $2.790 (10 u.) · $2.565 (50 u.) | **V** (Todomicro; sin stock) |
| Vinilo laminado cortado CR80 | $400 | **E** |
| Mano de obra: 15 min | $1.250 | **E** |
| Embalaje | $800 | **E** |
| **Costo unitario (10 u.)** | **$5.240** | |
| Precio propuesto 10–24 u.: NFC $15.900 / QR + NFC $17.500 | Margen **67,0 % / 70,1 %** | **Estimado** |
| Con 50 u. y 100 % tercerizado el costo depende de la impresión sobre PVC | **P** | |

### 7.4 Tercerizar 50 unidades (resumen)

| Diseño | Costo unitario (sin flete) | Precio 25+ propuesto | Margen | Observación |
| --- | --- | --- | --- | --- |
| B (stand QR + NFC, reseñas) vía Argentina NFC $10.000 | $11.617 ($10.000 + embalaje $1.200 + manipulación $417) | $24.900 | **53,3 %** | Diseño limitado a sus plantillas (**P** a medida). |
| B (stand mesa QR + NFC) vía Argentina NFC | $11.617 | $15.900 | **26,9 %** | **Insuficiente**: revisar precio o proveedor. |
| A (stand QR sin NFC) | **P** | $14.900 / $9.500 | — | No hay proveedor verificado de producto terminado. |
| C (sticker QR) | $347 | $1.300 | 73,3 % | Lote de 100 de Sofite. |
| D (sticker QR + NFC) | $4.717 | $7.500 | 37,1 % | Argentina NFC $4.000. |
| E (tarjeta NFC) | $5.282 (con impresión **E** $1.500) | $14.500 | **63,6 %** | Impresión sobre PVC **P**. |
| F (tarjeta QR + NFC) | $5.282 | $15.900 | **66,8 %** | Idem. |

## 8. Herramientas y materiales para las primeras 10 unidades

> **No se relevaron precios** de herramientas ni consumibles (**P**). Cotizar en ferreterías, casas de plásticos y librerías técnicas.

**Soportes de acrílico (A/B)**

- 1 placa acrílico cristal 3 mm 122 × 244 cm (**V**: $167.989) o piezas ya cortadas (cotizar).
- Cutter de acrílico (marcador), regla metálica, escuadra, tapete de corte.
- Lijas al agua (400/800/1200), taco de lijar, paño de pulido.
- Adhesivo para acrílico (cemento solvente), jeringa/aplicador, abrazaderas. **Usar con ventilación y protección** (gafas, guantes).
- Alcohol isopropílico, paños de microfibra, espátula/rasqueta para vinilo.
- Inserts de vinilo impresos y laminados (imprenta) o impresora de vinilo propia (**P**).

**NFC**

- Chips NFC NTAG213 (**V**: $390, mín. 100) y, para tarjetas, tarjetas NTAG215 PVC (**V**: Todomicro).
- 1 celular **Android con NFC** y 1 **iPhone** para grabar y probar; app gratuita de lectura/escritura NFC; función de **bloqueo** (solo lectura) del tag.

**Stickers y tarjetas**

- Lote de stickers (Sofite $16.200 por 100 **V**) o vinilo + laminado propio (**P**).
- Cutter/guillotina de precisión; regla; plantilla de corte CR80.

**Embalaje y control**

- Bolsas, cajas de cartón, protección (papel/cartón corrugado), cinta, etiquetas de despacho.
- Planilla de control de calidad (sección 9), calibre o regla, lupa.

## 9. Control de calidad

Criterios **propuestos** (a ajustar con la experiencia de las primeras unidades). Para las primeras 10 unidades: **inspección del 100 %**.

**QR**

1. Verificar que la URL del QR coincide con la del pedido (copiar y abrir).
2. Escanear con **al menos 3 lectores** (cámara de iPhone, cámara de Android, Google Lens u otra app) a **10, 30 y 60 cm** y con un ángulo de unos **30°**.
3. Probar con **luz baja** y con **reflejo** (el acrílico y el laminado brillante pueden producir brillos).
4. Zona de silencio (margen blanco) suficiente y **tamaño mínimo ≈ 2 × 2 cm** de QR (a validar con las muestras). Nivel de corrección de errores M o Q.
5. **Aprobado** si abre el destino correcto en todos los lectores y condiciones.

**NFC**

1. Grabar el enlace como NDEF/URL, **releer** para verificar y **bloquear** (solo lectura) si corresponde.
2. Probar **antes** y **después** del armado con **Android y iPhone** (distancia y posición de contacto).
3. Confirmar que la lectura funciona **a través del acrílico de 3 mm y del vinilo** (soportes) y en la posición marcada para acercar el celular.
4. Probar con y sin funda del celular.
5. Evitar superficies metálicas detrás del chip (pueden degradar la lectura; verificar con las muestras).
6. **Aprobado** si la lectura es inmediata y repetible (**5/5 lecturas** por equipo).

**Visual y mecánico**

- Sin rayas, burbujas, manchas de adhesivo ni bordes filosos; vinilo alineado y laminado sin levantarse; piezas estables sobre la mesa; medidas dentro de ±1 mm (**propuesta**).
- Registro por unidad: lote, fecha, URL, resultado de pruebas, responsable.
- **Descarte/retrabajo** de cualquier pieza que falle.

## 10. Abastecimiento desde Formosa

- **Ningún proveedor verificado está en Formosa.** Distribuidor de acrílico más cercano relevado: **Mebac** (Jujuy y Salta). Laser House está en **Rosario**; Sofite y Argentina NFC operan en el centro del país (ubicación exacta **P**).
- **Fletes P**: pedir a cada proveedor el costo de envío a **Formosa Capital** (CP **3600**, verificar). Sofite calcula el envío por código postal y es gratis desde **$300.000**.
- **Consolidar compras** (acrílico + chips + stickers en una o dos remesas) para diluir el flete y comprar con stock para varios pedidos.
- Un taller de corte láser o una gráfica local simplificaría tiempos y evitaría fletes de insumos pesados (placas de acrílico de 122 × 244 cm).

## 11. Lista de proveedores a quienes pedir cotización

| # | Proveedor | Qué pedir | Cantidades |
| --- | --- | --- | --- |
| 1 | **Mebac Jujuy / Salta** (https://mebac.com.ar) | Placa de acrílico cristal 3 mm entera y **corte a medida** (piezas 10 × 15 y 10 × 5 cm); flete a Formosa. | 1 placa; 40, 100, 200 piezas |
| 2 | **Laser House** (Rosario) | Corte láser de piezas de acrílico, pulido de bordes, **armado**; flete a Formosa. | 10, 25, 50, 100 soportes |
| 3 | **Argentina NFC** (https://argentinanfc.com) | Soporte con NFC y sticker NFC + QR **con diseño propio** (no plantilla); ¿venden sin su marca?; tiempo de entrega; flete. | 10, 25, 50, 100 |
| 4 | **Coloz NFC** (https://coloznfc.com) | ¿Producen a medida y por mayor? Precio por 10/25/50/100. | idem |
| 5 | **Tap4r** (https://tap4r.com) y **Tapp** (https://tapp.ar) | Tarjetas NFC **sin perfil digital** (solo enlace), por mayor. | 10, 25, 50, 100 |
| 6 | **Sofite** (https://sofite.com.ar) | Stickers troquelados 5 × 5 y 7 × 7 cm con QR; **inserto de vinilo 10 × 15 cm laminado**; lotes menores a 100; flete a Formosa. | 10, 25, 50, 100 |
| 7 | **Blear** (https://blear.ar) | Stickers UV, insertos 10 × 15 cm; plazos. | 25, 50, 100 |
| 8 | **Todomicro** (https://www.todomicro.com.ar) | Confirmar **stock** y precio actual de tarjetas NTAG215; ¿NTAG213? | 20, 50, 100 |
| 9 | Importación: **GoToTags**, **ShopNFC/NFCStock**, **ABC RFID** | Precio puesto en Formosa (courier + impuestos) de stickers y tarjetas NFC; tiempos. | 100, 500 |
| 10 | Locales de **Formosa**: grabado láser, gráfica/imprenta, vidriería/acrílicos, cartelería (a identificar) | Corte láser y armado de soportes; impresión de vinilo; precios por pieza. | 10, 25, 50 |
| 11 | Impresores de **tarjetas PVC** con chip (a identificar) | Tarjeta CR80 impresa con chip NFC; mínimo; precio por 50/100. | 50, 100 |

**Modelo de pedido de cotización (para cada proveedor):** descripción de la pieza y medidas; archivo/diseño (se envía al aceptar); cantidades **1, 10, 25, 50 y 100**; precio unitario **con y sin IVA**; **mínimo de pedido**; plazo de producción y entrega; costo de envío a Formosa (CP 3600); condiciones de pago; si pueden producir **sin su marca**; muestra previa y su costo; garantía y política de reposición ante fallas.

## 12. Propuestas de inversión inicial

> Importes en pesos al 12/11/2026. **V** = verificado en la página del proveedor; **E** = estimación del plan; **P** = pendiente de cotización. **No incluyen envíos, impuestos, comisiones de cobro ni herramientas (P).**

### 12.1 Propuesta A — fabricar/personalizar internamente **10 unidades de cada producto prioritario** (8 productos = 80 unidades)

| Concepto | Cantidad | Importe | Tipo |
| --- | --- | --- | --- |
| Placa de acrílico cristal 3 mm 122 × 244 cm (Mebac) — rinde para > 40 soportes | 1 | **$167.989** | V |
| Chips NFC (Argentina NFC), mínimo 100 u. (se usan 20; stock de reserva) | 100 | **$39.000** | V (disponibilidad P) |
| Tarjetas NFC en blanco NTAG215 (Todomicro, 10+) — para E y F | 20 | **$55.800** | V (sin stock al consultar) |
| Stickers QR 5 × 5 (Sofite), lote de 100 | 1 lote | **$16.200** | V |
| Stickers QR + NFC (Argentina NFC), 10 u. | 10 | **$50.000** | V |
| **Subtotal verificado** | | **$328.989** | |
| Insertos de vinilo para soportes (4 productos × 10) | 40 | $50.000 | E |
| Vinilo laminado para tarjetas | 20 | $8.000 | E |
| Embalaje (soportes $1.200; stickers $300; tarjetas $800) | 40 / 20 / 20 | $70.000 | E |
| **Subtotal estimado** | | **$128.000** | |
| **Desembolso inicial (V + E)** | | **$456.989** | |
| Herramientas y consumibles (sección 8) | — | **P** | P |
| Mano de obra (≈ 30 horas × $5.000, **no es desembolso**) | — | $150.000 | E |
| Fletes de los proveedores a Formosa | — | **P** | P |

Notas: la placa de acrílico y los chips dejan **stock** para más pedidos (la inversión no se consume por completo en estas 80 unidades). El costo económico de producir las 80 unidades, **incluyendo mano de obra valorizada**, es ≈ **$462.000** (estimado).

### 12.2 Propuesta B — **tercerizar 50 unidades** de cada producto prioritario

| Concepto | Cantidad | Importe | Tipo |
| --- | --- | --- | --- |
| Soporte QR + NFC (reseñas), Argentina NFC a $10.000 (25–99 u.) | 50 | **$500.000** | V (diseño a medida P) |
| Soporte QR + NFC (mesa), Argentina NFC a $10.000 | 50 | **$500.000** | V (diseño a medida P) |
| Stickers QR 5 × 5, lote de 100 (Sofite) | 1 lote | **$16.200** | V |
| Stickers QR + NFC, Argentina NFC a $4.000 | 50 | **$200.000** | V |
| Tarjetas NFC en blanco NTAG215 (Todomicro 50+) — NFC y QR + NFC | 100 | **$256.500** | V (sin stock al consultar) |
| **Subtotal verificado** | | **$1.472.700** | |
| Impresión sobre las tarjetas (supuesto $1.500 por tarjeta) | 100 | $150.000 | E (impresión **P**) |
| Embalaje (stand $1.200 × 100; stickers $300 × 100; tarjetas $800 × 100) | — | $230.000 | E |
| **Subtotal estimado** | | **$380.000** | |
| **Total (V + E)** | | **$1.852.700** | |
| Soportes **solo QR** (reseñas y mesa), 50 u. c/u | 100 | **P** | P (referencia sin verificar: Laser House porta menú $7.086,57/u, solo soporte en blanco) |
| Fletes desde proveedores a Formosa | — | **P** | P |

Observaciones: el soporte de **mesa** QR + NFC tercerizado a $10.000 queda con **margen 26,9 %** al precio propuesto de 25+ ($15.900): hay que revisar precio o buscar un proveedor de corte láser más barato. Los productos de Argentina NFC usan **sus plantillas** (Google/Instagram/WhatsApp): para mantener el control de diseño hay que pedir una **producción a medida** (**P**).

## 13. Riesgos

- **Dependencia de pocos proveedores** y stock (Todomicro sin stock, IDSHOP sin stock): validar disponibilidad antes de prometer plazos.
- **Precios que cambian** con el dólar y la inflación: renovar cotizaciones cada 30–60 días.
- **Unidades individuales:** el trabajo por pieza puede superar el margen (ver 7.2): fijar **cantidades mínimas** o precios de 1 unidad más altos.
- **Calidad de lectura NFC** a través del acrílico: validar con muestras antes de publicar.
- **Comunicación:** no prometer plazos ni marcas de fabricación hasta tener acuerdos con proveedores.

## 14. Próximos pasos

1. Enviar los pedidos de cotización de la sección 11 (prioridad: Mebac/Laser House, Argentina NFC, Sofite, talleres de Formosa).
2. Comprar el **kit de 10 unidades** de la propuesta A y producir muestras de A y B; ejecutar el control de calidad (sección 9).
3. Con las cotizaciones y las muestras, **recalcular costos y márgenes** y recién entonces proponer la carga de precios en el catálogo.
4. Definir **medidas, materiales y cantidad mínima** de cada producto para publicarlos.
