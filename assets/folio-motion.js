/* folio-motion.js — el movimiento de Folio. Sin librerías, sin dependencias.
 *
 * Da el mismo "feel" de las buenas webs: scroll suave, apariciones al bajar
 * (con escalonado), parallax sutil, contadores que suben y una entrada del
 * héroe al cargar. Todo con data-atributos; respeta prefers-reduced-motion.
 *
 *   <script src="folio-motion.js" defer></script>
 *
 * Atributos (se pueden combinar, separados por espacio):
 *   data-folio="aparece"          aparece al entrar en la vista (fade + subida)
 *   data-folio="entrada"          aparece al cargar (para el héroe)
 *   data-folio="parallax" data-velocidad="0.2"   se mueve despacio al hacer scroll
 *   data-folio="contador" data-fin="12000" data-sufijo="M"   cuenta hacia arriba
 *   data-retraso="120"            retrasa su aparición (ms); si no, se escalona solo
 *
 * Scroll suave (opcional): Folio.motion({ scrollSuave: true })
 */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // CSS propio, inyectado una vez.
  const css = `
  [data-folio~="aparece"],[data-folio~="entrada"]{opacity:0;transform:translateY(14px);
    transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1);will-change:opacity,transform}
  [data-folio~="aparece"].folio-on,[data-folio~="entrada"].folio-on{opacity:1;transform:none}
  @media (prefers-reduced-motion: reduce){
    [data-folio~="aparece"],[data-folio~="entrada"]{opacity:1!important;transform:none!important;transition:none!important}
    html.folio-suave{scroll-behavior:auto!important}
  }`;
  const estilo = document.createElement("style");
  estilo.textContent = css;
  document.head.appendChild(estilo);

  function listo(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // ── Apariciones al entrar en la vista, con escalonado por hermanos ───────
  function apariciones() {
    const items = [...document.querySelectorAll('[data-folio~="aparece"]')];
    if (reduce) { items.forEach((e) => e.classList.add("folio-on")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const propio = el.dataset.retraso;
        const idx = propio != null ? 0 : [...el.parentElement.children].filter((c) => c.matches('[data-folio~="aparece"]')).indexOf(el);
        el.style.transitionDelay = (propio != null ? +propio : Math.min(idx, 6) * 70) + "ms";
        el.classList.add("folio-on");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((e) => io.observe(e));
  }

  // ── Entrada del héroe al cargar ──────────────────────────────────────────
  function entrada() {
    const items = [...document.querySelectorAll('[data-folio~="entrada"]')];
    if (reduce) { items.forEach((e) => e.classList.add("folio-on")); return; }
    items.forEach((el, i) => {
      el.style.transitionDelay = (80 + i * 90) + "ms";
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("folio-on")));
    });
  }

  // ── Parallax sutil ───────────────────────────────────────────────────────
  function parallax() {
    const items = [...document.querySelectorAll('[data-folio~="parallax"]')];
    if (reduce || items.length === 0) return;
    let activo = false;
    function pintar() {
      activo = false;
      const vh = innerHeight;
      for (const el of items) {
        const r = el.getBoundingClientRect();
        const centro = r.top + r.height / 2 - vh / 2;
        const v = parseFloat(el.dataset.velocidad || "0.15");
        el.style.transform = `translate3d(0, ${(-centro * v).toFixed(1)}px, 0)`;
      }
    }
    addEventListener("scroll", () => { if (!activo) { activo = true; requestAnimationFrame(pintar); } }, { passive: true });
    pintar();
  }

  // ── Contadores ───────────────────────────────────────────────────────────
  function contadores() {
    const items = [...document.querySelectorAll('[data-folio~="contador"]')];
    if (items.length === 0) return;
    const fmt = (n) => n.toLocaleString("es-CL");
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target; io.unobserve(el);
        const fin = parseFloat(el.dataset.fin || "0");
        const suf = el.dataset.sufijo || "";
        const pre = el.dataset.prefijo || "";
        if (reduce) { el.textContent = pre + fmt(fin) + suf; return; }
        const dur = 1100, t0 = performance.now();
        (function paso(t) {
          const p = Math.min(1, (t - t0) / dur);
          const e2 = 1 - Math.pow(1 - p, 3); // easeOutCubic
          el.textContent = pre + fmt(Math.round(fin * e2)) + suf;
          if (p < 1) requestAnimationFrame(paso);
        })(t0);
      });
    }, { threshold: 0.6 });
    items.forEach((e) => io.observe(e));
  }

  // ── Scroll suave (opcional, tipo Lenis pero propio y mínimo) ──────────────
  function scrollSuave() {
    if (reduce) return;
    document.documentElement.classList.add("folio-suave");
    let objetivo = scrollY, actual = scrollY, corriendo = false;
    const lerp = 0.12;
    function loop() {
      actual += (objetivo - actual) * lerp;
      if (Math.abs(objetivo - actual) < 0.5) { actual = objetivo; corriendo = false; }
      else requestAnimationFrame(loop);
      window.scrollTo(0, actual);
    }
    addEventListener("wheel", (e) => {
      e.preventDefault();
      objetivo = Math.max(0, Math.min(objetivo + e.deltaY, document.body.scrollHeight - innerHeight));
      if (!corriendo) { corriendo = true; actual = scrollY; requestAnimationFrame(loop); }
    }, { passive: false });
  }

  const API = {
    motion(opts = {}) {
      listo(() => {
        entrada(); apariciones(); parallax(); contadores();
        if (opts.scrollSuave) scrollSuave();
      });
      return API;
    },
  };
  window.Folio = Object.assign(window.Folio || {}, API);
  // Auto-arranque (sin scroll suave; actívalo con Folio.motion({scrollSuave:true})).
  if (!window.__folioManual) API.motion();
})();
