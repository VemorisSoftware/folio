// scripts/direccion.mjs — reparte una dirección de arte (evitando las de los
// últimos builds) y la imprime completa para que el agente la siga. Con --tipo
// la elige entre las que suelen calzar con ese tipo de página.
//
//   node scripts/direccion.mjs                 (cualquiera)
//   node scripts/direccion.mjs --tipo producto (acotada al tipo)
//   node scripts/direccion.mjs 03              (una concreta, por número)
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { RAIZ_SKILL, elegirEvitando, C } from "./_comun.mjs";

const DIR = join(RAIZ_SKILL, "direcciones");
const archivos = readdirSync(DIR).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();

const SUGERIDAS = {
  producto: ["02", "06", "08", "04", "14"],
  servicio: ["01", "06", "13", "12"],
  lugar: ["09", "05", "10", "07"],
  editorial: ["01", "03", "12", "11"],
  portafolio: ["05", "10", "11", "09"],
};

const args = process.argv.slice(2);
const concreta = args.find((a) => /^\d\d?$/.test(a));
const tipo = (args[args.indexOf("--tipo") + 1] || "").toLowerCase();

let elegido;
if (concreta) {
  const n = concreta.padStart(2, "0");
  elegido = archivos.find((f) => f.startsWith(n + "-"));
  if (!elegido) { console.error(`No existe la dirección ${n}.`); process.exit(2); }
} else {
  let candidatos = archivos;
  if (SUGERIDAS[tipo]) candidatos = archivos.filter((f) => SUGERIDAS[tipo].includes(f.slice(0, 2)));
  elegido = elegirEvitando(candidatos, `direccion:${tipo || "todas"}`);
}

console.log(C.gris(`\n[Folio repartió: ${elegido}${tipo ? ` · tipo ${tipo}` : ""}]\n`));
console.log(readFileSync(join(DIR, elegido), "utf8"));
