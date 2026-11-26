# Sistema Folio — los materiales (por defecto)

Estos son los materiales por defecto de Folio. La **dirección de arte** decide
cómo combinarlos; aquí solo se definen. Si tu proyecto tiene marca propia,
cámbialos por los suyos (ver «Cambiar por tu marca» al final).

## Paleta

El fondo es tranquilo y cálido; el oscuro navy es la voz; un solo acento.

| Nombre | Hex | Uso |
|---|---|---|
| Tinta | `#132941` | Navy profundo. Titulares, texto fuerte, fondos oscuros. |
| Tinta-2 | `#263443` | Navy un paso más suave. Fondos oscuros alternos, bordes sobre oscuro. |
| Pizarra | `#666C74` | Gris. Texto secundario, subtítulos, metadatos. |
| Hueso | `#DCD7D0` | Claro cálido. Bordes, separadores, fondos de tarjeta. |
| Hueso claro | `#E4DFD9` | Un paso más claro. Fondos de sección alternos. |
| Papel | `#FAF9F5` | Casi blanco cálido. Fondo principal de la página. |
| Blanco | `#FFFFFF` | Texto sobre oscuro, superficies que deben saltar. |

Reglas de color:
- Fondo = Papel. Texto principal = Tinta. Texto secundario = Pizarra.
- **Un solo acento por página.** Por defecto, el acento es el propio navy
  (Tinta) en bloques oscuros. Si de verdad hace falta un color de énfasis,
  elígelo una vez y úsalo poco.
- Nunca pongas texto Pizarra sobre Hueso (poco contraste). Texto sobre oscuro
  = Blanco o Hueso claro.
- Contraste mínimo AA siempre. Si dudas, oscurece el texto.

```css
:root {
  --tinta: #132941;
  --tinta-2: #263443;
  --pizarra: #666C74;
  --hueso: #DCD7D0;
  --hueso-claro: #E4DFD9;
  --papel: #FAF9F5;
  --blanco: #FFFFFF;
}
```

## Tipografía

Dos voces: una **serif** de display para los titulares (la voz de Vemoris, con
carácter) y una **sans** limpia para el texto y la interfaz. Una **mono** solo
para código y datos.

- Serif de display: `"Source Serif 4", Georgia, serif`. La voz con carácter.
- Sans de texto e interfaz: `"Inter Tight", "Inter", system-ui, sans-serif`.
- Mono (código y datos): `ui-monospace, "SF Mono", Menlo, monospace`.

Reglas tipográficas:
- Titulares en serif, tamaño grande, `letter-spacing` ligeramente negativo
  (-0.02em), interlineado ajustado (1.05–1.15).
- Cuerpo en sans, 16–18px, interlineado 1.5–1.65, ancho de línea 60–75
  caracteres máximo. El texto largo nunca ocupa todo el ancho.
- Jerarquía por **tamaño y peso**, no por color ni por mayúsculas sostenidas.
- Un peso fuerte (600/700) para titulares; regular (400) para cuerpo. Evita
  usar cinco pesos distintos.

### Escala (sugerida, ajústala a la dirección)

```
Display   clamp(2.5rem, 5vw, 4.5rem)   serif   700   lh 1.05   ls -0.025em
H1        clamp(2rem, 3.5vw, 3rem)     serif   600   lh 1.1    ls -0.02em
H2        1.5rem                        serif   600   lh 1.2
H3        1.125rem                      sans    650   lh 1.3
Cuerpo    1.0625rem (17px)              sans    400   lh 1.6
Menor     0.8125rem (13px)              sans    400   lh 1.5   (metadatos)
```

## Espaciado

El aire es parte del diseño. Sé generoso.

- Escala base de 4px: `4 8 12 16 24 32 48 64 96 128`.
- Márgenes de sección verticales grandes: 96–128px en escritorio, 56–72px en
  teléfono.
- Contenedor de lectura: máximo ~720px. Contenedor ancho (galerías, rejillas):
  máximo ~1100–1200px. Centrado con margen a los lados que nunca baja de 24px.
- Agrupa por cercanía: lo relacionado va junto, lo distinto se separa con
  espacio, no con líneas.

## Bordes, radios y superficies

- Bordes finos (1px) en Hueso. Las líneas y separadores son la decoración de
  Vemoris; úsalas en vez de sombras cuando puedas.
- Radios suaves: 10–16px en tarjetas y botones; 0 cuando la dirección es
  editorial o de índice (ahí los rectos se ven más serios).
- Sombras: casi nunca. Si una tarjeta debe elevarse, una sombra muy suave y
  difusa (`0 20px 60px -30px rgba(19,41,65,.25)`), no un halo marcado.

## Movimiento

```css
--curva: cubic-bezier(.2,.6,.2,1);
--rapido: 150ms;
--medio: 250ms;
```

- Apariciones al bajar: opacidad 0→1 y `translateY(8px)→0`, en `--medio`.
- Hover: solo cambio de fondo o un subrayado que crece; nada que salte.
- Siempre `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`.

## Cambiar por tu marca

Folio trae estos materiales por defecto, pero la gracia es que la **dirección**
y el **proceso** funcionan con cualquier identidad. Para usar tu marca:

1. Reemplaza las variables de color (`--tinta`, `--papel`, etc.) por las de tu
   paleta, respetando los roles: un fondo tranquilo, un texto oscuro, un gris
   para lo secundario, un acento usado con avaricia.
2. Cambia las dos familias tipográficas (una serif de display con carácter y
   una sans limpia). Mantén la regla: jerarquía por tamaño y peso, no por
   color.
3. No toques las direcciones de arte ni la lista de revisión: esas son el
   criterio, y valen para cualquier marca.

Mientras se respeten los **roles** (un fondo, una voz, un acento, mucho aire),
el resultado sigue teniendo el gusto de Folio aunque los colores sean otros.
