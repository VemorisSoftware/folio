// scripts/_comun.mjs — utilidades compartidas de Folio.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const AQUI = dirname(fileURLToPath(import.meta.url));
export const RAIZ_SKILL = resolve(AQUI, "..");

// Carpeta de estado dentro del proyecto donde se trabaja (no de la skill).
export function carpetaEstado() {
  const d = join(process.cwd(), ".folio");
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
  return d;
}

export function leerEstado() {
  const f = join(carpetaEstado(), "estado.json");
  if (!existsSync(f)) return { recientes: {} };
  try { return JSON.parse(readFileSync(f, "utf8")); } catch { return { recientes: {} }; }
}

export function guardarEstado(e) {
  writeFileSync(join(carpetaEstado(), "estado.json"), JSON.stringify(e, null, 2));
}

// Elige un elemento al azar evitando los últimos `memoria` ya usados en esa
// categoría. Así no se repite la misma dirección/paleta build tras build.
export function elegirEvitando(opciones, categoria, memoria = 3) {
  const e = leerEstado();
  e.recientes ||= {};
  const recientes = e.recientes[categoria] || [];
  const id = (x) => (typeof x === "string" ? x : x.nombre || JSON.stringify(x));
  let libres = opciones.filter((o) => !recientes.includes(id(o)));
  if (libres.length === 0) libres = opciones;
  const elegido = libres[Math.floor(Math.random() * libres.length)];
  e.recientes[categoria] = [id(elegido), ...recientes].slice(0, memoria);
  guardarEstado(e);
  return elegido;
}

export function leerJSON(ruta) {
  return JSON.parse(readFileSync(join(RAIZ_SKILL, ruta), "utf8"));
}

// ── Contraste WCAG ───────────────────────────────────────────────────────
function aLineal(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
export function rgb(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
}
export function luminancia(hex) {
  const [r, g, b] = rgb(hex).map(aLineal);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contraste(a, b) {
  const la = luminancia(a), lb = luminancia(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const C = {
  gris: (s) => `\x1b[90m${s}\x1b[0m`,
  verde: (s) => `\x1b[32m${s}\x1b[0m`,
  ambar: (s) => `\x1b[33m${s}\x1b[0m`,
  rojo: (s) => `\x1b[31m${s}\x1b[0m`,
  fuerte: (s) => `\x1b[1m${s}\x1b[0m`,
};

// Busca un ejecutable de Chrome para puppeteer-core.
export function rutaChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidatos = [
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  ];
  for (const c of candidatos) { try { if (existsSync(c)) return c; } catch {} }
  return null;
}
