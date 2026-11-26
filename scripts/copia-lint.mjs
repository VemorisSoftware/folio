// scripts/copia-lint.mjs — revisa el texto de una página en busca de relleno
// genérico: "lorem ipsum", cajas de "imagen aquí", emojis como íconos de
// sección, testimonios de mentira y frases de molde.
//
//   node scripts/copia-lint.mjs pagina.html
import { readFileSync } from "node:fs";
import { C } from "./_comun.mjs";

const ruta = process.argv[2];
if (!ruta) { console.error("Uso: node scripts/copia-lint.mjs <archivo.html>"); process.exit(2); }
const html = readFileSync(ruta, "utf8");
const lineas = html.split("\n");

const REGLAS = [
  { nivel: "FALLA", re: /lorem ipsum/i, msg: "Texto de relleno 'Lorem ipsum'. Escribe texto real." },
  { nivel: "FALLA", re: /\b(imagen aquí|image here|placeholder|your image)\b/i, msg: "Marcador de imagen. Usa una imagen real o una composición tipográfica." },
  { nivel: "FALLA", re: /\b(tu texto|your text here|insert text|texto de ejemplo)\b/i, msg: "Marcador de texto sin reemplazar." },
  { nivel: "OJO", re: /<h[1-3][^>]*>\s*[\p{Emoji_Presentation}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, msg: "Emoji como ícono de título. Folio no usa emojis de sección." },
  { nivel: "OJO", re: /\b(soluciones innovadoras|lleva tu .* al siguiente nivel|next level|empodera|sinergia|revoluciona|transformamos tu|cambia las reglas del juego)\b/i, msg: "Frase de molde vacía. Di algo concreto y verdadero." },
  { nivel: "OJO", re: /\b(lo que dicen nuestros clientes|testimonios|lo que opinan)\b/i, msg: "Sección de testimonios: úsala solo con testimonios REALES, nunca inventados." },
  { nivel: "OJO", re: /\b(nuestros valores|nuestra misión|misión y visión)\b/i, msg: "Sección de relleno típica. Inclúyela solo si aporta algo real." },
  { nivel: "OJO", re: /#(6b46c1|7c3aed|8b5cf6|a855f7|9333ea)/i, msg: "Morado/degradado genérico. Usa la paleta del sistema." },
];

const hallazgos = [];
lineas.forEach((linea, i) => {
  for (const r of REGLAS) {
    if (r.re.test(linea)) hallazgos.push({ nivel: r.nivel, linea: i + 1, msg: r.msg, texto: linea.trim().slice(0, 80) });
  }
});

// <img> sin alt (en todo el documento)
const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
for (const m of imgs) {
  if (!/\balt\s*=/.test(m[0])) hallazgos.push({ nivel: "OJO", linea: lineaDe(html, m.index), msg: "Imagen sin texto alternativo (alt).", texto: m[0].slice(0, 60) });
}

const fallas = hallazgos.filter((h) => h.nivel === "FALLA").length;
const ojos = hallazgos.filter((h) => h.nivel === "OJO").length;

console.log(C.fuerte(`\nFolio · textos · ${ruta}`));
console.log(C.gris("─".repeat(52)));
if (hallazgos.length === 0) {
  console.log(C.verde("✓ Sin relleno ni frases de molde."));
} else {
  for (const h of hallazgos) {
    const et = h.nivel === "FALLA" ? C.rojo("FALLA") : C.ambar(" OJO ");
    console.log(`${et} L${h.linea}  ${h.msg}`);
    console.log(C.gris(`        ${h.texto}`));
  }
}
console.log(C.gris(`\n${fallas} fallas · ${ojos} avisos\n`));
process.exit(fallas > 0 ? 1 : 0);

function lineaDe(texto, indice) { return texto.slice(0, indice).split("\n").length; }
