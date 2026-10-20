// Plaeta website behaviour. Prices and links come from config.js.
(function () {
  var C = window.PLAETA || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // Links and details from the settings file
  document.querySelectorAll('[data-app]').forEach(function (a) { a.href = C.appUrl || '#'; });
  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var v = C[el.getAttribute('data-cfg')]; if (v == null) return;
    el.textContent = v;
    if (el.tagName === 'A' && el.getAttribute('data-cfg') === 'contactEmail') el.href = 'mailto:' + v;
  });
  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  // A little solar system for each plan: a bigger plan shows more worlds. A picture of the plan, not a promise.
  var WORLDS = ['p-europa', 'p-io', 'p-titan', 'p-kepler', 'p-pluto', 'p-gj', 'p-cnc'];
  var ANGLES = [205, 335, 115, 20, 250, 160, 295];
  var system = function (n, last) {
    n = Math.max(1, Math.min(7, Math.round(+n) || 1));
    var rings = '', worlds = '';
    if (n === 1) {
      rings = '<ellipse class="ring" cx="150" cy="65" rx="54" ry="22" vector-effect="non-scaling-stroke"/>';
      worlds = '<i class="sprite xs ' + WORLDS[0] + '" style="--s:.62;left:50%;top:50%"></i>';
    } else {
      var step = (136 - 34) / (n - 1);
      for (var j = 0; j < n; j++) {
        var rx = 34 + j * step, ry = rx * .32, a = ANGLES[j] * Math.PI / 180;
        var x = 150 + rx * Math.cos(a), y = 65 + ry * Math.sin(a);
        rings += '<ellipse class="ring" cx="150" cy="65" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" vector-effect="non-scaling-stroke"/>';
        worlds += '<i class="sprite xs ' + WORLDS[j] + '" style="--s:' + (0.3 + (j % 3) * 0.05).toFixed(2) + ';--dur:' + (7 + j * 1.5) + 's;left:' + (x / 3).toFixed(2) + '%;top:' + (y / 1.3).toFixed(2) + '%"></i>';
      }
      worlds = '<i class="sun"></i>' + worlds;
    }
    return '<div class="sys' + (last && n > 1 ? ' neb' : '') + '" aria-hidden="true"><svg viewBox="0 0 300 130" preserveAspectRatio="none">' + rings + '</svg>' + worlds + '</div>';
  };

  // Price plans
  var plansEl = document.getElementById('plans');
  if (plansEl && C.plans) {
    var inc = (C.included || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    plansEl.innerHTML = C.plans.map(function (p, i) {
      return '<article class="plan reveal d' + (i + 1) + (p.recommended ? ' rec' : '') + '">' +
        (p.recommended ? '<span class="flag">Recommended</span>' : '') + system(p.worlds || i * 2 + 1, i === C.plans.length - 1) +
        '<h3>' + esc(p.name) + '</h3><p class="blurb">' + esc(p.blurb || '') + '</p>' +
        '<div class="price"><span class="amt">' + esc(C.currency || '$') + esc(p.price) + '</span><span class="per">/ month</span></div>' +
        '<span class="papers">' + esc(p.papers) + ' past papers a month</span>' +
        '<ul>' + inc + '</ul>' +
        '<a class="btn btn-primary" href="start.html?plan=' + encodeURIComponent(p.id) + '">Choose ' + esc(p.name) + ' <span class="arr">&rarr;</span></a>' +
        '</article>';
    }).join('');
  }

  // Plan picker on the Get started page
  var picker = document.getElementById('picker');
  if (picker && C.plans) {
    var want = new URLSearchParams(location.search).get('plan');
    var chosen = C.plans.some(function (p) { return p.id === want; }) ? want : (C.plans.filter(function (p) { return p.recommended; })[0] || C.plans[0]).id;
    picker.innerHTML = C.plans.map(function (p) {
      return '<label class="pick"><input type="radio" name="plan" value="' + esc(p.id) + '"' + (p.id === chosen ? ' checked' : '') + '>' +
        '<span><span class="nm">' + esc(p.name) + '</span><br><span class="sub">' + esc(p.papers) + ' past papers a month</span></span>' +
        '<span class="pr">' + esc(C.currency || '$') + esc(p.price) + ' <small>/ mo</small></span></label>';
    }).join('');
    var label = document.getElementById('chosen');
    var sync = function () {
      var id = (picker.querySelector('input:checked') || {}).value, p = C.plans.filter(function (x) { return x.id === id; })[0];
      if (label && p) label.textContent = p.name + ', ' + (C.currency || '$') + p.price + ' a month';
    };
    picker.addEventListener('change', sync); sync();
  }

  // "Get the highlights": swipe or use the arrows and dots. It moves on by itself until paused, and never on its
  // own when the device asks for reduced motion.
  var hl = document.querySelector('[data-hl]');
  if (hl) {
    var track = hl.querySelector('.hl-track'), cards = [].slice.call(track.querySelectorAll('.hl-card'));
    var dotsBox = hl.querySelector('.hl-dots'), playBtn = hl.querySelector('.hl-play');
    var cur = 0, playing = !reduce, seen = !('IntersectionObserver' in window), wait = 0, settle = 0, DUR = 6000;
    dotsBox.innerHTML = cards.map(function (c) { return '<button type="button" class="hl-dot" aria-label="Show ' + esc(c.getAttribute('data-name')) + '"><span><i></i></span></button>'; }).join('');
    var dots = [].slice.call(dotsBox.children);
    var arm = function () {
      clearTimeout(wait);
      var on = playing && seen;
      hl.classList.toggle('running', on);
      dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); if (i === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      var d = dots[cur]; d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
      if (on) wait = setTimeout(function () { go(cur + 1); }, DUR);
    };
    var go = function (n) {
      cur = (n + cards.length) % cards.length;
      track.scrollTo({ left: cards[cur].offsetLeft - cards[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
      arm();
    };
    var setPlay = function (on) {
      playing = on;
      playBtn.classList.toggle('paused', !on);
      playBtn.setAttribute('aria-label', on ? 'Pause the slideshow' : 'Play the slideshow');
      arm();
    };
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    hl.querySelectorAll('[data-hl-go]').forEach(function (b) { b.addEventListener('click', function () { go(cur + +b.getAttribute('data-hl-go')); }); });
    playBtn.addEventListener('click', function () { setPlay(!playing); });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault(); go(cur + (e.key === 'ArrowRight' ? 1 : -1));
    });
    // After a swipe, the card nearest the start becomes the current one
    track.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var best = 0, gap = Infinity;
        cards.forEach(function (c, i) { var g = Math.abs(c.offsetLeft - cards[0].offsetLeft - track.scrollLeft); if (g < gap) { gap = g; best = i; } });
        if (best !== cur) { cur = best; arm(); }
      }, 140);
    }, { passive: true });
    if (!seen) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; arm(); }, { threshold: 0.35 }).observe(track);
    setPlay(playing);
  }

  // Nav border once you scroll
  var nav = document.querySelector('.nav');
  if (nav) { var onS = function () { nav.classList.toggle('scrolled', scrollY > 8); }; addEventListener('scroll', onS, { passive: true }); onS(); }

  // Fade things in as they scroll into view
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  // Pixel stars, placed the same way every visit
  document.querySelectorAll('.stars').forEach(function (box, k) {
    var n = +box.getAttribute('data-n') || 26, seed = 7 + k * 101, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var cols = ['#9DB0EA', '#C9B8F0', '#F2C9A8', '#A9D4DE', '#E8D27A'];
    var html = '';
    for (var i = 0; i < n; i++) {
      var plus = rnd() < 0.18;
      var x = rnd() * 44; x = x < 22 ? x : x + 56;
      html += '<i class="star' + (plus ? ' plus' : '') + '" style="left:' + x.toFixed(2) + '%;top:' + (rnd() * 100).toFixed(2) + '%;--c:' + cols[i % cols.length] + ';--t:' + (3 + rnd() * 4).toFixed(1) + 's;--d:-' + (rnd() * 6).toFixed(1) + 's"></i>';
    }
    box.innerHTML = html;
  });
})();
