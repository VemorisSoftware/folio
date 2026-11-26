# Direcciones de arte

Una **dirección** es la personalidad visual de una sección o página: cómo se
maqueta, qué manda, cómo se mueve. Elige **una** por página (o una por sección
grande). No mezcles dos en el mismo bloque: se ve indeciso.

Puedes repartir una al azar con `node scripts/direccion.mjs --tipo <tipo>`
(evita las de los últimos builds), o elegir a mano según lo que sea la página.

| # | Dirección | Úsala cuando la página… |
|---|---|---|
| 01 | Editorial sereno | explica o convence con texto |
| 02 | Monolito | tiene una sola idea potente |
| 03 | Índice | lista o estructura cosas |
| 04 | Terminal | es técnica o para programadores |
| 05 | Galería | muestra varias imágenes o trabajo |
| 06 | Dividido | muestra una idea y una prueba a la vez |
| 07 | Centrado | tiene un mensaje corto y directo |
| 08 | Producto | el héroe es un objeto o una pantalla |
| 09 | Foto | una sola imagen cuenta la historia |
| 10 | Collage | varias piezas visuales dan una sensación |
| 11 | Palabra | el nombre o una palabra ES el mensaje |
| 12 | Declaración | hay una postura o promesa fuerte que decir |
| 13 | Tríptico | hay tres cosas de igual peso |
| 14 | Panel | es una aplicación: dashboard, ajustes, datos |

## Tipos de página

El **tipo** define los materiales por defecto (paleta y tipografía, en
`../sistema/`), y sugiere qué direcciones calzan mejor:

| Tipo | Qué es | Direcciones que suelen calzar |
|---|---|---|
| `producto` | software, apps, herramientas dev | monolito, dividido, producto, terminal, panel |
| `servicio` | agencias, consultoras, estudios | editorial, dividido, tríptico, declaración |
| `lugar` | cafés, tiendas, restaurantes, hoteles | foto, galería, collage, centrado |
| `editorial` | medios, blogs, documentación, libros | editorial, índice, declaración, palabra |
| `portafolio` | trabajo, galerías, identidad | galería, collage, palabra, foto |

Cómo elegir rápido: pregúntate qué es lo único que la persona tiene que captar.
Una frase → monolito o palabra. Entender algo → editorial. Encontrar algo en una
lista → índice. Para devs → terminal. Mirar → galería o foto. Una app → panel.

Todas comparten el mismo sistema (`../sistema/tokens.md`): la dirección cambia
la composición, no los materiales.
