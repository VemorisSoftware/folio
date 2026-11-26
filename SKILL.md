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

Sigue estos pasos en orden. No saltes al código antes del paso 3.

1. **Entiende qué es la página.** ¿Qué es lo único que la persona tiene que
   entender o hacer aquí? Escríbelo en una frase antes de maquetar.
2. **Elige UNA dirección de arte** de `direcciones/` según lo que sea la
   página (cada archivo dice cuándo usarla). No mezcles dos. Si dudas entre
   dos, es señal de que la página hace dos cosas: sepárala.
3. **Aplica el sistema** de `sistema/tokens.md`: paleta, escala tipográfica,
   espaciado y movimiento. Son los materiales; la dirección dice cómo
   usarlos. Si el proyecto tiene su propia marca, reemplaza los tokens por los
   de esa marca (ver el final de ese archivo).
4. **Construye con contenido real.** Nada de "Lorem ipsum" ni cajas grises que
   digan "imagen". Si no hay texto, escribe texto de verdad; si no hay imagen,
   usa una forma, un degradado de la paleta o tipografía grande.
5. **Revisa contra `revisar/lista.md`** en tres anchos (teléfono ~390px,
   tablet ~800px, escritorio ~1280px). Arregla primero lo que rompe la
   jerarquía o el aire. Repite hasta que pase la lista.

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
Apariciones suaves al bajar (fade + 8px hacia arriba), transiciones de
150–250ms con una curva tranquila. Nada rebota, nada gira, nada parpadea.
Respeta `prefers-reduced-motion`.

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
