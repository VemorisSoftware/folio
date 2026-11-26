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
 *   data-folio="inclina"         empieza volcada en 3D y se endereza al entrar (scrubbed)
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
  [data-folio~="aparece"],[data-folio~="entrada"]{opacity:0;transform:translateY(28px);
    transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);will-change:opacity,transform}
  [data-folio~="aparece"].folio-on,[data-folio~="entrada"].folio-on{opacity:1;transform:none}
  [data-folio~="inclina"]{opacity:0;transform-origin:center top;will-change:transform,opacity;
    transform:perspective(1500px) rotateX(18deg) scale(.93) translateY(40px)}
  @media (prefers-reduced-motion: reduce){
    [data-folio~="aparece"],[data-folio~="entrada"],[data-folio~="inclina"]{opacity:1!important;transform:none!important;transition:none!important}
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
        el.style.transitionDelay = (propio != null ? +propio : Math.min(idx, 8) * 130) + "ms";
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
      el.style.transitionDelay = (80 + i * 110) + "ms";
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("folio-on")));
    });
  }

  // ── Movimiento ligado al scroll: parallax + inclinación 3D ────────────────
  function scrollLigado() {
    const para = [...document.querySelectorAll('[data-folio~="parallax"]')];
    const incl = [...document.querySelectorAll('[data-folio~="inclina"]')];
    if (reduce || (para.length === 0 && incl.length === 0)) return;
    let activo = false;
    function pintar() {
      activo = false;
      const vh = innerHeight;
      // Parallax: el elemento deriva despacio respecto al scroll.
      for (const el of para) {
        const r = el.getBoundingClientRect();
        const centro = r.top + r.height / 2 - vh / 2;
        const v = parseFloat(el.dataset.velocidad || "0.15");
        el.style.transform = `translate3d(0, ${(-centro * v).toFixed(1)}px, 0)`;
      }
      // Inclinación: empieza volcada en 3D y se endereza al entrar (scrubbed).
      for (const el of incl) {
        const r = el.getBoundingClientRect();
        const inicio = vh * 0.96, fin = vh * 0.34;   // de 0 a 1 en esta banda
        let p = (inicio - r.top) / (inicio - fin);
        p = Math.max(0, Math.min(1, p));
        const e = 1 - Math.pow(1 - p, 3);             // easeOutCubic
        const rot = (1 - e) * 18;                     // 18° -> 0°
        const sc = 0.93 + e * 0.07;                   // 0.93 -> 1
        const ty = (1 - e) * 40;                      // sube 40px -> 0
        el.style.transform = `perspective(1500px) rotateX(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)}) translateY(${ty.toFixed(1)}px)`;
        el.style.opacity = (0.35 + e * 0.65).toFixed(2);
      }
    }
    const pedir = () => { if (!activo) { activo = true; requestAnimationFrame(pintar); } };
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", pedir, { passive: true });
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
    // No lo hagas en pantallas táctiles (el scroll nativo del dedo ya es suave).
    if (matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("folio-suave");
    let objetivo = scrollY, actual = scrollY, corriendo = false;
    const lerp = 0.12;
    // Deja el scroll nativo cuando la rueda cae dentro de un panel propio
    // (overflow auto/scroll que aún puede desplazarse): menús, modales, etc.
    function enScrollable(el) {
      while (el && el !== document.body && el !== document.documentElement) {
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2) return true;
        el = el.parentElement;
      }
      return false;
    }
    function loop() {
      actual += (objetivo - actual) * lerp;
      if (Math.abs(objetivo - actual) < 0.5) { actual = objetivo; corriendo = false; }
      else requestAnimationFrame(loop);
      window.scrollTo(0, actual);
    }
    addEventListener("wheel", (e) => {
      if (e.ctrlKey || enScrollable(e.target)) return; // zoom o panel con scroll propio
      e.preventDefault();
      const tope = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      objetivo = Math.max(0, Math.min(objetivo + e.deltaY, tope));
      if (!corriendo) { corriendo = true; actual = scrollY; requestAnimationFrame(loop); }
    }, { passive: false });
    // Si algo cambia el scroll por otra vía (anclas, teclado), resincroniza.
    addEventListener("keydown", () => { objetivo = scrollY; });
  }

  const API = {
    motion(opts = {}) {
      listo(() => {
        entrada(); apariciones(); scrollLigado(); contadores();
        if (opts.scrollSuave) scrollSuave();
      });
      return API;
    },
  };
  window.Folio = Object.assign(window.Folio || {}, API);
  // Auto-arranque (sin scroll suave; actívalo con Folio.motion({scrollSuave:true})).
  if (!window.__folioManual) API.motion();
})();
