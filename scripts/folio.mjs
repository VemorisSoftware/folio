#!/usr/bin/env node
// scripts/folio.mjs — un solo comando para todo Folio.
//
//   folio sistema   --tipo producto
//   folio direccion --tipo producto
//   folio fotos     "café de especialidad"
//   folio revisar   pagina.html
//   folio textos    pagina.html
//   folio cierre    pagina.html
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { AQUI } from "./_comun.mjs";

const mapa = {
  sistema: "sistema.mjs",
  direccion: "direccion.mjs",
  fotos: "fotos.mjs",
  revisar: "revisar.mjs",
  textos: "copia-lint.mjs",
  cierre: "cierre.mjs",
};
const [cmd, ...resto] = process.argv.slice(2);
const script = mapa[cmd];
if (!script) {
  console.log(`Folio — gusto de diseño.

Comandos:
  folio sistema   --tipo <producto|servicio|lugar|editorial|portafolio>
  folio direccion [--tipo <tipo>] [NN]
  folio fotos     "<búsqueda>" [--n 3] [--licencia cc0,pdm]
  folio revisar   <url|archivo.html>
  folio textos    <archivo.html>
  folio cierre    <url|archivo.html>`);
  process.exit(cmd ? 2 : 0);
}
const r = spawnSync(process.execPath, [join(AQUI, script), ...resto], { stdio: "inherit" });
process.exit(r.status ?? 0);
