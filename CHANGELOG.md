# Cambios

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
