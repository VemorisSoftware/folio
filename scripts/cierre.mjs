// scripts/cierre.mjs — la puerta de cierre. Antes de dar una página por lista,
// corre el linter de textos y la revisión en navegador. Si queda alguna FALLA,
// no pasa: el agente arregla y vuelve a correrla (hasta 3 rondas). Sirve como
// hook de Stop en Claude Code.
//
//   node scripts/cierre.mjs <url|archivo.html>
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { AQUI, C } from "./_comun.mjs";

const objetivo = process.argv[2];
if (!objetivo) { console.error("Uso: node scripts/cierre.mjs <url|archivo.html>"); process.exit(2); }

function correr(script, arg) {
  const r = spawnSync(process.execPath, [join(AQUI, script), arg], { stdio: "inherit" });
  return r.status === 0;
}

console.log(C.fuerte("\n═══ Folio · puerta de cierre ═══"));

let ok = true;
// El linter de textos solo aplica a archivos locales.
if (!/^https?:\/\//.test(objetivo) && existsSync(objetivo)) {
  ok = correr("copia-lint.mjs", objetivo) && ok;
}
ok = correr("revisar.mjs", objetivo) && ok;

console.log(C.fuerte("═".repeat(34)));
if (ok) {
  console.log(C.verde("✓ La página pasa. Lista para entregar."));
  process.exit(0);
} else {
  console.log(C.rojo("✗ Quedan FALLAS. Arréglalas y vuelve a correr el cierre (hasta 3 rondas)."));
  console.log(C.gris("  Las FALLAS rompen la jerarquía, el contraste o el móvil: esas van primero."));
  process.exit(1);
}
