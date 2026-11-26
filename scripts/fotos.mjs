// scripts/fotos.mjs — busca imágenes de bancos con licencia libre y clara, y
// arma el crédito listo para poner en la página. Usa Openverse, que agrega
// fotos de Wikimedia Commons, Flickr (CC), museos y más, filtrando por licencia.
//
//   node scripts/fotos.mjs "café de especialidad" --n 3
//   node scripts/fotos.mjs "sala de servidores" --licencia cc0,pdm,by
//
// Necesita acceso a internet (solo para buscar las imágenes). Sin API keys.
import { C } from "./_comun.mjs";

const args = process.argv.slice(2);
const q = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--n" && args[i - 1] !== "--licencia").join(" ").trim();
if (!q) { console.error('Uso: node scripts/fotos.mjs "lo que buscas" [--n 3] [--licencia cc0,pdm,by]'); process.exit(2); }
const n = parseInt(args[args.indexOf("--n") + 1]) || 3;
const licencia = args[args.indexOf("--licencia") + 1] || "cc0,pdm";

const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=${encodeURIComponent(licencia)}&page_size=${n}&mature=false`;

let datos;
try {
  const r = await fetch(url, { headers: { "User-Agent": "Folio/0.2 (skill de diseño)" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  datos = await r.json();
} catch (e) {
  console.error(C.rojo(`No pude buscar imágenes: ${e.message}`));
  console.error(C.gris("Revisa tu conexión. Folio no sube tu código a ninguna parte; esto solo consulta Openverse."));
  process.exit(1);
}

const fotos = (datos.results || []).filter((f) => f.url);
if (fotos.length === 0) { console.log(C.ambar("Sin resultados con esa licencia. Prueba otra búsqueda o --licencia by,by-sa.")); process.exit(0); }

console.log(C.fuerte(`\nFolio · fotos para "${q}"  (licencia: ${licencia})`));
console.log(C.gris("─".repeat(56)));
fotos.forEach((f, i) => {
  const autor = f.creator || "autor desconocido";
  const lic = (f.license || "").toUpperCase() + (f.license_version ? ` ${f.license_version}` : "");
  const credito = `Foto: ${autor} — ${f.source || "Openverse"} (${lic})`;
  console.log(`\n${C.fuerte(`${i + 1}. ${f.title || "(sin título)"}`)}`);
  console.log(`   ${f.url}`);
  console.log(C.gris(`   ${credito}`));
  console.log(C.gris("   HTML:"));
  console.log(`   <figure>
     <img src="${f.url}" alt="${(f.title || q).replace(/"/g, "")}" loading="lazy">
     <figcaption>${credito}${f.foreign_landing_url ? ` · <a href="${f.foreign_landing_url}">fuente</a>` : ""}</figcaption>
   </figure>`);
});
console.log(C.gris("\nPon siempre el crédito en la página. Descarga la imagen a tu proyecto en WebP si vas a producción.\n"));
