// Plaeta website behaviour. Links and contact details come from config.js.
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
