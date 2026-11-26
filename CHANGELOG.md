# Cambios

## Sin publicar

- **Movimiento: efectos nuevos en `assets/folio-motion.js`** (CSS + IntersectionObserver, sin librerías, con `prefers-reduced-motion`):
  - `data-folio="palabras"`: el titular entra palabra por palabra, subiendo y de `blur(8px)` a nítido, 60 ms entre palabras. Respeta `<em>` y enlaces; si no está a la vista al cargar, entra al llegar a él.
  - `data-folio="trazo"`: los trazos SVG se dibujan al entrar (`stroke-dasharray`/`stroke-dashoffset`). Los rellenos no se tocan.
  - `data-folio="deriva"`: movimiento continuo y muy leve para decorativos, con `data-eje` (`x`, `y`, `zoom`, `giro`, combinables), `data-amplitud` y `data-ciclo`. Fase al azar por elemento, se pausa fuera de la vista y usa `translate`/`rotate`/`scale` para sumarse a `parallax`.
  - `data-folio="cuenta-cue"`: indicador de scroll que late en bucle y se desvanece al bajar.
  - `data-folio="inclina"`: se endereza en 3D al entrar, ligado al scroll.
  - `Folio.escribir(el, texto, { velocidad, senal })`: escritura progresiva para demos de terminal.
- **Movimiento más presente**: apariciones de 40 px en 1–1,2 s y contadores de 1,8 s.
- **Arreglo**: la entrada del héroe no se veía cuando el navegador pintaba antes de que cargara el script (`defer`); ahora fija su estado inicial antes de animar.

## 0.3.0

- **Movimiento propio (`assets/folio-motion.js`)**, sin librerías: apariciones al bajar con escalonado, entrada del héroe, parallax sutil, contadores y scroll suave opcional. El mismo "feel" de las buenas webs (scroll suave + reveals), pero ligero y con `prefers-reduced-motion`.
- **Ejemplo de producto oscuro** (hero dramático, mockup con luz, diagrama y cifras animadas) y showcase en el README.

## 0.2.0

Folio deja de ser solo un criterio escrito y gana herramientas reales.

- **Herramientas (`scripts/`)**, en Node + Chrome, sin APIs ni llaves:
  - `sistema` reparte paleta + tipografía por tipo de página, con contraste AA comprobado.
  - `direccion` reparte una dirección de arte evitando las recientes.
  - `fotos` busca imágenes con licencia libre (Openverse) y arma el crédito.
  - `revisar` abre la página en 4 anchos (1440/1024/768/390) y revisa desborde, H1, contraste, ancho de línea, tipografías, alt y toque móvil.
  - `textos` caza relleno y frases de molde.
  - `cierre` junta todo en una puerta que no pasa con FALLAS (hook de Stop).
- **14 direcciones de arte** (antes 5): + dividido, centrado, producto, foto, collage, palabra, declaración, tríptico y panel.
- **Tipos de página** (producto, servicio, lugar, editorial, portafolio) con paletas y parejas tipográficas propias.
- **Página de ejemplo** y capturas.
- `install.sh` para enlazar Folio en Claude Code o Codex.

## 0.1.0

Primera versión de Folio: el criterio, el sistema base, 5 direcciones y la lista de revisión.
