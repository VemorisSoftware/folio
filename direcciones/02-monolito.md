# 02 · Monolito

**Úsala cuando** la página tiene una sola idea potente que debe imponerse: una
portada, el lanzamiento de un producto, un hero que resume todo en una frase.

**La sensación:** entras y hay **una frase** que no puedes ignorar. Silencio
alrededor.

## Maqueta
- Pantalla completa (o casi) con una sola declaración enorme, centrada
  verticalmente, alineada a la izquierda.
- Fondo sólido: Papel con texto Tinta, o Tinta con texto Blanco (más dramático).
- Debajo de la frase, a lo sumo: una línea de apoyo en Pizarra y **un** botón
  sobrio. Nada más en la primera pantalla.
- El resto del contenido vive más abajo, y aparece al bajar; la primera
  pantalla no se llena.

## Tipografía
- La frase: Vemoris Serif en display máximo (`clamp(2.5rem, 6vw, 5.5rem)`),
  peso 700, interlineado 1.0–1.05, `ls -0.03em`.
- Apoyo: Vemoris Sans, 1.125rem, Pizarra.

## Color
- Monocromo: un fondo, un color de texto. Cero acentos de color.
- Si el fondo es Tinta, el único detalle puede ser un degradado sutil
  Tinta→Tinta-2, nada más.

## Movimiento
- La frase aparece sola al cargar (fade + 8px, 400ms). Opcional: una forma
  grande y lenta de fondo que se mueve apenas (respetando reduced-motion).

## Evita
- Llenar la primera pantalla con botones, logos de clientes, estadísticas.
- Más de una idea. Si tienes dos, esta no es tu dirección: usa editorial.

## Referencia mental
La portada de un buen informe anual, un cartel tipográfico, la home de Vercel
o Linear: una afirmación, mucho vacío, cero ruido.
