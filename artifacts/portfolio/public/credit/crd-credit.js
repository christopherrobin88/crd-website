/*!
 * crd-credit.js: animated "Developed by Christopher Robin Design" tree credit.
 * Vanilla JS, no dependencies. Pairs with crd-credit.css and crd-tree.svg.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var RANGE = 150;            // px: proximity radius around the credit
  var SWAY_LEAN = 4;          // deg: trunk and branches, at full proximity
  var LEAF_LEAN = 9;          // deg: leaves lean further and independently
  var PIVOT = [222, 440];     // trunk base in tree coordinates (crd-tree.svg)
  var MAX_FALLEN = 3;         // leaves detached at once
  var MIN_GAP = 2200;         // ms between leaves falling
  var LINGER_MS = 1200;       // ms inside range before a leaf lets go
  var FAST_PASS = 1.1;        // px per ms: a quick sweep past the tree

  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function el(name) { return document.createElementNS(NS, name); }

  // Damped spring on one number (degrees). Semi-implicit Euler.
  function Spring(k, zeta) {
    this.x = 0; this.v = 0; this.target = 0;
    this.k = k; this.c = 2 * zeta * Math.sqrt(k);
  }
  Spring.prototype.step = function (dt) {
    this.v += (-this.k * (this.x - this.target) - this.c * this.v) * dt;
    this.x += this.v * dt;
  };
  Spring.prototype.settled = function () {
    return Math.abs(this.x - this.target) < 0.002 && Math.abs(this.v) < 0.01;
  };

  var mounted = 0;

  // mount(link, options) -> handle with destroy().
  // options.intro === false skips the scroll-in sway (used when a logo is
  // re-mounted on a page change and has already played once).
  function mount(link, options) {
    options = options || {};
    var handle = { destroyed: false, destroy: function () { handle.destroyed = true; if (handle.stop) handle.stop(); } };
    if (link.__crdCredit) return link.__crdCredit;
    link.__crdCredit = handle;
    var img = link.querySelector('img');
    // The resolved tree file wins: an <img> may still point at the static lockup.
    var src = link.getAttribute('data-crd-src') || (img && img.getAttribute('src'));
    if (!src) return handle;

    fetch(src).then(function (r) {
      if (!r.ok) throw new Error('crd-tree.svg ' + r.status);
      return r.text();
    }).then(function (text) {
      if (handle.destroyed) return;
      var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      var svg = document.importNode(doc.documentElement, true);
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('class', 'crd-credit__svg');
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      // Capture the animated parts by id before renaming, so a second credit on the page gets unique ids.
      var parts = {
        tree: svg.querySelector('#crd-tree'),
        sway: svg.querySelector('#crd-sway'),
        leaves: []
      };
      for (var i = 1; i <= 10; i++) parts.leaves.push(svg.querySelector('#crd-leaf-' + i));
      var n = mounted++;
      if (n > 0) svg.querySelectorAll('[id]').forEach(function (e) { e.setAttribute('id', e.getAttribute('id') + '-' + n); });
      if (img) { img.parentNode.replaceChild(svg, img); } else { link.appendChild(svg); }
      // Reduced motion: the logo is inlined (so theme colours apply) but nothing animates.
      if (reduceQuery && reduceQuery.matches) return;
      if (!parts.tree || !parts.sway || parts.leaves.indexOf(null) !== -1) return;   // not the split tree file: stay static
      handle.stop = animate(link, svg, parts, options);
    }).catch(function () {
      // Keep the static <img> if the SVG cannot be fetched (for example, file://).
    });
    return handle;
  }

  function animate(link, svg, parts, options) {
    var listeners = [];   // [target, type, fn] so everything can be removed again
    function on(target, type, fn, opts) { target.addEventListener(type, fn, opts); listeners.push([target, type, fn]); }
    var observer = null;
    var tree = parts.tree;
    var sway = parts.sway;
    var fallLayer = el('g');
    fallLayer.setAttribute('class', 'crd-fall-layer');
    tree.appendChild(fallLayer);

    var swaySpring = new Spring(18, 0.28);
    var leaves = [];
    for (var i = 1; i <= 10; i++) {
      var g = parts.leaves[i - 1];
      var t = /translate\(([-\d.]+),([-\d.]+)\)/.exec(g.firstElementChild.getAttribute('transform'));
      leaves.push({
        g: g,
        px: parseFloat(t[1]),
        py: parseFloat(t[2]),
        spring: new Spring(10, 0.4),
        factor: 0.85 + 0.05 * (i % 5),   // small variation so leaves do not move as one
        state: 'attached',               // attached | gone | regrowing
        op: 1,
        regrowAt: 0
      });
    }

    var falling = [];
    var inView = false;
    var running = false;   // true while a rAF callback is pending
    var stopped = false;   // set if the visitor switches to reduced motion mid-session
    var last = 0;
    var pointer = { x: 0, y: 0, active: false, speed: 0, fastPending: false };
    var lingerT = 0;
    var lastDetach = -Infinity;
    var introPlayed = options && options.intro === false;

    // ---- triggers --------------------------------------------------------

    function detach(leaf, now) {
      // Clone the leaf's current on-screen state into the falling layer so the
      // original can fade out and regrow without the falling leaf vanishing.
      var rel = tree.getCTM().inverse().multiply(leaf.g.getCTM());
      var m = new DOMMatrix([rel.a, rel.b, rel.c, rel.d, rel.e, rel.f]);
      var start = m.transformPoint(new DOMPoint(leaf.px, leaf.py));
      var clone = leaf.g.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('transform', 'matrix(' + [m.a, m.b, m.c, m.d, m.e, m.f].join(' ') + ')');
      var wrap = el('g');
      wrap.setAttribute('class', 'crd-fall');
      wrap.appendChild(clone);
      fallLayer.appendChild(wrap);
      falling.push({
        el: wrap, t: 0, dur: rand(1.4, 1.8),
        side: Math.random() < 0.5 ? -1 : 1,
        px: start.x, py: start.y
      });
      leaf.state = 'gone';
      leaf.regrowAt = now + rand(1500, 3000);
      lastDetach = now;
      kick();
    }

    function tryDetach(now) {
      if (stopped || now - lastDetach < MIN_GAP) return false;
      var gone = leaves.filter(function (l) { return l.state !== 'attached'; }).length;
      if (gone >= MAX_FALLEN) return false;
      var free = leaves.filter(function (l) { return l.state === 'attached'; });
      if (!free.length) return false;
      detach(free[Math.floor(Math.random() * free.length)], now);
      return true;
    }

    function playIntro() {
      // Gentle sway from rest, then one or two leaves let go.
      swaySpring.v = 13;
      setTimeout(function () { tryDetach(performance.now()); kick(); }, 450);
      if (Math.random() < 0.5) {
        setTimeout(function () { tryDetach(performance.now()); kick(); }, 1000);
      }
      kick();
    }

    // Read the link's box once per frame, before any writes.
    function proximity(rect) {
      var dx = Math.max(rect.left - pointer.x, 0, pointer.x - rect.right);
      var dy = Math.max(rect.top - pointer.y, 0, pointer.y - rect.bottom);
      var dist = Math.sqrt(dx * dx + dy * dy);
      var intensity = clamp(1 - dist / RANGE, 0, 1);
      // Which side the cursor is on, softened so the lean does not flip abruptly.
      var mid = rect.left + rect.width / 2;
      var side = clamp((pointer.x - mid) / (rect.width / 2 + 20), -1, 1);
      return { intensity: intensity, side: side };
    }

    // ---- frame loop ------------------------------------------------------

    function kick() {
      if (running || stopped || !inView) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }

    function frame(now) {
      if (stopped || !inView) { running = false; return; }
      var dt = Math.min(1 / 30, Math.max(0, (now - last) / 1000));
      last = now;

      var prox = { intensity: 0, side: 0 };
      if (pointer.active) prox = proximity(link.getBoundingClientRect());

      // Linger and fast-pass triggers (desktop pointer only).
      if (prox.intensity > 0.5) {
        lingerT += dt;
        if (lingerT >= LINGER_MS / 1000) { lingerT = 0; tryDetach(now); }
      } else {
        lingerT = Math.max(0, lingerT - dt * 2);
      }
      if (pointer.fastPending) {
        pointer.fastPending = false;
        if (prox.intensity > 0.2) tryDetach(now);
      }

      swaySpring.target = -SWAY_LEAN * prox.intensity * prox.side;
      swaySpring.step(dt); swaySpring.step(dt);
      sway.setAttribute('transform', 'rotate(' + swaySpring.x.toFixed(3) + ' ' + PIVOT[0] + ' ' + PIVOT[1] + ')');

      var busy = !swaySpring.settled();
      for (var i = 0; i < leaves.length; i++) {
        var L = leaves[i];
        L.spring.target = -LEAF_LEAN * prox.intensity * prox.side * L.factor;
        L.spring.step(dt); L.spring.step(dt);
        L.g.setAttribute('transform', 'rotate(' + L.spring.x.toFixed(3) + ' ' + L.px + ' ' + L.py + ')');

        if (L.state === 'gone' && now >= L.regrowAt) L.state = 'regrowing';
        var opTarget = L.state === 'gone' ? 0 : 1;
        var fadeRate = L.state === 'gone' ? 1 / 0.35 : 1 / 0.9;   // fade out fast, regrow slowly
        if (L.op !== opTarget) {
          L.op = opTarget > L.op ? Math.min(1, L.op + dt * fadeRate) : Math.max(0, L.op - dt * fadeRate);
          L.g.setAttribute('opacity', L.op.toFixed(3));
        }
        if (L.state === 'regrowing' && L.op >= 1) L.state = 'attached';
        if (!L.spring.settled() || L.op !== opTarget || L.state !== 'attached') busy = true;
      }

      for (var j = falling.length - 1; j >= 0; j--) {
        var F = falling[j];
        F.t += dt;
        var p = Math.min(1, F.t / F.dur);
        var x = F.side * 26 * Math.sin(p * Math.PI / 2);      // slight outward drift
        var y = 230 * (0.35 * p + 0.65 * p * p);              // gentle acceleration
        var r = F.side * 110 * p;                            // tumbling rotation
        var fade = p < 0.55 ? 1 : 1 - (p - 0.55) / 0.45;
        F.el.setAttribute('transform',
          'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + r.toFixed(2) + ' ' + F.px.toFixed(2) + ' ' + F.py.toFixed(2) + ')');
        F.el.setAttribute('opacity', Math.max(0, fade).toFixed(3));
        if (p >= 1) { fallLayer.removeChild(F.el); falling.splice(j, 1); }
      }
      if (falling.length) busy = true;
      if (prox.intensity > 0) busy = true;

      // Keep one rAF pending while busy; otherwise go idle until the next trigger.
      if (busy) {
        requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    // ---- wiring ----------------------------------------------------------

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (stopped) return;
          inView = entry.isIntersecting;
          if (inView && !introPlayed) { introPlayed = true; playIntro(); }
          if (inView) kick();
        });
      }, { threshold: 0.6 });
      observer.observe(link);
    } else {
      inView = true;
      if (!introPlayed) { introPlayed = true; playIntro(); }
    }

    on(window, 'pointermove', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      var dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
      var dt = Math.max(1, performance.now() - (pointer.t || 0));
      pointer.speed = Math.sqrt(dx * dx + dy * dy) / dt;
      if (pointer.speed > FAST_PASS) pointer.fastPending = true;
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now();
      pointer.active = true;
      kick();
    }, { passive: true });
    on(document.documentElement, 'mouseleave', function () { pointer.active = false; kick(); });

    // Touch: a tap gives a sway and one leaf, under the same rate limit. The link still navigates.
    on(link, 'pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      swaySpring.v += 14;
      tryDetach(performance.now());
      kick();
    });

    if (reduceQuery && reduceQuery.addEventListener) {
      on(reduceQuery, 'change', function (e) {
        if (!e.matches) return;
        // Switched to reduced motion mid-session: stop and return the logo to rest.
        stopped = true;
        falling.forEach(function (F) { fallLayer.removeChild(F.el); });
        falling.length = 0;
        sway.removeAttribute('transform');
        leaves.forEach(function (L) { L.g.removeAttribute('transform'); L.g.removeAttribute('opacity'); L.state = 'attached'; L.op = 1; });
      });
    }

    // Stop everything and detach listeners (the host element is going away).
    return function stop() {
      stopped = true;
      if (observer) observer.disconnect();
      listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2]); });
      listeners.length = 0;
    };
  }

  function treeSrc(link) {
    var img = link.querySelector('img');
    var src = link.getAttribute('data-crd-src') || (img && img.getAttribute('src')) || '';
    if (/crd-tree\.svg(\?|#|$)/i.test(src)) return src;
    if (/crd-lockup\.svg(\?|#|$)/i.test(src)) return src.replace(/crd-lockup\.svg/i, 'crd-tree.svg');
    var scripts = document.querySelectorAll('script[src*="crd-credit.js"]');
    if (scripts.length) {
      var href = scripts[scripts.length - 1].src || '';
      if (href) return href.replace(/crd-credit\.js(\?.*)?$/i, 'crd-tree.svg');
    }
    return src;
  }

  // Drop-in: enhance an existing #crd-credit (the link itself, or a wrapper with a link inside).
  // Also mounts any a.crd-credit that is not already covered.
  function start() {
    var seen = [];
    function add(link) {
      if (!link || link.tagName !== 'A') return;
      for (var i = 0; i < seen.length; i++) if (seen[i] === link) return;
      seen.push(link);
    }
    var host = document.getElementById('crd-credit');
    if (host) add(host.tagName === 'A' ? host : host.querySelector('a'));
    var extras = document.querySelectorAll('a.crd-credit');
    for (var i = 0; i < extras.length; i++) add(extras[i]);
    for (var j = 0; j < seen.length; j++) {
      var link = seen[j];
      var src = treeSrc(link);
      if (src && !link.getAttribute('data-crd-src')) link.setAttribute('data-crd-src', src);
      mount(link);
    }
  }

  // For pages that add the credit after load (single-page apps).
  window.CRDCredit = { mount: mount, start: start };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
