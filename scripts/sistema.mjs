// scripts/sistema.mjs — reparte una paleta y una pareja tipográfica según el
// tipo de página, e imprime los <link> de fuentes y los tokens :root listos
// para pegar. Evita repetir la elección de builds recientes.
//
//   node scripts/sistema.mjs --tipo producto
//   tipos: producto · servicio · lugar · editorial · portafolio
import { leerJSON, elegirEvitando, contraste, C } from "./_comun.mjs";

const TIPOS = ["producto", "servicio", "lugar", "editorial", "portafolio"];
const args = process.argv.slice(2);
const tipo = (args[args.indexOf("--tipo") + 1] || "producto").toLowerCase();
if (!TIPOS.includes(tipo)) {
  console.error(`Tipo desconocido: ${tipo}. Usa uno de: ${TIPOS.join(", ")}`);
  process.exit(2);
}

const paleta = elegirEvitando(leerJSON("sistema/paletas.json")[tipo], `paleta:${tipo}`);
const tipos = elegirEvitando(leerJSON("sistema/tipografias.json")[tipo], `tipo:${tipo}`);

const familias = [tipos.display, tipos.texto, tipos.mono].filter(Boolean);
const q = familias.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`).join("&");
const head = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${q}&display=swap" rel="stylesheet">`;

const root = `:root {
  --fondo: ${paleta.fondo};
  --tinta: ${paleta.tinta};
  --pizarra: ${paleta.pizarra};
  --borde: ${paleta.borde};
  --acento: ${paleta.acento};
  --oscuro: ${paleta.oscuro};
  --serif: "${tipos.display}", Georgia, serif;
  --sans: "${tipos.texto}", system-ui, sans-serif;${tipos.mono ? `\n  --mono: "${tipos.mono}", ui-monospace, Menlo, monospace;` : ""}
  --curva: cubic-bezier(.2,.6,.2,1);
}`;

const cTexto = contraste(paleta.tinta, paleta.fondo);
const cSec = contraste(paleta.pizarra, paleta.fondo);

console.log(C.fuerte(`\nFolio · sistema para página de tipo "${tipo}"`));
console.log(C.gris("─".repeat(52)));
console.log(`Paleta:      ${C.fuerte(paleta.nombre)}`);
console.log(`Tipografía:  ${C.fuerte(tipos.display)} (display) + ${C.fuerte(tipos.texto)} (texto)${tipos.mono ? ` + ${tipos.mono} (mono)` : ""}`);
console.log(`Contraste:   texto ${marca(cTexto, 4.5)} ${cTexto.toFixed(1)}:1 · secundario ${marca(cSec, 4.5)} ${cSec.toFixed(1)}:1`);
console.log(C.gris("\n<!-- en el <head> -->"));
console.log(head);
console.log(C.gris("\n/* en tu CSS */"));
console.log(root);
console.log(C.gris("\nSugerencia: usa --acento con avaricia (enlaces, un botón, un detalle), no en bloques grandes.\n"));

function marca(v, min) { return v >= min ? C.verde("PASA") : C.rojo("BAJO"); }
