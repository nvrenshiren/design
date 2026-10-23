/* Transition examples adapted from transitions.dev.
 * Explicitly initialize a fragment after its DOM is mounted:
 * const controls = CohesionTransitions.mount("modal", container);
 * controls.openModal(); controls.closeModal(); controls.destroy();
 * Source snippets: reference/transitions/snippets.json. Styles: Tailwind utilities.
 * Regenerate with: node reference/build-transitions.cjs
 */
(function (global) {
  "use strict";
  const mounted = new WeakMap();
  const factories = {
    "accordion": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-acc") || !find(".t-acc-head")) return {};
      // Toggle data-open on the item; CSS owns the height + chevron morph.
      const acc = find(".t-acc");
      const head = acc.querySelector(".t-acc-head");
      
      listen(head, "click", () => {
        const open = acc.getAttribute("data-open") === "true";
        acc.setAttribute("data-open", String(!open));
        head.setAttribute("aria-expanded", String(!open));
      });
      return {  };
    },
    "avatar-group-hover": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-avatar-group")) return {};
      // CSS optimizers may serialize 400ms as .4s. Normalize time tokens to ms;
      // dimension and unitless numeric tokens retain their original values.
      const tokenNumber = (raw, fallback) => {
        const text = String(raw).trim();
        const value = parseFloat(text);
        return Number.isFinite(value) ? value * (/ms$/i.test(text) ? 1 : /s$/i.test(text) ? 1000 : 1) : fallback;
      };
      // Distance-falloff lift with direction-aware easing. The trick
      // is setting transition-timing-function inline BEFORE writing the
      // CSS variables — the browser uses whatever timing-function is
      // current at the moment a transitionable property changes, so this
      // gives us ease-in on the way up and a bouncy spring on the return
      // without two separate transition declarations.
      const root = find(".t-avatar-group");
      const avatars = Array.from(root.querySelectorAll(".t-avatar"));
      const cs = getComputedStyle(document.documentElement);
      const num = (name, fb) => {
        return tokenNumber(cs.getPropertyValue(name), fb);
      };
      const ease = (name, fb) =>
        cs.getPropertyValue(name).trim() || fb;
      
      function setShifts(activeIdx, phase) {
        const lift    = num("--avatar-lift", -4);
        const falloff = num("--avatar-falloff", 0.45);
        const scale   = num("--avatar-scale", 1.05);
        const tf      = phase === "out"
          ? ease("--avatar-ease-out", "cubic-bezier(0.34, 3.85, 0.64, 1)")
          : ease("--avatar-ease-in",  "cubic-bezier(0.22, 1, 0.36, 1)");
      
        avatars.forEach((el, i) => {
          el.style.setProperty("--avatar-active-ease", tf);
          if (activeIdx == null) {
            el.style.setProperty("--shift", "0px");
            el.style.setProperty("--scale-active", "1");
            return;
          }
          const d = Math.abs(i - activeIdx);
          el.style.setProperty(
            "--shift",
            (lift * Math.pow(falloff, d)).toFixed(3) + "px"
          );
          el.style.setProperty(
            "--scale-active",
            i === activeIdx ? String(scale) : "1"
          );
        });
      }
      
      avatars.forEach((el, i) => {
        listen(el, "mouseenter", () => setShifts(i, "in"));
      });
      listen(root, "mouseleave", () => setShifts(null, "out"));
      onCleanup(() => setShifts(null, "out"));
      return {  };
    },
    "card-tilt": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-tilt") || !find(".t-tilt-card")) return {};
      // Track the pointer on the OUTER .t-tilt (never transforms) and write
      // rotation + glare position onto the inner card. Works for mouse
      // (hover) and touch / pen (tap-hold-drag) — a touch pointermove only
      // fires while a finger is down, so the press naturally drives the tilt.
      const tilt = find(".t-tilt");
      const card = tilt.querySelector(".t-tilt-card");
      const reduce = matchMedia("(prefers-reduced-motion: reduce)");
      
      const MAX = 14; // peak tilt in degrees at the card edges (raise for a stronger lean)
      
      function reset() {
        tilt.classList.remove("is-hover");
        card.classList.remove("is-tilting");
        card.style.setProperty("--tilt-rx", "0deg");
        card.style.setProperty("--tilt-ry", "0deg");
      }
      
      function track(e) {
        if (reduce.matches) return;
        const r = tilt.getBoundingClientRect();
        const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        tilt.classList.add("is-hover");
        card.classList.add("is-tilting");
        card.style.setProperty("--tilt-ry", ((px - 0.5) * MAX).toFixed(2) + "deg");
        card.style.setProperty("--tilt-rx", ((0.5 - py) * MAX).toFixed(2) + "deg");
        card.style.setProperty("--tilt-gx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--tilt-gy", (py * 100).toFixed(1) + "%");
      }
      
      listen(tilt, "pointerdown", (e) => {
        // Touch / pen: capture so the drag keeps targeting the card even if
        // the finger drifts past its edge. Pair with touch-action: none on
        // .t-tilt so the drag tilts instead of scrolling the page.
        if (e.pointerType !== "mouse") {
          try { tilt.setPointerCapture(e.pointerId); } catch (_) {}
        }
      });
      listen(tilt, "pointermove", track);
      listen(tilt, "pointerup", reset);
      listen(tilt, "pointercancel", reset);
      listen(tilt, "lostpointercapture", reset);
      listen(window, "blur", reset);
      listen(reduce, "change", reset);
      listen(tilt, "pointerleave", (e) => {
        // Mouse: leaving the card flattens it. Touch already reset on up.
        if (e.pointerType === "mouse") reset();
      });
      onCleanup(reset);
      return {  };
    },
    "error-state-shake": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-input-wrap") || !find(".t-input")) return {};
      // CSS optimizers may serialize 400ms as .4s. Normalize time tokens to ms;
      // dimension and unitless numeric tokens retain their original values.
      const tokenNumber = (raw, fallback) => {
        const text = String(raw).trim();
        const value = parseFloat(text);
        return Number.isFinite(value) ? value * (/ms$/i.test(text) ? 1 : /s$/i.test(text) ? 1000 : 1) : fallback;
      };
      // Trigger the error state, replay the shake, and schedule the
      // auto-revert. Cancel any in-flight revert so the timer always
      // tracks the latest call.
      const wrap = find(".t-input-wrap");
      const input = wrap.querySelector(".t-input");
      
      const cs = getComputedStyle(document.documentElement);
      const ms = (name, fb) => {
        return tokenNumber(cs.getPropertyValue(name), fb);
      };
      
      let shakeTimer = 0;
      function showError() {
        clearTimeout(shakeTimer);
        inputEl?.setAttribute("aria-invalid", "true");
        wrap.classList.add("is-error");
        input.classList.add("is-error");
      
        // Replay the shake from a clean baseline.
        input.classList.remove("is-shaking");
        void input.offsetWidth; // force reflow
        input.classList.add("is-shaking");
      
        const shakeMs =
          ms("--shake-dur-a", 80) * 2 +
          ms("--shake-dur-b", 60) * 2;
        shakeTimer = setTimeout(() => input.classList.remove("is-shaking"), shakeMs + 20);
      
        // Auto-revert: hold long enough to read the message, then fade
        // border + message back to neutral via the CSS transitions.
        if (wrap._revertTimer) clearTimeout(wrap._revertTimer);
        const hold = ms("--revert-hold", 3000);
        wrap._revertTimer = setTimeout(() => {
          wrap._revertTimer = null;
          wrap.classList.remove("is-error");
          input.classList.remove("is-error");
          inputEl?.removeAttribute("aria-invalid");
        }, shakeMs + hold);
      }
      
      // Optional but recommended: typing cancels the auto-revert and
      // clears the error so the user isn't shaking at a value they're
      // already correcting.
      const inputEl = wrap.querySelector("input, textarea");
      listen(inputEl, "input", () => {
        clearTimeout(shakeTimer);
        input.classList.remove("is-shaking");
        inputEl.removeAttribute("aria-invalid");
        if (wrap._revertTimer) {
          clearTimeout(wrap._revertTimer);
          wrap._revertTimer = null;
        }
        wrap.classList.remove("is-error");
        input.classList.remove("is-error");
      });
      return { showError };
    },
    "input-clear-dissolve": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      // CSS optimizers may serialize 400ms as .4s. Normalize time tokens to ms;
      // dimension and unitless numeric tokens retain their original values.
      const tokenNumber = (raw, fallback) => {
        const text = String(raw).trim();
        const value = parseFloat(text);
        return Number.isFinite(value) ? value * (/ms$/i.test(text) ? 1 : /s$/i.test(text) ? 1000 : 1) : fallback;
      };
      // One clear routine per .t-clear. Reads timing/geometry from the
      // CSS variables each call so live tweaks apply without a reload.
      const root = document.documentElement;
      const num = (name, fb) => {
        return tokenNumber(getComputedStyle(root).getPropertyValue(name), fb);
      };
      // Minimal cubic-bezier(x1,y1,x2,y2) sampler so JS easing matches CSS.
      function bezier(str) {
        const m = String(str).match(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/);
        if (!m) return (t) => t;
        const [x1, y1, x2, y2] = m.slice(1).map(parseFloat);
        const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
        const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
        return (t) => {
          if (t <= 0) return 0;
          if (t >= 1) return 1;
          let s = t;
          for (let i = 0; i < 8; i++) {
            const dx = ((ax * s + bx) * s + cx) * s - t;
            const d = (3 * ax * s + 2 * bx) * s + cx;
            if (Math.abs(dx) < 1e-6 || d === 0) break;
            s -= dx / d;
          }
          return ((ay * s + by) * s + cy) * s;
        };
      }
      
      findAll(".t-clear").forEach((wrap) => {
        const input  = wrap.querySelector("input");
        const mirror = wrap.querySelector(".t-clear-mirror");
        const phold  = wrap.querySelector(".t-clear-placeholder");
        const glow   = wrap.querySelector(".t-clear-glow");
        const btn    = wrap.querySelector(".t-clear-btn");
        if (!input || !mirror || !phold || !glow || !btn) return;
        const canvas = document.createElement("canvas").getContext("2d");
        let clearing = false;
        let frameId = 0;
        const reduce = matchMedia("(prefers-reduced-motion: reduce)");
        const finish = () => {
          cancelAnimationFrame(frameId);
          wrap.classList.remove("is-clearing");
          [mirror, phold].forEach((el) => {
            ["--clear-y", "--clear-opacity", "--clear-blur-value"].forEach((prop) => el.style.removeProperty(prop));
          });
          mirror.textContent = "";
          glow.style.setProperty("--clear-opacity", "0");
          glow.style.removeProperty("--clear-glow");
          clearing = false;
        };
      
        onCleanup(finish);
        const sync = () => {
          const has = input.value.length > 0;
          wrap.classList.toggle("has-value", has);
          if (has) mirror.textContent = input.value.replace(/ /g, "\u00a0");
        };
      
        function buildGlow(text) {
          if (!canvas) return "";
          canvas.font = getComputedStyle(input).font;
          const isDark = root.getAttribute("data-theme") === "dark";
          const rgb = isDark ? "255,255,255" : "0,0,0";
          const w = wrap.clientWidth || 280;
          const padLeft = parseFloat(getComputedStyle(input).paddingLeft) || 12;
          const spread = num("--glow-spread", 1.5);
          const layers = [];
          let x = 0;
          text.split(/(\s+)/).forEach((seg) => {
            const segW = canvas.measureText(seg).width;
            if (seg.trim()) {
              const cx = padLeft + x + segW / 2;
              const hw = Math.max(segW * 0.45, 8) * spread;
              [[0, 0.8, 7, 0.22], [hw * 0.45, 0.55, 8, 0.18],
               [-hw * 0.4, 0.65, 6, 0.16], [hw * 0.15, 0.9, 5, 0.14]]
                .forEach(([dx, rwm, rh, a]) => {
                  const lx = (((cx + dx) / w) * 100).toFixed(2);
                  layers.push(
                    `radial-gradient(ellipse ${Math.max(hw * rwm, 2).toFixed(1)}px ${rh}px at ${lx}% 100%, rgba(${rgb},${a}), transparent)`
                  );
                });
            }
            x += segW;
          });
          return layers.join(", ");
        }
      
        function clearWithAnimation() {
          if (clearing || !input.value) return;
          clearing = true;
          input.focus({ preventScroll: true });
          mirror.textContent = input.value.replace(/ /g, "\u00a0");
      
          const total = Math.max(1, num("--clear-dur", 1000));
          const outDur = Math.max(1, num("--clear-out-dur", 400));
          const inDur  = Math.max(1, num("--clear-in-dur", 400));
          const outFly = num("--clear-out-fly", 12);
          const inFly  = num("--clear-in-fly", 12);
          const blur   = num("--clear-blur", 2);
          const delay  = num("--glow-delay", 50);
          const peakAt = num("--glow-peak-at", 0.15);
          const gOp    = num("--glow-opacity", 0.42);
          const easeOut = bezier(getComputedStyle(root).getPropertyValue("--clear-out-ease"));
          const easeIn  = bezier(getComputedStyle(root).getPropertyValue("--clear-in-ease"));
      
          input.value = "";
          clearing = false;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          if (reduce.matches) { finish(); sync(); return; }
          clearing = true;
          wrap.classList.remove("has-value");
          wrap.classList.add("is-clearing");
          glow.style.setProperty("--clear-glow", buildGlow(mirror.textContent));
          glow.style.setProperty("--clear-opacity", "0");
          phold.style.setProperty("--clear-y", `-${inFly}px`);
          phold.style.setProperty("--clear-opacity", "0.9");
          phold.style.setProperty("--clear-blur-value", `${blur}px`);
      
          const t0 = performance.now();
          (function tick(now) {
            const el = now - t0;
            const eo = easeOut(Math.min(1, el / outDur));
            mirror.style.setProperty("--clear-y", `${(eo * outFly).toFixed(1)}px`);
            mirror.style.setProperty("--clear-opacity", (1 - eo).toFixed(3));
            mirror.style.setProperty("--clear-blur-value", `${(eo * blur).toFixed(1)}px`);
      
            const ei = easeIn(Math.min(1, el / inDur));
            phold.style.setProperty("--clear-y", `${(-inFly + ei * inFly).toFixed(1)}px`);
            phold.style.setProperty("--clear-opacity", (0.9 + ei * 0.1).toFixed(3));
            phold.style.setProperty("--clear-blur-value", `${(blur - ei * blur).toFixed(1)}px`);
      
            let g = 0;
            if (el > delay) {
              const gp = Math.min(1, (el - delay) / Math.max(1, total - delay));
              g = gp < peakAt ? gp / peakAt : 1 - (gp - peakAt) / (1 - peakAt);
            }
            glow.style.setProperty("--clear-opacity", (g * gOp).toFixed(3));
      
            if (el < total) {
              frameId = requestAnimationFrame(tick);
            } else {
              finish();
              sync();
            }
          })(performance.now());
        }
      
        const keep = (e) => { if (document.activeElement === input) e.preventDefault(); };
        listen(btn, "pointerdown", keep);
        listen(btn, "mousedown", keep);
        listen(btn, "click", clearWithAnimation);
        listen(input, "input", () => {
          if (clearing) finish();
          sync();
        });
        listen(reduce, "change", () => { if (reduce.matches && clearing) { finish(); sync(); } });
        sync();
      });
      return {  };
    },
    "menu-dropdown": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-dropdown")) return {};
      // CSS optimizers may serialize 400ms as .4s. Normalize time tokens to ms;
      // dimension and unitless numeric tokens retain their original values.
      const tokenNumber = (raw, fallback) => {
        const text = String(raw).trim();
        const value = parseFloat(text);
        return Number.isFinite(value) ? value * (/ms$/i.test(text) ? 1 : /s$/i.test(text) ? 1000 : 1) : fallback;
      };
      // Toggle .is-open / .is-closing with a setTimeout cleanup so the closing
      // scale animates before the element resets to its pre-open rest state.
      const dropdown = find(".t-dropdown");
      const closeMs = tokenNumber(
        getComputedStyle(document.documentElement).getPropertyValue("--dropdown-close-dur"), 150
      );
      
      let closeTimer = 0;
      function openDropdown() {
        clearTimeout(closeTimer);
        dropdown.classList.remove("is-closing");
        dropdown.classList.add("is-open");
      }
      function closeDropdown() {
        clearTimeout(closeTimer);
        dropdown.classList.remove("is-open");
        dropdown.classList.add("is-closing");
        closeTimer = setTimeout(() => dropdown.classList.remove("is-closing"), closeMs);
      }
      return { openDropdown, closeDropdown };
    },
    "modal": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-modal")) return {};
      // CSS optimizers may serialize 400ms as .4s. Normalize time tokens to ms;
      // dimension and unitless numeric tokens retain their original values.
      const tokenNumber = (raw, fallback) => {
        const text = String(raw).trim();
        const value = parseFloat(text);
        return Number.isFinite(value) ? value * (/ms$/i.test(text) ? 1 : /s$/i.test(text) ? 1000 : 1) : fallback;
      };
      // Same close-then-cleanup pattern as the dropdown — modals scale from
      // --modal-scale up to 1, then on close dip to --modal-scale-close.
      const modal = find(".t-modal");
      const closeMs = tokenNumber(
        getComputedStyle(document.documentElement).getPropertyValue("--modal-close-dur"), 150
      );
      
      let closeTimer = 0;
      function openModal() {
        clearTimeout(closeTimer);
        modal.classList.remove("is-closing");
        modal.classList.add("is-open");
      }
      function closeModal() {
        clearTimeout(closeTimer);
        modal.classList.remove("is-open");
        modal.classList.add("is-closing");
        closeTimer = setTimeout(() => modal.classList.remove("is-closing"), closeMs);
      }
      return { openModal, closeModal };
    },
    "number-pop-in": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-digit-group")) return {};
      // Replay the digit pop-in: remove .is-animating, swap the digit spans,
      // force a reflow, then re-add .is-animating. Mark the last two digits
      // with data-stagger="1" / "2" so they ride in 1× / 2× --digit-stagger
      // behind the leading digits.
      const group = find(".t-digit-group");
      
      function setDigits(str) {
        group.classList.remove("is-animating");
        group.replaceChildren();
        const chars = str.split("");
        chars.forEach((ch, i) => {
          const span = document.createElement("span");
          span.className = "t-digit mr:inline-block mr:[will-change:transform,_opacity,_filter] mr:[.t-digit-group.is-animating_&]:[animation:t-digit-pop-in_var(--digit-dur)_var(--digit-ease)_both] mr:[.t-digit-group.is-animating_&[data-stagger='1']]:[animation-delay:var(--digit-stagger)] mr:[.t-digit-group.is-animating_&[data-stagger='2']]:[animation-delay:calc(var(--digit-stagger)_*_2)] mr:motion-reduce:[.t-digit-group_&]:animate-none!";
          span.textContent = ch;
          if (i === chars.length - 2) span.dataset.stagger = "1";
          else if (i === chars.length - 1) span.dataset.stagger = "2";
          group.appendChild(span);
        });
        void group.offsetHeight; // force reflow
        group.classList.add("is-animating");
      }
      return { setDigits };
    },
    "page-side-by-side": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-page-slide")) return {};
      // Flip data-page on the container — the CSS handles the rest.
      // Set --page-exit-enabled: 0 on the container if you want pages to
      // fade without sliding (useful on first paint).
      const slider = find(".t-page-slide");
      function showPage(n) {
        slider.setAttribute("data-page", String(n));
      }
      return { showPage };
    },
    "plus-menu-morph": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-morph") || !find(".t-morph-plus")) return {};
      // Toggle data-open on the container; CSS owns the morph. Mirror the
      // state to aria-expanded and close on outside click / Escape.
      const morph = find(".t-morph");
      const plus = morph.querySelector(".t-morph-plus");
      
      function setOpen(open) {
        morph.setAttribute("data-open", String(open));
        plus.setAttribute("aria-expanded", String(open));
      }
      
      listen(plus, "click", (e) => {
        e.stopPropagation();
        setOpen(morph.getAttribute("data-open") !== "true");
      });
      listen(document, "click", (e) => {
        if (!morph.contains(e.target)) setOpen(false);
      });
      listen(document, "keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });
      return { setOpen };
    },
    "skeleton-reveal": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-skel") || !find(".t-skel-skeleton")) return {};
      // CSS optimizers may serialize 400ms as .4s. Normalize time tokens to ms;
      // dimension and unitless numeric tokens retain their original values.
      const tokenNumber = (raw, fallback) => {
        const text = String(raw).trim();
        const value = parseFloat(text);
        return Number.isFinite(value) ? value * (/ms$/i.test(text) ? 1 : /s$/i.test(text) ? 1000 : 1) : fallback;
      };
      const skel = find(".t-skel");
      const skeleton = skel.querySelector(".t-skel-skeleton");
      const cs = getComputedStyle(document.documentElement);
      const num = (name, fb) => {
        return tokenNumber(cs.getPropertyValue(name), fb);
      };
      
      // Call when async data arrives:
      let revealTimer = 0;
      function reveal() {
        clearTimeout(revealTimer);
        skel.classList.add("is-revealed");
      }
      
      // Demo replay: snap back, pulse, then reveal.
      function replay() {
        clearTimeout(revealTimer);
        skel.classList.add("is-resetting");
        skel.classList.remove("is-revealed");
        skeleton.classList.remove("is-pulsing");
        void skeleton.offsetWidth;
        skel.classList.remove("is-resetting");
        skeleton.classList.add("is-pulsing");
        const total = num("--pulse-dur", 1000) * num("--pulse-count", 1);
        revealTimer = setTimeout(() => skel.classList.add("is-revealed"), total);
      }
      return { reveal, replay };
    },
    "success-check": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-success-check")) return {};
      // Cold-load → "out" (no animation). On show, flip to "in".
      // Replay-on-retrigger: reset to "out", force a reflow, then flip
      // back to "in" so the keyframes restart from offset 0.
      const check = find(".t-success-check");
      
      function showCheck() {
        check.setAttribute("data-state", "out");
        void check.offsetWidth; // force reflow so keyframes restart
        check.setAttribute("data-state", "in");
      }
      
      // If the icon is mounted unconditionally and only shown after some
      // event (e.g. await save()), the simpler form is enough:
      //   check.setAttribute("data-state", "in");
      // The reflow trick only matters when you replay the appear from
      // an already-visible state.
      // Measure this instance's path rather than an unrelated wrapper.
      const path = check.querySelector("svg path");
      if (path) {
        const len = Math.ceil(path.getTotalLength());
        path.style.setProperty("--check-length", String(len));
      }
      return { showCheck };
    },
    "tabs-sliding": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-tabs") || !find(".t-tabs-pill") || !find(".t-tab")) return {};
      const bar = find(".t-tabs");
      const pill = bar.querySelector(".t-tabs-pill");
      const tabs = [...bar.querySelectorAll(".t-tab")];
      
      function moveTo(tab, animate) {
        pill.toggleAttribute("data-no-transition", !animate);
        pill.style.setProperty("--tabs-x", tab.offsetLeft + "px");
        pill.style.setProperty("--tabs-width", tab.offsetWidth + "px");
        if (!animate) { void pill.offsetWidth; pill.removeAttribute("data-no-transition"); }
      }
      const active = () =>
        tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
      
      tabs.forEach((tab) => {
        listen(tab, "click", () => {
          tabs.forEach((t) =>
            t.setAttribute("aria-selected", t === tab ? "true" : "false")
          );
          moveTo(tab, true);
        });
      });
      requestAnimationFrame(() => moveTo(active(), false));
      listen(window, "resize", () => moveTo(active(), false));
      return {  };
    },
    "text-states-swap": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-text-swap")) return {};
      // CSS optimizers may serialize 400ms as .4s. Normalize time tokens to ms;
      // dimension and unitless numeric tokens retain their original values.
      const tokenNumber = (raw, fallback) => {
        const text = String(raw).trim();
        const value = parseFloat(text);
        return Number.isFinite(value) ? value * (/ms$/i.test(text) ? 1 : /s$/i.test(text) ? 1000 : 1) : fallback;
      };
      // Three-phase text swap:
      //   1. Add .is-exit              — old text exits up with blur.
      //   2. After --text-swap-dur, swap textContent and add .is-enter-start
      //      (jumps to "below, no transition"), force a reflow.
      //   3. Remove .is-enter-start    — new text animates back to rest.
      const el = find(".t-text-swap");
      const dur = tokenNumber(
        getComputedStyle(document.documentElement).getPropertyValue("--text-swap-dur"), 200
      );
      
      let swapTimer = 0;
      function swapText(next) {
        clearTimeout(swapTimer);
        el.classList.add("is-exit");
        swapTimer = setTimeout(() => {
          el.textContent = next;
          el.classList.remove("is-exit");
          el.classList.add("is-enter-start");
          void el.offsetHeight; // force reflow so the next change transitions
          el.classList.remove("is-enter-start");
        }, dur);
      }
      return { swapText };
    },
    "texts-reveal": function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {
      if (!find(".t-stagger")) return {};
      const block = find(".t-stagger");
      
      let hideTimer = 0;
      function showText() {
        clearTimeout(hideTimer);
        block.classList.remove("is-hiding");
        block.classList.remove("is-shown");
        void block.offsetHeight;
        block.classList.add("is-shown");
      }
      function hideText() {
        clearTimeout(hideTimer);
        block.classList.add("is-hiding");
        block.classList.remove("is-shown");
        hideTimer = setTimeout(() => block.classList.remove("is-hiding"), 200);
      }
      return { showText, hideText };
    },
  };
  function mount(slug, scope = document) {
    if (!scope || typeof scope.querySelector !== "function") throw new TypeError("A Document or Element scope is required");
    const owner = scope.nodeType === 9 ? scope : scope.ownerDocument;
    owner.documentElement.classList.add(...rootClasses.split(/\s+/));
    let bySlug = mounted.get(scope);
    if (!bySlug) { bySlug = new Map(); mounted.set(scope, bySlug); }
    bySlug.get(slug)?.destroy();
    const cleanups = [];
    const decorate = node => {
      if (node.nodeType !== 1 && node.nodeType !== 9) return;
      for (const element of [...(node.nodeType === 1 ? [node] : []), ...node.querySelectorAll('[class]')]) {
        for (const name of [...element.classList]) {
          const utilities = classes[name];
          if (utilities) element.classList.add(...utilities.split(/\s+/));
        }
      }
    };
    decorate(scope);
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(decorate)));
    observer.observe(scope, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());
    const timers = new Set();
    const frames = new Set();
    const find = selector => scope.matches?.(selector) ? scope : scope.querySelector(selector);
    const findAll = selector => [...(scope.matches?.(selector) ? [scope] : []), ...scope.querySelectorAll(selector)];
    const listen = (el, type, callback, options) => {
      if (!el) return;
      el.addEventListener(type, callback, options);
      cleanups.push(() => el.removeEventListener(type, callback, options));
    };
    const later = (callback, delay) => {
      const id = global.setTimeout(() => { timers.delete(id); callback(); }, delay);
      timers.add(id);
      return id;
    };
    const clear = id => { global.clearTimeout(id); timers.delete(id); };
    const nextFrame = callback => {
      const id = global.requestAnimationFrame(time => { frames.delete(id); callback(time); });
      frames.add(id);
      return id;
    };
    const cancelFrame = id => { global.cancelAnimationFrame(id); frames.delete(id); };
    let disposed = false;
    const factory = factories[slug];
    const actions = factory ? factory(find, findAll, listen, cleanup => cleanups.push(cleanup), later, clear, nextFrame, cancelFrame) : {};
    const controller = { ...actions, destroy() {
      if (disposed) return;
      disposed = true;
      cleanups.reverse().forEach(cleanup => cleanup());
      timers.forEach(id => global.clearTimeout(id));
      frames.forEach(id => global.cancelAnimationFrame(id));
      timers.clear(); frames.clear();
      bySlug.delete(slug);
    } };
    bySlug.set(slug, controller);
    return controller;
  }
  const classNames = names => names.split(/\s+/).flatMap(name => [name, classes[name] || ""]).filter(Boolean).join(" ");
  const classes = {"t-acc-panel":"mr:grid mr:[grid-template-rows:0fr] mr:[transition:grid-template-rows_var(--acc-collapse)_var(--acc-ease)] mr:[.t-acc[data-open=true]_&]:[grid-template-rows:1fr] mr:[.t-acc[data-open=true]_&]:[transition:grid-template-rows_var(--acc-expand)_var(--acc-ease)] mr:motion-reduce:transition-none!","t-acc-panel-inner":"mr:overflow-hidden mr:opacity-0 mr:[filter:blur(2px)] mr:[transition:opacity_var(--acc-collapse)_var(--acc-ease),_filter_var(--acc-collapse)_var(--acc-ease)] mr:[.t-acc[data-open=true]_&]:opacity-100 mr:[.t-acc[data-open=true]_&]:[filter:blur(0)] mr:[.t-acc[data-open=true]_&]:[transition:opacity_var(--acc-expand)_var(--acc-ease),_filter_var(--acc-expand)_var(--acc-ease)] mr:motion-reduce:transition-none! mr:pt-3 mr:[color:var(--demo-muted)]","t-acc-chevron":"mr:inline-flex mr:[transform:scaleY(1)] mr:origin-center mr:[transition:transform_var(--acc-chevron)_var(--acc-ease)] mr:[&_path]:[vector-effect:non-scaling-stroke] mr:[.t-acc[data-open=true]_&]:[transform:scaleY(-1)] mr:motion-reduce:transition-none!","t-avatar":"mr:origin-center mr:[transform:translateY(var(--shift,_0px))_scale(var(--scale-active,_1))] mr:[transition:transform_var(--avatar-dur)_var(--avatar-active-ease,var(--avatar-ease-in))] mr:[will-change:transform] mr:motion-reduce:transition-none! mr:motion-reduce:[transform:none]! mr:w-12 mr:h-12 mr:ml-[-6px] mr:[border:3px_solid_var(--demo-bg)] mr:rounded-full mr:[background:var(--demo-selected)] mr:[color:var(--demo-primary)] mr:font-semibold mr:grid mr:place-items-center mr:[html[data-motion=paused]_&]:[transform:none]!","t-resize":"mr:[transition:width_var(--resize-dur)_var(--resize-ease),_height_var(--resize-dur)_var(--resize-ease)] mr:[will-change:width,_height] mr:motion-reduce:transition-none! mr:w-[72%] mr:h-[110px] mr:max-w-[100%] mr:data-[expanded=true]:w-full mr:data-[expanded=true]:h-40","t-tilt":"mr:touch-pan-y mr:w-full","t-tilt-card":"mr:relative mr:rounded-[8px] mr:overflow-hidden mr:[transform:perspective(var(--tilt-perspective))_rotateX(var(--tilt-rx,_0deg))_rotateY(var(--tilt-ry,_0deg))] mr:[transform-style:preserve-3d] mr:[transition:transform_var(--tilt-return)_var(--tilt-return-ease)] mr:[will-change:transform] mr:[&.is-tilting]:[transition:transform_var(--tilt-follow)_var(--tilt-follow-ease)] mr:motion-reduce:[transform:none]! mr:motion-reduce:transition-none! mr:[border:1px_solid_var(--demo-line)] mr:[background:var(--demo-bg)] mr:p-5 mr:w-full mr:[html[data-motion=paused]_&]:[transform:none]!","t-tilt-glare":"mr:absolute mr:inset-0 mr:pointer-events-none mr:opacity-0 mr:mix-blend-screen mr:[background:radial-gradient(circle_95px_at_var(--tilt-gx,_50%)_var(--tilt-gy,_50%),_rgba(255,255,255,0.48),_rgba(255,255,255,0.06)_52%,_rgba(255,255,255,0)_84%),_radial-gradient(circle_200px_at_var(--tilt-gx,_50%)_var(--tilt-gy,_50%),_rgba(255,255,255,0.22),_rgba(255,255,255,0.04)_58%,_rgba(255,255,255,0)_78%),_radial-gradient(circle_360px_at_var(--tilt-gx,_50%)_var(--tilt-gy,_50%),_rgba(255,255,255,0.10),_rgba(255,255,255,0)_88%)] mr:[transition:opacity_var(--tilt-glare-fade)_var(--tilt-glare-ease)] mr:[.t-tilt.is-hover_&]:[opacity:var(--tilt-glare-opacity)]","t-check":"mr:[transition:background_var(--check-box)_var(--check-ease),_box-shadow_var(--check-box)_var(--check-ease)] mr:[&_svg_path]:[stroke-dasharray:var(--check-len,_15)] mr:[&_svg_path]:[stroke-dashoffset:var(--check-len,_15)] mr:[&_svg_path]:[transition:stroke-dashoffset_var(--check-uncheck)_var(--check-ease)] mr:[&[aria-checked=true]_svg_path]:[stroke-dashoffset:0] mr:[&[aria-checked=true]_svg_path]:[transition:stroke-dashoffset_var(--check-draw)_var(--check-ease)_var(--check-delay)] mr:motion-reduce:transition-none! mr:motion-reduce:[&_svg_path]:transition-none! mr:w-8 mr:h-8 mr:grid mr:place-items-center mr:[border:1px_solid_var(--demo-line)] mr:rounded-[6px] mr:[background:var(--demo-bg)] mr:[&[aria-checked=true]]:[color:var(--demo-primary)] mr:[&[aria-checked=true]]:[background:var(--demo-selected)] mr:[&[aria-checked=true]]:[border-color:var(--demo-primary)]","t-input":"mr:[transition:border-color_150ms_ease-out] mr:[will-change:transform] mr:[&.is-error]:[transition:border-color_var(--revert-dur,_280ms)_ease-out] mr:[&.is-shaking]:[animation:t-input-shake_calc(_var(--shake-dur-a)_*_2_+_var(--shake-dur-b)_*_2_)_linear] mr:motion-reduce:animate-none! mr:motion-reduce:[transform:none]! mr:[border:1px_solid_var(--demo-line)] mr:rounded-[6px] mr:p-[7px_11px] mr:[background:var(--demo-bg)] mr:[&_input]:w-full mr:[&_input]:bg-none mr:[&_input]:border-0 mr:[&_input]:outline-none mr:[&.is-error]:[border-color:var(--demo-error)]","t-error-msg":"mr:opacity-0 mr:invisible mr:[transition:opacity_var(--revert-dur,_280ms)_ease-out,_visibility_0s_linear_var(--revert-dur,_280ms)] mr:[.t-input-wrap.is-error_&]:opacity-100 mr:[.t-input-wrap.is-error_&]:visible mr:[.t-input-wrap.is-error_&]:[transition:opacity_var(--revert-dur,_280ms)_ease-out,_visibility_0s_linear_0s] mr:m-[8px_0_0] mr:[color:var(--demo-error)]","t-icon-swap":"mr:relative mr:inline-grid mr:w-12 mr:h-12 mr:bg-none mr:border-0","t-icon":"mr:[.t-icon-swap_&]:[grid-area:1_/_1] mr:[.t-icon-swap_&]:[transition:opacity_var(--icon-swap-dur)_var(--icon-swap-ease),_filter_var(--icon-swap-dur)_var(--icon-swap-ease),_transform_var(--icon-swap-dur)_var(--icon-swap-ease)] mr:[.t-icon-swap_&]:[will-change:opacity,_filter,_transform] mr:[.t-icon-swap[data-state=a]_&[data-icon=a]]:opacity-100 mr:[.t-icon-swap[data-state=a]_&[data-icon=a]]:[filter:blur(0)] mr:[.t-icon-swap[data-state=a]_&[data-icon=a]]:[transform:scale(1)] mr:[.t-icon-swap[data-state=b]_&[data-icon=b]]:opacity-100 mr:[.t-icon-swap[data-state=b]_&[data-icon=b]]:[filter:blur(0)] mr:[.t-icon-swap[data-state=b]_&[data-icon=b]]:[transform:scale(1)] mr:[.t-icon-swap[data-state=a]_&[data-icon=b]]:opacity-0 mr:[.t-icon-swap[data-state=a]_&[data-icon=b]]:[filter:blur(var(--icon-swap-blur))] mr:[.t-icon-swap[data-state=a]_&[data-icon=b]]:[transform:scale(var(--icon-swap-start-scale))] mr:[.t-icon-swap[data-state=b]_&[data-icon=a]]:opacity-0 mr:[.t-icon-swap[data-state=b]_&[data-icon=a]]:[filter:blur(var(--icon-swap-blur))] mr:[.t-icon-swap[data-state=b]_&[data-icon=a]]:[transform:scale(var(--icon-swap-start-scale))] mr:motion-reduce:[.t-icon-swap_&]:transition-none! mr:grid mr:place-items-center mr:[&_svg]:w-7 mr:[&_svg]:h-7","t-clear":"mr:relative mr:overflow-hidden mr:[&.has-value_>_input]:[-webkit-text-fill-color:transparent] mr:[&.is-clearing_>_input]:[-webkit-text-fill-color:transparent] mr:w-full mr:h-10 mr:[border:1px_solid_var(--demo-line)] mr:rounded-[6px] mr:[background:var(--demo-bg)] mr:[&_input]:w-full mr:[&_input]:h-full mr:[&_input]:border-0 mr:[&_input]:outline-none mr:[&_input]:p-[8px_36px_8px_12px] mr:[&_input]:bg-transparent","t-clear-mirror":"mr:absolute mr:inset-0 mr:flex mr:items-center mr:pointer-events-none mr:whitespace-nowrap mr:overflow-hidden mr:z-[2] mr:[opacity:var(--clear-opacity,0)] mr:[.t-clear.has-value_&]:[opacity:var(--clear-opacity,1)] mr:[.t-clear.is-clearing_&]:[opacity:var(--clear-opacity,1)] mr:pl-3 mr:leading-[38px] mr:[transform:translateY(var(--clear-y,0px))] mr:[filter:blur(var(--clear-blur-value,0px))]","t-clear-placeholder":"mr:absolute mr:inset-0 mr:flex mr:items-center mr:pointer-events-none mr:whitespace-nowrap mr:overflow-hidden mr:z-[2] mr:[.t-clear.has-value_&]:opacity-0 mr:pl-3 mr:leading-[38px] mr:[transform:translateY(var(--clear-y,0px))] mr:[filter:blur(var(--clear-blur-value,0px))] mr:[opacity:var(--clear-opacity,1)]","t-clear-glow":"mr:absolute mr:inset-0 mr:pointer-events-none mr:[opacity:var(--clear-opacity,0)] mr:z-[3] mr:mix-blend-multiply mr:motion-reduce:opacity-0! mr:[background:var(--clear-glow,none)]","t-learn-chevron":"mr:inline-flex mr:[transform:translateX(0)] mr:[transition:transform_var(--learn-out)_var(--learn-ease)] mr:[.t-learn:hover_&]:[transform:translateX(var(--learn-shift))] mr:[.t-learn:hover_&]:[transition-duration:var(--learn-in)] mr:motion-reduce:transition-none! mr:data-[shift=true]:[transform:translateX(3px)]","t-learn-arm":"mr:[transform-box:view-box] mr:[transform-origin:10px_8px] mr:[vector-effect:non-scaling-stroke] mr:[transition:transform_var(--learn-out)_var(--learn-ease)] mr:[.t-learn:hover_&]:[transition-duration:var(--learn-in)] mr:motion-reduce:transition-none!","t-learn-arm-top":"mr:[.t-learn:hover_&]:[transform:rotate(var(--learn-spread))]","t-learn-arm-bot":"mr:[.t-learn:hover_&]:[transform:rotate(calc(var(--learn-spread)_*_-1))]","t-like-heart":"mr:text-current mr:[transition:color_var(--like-fill)_var(--like-ease)] mr:[&_path]:fill-transparent mr:[&_path]:stroke-current mr:[&_path]:[transition:fill_var(--like-fill)_var(--like-ease),_stroke_var(--like-fill)_var(--like-ease)] mr:[.t-like[data-liked=true]_&]:[color:var(--like-color)] mr:[.t-like[data-liked=true]_&_path]:fill-current","t-like-icon":"mr:[.t-like[data-liked=true]_&]:[animation:t-like-pop_var(--like-pop)_var(--like-pop-ease)] mr:motion-reduce:animate-none!","t-like-particles":"mr:absolute mr:left-7 mr:top-1/2 mr:w-0 mr:h-0 mr:pointer-events-none mr:[color:var(--like-color)] mr:[&_i]:absolute mr:[&_i]:left-[calc(var(--like-particle-size)_*_var(--psize,_1)_/_-2)] mr:[&_i]:top-[calc(var(--like-particle-size)_*_var(--psize,_1)_/_-2)] mr:[&_i]:w-[calc(var(--like-particle-size)_*_var(--psize,_1))] mr:[&_i]:h-[calc(var(--like-particle-size)_*_var(--psize,_1))] mr:[&_i]:rounded-full mr:[&_i]:[background:currentColor] mr:[&_i]:opacity-0 mr:[.t-like.is-bursting_&_i]:[animation:t-like-burst_var(--pdur,_var(--like-particle-dur))_ease-out_var(--pdelay,_0ms)_forwards] mr:motion-reduce:[&_i]:animate-none!","t-dropdown":"mr:origin-top-left mr:[transform:scale(var(--dropdown-pre-scale))] mr:opacity-0 mr:pointer-events-none mr:[transition:transform_var(--dropdown-open-dur)_var(--dropdown-ease),_opacity_var(--dropdown-open-dur)_var(--dropdown-ease)] mr:[will-change:transform,_opacity] mr:[&[data-origin=top-right]]:origin-top-right mr:[&[data-origin=top-center]]:origin-top mr:[&[data-origin=bottom-left]]:origin-bottom-left mr:[&[data-origin=bottom-center]]:origin-bottom mr:[&[data-origin=bottom-right]]:origin-bottom-right mr:[&.is-open]:[transform:scale(1)] mr:[&.is-open]:opacity-100 mr:[&.is-open]:pointer-events-auto mr:[&.is-closing]:[transform:scale(var(--dropdown-closing-scale))] mr:[&.is-closing]:opacity-0 mr:[&.is-closing]:pointer-events-none mr:[&.is-closing]:[transition:transform_var(--dropdown-close-dur)_var(--dropdown-ease),_opacity_var(--dropdown-close-dur)_var(--dropdown-ease)] mr:motion-reduce:transition-none! mr:max-w-55","t-modal":"mr:origin-center mr:[transform:scale(var(--modal-scale))] mr:opacity-0 mr:pointer-events-none mr:[transition:transform_var(--modal-open-dur)_var(--modal-ease),_opacity_var(--modal-open-dur)_var(--modal-ease)] mr:[will-change:transform,_opacity] mr:[&.is-open]:[transform:scale(1)] mr:[&.is-open]:opacity-100 mr:[&.is-open]:pointer-events-auto mr:[&.is-closing]:[transform:scale(var(--modal-scale-close))] mr:[&.is-closing]:opacity-0 mr:[&.is-closing]:pointer-events-none mr:[&.is-closing]:[transition:transform_var(--modal-close-dur)_var(--modal-ease),_opacity_var(--modal-close-dur)_var(--modal-ease)] mr:motion-reduce:transition-none! mr:max-w-75","t-badge":"mr:absolute mr:top-[-6px] mr:right-[-8px] mr:pointer-events-none mr:[will-change:transform] mr:[&[data-open=true]]:[animation:t-badge-slide-in_var(--badge-slide-dur)_var(--badge-slide-ease)] mr:motion-reduce:animate-none! mr:motion-reduce:transition-none!","t-badge-dot":"mr:block mr:origin-center mr:[transform:scale(1)] mr:opacity-100 mr:[filter:blur(0)] mr:[transition:transform_var(--badge-pop-dur)_var(--badge-pop-ease),_opacity_var(--badge-fade-dur)_var(--badge-pop-ease),_filter_var(--badge-pop-dur)_var(--badge-pop-ease)] mr:[will-change:transform,_opacity,_filter] mr:[.t-badge[data-open=false]_&]:[transform:scale(0)] mr:[.t-badge[data-open=false]_&]:opacity-0 mr:[.t-badge[data-open=false]_&]:[filter:blur(var(--badge-blur))] mr:[.t-badge[data-open=false]_&]:[transition:transform_var(--badge-pop-close-dur)_var(--badge-close-ease),_opacity_var(--badge-fade-close-dur)_var(--badge-close-ease),_filter_var(--badge-pop-close-dur)_var(--badge-close-ease)] mr:motion-reduce:animate-none! mr:motion-reduce:transition-none! mr:min-w-[18px] mr:h-[18px] mr:p-[0_5px] mr:leading-[18px] mr:text-[12px] mr:rounded-[20px] mr:[background:var(--demo-error)] mr:[color:white]","t-digit-group":"mr:inline-flex mr:items-baseline mr:text-[40px] mr:font-semibold mr:tabular-nums","t-digit":"mr:inline-block mr:[will-change:transform,_opacity,_filter] mr:[.t-digit-group.is-animating_&]:[animation:t-digit-pop-in_var(--digit-dur)_var(--digit-ease)_both] mr:[.t-digit-group.is-animating_&[data-stagger='1']]:[animation-delay:var(--digit-stagger)] mr:[.t-digit-group.is-animating_&[data-stagger='2']]:[animation-delay:calc(var(--digit-stagger)_*_2)] mr:motion-reduce:[.t-digit-group_&]:animate-none!","t-page-slide":"mr:relative mr:w-full mr:h-34","t-page":"mr:[.t-page-slide_&[data-page-id='1']]:[--t-page-from-x:calc(var(--page-slide-distance)_*_-1)] mr:[.t-page-slide_&[data-page-id='2']]:[--t-page-from-x:var(--page-slide-distance)] mr:[.t-page-slide_&]:absolute mr:[.t-page-slide_&]:inset-0 mr:[.t-page-slide_&]:opacity-0 mr:[.t-page-slide_&]:pointer-events-none mr:[.t-page-slide_&]:[transform:translateX(calc(var(--t-page-from-x,_0px)_*_var(--page-exit-enabled)))] mr:[.t-page-slide_&]:[filter:blur(calc(var(--page-blur)_*_var(--page-exit-enabled)))] mr:[.t-page-slide_&]:[transition:opacity_var(--page-fade-dur)_var(--page-fade-ease),_transform_var(--page-slide-dur)_var(--page-slide-ease),_filter_var(--page-slide-dur)_var(--page-slide-ease)] mr:[.t-page-slide_&]:[will-change:opacity,_transform,_filter] mr:[.t-page-slide[data-page='1']_&[data-page-id='1']]:opacity-100 mr:[.t-page-slide[data-page='1']_&[data-page-id='1']]:pointer-events-auto mr:[.t-page-slide[data-page='1']_&[data-page-id='1']]:[transform:translateX(0)] mr:[.t-page-slide[data-page='1']_&[data-page-id='1']]:[filter:blur(0)] mr:[.t-page-slide[data-page='1']_&[data-page-id='1']]:[transition-delay:var(--page-stagger)] mr:[.t-page-slide[data-page='2']_&[data-page-id='2']]:opacity-100 mr:[.t-page-slide[data-page='2']_&[data-page-id='2']]:pointer-events-auto mr:[.t-page-slide[data-page='2']_&[data-page-id='2']]:[transform:translateX(0)] mr:[.t-page-slide[data-page='2']_&[data-page-id='2']]:[filter:blur(0)] mr:[.t-page-slide[data-page='2']_&[data-page-id='2']]:[transition-delay:var(--page-stagger)] mr:motion-reduce:[.t-page-slide_&]:transition-none! mr:h-34","t-panel-slide":"mr:[transform:translateY(var(--panel-translate-y))] mr:opacity-0 mr:[filter:blur(var(--panel-blur))] mr:pointer-events-none mr:[transition:transform_var(--panel-close-dur)_var(--panel-ease),_opacity_var(--panel-close-dur)_var(--panel-ease),_filter_var(--panel-close-dur)_var(--panel-ease)] mr:[will-change:transform,_opacity,_filter] mr:[&[data-open=true]]:[transform:translateY(0)] mr:[&[data-open=true]]:opacity-100 mr:[&[data-open=true]]:[filter:blur(0)] mr:[&[data-open=true]]:pointer-events-auto mr:[&[data-open=true]]:[transition:transform_var(--panel-open-dur)_var(--panel-ease),_opacity_var(--panel-open-dur)_var(--panel-ease),_filter_var(--panel-open-dur)_var(--panel-ease)] mr:motion-reduce:transition-none!","t-morph":"mr:relative mr:w-10 mr:h-10 mr:rounded-[var(--morph-r-closed)] mr:overflow-hidden mr:[transition:width_var(--morph-close-dur)_var(--morph-close-ease),_height_var(--morph-close-dur)_var(--morph-close-ease),_border-radius_var(--morph-close-dur)_var(--morph-close-ease)] mr:[&[data-open=true]]:w-[183px] mr:[&[data-open=true]]:h-43 mr:[&[data-open=true]]:rounded-[var(--morph-r-open)] mr:[&[data-open=true]]:[transition:width_var(--morph-open-dur)_var(--morph-ease),_height_var(--morph-open-dur)_var(--morph-ease),_border-radius_var(--morph-open-dur)_var(--morph-ease)] mr:motion-reduce:transition-none! mr:[background:var(--demo-fill)] mr:min-w-11 mr:min-h-11","t-morph-plus":"mr:absolute mr:inset-[auto_0_0_auto] mr:w-10 mr:h-10 mr:grid mr:place-items-center mr:[border:1px_solid_var(--demo-line)] mr:[background:var(--demo-bg)] mr:cursor-pointer mr:[transition:opacity_var(--morph-fade-dur)_var(--morph-close-ease),_transform_var(--morph-open-dur)_var(--morph-close-ease),_filter_var(--morph-fade-dur)_var(--morph-close-ease)] mr:[&_svg]:[transition:transform_var(--morph-open-dur)_var(--morph-close-ease)] mr:[.t-morph[data-open=true]_&]:opacity-0 mr:[.t-morph[data-open=true]_&]:[transform:translateX(calc(-1_*_var(--morph-slide)))] mr:[.t-morph[data-open=true]_&]:[filter:blur(var(--morph-blur))] mr:[.t-morph[data-open=true]_&]:pointer-events-none mr:[.t-morph[data-open=true]_&_svg]:[transform:scale(var(--morph-scale))_rotate(var(--morph-rotate))] mr:motion-reduce:transition-none! mr:[color:var(--demo-primary)]","t-morph-menu":"mr:absolute mr:inset-0 mr:opacity-0 mr:[transform:translateX(var(--morph-slide))_scale(var(--morph-scale))] mr:[filter:blur(var(--morph-blur))] mr:pointer-events-none mr:[transition:opacity_var(--morph-fade-dur)_var(--morph-close-ease),_transform_var(--morph-open-dur)_var(--morph-close-ease),_filter_var(--morph-fade-dur)_var(--morph-close-ease)] mr:[.t-morph[data-open=true]_&]:opacity-100 mr:[.t-morph[data-open=true]_&]:[transform:translateX(0)_scale(1)] mr:[.t-morph[data-open=true]_&]:[filter:blur(0)] mr:[.t-morph[data-open=true]_&]:pointer-events-auto mr:motion-reduce:transition-none! mr:p-[12px_56px_12px_16px] mr:grid mr:gap-2 mr:whitespace-nowrap","t-shimmer":"mr:relative mr:inline-block mr:[color:var(--shimmer-base)] mr:[&::before]:[content:attr(data-text)] mr:[&::before]:absolute mr:[&::before]:inset-0 mr:[&::before]:pointer-events-none mr:[&::before]:[background-image:linear-gradient(_90deg,_transparent_0%,_transparent_40%,_var(--shimmer-highlight)_50%,_transparent_60%,_transparent_100%_)] mr:[&::before]:[background-size:var(--shimmer-band)_100%] mr:[&::before]:bg-no-repeat mr:[&::before]:[-webkit-background-clip:text] mr:[&::before]:bg-clip-text mr:[&::before]:text-transparent mr:[&::before]:[-webkit-text-fill-color:transparent] mr:[&::before]:animate-none mr:motion-reduce:[&::before]:animate-none! mr:text-[20px] mr:[&.is-playing::before]:[animation:t-shimmer_var(--shimmer-dur)_var(--shimmer-ease)_1]","t-skel":"mr:relative mr:w-full mr:h-34","t-skel-skeleton":"mr:absolute mr:inset-0 mr:z-[1] mr:opacity-100 mr:[filter:blur(0)] mr:[transition:opacity_var(--reveal-dur)_var(--reveal-ease),_filter_var(--reveal-dur)_var(--reveal-ease)] mr:[.t-skel.is-revealed_&]:opacity-0 mr:[.t-skel.is-revealed_&]:[filter:blur(var(--reveal-blur))] mr:[.t-skel.is-resetting_&]:transition-none! mr:[&.is-pulsing_>_*]:[animation:t-skel-pulse_var(--pulse-dur)_ease-in-out_var(--pulse-count)] mr:motion-reduce:transition-none! mr:motion-reduce:[&.is-pulsing_>_*]:animate-none! mr:grid mr:gap-3 mr:p-6 mr:[&_i]:block mr:[&_i]:h-3 mr:[&_i]:w-full mr:[&_i]:rounded-[4px] mr:[&_i]:[background:var(--demo-fill)] mr:[&_i:last-child]:w-[65%]","t-skel-content":"mr:absolute mr:inset-0 mr:z-[2] mr:opacity-0 mr:[filter:blur(var(--reveal-blur))] mr:[transition:opacity_var(--reveal-dur)_var(--reveal-ease),_filter_var(--reveal-dur)_var(--reveal-ease)] mr:[.t-skel.is-revealed_&]:opacity-100 mr:[.t-skel.is-revealed_&]:[filter:blur(0)] mr:[.t-skel.is-resetting_&]:transition-none! mr:motion-reduce:transition-none! mr:h-34","t-reel":"mr:inline-flex mr:items-center mr:h-[var(--reel-cell)] mr:tabular-nums mr:text-[30px]","t-reel-col":"mr:relative mr:h-[var(--reel-cell)] mr:overflow-hidden mr:[-webkit-mask-image:linear-gradient(to_bottom,_transparent_0%,_#000_22%,_#000_78%,_transparent_100%)] mr:[mask-image:linear-gradient(to_bottom,_transparent_0%,_#000_22%,_#000_78%,_transparent_100%)] mr:w-6","t-reel-strip":"mr:flex mr:flex-col mr:[will-change:transform,_filter] mr:motion-reduce:transition-none! mr:motion-reduce:[filter:none]! mr:[transform:translateY(var(--reel-y,0px))] mr:[transition:var(--reel-transition,none)]","t-reel-digit":"mr:h-[var(--reel-cell)] mr:flex mr:items-center mr:justify-center","t-success-check":"mr:inline-block mr:origin-center mr:opacity-0 mr:[will-change:transform,_opacity,_filter] mr:[&_svg]:block mr:[&_svg]:overflow-visible mr:[&_svg_path]:[stroke-dasharray:var(--check-length,20)] mr:[&_svg_path]:[stroke-dashoffset:var(--check-length,20)] mr:[&[data-state=in]]:[animation:t-check-fade_var(--check-opacity-dur)_var(--check-ease-opacity)_forwards,_t-check-rotate_var(--check-rotate-dur)_var(--check-ease-rotate)_forwards,_t-check-blur_var(--check-blur-dur)_var(--check-ease-out)_forwards,_t-check-bob_var(--check-bob-dur)_var(--check-ease-bob)_forwards] mr:[&[data-state=in]_svg_path]:[animation:t-check-draw_var(--check-path-dur)_var(--check-ease-path)_var(--check-path-delay,_0ms)_forwards] mr:motion-reduce:animate-none! mr:motion-reduce:[&[data-state=in]]:opacity-100 mr:motion-reduce:[&[data-state=in]_svg_path]:animate-none! mr:motion-reduce:[&[data-state=in]_svg_path]:[stroke-dashoffset:0]! mr:[color:var(--demo-primary)]","t-tabs":"mr:relative mr:inline-flex mr:items-center mr:gap-[3px] mr:p-[3px] mr:rounded-[48px] mr:[background:var(--tabs-bar-bg)]","t-tab":"mr:relative mr:appearance-none mr:border-0 mr:bg-transparent mr:h-[30px] mr:p-[4px_12px] mr:[color:var(--tabs-text-muted)] mr:cursor-pointer mr:rounded-[48px] mr:z-[1] mr:[transition:color_var(--tabs-dur)_var(--tabs-ease)] mr:[&:not([aria-selected=true]):hover]:[color:var(--tabs-text-active)] mr:[&[aria-selected=true]]:[color:var(--tabs-text-active)] mr:motion-reduce:transition-none!","t-tabs-pill":"mr:absolute mr:top-[3px] mr:left-0 mr:h-[30px] mr:w-(--tabs-width) mr:[background:var(--tabs-pill-bg)] mr:rounded-[48px] mr:[transform:translateX(var(--tabs-x,0px))] mr:[transition:transform_var(--tabs-dur)_var(--tabs-ease),_width_var(--tabs-dur)_var(--tabs-ease)] mr:[will-change:transform,_width] mr:z-0 mr:pointer-events-none mr:motion-reduce:transition-none! mr:data-[no-transition]:transition-none","t-text-swap":"mr:inline-block mr:[transform:translateY(0)] mr:[filter:blur(0)] mr:opacity-100 mr:[transition:transform_var(--text-swap-dur)_var(--text-swap-ease),_filter_var(--text-swap-dur)_var(--text-swap-ease),_opacity_var(--text-swap-dur)_var(--text-swap-ease)] mr:[will-change:transform,_filter,_opacity] mr:[&.is-exit]:[transform:translateY(calc(var(--text-swap-translate-y)_*_-1))] mr:[&.is-exit]:[filter:blur(var(--text-swap-blur))] mr:[&.is-exit]:opacity-0 mr:[&.is-enter-start]:[transform:translateY(var(--text-swap-translate-y))] mr:[&.is-enter-start]:[filter:blur(var(--text-swap-blur))] mr:[&.is-enter-start]:opacity-0 mr:[&.is-enter-start]:transition-none mr:motion-reduce:transition-none!","t-stagger-line":"mr:block mr:opacity-0 mr:[transform:translateY(var(--stagger-distance))] mr:[filter:blur(var(--stagger-blur))] mr:[transition:opacity_var(--stagger-dur)_var(--stagger-ease),_transform_var(--stagger-dur)_var(--stagger-ease),_filter_var(--stagger-dur)_var(--stagger-ease)] mr:[will-change:transform,_opacity,_filter] mr:[.t-stagger.is-shown_&]:opacity-100 mr:[.t-stagger.is-shown_&]:[transform:translateY(0)] mr:[.t-stagger.is-shown_&]:[filter:blur(0)] mr:[.t-stagger.is-hiding_&]:opacity-0 mr:[.t-stagger.is-hiding_&]:[transform:translateY(0)] mr:[.t-stagger.is-hiding_&]:[filter:blur(0)] mr:[.t-stagger.is-hiding_&]:[transition:opacity_200ms_ease,_transform_0s_linear,_filter_0s_linear] mr:[.t-stagger.is-hiding_&]:[transition-delay:0s] mr:motion-reduce:transition-none!","t-stagger-line--2":"mr:[transition-delay:var(--stagger-stagger)] mr:[color:var(--demo-muted)] mr:mt-[6px]","t-toast":"mr:opacity-0 mr:[transform:translateY(var(--toast-distance))_scale(var(--toast-scale))] mr:[filter:blur(var(--toast-blur))] mr:[will-change:transform,_opacity,_filter] mr:[transition:opacity_var(--toast-close)_var(--toast-ease),_transform_var(--toast-close)_var(--toast-ease),_filter_var(--toast-close)_var(--toast-ease)] mr:[&.is-open]:opacity-100 mr:[&.is-open]:[transform:translateY(0)_scale(1)] mr:[&.is-open]:[filter:blur(0)] mr:[&.is-open]:[transition:opacity_var(--toast-open)_var(--toast-ease),_transform_var(--toast-open)_var(--toast-ease),_filter_var(--toast-open)_var(--toast-ease)] mr:motion-reduce:transition-none!","t-toggle":"mr:[transition:background_var(--toggle-track)_var(--toggle-ease)] mr:w-10 mr:h-6 mr:block mr:p-[3px] mr:border-0 mr:rounded-[24px] mr:[background:var(--demo-line)] mr:[&[data-on=true]]:[background:var(--demo-primary)]","t-toggle-thumb":"mr:[translate:0_0] mr:[will-change:translate] mr:[.t-toggle[data-on=true]_&]:[translate:var(--toggle-travel)_0] mr:[.t-toggle.is-init[data-on=true]_&]:[animation:t-toggle-on_var(--toggle-dur)_var(--toggle-ease)_both] mr:[.t-toggle.is-init[data-on=false]_&]:[animation:t-toggle-off_var(--toggle-dur)_var(--toggle-ease)_both] mr:motion-reduce:animate-none! mr:block mr:w-[18px] mr:h-[18px] mr:rounded-full mr:[background:white]","t-tt-wrap":"mr:relative mr:inline-block","t-tt":"mr:absolute mr:bottom-[calc(100%_+_8px)] mr:left-1/2 mr:[transform:translate(-50%,_0)_scale(var(--tt-scale))] mr:[transform-origin:50%_100%] mr:p-[8px_12px] mr:rounded-[8px] mr:[background:var(--tt-bg)] mr:[color:var(--tt-fg)] mr:whitespace-nowrap mr:[box-shadow:0_0_0_1px_rgba(0,_0,_0,_0.06),_0_2px_6px_0_rgba(0,_0,_0,_0.05),_0_4px_42px_0_rgba(0,_0,_0,_0.06)] mr:opacity-0 mr:pointer-events-none mr:[transition:opacity_var(--tt-out-dur)_var(--tt-out-ease),_transform_var(--tt-out-dur)_var(--tt-out-ease)] mr:[.t-tt-wrap:hover_&]:opacity-100 mr:[.t-tt-wrap:hover_&]:[transform:translate(-50%,_0)_scale(1)] mr:[.t-tt-wrap:hover_&]:[transition-duration:var(--tt-in-dur)] mr:[.t-tt-wrap:hover_&]:[transition-timing-function:var(--tt-in-ease)] mr:[.t-tt-wrap:hover_&]:[transition-delay:var(--tt-delay)] mr:[.t-tt-trigger:focus-visible_+_&]:opacity-100 mr:[.t-tt-trigger:focus-visible_+_&]:[transform:translate(-50%,_0)_scale(1)] mr:[.t-tt-trigger:focus-visible_+_&]:[transition-duration:var(--tt-in-dur)] mr:[.t-tt-trigger:focus-visible_+_&]:[transition-timing-function:var(--tt-in-ease)] mr:[.t-tt-trigger:focus-visible_+_&]:[transition-delay:var(--tt-delay)] mr:motion-reduce:transition-none! mr:[.t-tt-wrap.is-preview_&]:opacity-100 mr:[.t-tt-wrap.is-preview_&]:[transform:translate(-50%,0)_scale(1)]","specimen-surface":"mr:[border:1px_solid_var(--demo-line)] mr:rounded-[8px] mr:[background:var(--demo-bg)] mr:p-5 mr:w-full","t-acc":"mr:w-full mr:[border:1px_solid_var(--demo-line)] mr:rounded-[8px] mr:p-4","t-acc-head":"mr:w-full mr:border-0 mr:p-0 mr:bg-none mr:flex mr:justify-between mr:gap-3","t-avatar-group":"mr:flex mr:p-3","t-input-wrap":"mr:w-full mr:[&_label]:block mr:[&_label]:mb-2","t-learn":"mr:inline-flex mr:items-center mr:gap-2 mr:[border:1px_solid_var(--demo-line)] mr:rounded-[6px] mr:p-[8px_16px] mr:[background:var(--demo-bg)]","t-like":"mr:inline-flex mr:items-center mr:gap-2 mr:[border:1px_solid_var(--demo-line)] mr:rounded-[6px] mr:p-[8px_16px] mr:[background:var(--demo-bg)] mr:relative","notification-trigger":"mr:inline-flex mr:items-center mr:gap-2 mr:[border:1px_solid_var(--demo-line)] mr:rounded-[6px] mr:p-[8px_16px] mr:[background:var(--demo-bg)] mr:relative","t-tt-trigger":"mr:inline-flex mr:items-center mr:gap-2 mr:[border:1px_solid_var(--demo-line)] mr:rounded-[6px] mr:p-[8px_16px] mr:[background:var(--demo-bg)]","t-clear-btn":"mr:absolute mr:right-2 mr:top-2 mr:w-6 mr:h-6 mr:border-0 mr:bg-transparent mr:grid mr:place-items-center","success-result":"mr:flex mr:items-center mr:gap-4","t-stagger-line--1":"mr:text-[20px]"};
  const rootClasses = "mr:[--demo-ink:var(--ant-token-color-text,rgba(0,0,0,.88))] mr:[--demo-muted:var(--ant-token-color-text-secondary,rgba(0,0,0,.65))] mr:[--demo-bg:var(--ant-token-color-bg-container,#fff)] mr:[--demo-fill:var(--ant-token-color-fill-quaternary,rgba(0,0,0,.02))] mr:[--demo-line:var(--ant-token-color-border,#d9d9d9)] mr:[--demo-primary:var(--ant-token-color-primary,#167c4b)] mr:[--demo-error:var(--ant-token-color-error,#ca3d3f)] mr:[--demo-selected:var(--ant-token-color-primary-bg,#ecefed)] mr:[--acc-chevron:250ms] mr:[--acc-collapse:250ms] mr:[--acc-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--acc-expand:250ms] mr:[--avatar-dur:320ms] mr:[--avatar-ease-in:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--avatar-ease-out:cubic-bezier(0.34,_3.85,_0.64,_1)] mr:[--avatar-falloff:0.45] mr:[--avatar-lift:-4px] mr:[--avatar-scale:1.05] mr:[--badge-blur:2px] mr:[--badge-close-ease:cubic-bezier(0.4,_0,_0.2,_1)] mr:[--badge-fade-close-dur:180ms] mr:[--badge-fade-dur:400ms] mr:[--badge-offset-x:-8.2px] mr:[--badge-offset-y:12.4px] mr:[--badge-pop-close-dur:180ms] mr:[--badge-pop-dur:500ms] mr:[--badge-pop-ease:cubic-bezier(0.34,_1.36,_0.64,_1)] mr:[--badge-slide-dur:260ms] mr:[--badge-slide-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--check-blur-dur:500ms] mr:[--check-blur-from:10px] mr:[--check-bob-dur:500ms] mr:[--check-box:150ms] mr:[--check-delay:0ms] mr:[--check-draw:350ms] mr:[--check-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--check-ease-bob:cubic-bezier(0.34,_1.35,_0.64,_1)] mr:[--check-ease-opacity:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--check-ease-out:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--check-ease-path:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--check-ease-rotate:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--check-opacity-dur:500ms] mr:[--check-path-delay:80ms] mr:[--check-path-dur:500ms] mr:[--check-rotate-dur:500ms] mr:[--check-rotate-from:80deg] mr:[--check-uncheck:150ms] mr:[--check-y-amount:40px] mr:[--clear-blur:2px] mr:[--clear-dur:1000ms] mr:[--clear-in-dur:400ms] mr:[--clear-in-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--clear-in-fly:12px] mr:[--clear-out-dur:400ms] mr:[--clear-out-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--clear-out-fly:12px] mr:[--digit-blur:2px] mr:[--digit-dir-x:0] mr:[--digit-dir-y:1] mr:[--digit-distance:8px] mr:[--digit-dur:500ms] mr:[--digit-ease:cubic-bezier(0.34,_1.45,_0.64,_1)] mr:[--digit-stagger:70ms] mr:[--dropdown-close-dur:150ms] mr:[--dropdown-closing-scale:0.99] mr:[--dropdown-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--dropdown-open-dur:250ms] mr:[--dropdown-pre-scale:0.97] mr:[--glow-delay:50ms] mr:[--glow-opacity:0.42] mr:[--glow-peak-at:0.15] mr:[--glow-spread:1.5] mr:[--icon-swap-blur:2px] mr:[--icon-swap-dur:250ms] mr:[--icon-swap-ease:ease-in-out] mr:[--icon-swap-start-scale:0.25] mr:[--learn-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--learn-in:350ms] mr:[--learn-out:350ms] mr:[--learn-shift:2px] mr:[--learn-spread:8deg] mr:[--like-color:#f40051] mr:[--like-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--like-fill:150ms] mr:[--like-particle-dist:20px] mr:[--like-particle-dur:600ms] mr:[--like-particle-size:2.5px] mr:[--like-pop:350ms] mr:[--like-pop-ease:cubic-bezier(0.34,_1.96,_0.64,_1)] mr:[--modal-close-dur:150ms] mr:[--modal-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--modal-open-dur:250ms] mr:[--modal-scale:0.96] mr:[--modal-scale-close:0.96] mr:[--morph-blur:2px] mr:[--morph-close-dur:250ms] mr:[--morph-close-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--morph-ease:cubic-bezier(0.34,_1.25,_0.64,_1)] mr:[--morph-fade-dur:200ms] mr:[--morph-open-dur:350ms] mr:[--morph-r-closed:40px] mr:[--morph-r-open:20px] mr:[--morph-rotate:45deg] mr:[--morph-scale:0.97] mr:[--morph-slide:40px] mr:[--page-blur:3px] mr:[--page-exit-enabled:1] mr:[--page-fade-dur:250ms] mr:[--page-fade-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--page-slide-distance:8px] mr:[--page-slide-dur:250ms] mr:[--page-slide-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--page-stagger:0ms] mr:[--panel-blur:2px] mr:[--panel-close-dur:350ms] mr:[--panel-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--panel-open-dur:400ms] mr:[--panel-translate-y:100px] mr:[--pulse-count:1] mr:[--pulse-dur:1000ms] mr:[--pulse-min:0.5] mr:[--reel-cell:30px] mr:[--reel-dur:1400ms] mr:[--reel-ease:cubic-bezier(0.16,_1,_0.3,_1)] mr:[--reel-spin-blur:3px] mr:[--reel-stagger:90ms] mr:[--resize-dur:300ms] mr:[--resize-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--reveal-blur:2px] mr:[--reveal-dur:400ms] mr:[--reveal-ease:ease-in-out] mr:[--revert-dur:280ms] mr:[--revert-hold:3000ms] mr:[--shake-distance:6px] mr:[--shake-dur-a:80ms] mr:[--shake-dur-b:60ms] mr:[--shake-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--shake-overshoot:4px] mr:[--shimmer-band:400%] mr:[--shimmer-base:var(--demo-muted)] mr:[--shimmer-dur:2000ms] mr:[--shimmer-ease:linear] mr:[--shimmer-highlight:var(--demo-ink)] mr:[--stagger-blur:3px] mr:[--stagger-distance:12px] mr:[--stagger-dur:500ms] mr:[--stagger-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--stagger-stagger:40ms] mr:[--tabs-bar-bg:var(--demo-fill)] mr:[--tabs-dur:250ms] mr:[--tabs-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--tabs-pill-bg:var(--demo-bg)] mr:[--tabs-text-active:var(--demo-ink)] mr:[--tabs-text-muted:var(--demo-muted)] mr:[--text-swap-blur:2px] mr:[--text-swap-dur:150ms] mr:[--text-swap-ease:ease-in-out] mr:[--text-swap-translate-y:4px] mr:[--tilt-follow:400ms] mr:[--tilt-follow-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--tilt-glare-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--tilt-glare-fade:300ms] mr:[--tilt-glare-opacity:0.32] mr:[--tilt-perspective:1000px] mr:[--tilt-return:1000ms] mr:[--tilt-return-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--toast-blur:2px] mr:[--toast-close:250ms] mr:[--toast-distance:16px] mr:[--toast-ease:cubic-bezier(0.22,_1,_0.36,_1)] mr:[--toast-open:350ms] mr:[--toast-scale:0.97] mr:[--toggle-dur:350ms] mr:[--toggle-ease:cubic-bezier(0.34,_1.35,_0.64,_1)] mr:[--toggle-ov1:1px] mr:[--toggle-ov2:0px] mr:[--toggle-track:0ms] mr:[--toggle-travel:14.66px] mr:[--tt-bg:var(--demo-bg)] mr:[--tt-delay:80ms] mr:[--tt-fg:var(--demo-ink)] mr:[--tt-in-dur:150ms] mr:[--tt-in-ease:ease-out] mr:[--tt-out-dur:50ms] mr:[--tt-out-ease:ease-out] mr:[--tt-scale:0.98]";
  global.CohesionTransitions = Object.freeze({ mount, classNames });
})(window);
