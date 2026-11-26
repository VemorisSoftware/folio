// scripts/revisar.mjs — abre la página en un Chrome de verdad, en cuatro anchos
// (1440, 1024, 768, 390), y revisa reglas de diseño: desborde horizontal, un
// solo H1, contraste del texto (AA), ancho de línea, número de tipografías,
// imágenes sin alt y tamaño de los botones en móvil. Da PASA / OJO / FALLA.
//
//   node scripts/revisar.mjs <url|archivo.html>
//   Necesita Chrome/Chromium instalado (o CHROME_PATH). Sin APIs ni llaves.
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";
import { rutaChrome, C } from "./_comun.mjs";

const entrada = process.argv[2];
if (!entrada) { console.error("Uso: node scripts/revisar.mjs <url|archivo.html>"); process.exit(2); }
const url = /^https?:\/\//.test(entrada) ? entrada
  : existsSync(entrada) ? pathToFileURL(resolve(entrada)).href
  : null;
if (!url) { console.error(`No encuentro: ${entrada}`); process.exit(2); }

const chrome = rutaChrome();
if (!chrome) { console.error("No encontré Chrome. Instálalo o define CHROME_PATH."); process.exit(2); }

const ANCHOS = [1440, 1024, 768, 390];

const navegador = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
const resultados = {};
try {
  const page = await navegador.newPage();
  for (const w of ANCHOS) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 30000 }));
    await new Promise((r) => setTimeout(r, 350));
    resultados[w] = await page.evaluate(revisarEnPagina, w);
  }
} finally {
  await navegador.close();
}

// ── Reporte ──────────────────────────────────────────────────────────────
const REGLAS = [
  ["desborde", "Sin desborde horizontal"],
  ["un_h1", "Un solo H1"],
  ["contraste", "Contraste de texto (AA)"],
  ["ancho_linea", "Ancho de línea legible"],
  ["tipografias", "Máximo 3 tipografías"],
  ["img_alt", "Imágenes con alt"],
  ["toque", "Botones usables en móvil"],
];
console.log(C.fuerte(`\nFolio · revisión en navegador · ${entrada}`));
console.log(C.gris(`anchos: ${ANCHOS.join(", ")} px`));
console.log(C.gris("─".repeat(60)));

let fallas = 0, ojos = 0;
for (const [clave, titulo] of REGLAS) {
  let peor = "PASA", detalle = "";
  for (const w of ANCHOS) {
    const r = resultados[w][clave];
    if (!r) continue;
    if (r.estado === "FALLA" && peor !== "FALLA") { peor = "FALLA"; detalle = `@${w}px · ${r.detalle}`; }
    else if (r.estado === "OJO" && peor === "PASA") { peor = "OJO"; detalle = `@${w}px · ${r.detalle}`; }
  }
  if (peor === "FALLA") fallas++;
  if (peor === "OJO") ojos++;
  const et = peor === "FALLA" ? C.rojo("FALLA") : peor === "OJO" ? C.ambar(" OJO ") : C.verde("PASA ");
  console.log(`${et} ${titulo}${detalle ? C.gris("  — " + detalle) : ""}`);
}
console.log(C.gris(`\n${fallas} fallas · ${ojos} avisos\n`));
process.exit(fallas > 0 ? 1 : 0);

// ── Lo que corre dentro de la página ──────────────────────────────────────
function revisarEnPagina(ancho) {
  const movil = ancho <= 500;
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
  const out = {};

  // Desborde horizontal
  const sw = document.documentElement.scrollWidth, iw = window.innerWidth;
  out.desborde = sw > iw + 2
    ? { estado: movil ? "FALLA" : "OJO", detalle: `el contenido mide ${sw}px en ${iw}px` }
    : { estado: "PASA" };

  // Un solo H1
  const h1 = document.querySelectorAll("h1").length;
  out.un_h1 = h1 === 1 ? { estado: "PASA" } : { estado: h1 === 0 ? "OJO" : "OJO", detalle: `hay ${h1} H1` };

  // Contraste de texto
  function fondoEfectivo(el) {
    let n = el;
    while (n && n.nodeType === 1) {
      const c = getComputedStyle(n).backgroundColor;
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (m) { const p = m[1].split(",").map(Number); if (p.length < 4 || p[3] > 0.5) return p.slice(0, 3); }
      n = n.parentElement;
    }
    return [255, 255, 255];
  }
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const contraste = (a, b) => { const la = lum(a), lb = lum(b); const hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };
  let peorC = 21, muestras = 0;
  const textos = [...document.querySelectorAll("p,span,a,li,h1,h2,h3,h4,button,label,td,th")];
  for (const el of textos) {
    if (!visible(el) || !el.textContent.trim() || el.children.length > 0) continue;
    const s = getComputedStyle(el);
    const col = (s.color.match(/rgba?\(([^)]+)\)/)?.[1].split(",").map(Number)) || [0, 0, 0];
    if (col[3] !== undefined && col[3] < 0.5) continue;
    const c = contraste(col.slice(0, 3), fondoEfectivo(el));
    muestras++;
    if (c < peorC) peorC = c;
    if (muestras > 400) break;
  }
  out.contraste = muestras === 0 ? { estado: "PASA" }
    : peorC < 4.5 ? { estado: "FALLA", detalle: `hay texto con contraste ${peorC.toFixed(1)}:1 (mínimo 4.5)` }
    : { estado: "PASA" };

  // Ancho de línea (caracteres por línea en párrafos)
  let largas = 0;
  for (const p of document.querySelectorAll("p")) {
    if (!visible(p)) continue;
    const s = getComputedStyle(p);
    const fs = parseFloat(s.fontSize) || 16;
    const ch = p.getBoundingClientRect().width / (fs * 0.5);
    if (ch > 92 && p.textContent.trim().length > 120) largas++;
  }
  out.ancho_linea = largas > 0 ? { estado: "OJO", detalle: `${largas} párrafo(s) con líneas muy largas` } : { estado: "PASA" };

  // Tipografías distintas
  const fams = new Set();
  for (const el of textos) { if (visible(el)) fams.add((getComputedStyle(el).fontFamily.split(",")[0] || "").replace(/["']/g, "").trim().toLowerCase()); }
  out.tipografias = fams.size > 3 ? { estado: "OJO", detalle: `${fams.size} familias en uso` } : { estado: "PASA" };

  // Imágenes sin alt
  const sinAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length;
  out.img_alt = sinAlt > 0 ? { estado: "OJO", detalle: `${sinAlt} imagen(es) sin alt` } : { estado: "PASA" };

  // Tamaño de botones en móvil
  if (movil) {
    let chicos = 0;
    for (const b of document.querySelectorAll("a,button,[role=button]")) {
      if (!visible(b)) continue;
      const r = b.getBoundingClientRect();
      if (r.height < 32 && b.textContent.trim()) chicos++;
    }
    out.toque = chicos > 0 ? { estado: "OJO", detalle: `${chicos} control(es) de menos de 32px de alto` } : { estado: "PASA" };
  } else out.toque = { estado: "PASA" };

  return out;
}
