---
name: folio
description: Úsala al construir o rediseñar cualquier página o interfaz web (landing, sitio, panel, documentación) para que se vea diseñada con intención en vez de genérica. Elige una dirección de arte, aplica un sistema coherente y revisa el resultado en tres anchos. Funciona con HTML puro, React, Vue o Svelte, porque trata del diseño, no del framework.
---

# Folio

Folio es una skill de **gusto de diseño**. Su trabajo es que una página se vea
**pensada**: con una dirección clara, jerarquía real, aire, y una voz visual
coherente — en vez de la página genérica de siempre (tres tarjetas, un degradado
morado y todo centrado).

No es una plantilla; es un criterio. Es software propietario de Vemoris
Software, pero el nombre es suyo: Folio.

## La voz de Folio en una línea

Editorial, serena y segura. Calma antes que ruido, una idea fuerte antes que
diez débiles, y el espacio en blanco tratado como material, no como sobra.

Tres reglas que nunca se rompen:
1. **Una sola idea manda por pantalla.** Lo demás la acompaña, no compite.
2. **La tipografía hace el trabajo pesado.** Un buen titular grande vale más
   que cualquier adorno.
3. **El color se usa con avaricia.** Fondo tranquilo, un acento y basta.

## Cómo trabajar (proceso)

Sigue estos pasos en orden. No saltes al código antes del paso 4.

1. **Entiende qué es la página** y clasifícala en un **tipo**: `producto`,
   `servicio`, `lugar`, `editorial` o `portafolio`. Pregúntate qué es lo único
   que la persona tiene que entender o hacer aquí.
2. **Reparte el sistema:** `node scripts/sistema.mjs --tipo <tipo>` te da una
   paleta y una pareja tipográfica (con sus `<link>` y tokens `:root` listos),
   evitando repetir las de builds recientes. O usa los tuyos de
   `sistema/tokens.md` (y, si tienes marca propia, los suyos).
3. **Elige UNA dirección de arte:** `node scripts/direccion.mjs --tipo <tipo>`
   reparte una (evitando las últimas), o elige a mano en `direcciones/`. No
   mezcles dos en el mismo bloque. Si dudas entre dos, la página hace dos cosas:
   sepárala.
4. **Construye con contenido real.** Nada de "Lorem ipsum" ni cajas grises que
   digan "imagen". Si no hay texto, escribe texto de verdad; para fotos con
   licencia libre y su crédito, usa `node scripts/fotos.mjs "lo que buscas"`.
5. **Revisa y cierra:** `node scripts/cierre.mjs <archivo|url>` corre el linter
   de textos y la revisión en navegador (anchos 1440, 1024, 768, 390) y no deja
   pasar una FALLA. Arregla primero lo que rompe la jerarquía, el contraste o el
   móvil, y vuelve a correr (hasta 3 rondas). La lista completa está en
   `revisar/lista.md`.

## Herramientas (scripts/)

Folio trae herramientas reales que corren con Node 22+ y, para la revisión,
Chrome/Chromium (sin APIs ni llaves). Un solo comando: `node scripts/folio.mjs <cmd>`.

| Comando | Qué hace |
|---|---|
| `folio sistema --tipo <tipo>` | Reparte paleta + tipografía y escribe los `<link>` y tokens `:root`. |
| `folio direccion --tipo <tipo>` | Reparte una dirección de arte (evita las recientes). |
| `folio fotos "<búsqueda>"` | Busca imágenes con licencia libre (Openverse) y arma el crédito. |
| `folio revisar <url\|archivo>` | Abre la página en 4 anchos y revisa desborde, H1, contraste AA, línea, tipografías, alt y toque móvil. |
| `folio textos <archivo>` | Linter de textos: caza relleno, frases de molde y marcadores. |
| `folio cierre <url\|archivo>` | La puerta de cierre: textos + revisión. No pasa con FALLAS. Sirve como hook de Stop. |

## Qué NO hacer (lo que delata una página genérica)

- Tres tarjetas iguales con un ícono, un título y dos líneas. Es el molde de
  todas las webs del mundo. Si usas tarjetas, que tengan ritmo distinto,
  tamaños distintos, o contenido real que pida esa forma.
- Degradados morados, sombras azules difusas, "glassmorphism" por defecto.
- Centrar todo. El texto largo centrado no se lee; alinéalo a la izquierda.
- Emojis como íconos de sección.
- Botones gigantes de colores chillones. El botón principal es sobrio (oscuro
  sobre claro) y hay uno, no cinco.
- Rellenar con secciones vacías ("Nuestros valores", testimonios inventados)
  solo para que la página sea larga. Mejor corta y verdadera.

## Movimiento

El movimiento en Folio es casi invisible: entra para aclarar, no para lucirse.
Apariciones suaves al bajar (fade + subida), transiciones tranquilas. Nada
rebota, nada gira, nada parpadea. Respeta `prefers-reduced-motion`.

Para lograrlo sin pelear con CSS, **usa el módulo propio `assets/folio-motion.js`**
(sin librerías). Un solo `<script src="folio-motion.js" defer></script>` y luego
marcas con data-atributos:

- `data-folio="entrada"` — aparece al cargar, escalonado (para el héroe).
- `data-folio="aparece"` — aparece al entrar en la vista (se escalona solo entre
  hermanos; `data-retraso="120"` para forzar un retraso en ms).
- `data-folio="parallax" data-velocidad="0.15"` — se mueve despacio al hacer scroll.
- `data-folio="contador" data-fin="12000" data-sufijo="M"` — cuenta hacia arriba.

Para scroll suave (tipo mantequilla), llama `Folio.motion({ scrollSuave: true })`.
Todo se apaga solo con `prefers-reduced-motion`. Copia `folio-motion.js` a tu
proyecto y enlázalo; es el mismo «feel» de las buenas webs, pero tuyo y ligero.

## Imágenes

Si usas fotos, que sean de bancos con licencia libre y clara (Openverse,
Wikimedia Commons, museos de dominio público) y **pon el crédito** en la
página. Si no hay una imagen que de verdad aporte, no la pongas: una buena
composición tipográfica se ve mejor que una foto de archivo que no dice nada.

## Archivos de esta skill

- `sistema/tokens.md` — paleta, tipografía, escala, espaciado y movimiento (y
  cómo cambiarlos por los de tu marca).
- `direcciones/` — las direcciones de arte (una por archivo) y cuándo usar
  cada una.
- `revisar/lista.md` — la lista con la que se revisa la página al final.
- `scripts/` — las herramientas (sistema, dirección, fotos, revisar, textos, cierre).
- `ejemplos/` — una página de ejemplo hecha con Folio.
