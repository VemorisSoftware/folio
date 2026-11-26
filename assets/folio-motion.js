/* folio-motion.js — el movimiento de Folio. Sin librerías, sin dependencias.
 *
 * Da el mismo "feel" de las buenas webs: scroll suave, apariciones al bajar
 * (con escalonado), parallax sutil, contadores que suben, una entrada del
 * héroe al cargar, titulares palabra por palabra, SVG que se dibujan,
 * decorativos que derivan y un indicador de scroll que late.
 * Todo con data-atributos, CSS + IntersectionObserver, sin librerías;
 * respeta prefers-reduced-motion.
 *
 *   <script src="folio-motion.js" defer></script>
 *
 * Atributos (se pueden combinar, separados por espacio):
 *   data-folio="aparece"          aparece al entrar en la vista (fade + subida)
 *   data-folio="entrada"          aparece al cargar (para el héroe)
 *   data-folio="parallax" data-velocidad="0.2"   se mueve despacio al hacer scroll
 *   data-folio="inclina"         empieza volcada en 3D y se endereza al entrar (scrubbed)
 *   data-folio="contador" data-fin="12000" data-sufijo="M"   cuenta hacia arriba
 *   data-folio="palabras"         el texto entra palabra por palabra, subiendo y desenfocado→nítido
 *                                 (al cargar si está a la vista; si no, al llegar a él)
 *   data-folio="trazo"            los trazos SVG de dentro se dibujan al entrar en la vista
 *                                 (data-duracion="1600" ms; data-retraso también vale;
 *                                 "traza" sigue funcionando como alias)
 *   data-folio="deriva"           movimiento continuo y muy suave, para decorativos
 *                                 data-eje="x" | "y" | "zoom" | "giro" (combinables; sin eje: x+y+giro)
 *                                 data-amplitud="8" (px)  data-ciclo="9" (s)  data-giro="1.6" (°)  data-zoom="1.035"
 *                                 Se pausa fuera de la vista. Combina con parallax.
 *   data-folio="cuenta-cue"       indicador de scroll que late en bucle; se desvanece al
 *                                 bajar y vuelve arriba (data-ocultar="no" lo deja siempre)
 *   data-retraso="120"            retrasa su aparición (ms); si no, se escalona solo
 *
 * Escritura progresiva (para demos de terminal):
 *   Folio.escribir(el, "texto", { velocidad: 18, senal })  → Promise
 *   Escribe carácter a carácter; si `senal` (AbortSignal) se aborta, se detiene.
 *
 * Scroll suave (opcional): Folio.motion({ scrollSuave: true })
 *
 * Sin parpadeo: este archivo se carga con defer, así que el navegador puede
 * pintar la página antes de que llegue este CSS. Para que lo animado parta
 * oculto desde el primer pintado, copia el estado inicial (opacity:0 de
 * aparece/entrada/palabras) a tu hoja de estilos bajo html.js.
 * Aun sin eso, la entrada fuerza su estado inicial antes de animar.
 */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // CSS propio, inyectado una vez.
  const css = `
  [data-folio~="aparece"],[data-folio~="entrada"]{opacity:0;transform:translateY(40px);
    transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1.2s cubic-bezier(.16,1,.3,1);will-change:opacity,transform}
  [data-folio~="palabras"] .folio-palabra{display:inline-block;opacity:0;transform:translateY(.38em) rotate(1.5deg);filter:blur(8px);
    transition:opacity .9s cubic-bezier(.16,1,.3,1),transform 1.2s cubic-bezier(.16,1,.3,1),filter .9s cubic-bezier(.16,1,.3,1)}
  [data-folio~="palabras"].folio-on .folio-palabra{opacity:1;transform:none;filter:none}
  [data-folio~="aparece"].folio-on,[data-folio~="entrada"].folio-on{opacity:1;transform:none}
  [data-folio~="inclina"]{opacity:0;transform-origin:center top;will-change:transform,opacity;
    transform:perspective(1500px) rotateX(18deg) scale(.93) translateY(40px)}
  [data-folio~="traza"] .folio-trazo,[data-folio~="trazo"] .folio-trazo{transition:stroke-dashoffset var(--folio-dur,1600ms) cubic-bezier(.16,1,.3,1)}
  /* Deriva: usa translate/rotate/scale (propiedades sueltas) para sumarse a
     cualquier transform (parallax, hover) sin pisarlo. */
  [data-folio~="deriva"]{--folio-amp:8px;--folio-ciclo:9s;will-change:translate,rotate,scale;transform-box:fill-box;transform-origin:center}
  [data-folio~="deriva"].folio-deriva{animation:var(--folio-anims)}
  [data-folio~="deriva"].folio-quieto{animation-play-state:paused}
  @keyframes folio-deriva-xy{0%,100%{translate:0 0}25%{translate:calc(var(--folio-amp) * .8) calc(var(--folio-amp) * -.6)}50%{translate:calc(var(--folio-amp) * .2) calc(var(--folio-amp) * -1)}75%{translate:calc(var(--folio-amp) * -.7) calc(var(--folio-amp) * -.3)}}
  @keyframes folio-deriva-x{0%,100%{translate:0 0}50%{translate:var(--folio-amp) 0}}
  @keyframes folio-deriva-y{0%,100%{translate:0 0}50%{translate:0 calc(var(--folio-amp) * -1)}}
  @keyframes folio-deriva-giro{0%,100%{rotate:0deg}33%{rotate:var(--folio-giro,1.6deg)}66%{rotate:calc(var(--folio-giro,1.6deg) * -.7)}}
  @keyframes folio-deriva-zoom{0%,100%{scale:1}50%{scale:var(--folio-zoom,1.035)}}
  /* Indicador de scroll que late. */
  [data-folio~="cuenta-cue"]{animation:folio-late 2.4s cubic-bezier(.16,1,.3,1) infinite;transition:opacity .6s cubic-bezier(.16,1,.3,1)}
  [data-folio~="cuenta-cue"].folio-fuera{opacity:0!important;pointer-events:none}
  @keyframes folio-late{0%{translate:0 0;opacity:.45}35%{translate:0 7px;opacity:1}70%,100%{translate:0 0;opacity:.45}}
  @media (prefers-reduced-motion: reduce){
    [data-folio~="aparece"],[data-folio~="entrada"],[data-folio~="inclina"],[data-folio~="palabras"],.folio-palabra{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}
    [data-folio~="deriva"],[data-folio~="cuenta-cue"]{animation:none!important;translate:none!important;rotate:none!important;scale:none!important}
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
  // Fija el estado inicial sin transición (por si ya se pintó visible) y
  // luego activa la animación en el siguiente cuadro.
  function arrancar(el, retraso) {
    el.style.transition = "none";
    el.getBoundingClientRect();              // aplica opacity:0 ya, sin animar
    el.style.transition = "";
    el.style.transitionDelay = retraso + "ms";
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("folio-on")));
  }

  const PASO_PALABRA = 60;   // ms entre palabras

  // Parte el texto en palabras (respeta <em>, <a>, etc.: solo toca nodos de texto).
  function partirPalabras(raiz) {
    const textos = [];
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) textos.push(w.currentNode);
    let n = 0;
    textos.forEach((t) => {
      const trozos = t.data.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      trozos.forEach((tr) => {
        if (!tr) return;
        if (/^\s+$/.test(tr)) { frag.appendChild(document.createTextNode(tr)); return; }
        const s = document.createElement("span");
        s.className = "folio-palabra";
        s.textContent = tr;
        s.style.transitionDelay = (n++ * PASO_PALABRA) + "ms";
        frag.appendChild(s);
      });
      t.replaceWith(frag);
    });
    raiz.classList.add("folio-partido");
    return n;
  }

  // Encendido de un titular partido: suma un retraso base a cada palabra.
  function encenderPalabras(el, base) {
    el.querySelectorAll(".folio-palabra").forEach((s) => {
      s.style.transitionDelay = (base + parseFloat(s.style.transitionDelay)) + "ms";
    });
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("folio-on")));
  }

  function entrada() {
    const items = [...document.querySelectorAll('[data-folio~="entrada"], [data-folio~="palabras"]')];
    if (reduce) { items.forEach((e) => e.classList.add("folio-on", "folio-partido")); return; }
    let t = 80;
    // Titulares con palabras que no están a la vista: entran al llegar a ellos.
    const ioPal = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        ioPal.unobserve(e.target);
        encenderPalabras(e.target, +(e.target.dataset.retraso || 0));
      });
    }, { threshold: 0.3 });
    items.forEach((el) => {
      if (el.matches('[data-folio~="palabras"]')) {
        const n = partirPalabras(el);
        const r = el.getBoundingClientRect();
        if (r.top > innerHeight || r.bottom < 0) { ioPal.observe(el); return; }
        encenderPalabras(el, t);
        t += Math.min(n, 10) * PASO_PALABRA;
      } else {
        arrancar(el, t);
        t += 120;
      }
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
        const dur = 1800, t0 = performance.now();
        (function paso(t) {
          const p = Math.min(1, (t - t0) / dur);
          const e2 = 1 - Math.pow(1 - p, 3); // easeOutCubic
          el.textContent = pre + fmt(Math.round(fin * e2)) + suf;
          if (p < 1) requestAnimationFrame(paso);
        })(t0);
      });
    }, { threshold: 0.4 });
    items.forEach((e) => io.observe(e));
  }

  // ── Trazos SVG que se dibujan al entrar ──────────────────────────────────
  // Cada path/line/polyline/circle/ellipse/rect con trazo empieza oculto con
  // stroke-dasharray y se revela en orden. Los rellenos no se tocan.
  function trazos() {
    const grupos = [...document.querySelectorAll('[data-folio~="trazo"], [data-folio~="traza"]')];
    if (grupos.length === 0) return;
    if (reduce) { grupos.forEach((g) => g.classList.add("folio-listo")); return; }
    const formas = "path,line,polyline,polygon,circle,ellipse,rect";
    grupos.forEach((g) => {
      const items = [...g.querySelectorAll(formas)].filter((f) => {
        const s = getComputedStyle(f);
        return s.stroke && s.stroke !== "none" && typeof f.getTotalLength === "function";
      });
      g.__folioTrazos = items;
      items.forEach((f) => {
        const L = Math.ceil(f.getTotalLength()) + 1;
        f.style.strokeDasharray = L + " " + L;
        f.style.strokeDashoffset = L;
      });
      if (g.dataset.duracion) g.style.setProperty("--folio-dur", g.dataset.duracion + "ms");
      g.classList.add("folio-listo");
    });
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const g = e.target; io.unobserve(g);
        const base = +(g.dataset.retraso || 0);
        const items = g.__folioTrazos || [];
        const paso = Math.min(90, 900 / Math.max(1, items.length));
        items.forEach((f, i) => {
          f.style.transitionDelay = (base + i * paso) + "ms";
          f.classList.add("folio-trazo");   // la transición se activa recién aquí
          f.getBoundingClientRect();
          requestAnimationFrame(() => { f.style.strokeDashoffset = "0"; });
        });
      });
    }, { threshold: 0.25 });
    grupos.forEach((g) => io.observe(g));
  }

  // ── Deriva: movimiento continuo y suave para decorativos ─────────────────
  // Cada elemento recibe una fase al azar (para que no se muevan en coro) y
  // se pausa cuando sale de la vista (no gasta cuadros fuera de pantalla).
  function derivas() {
    const items = [...document.querySelectorAll('[data-folio~="deriva"]')];
    if (items.length === 0 || reduce) return;
    const ANIM = {
      x: "folio-deriva-x var(--folio-ciclo) ease-in-out infinite var(--folio-fase,0s)",
      y: "folio-deriva-y var(--folio-ciclo) ease-in-out infinite var(--folio-fase,0s)",
      xy: "folio-deriva-xy var(--folio-ciclo) ease-in-out infinite var(--folio-fase,0s)",
      giro: "folio-deriva-giro calc(var(--folio-ciclo) * 1.37) ease-in-out infinite var(--folio-fase,0s)",
      zoom: "folio-deriva-zoom calc(var(--folio-ciclo) * 1.21) ease-in-out infinite var(--folio-fase,0s)",
    };
    items.forEach((el) => {
      const d = el.dataset;
      if (d.amplitud) el.style.setProperty("--folio-amp", parseFloat(d.amplitud) + "px");
      if (d.ciclo) el.style.setProperty("--folio-ciclo", parseFloat(d.ciclo) + "s");
      if (d.giro) el.style.setProperty("--folio-giro", parseFloat(d.giro) + "deg");
      if (d.zoom) el.style.setProperty("--folio-zoom", d.zoom);
      el.style.setProperty("--folio-fase", (-Math.random() * 12).toFixed(2) + "s");
      let ejes = (d.eje || "").split(/\s+/).filter((e) => ANIM[e]);
      // x e y juntos son una sola animación (comparten translate).
      if (ejes.includes("x") && ejes.includes("y")) ejes = ["xy", ...ejes.filter((e) => e !== "x" && e !== "y")];
      if (ejes.length === 0) ejes = ["xy", "giro"];   // por defecto: deriva orgánica
      el.style.setProperty("--folio-anims", ejes.map((e) => ANIM[e]).join(","));
      el.classList.add("folio-deriva");
    });
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => e.target.classList.toggle("folio-quieto", !e.isIntersecting));
    }, { rootMargin: "80px" });
    items.forEach((el) => io.observe(el));
  }

  // ── Indicador de scroll que late ─────────────────────────────────────────
  // Late siempre (CSS). Se desvanece al bajar 80px y vuelve al regresar arriba.
  function cuentaCues() {
    const items = [...document.querySelectorAll('[data-folio~="cuenta-cue"]')].filter((el) => el.dataset.ocultar !== "no");
    if (items.length === 0) return;
    let activo = false;
    function pintar() {
      activo = false;
      const fuera = scrollY > 80;
      items.forEach((el) => el.classList.toggle("folio-fuera", fuera));
    }
    addEventListener("scroll", () => { if (!activo) { activo = true; requestAnimationFrame(pintar); } }, { passive: true });
    pintar();
  }

  // ── Escritura progresiva ─────────────────────────────────────────────────
  // Escribe `texto` dentro de `el` carácter a carácter. Respeta saltos de
  // línea con una pausa un poco mayor. Con movimiento reducido, de una vez.
  function escribir(el, texto, opts = {}) {
    const vel = opts.velocidad || 18;
    const senal = opts.senal;
    const nodo = document.createTextNode("");
    el.appendChild(nodo);
    if (reduce) { nodo.data = texto; return Promise.resolve(); }
    return new Promise((resolver) => {
      let i = 0;
      (function siguiente() {
        if (senal && senal.aborted) return resolver();
        if (i >= texto.length) return resolver();
        const c = texto[i++];
        nodo.data += c;
        const pausa = c === "\n" ? vel * 6 : (c === " " ? vel * 0.6 : vel * (0.6 + Math.random() * 0.8));
        setTimeout(siguiente, pausa);
      })();
    });
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
    escribir,
    reducido: reduce,
    motion(opts = {}) {
      listo(() => {
        entrada(); apariciones(); scrollLigado(); contadores(); trazos(); derivas(); cuentaCues();
        if (opts.scrollSuave) scrollSuave();
      });
      return API;
    },
  };
  window.Folio = Object.assign(window.Folio || {}, API);
  // Auto-arranque (sin scroll suave; actívalo con Folio.motion({scrollSuave:true})).
  if (!window.__folioManual) API.motion();
})();
