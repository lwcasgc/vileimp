/* Persistent shell. The header, the language switch and the music player live outside <main>; links between the site's
   pages swap <main> and the footer in place (no reload), so the music never stops. Falls back to a normal page load. */
(function () {
  'use strict';

  /* ---------- music ---------- */
  var box = document.createElement('div');
  box.className = 'music-box';
  box.hidden = true;
  box.innerHTML =
    '<button class="music-play" id="music-play" type="button" aria-label="Play music"><img id="music-play-icon" src="assets/gearbreak/play.png" alt="" width="16" height="16"></button>' +
    '<button class="music" id="music" type="button" aria-pressed="true"><img src="assets/gearbreak/music.png?v=2" alt="" width="10" height="14"><span id="music-label">Music: on</span></button>' +
    '<input class="volume" id="volume" type="range" min="0" max="100" step="1" value="35" aria-label="Volume">';
  var a = document.createElement('audio');
  a.id = 'theme'; a.loop = true; a.preload = 'auto';
  a.innerHTML = '<source src="assets/audio/gearbreak-theme.ogg" type="audio/ogg; codecs=opus">';
  document.body.appendChild(box);
  document.body.appendChild(a);

  var b = box.querySelector('#music'), l = box.querySelector('#music-label');
  var pb = box.querySelector('#music-play'), pi = box.querySelector('#music-play-icon'), vol = box.querySelector('#volume');
  var muted = false, playing = false, userPaused = false, fading = false, level = 35;
  try { muted = localStorage.getItem('vi-music-muted') === '1'; userPaused = localStorage.getItem('vi-music-paused') === '1'; } catch (e) {}
  try { var sv = parseInt(localStorage.getItem('vi-music-volume'), 10); if (sv >= 0 && sv <= 100) level = sv; } catch (e) {}
  vol.value = level; a.volume = level / 100;

  /* The music belongs to the Gearbreak page and its devlogs (body.gb); the studio's pages have none, so leaving them
     for the studio stops it (syncMusic runs after every page swap). */
  function wants() {
    return document.body.classList.contains('gb');
  }
  var words = { en: ['Music: on', 'Music: off', 'Click anywhere for music', 'Music: paused', 'Play music', 'Pause music'], pt: ['Música: ligada', 'Música: desligada', 'Clique para ouvir a música', 'Música: pausada', 'Tocar música', 'Pausar música'], es: ['Música: activada', 'Música: desactivada', 'Haz clic para escuchar la música', 'Música: en pausa', 'Reproducir música', 'Pausar música'], ja: ['音楽：オン', '音楽：オフ', 'クリックで音楽を再生', '音楽：一時停止中', '音楽を再生', '音楽を一時停止'], zh: ['音乐：开', '音乐：关', '点击任意处播放音乐', '音乐：已暂停', '播放音乐', '暂停音乐'] };
  function label() {
    var w = words[document.documentElement.lang.slice(0, 2)] || words.en;
    l.textContent = playing && !muted ? w[0] : w[1];
    pb.classList.toggle('is-waiting', !muted && !playing && !userPaused);
    pi.src = playing ? 'assets/gearbreak/pause.png' : 'assets/gearbreak/play.png';
    pb.setAttribute('aria-label', playing ? w[5] : w[4]);
    b.setAttribute('aria-pressed', muted ? 'false' : 'true');
    b.classList.toggle('is-off', muted);
  }
  function fadeIn() {
    fading = true; var t0 = performance.now();
    (function step(now) {
      if (!fading || muted || !playing) return;
      var k = Math.min(1, (now - t0) / 2500);
      a.volume = k * level / 100;
      if (k < 1) requestAnimationFrame(step); else fading = false;
    })(t0);
  }
  function started() {
    playing = true; fadeIn(); label();
  }
  function start() {
    if (muted || playing || userPaused || !wants()) return;
    a.volume = 0;
    var p = a.play();
    if (p && p.then) p.then(started, function () {});
    else started();
  }
  function syncMusic() {
    var want = wants();
    box.hidden = !want;
    if (!want && playing) { fading = false; a.pause(); playing = false; }
    label();
    if (want) start();
  }
  vol.addEventListener('input', function () {
    level = parseInt(vol.value, 10); fading = false; a.volume = level / 100;
    try { localStorage.setItem('vi-music-volume', String(level)); } catch (x) {}
    if (muted && level > 0) { muted = false; try { localStorage.setItem('vi-music-muted', '0'); } catch (x) {} label(); start(); }
    else if (!muted) { start(); }
  });
  function unlock(e) { if (e && e.target && e.target.closest && e.target.closest('#music-play')) return; start(); }
  ['pointerdown', 'pointerup', 'mousedown', 'click', 'keydown', 'touchstart', 'touchend'].forEach(function (ev) { window.addEventListener(ev, unlock, { passive: true }); });
  pb.addEventListener('click', function (e) {
    e.stopPropagation();
    if (playing) {
      userPaused = true; fading = false; a.pause(); playing = false;
    } else {
      userPaused = false;
      if (muted) { muted = false; try { localStorage.setItem('vi-music-muted', '0'); } catch (x) {} }
      start();
    }
    try { localStorage.setItem('vi-music-paused', userPaused ? '1' : '0'); } catch (x) {}
    label();
  });
  b.addEventListener('click', function (e) {
    e.stopPropagation();
    muted = !muted;
    try { localStorage.setItem('vi-music-muted', muted ? '1' : '0'); } catch (x) {}
    if (muted) { fading = false; a.pause(); playing = false; } else { userPaused = false; try { localStorage.setItem('vi-music-paused', '0'); } catch (x) {} start(); }
    label();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { a.pause(); playing = false; label(); } else if (!muted) { start(); }
  });
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* ---------- screenshot lightbox (Gearbreak page) ---------- */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb || !lb.showModal) return;
    var shots = Array.prototype.slice.call(document.querySelectorAll('[data-shot]'));
    var img = lb.querySelector('.lightbox__img'), cap = lb.querySelector('.lightbox__cap'), cur = 0;
    function show(i) {
      cur = (i + shots.length) % shots.length;
      var src = shots[cur].querySelector('img');
      img.src = src.src; img.alt = src.alt; cap.textContent = src.alt;
    }
    shots.forEach(function (btn, i) { btn.addEventListener('click', function () { show(i); lb.showModal(); }); });
    lb.addEventListener('click', function (e) {
      var act = e.target.dataset.lb;
      if (act === 'prev') show(cur - 1);
      else if (act === 'next') show(cur + 1);
      else if (act === 'close' || e.target === lb) lb.close();
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ---------- page swapping ---------- */
  /* Pages are keyed by their path from the site root. The Gearbreak devlogs live in gearbreak/ (they carry
     <base href="../"> so their links and assets match the root pages); a bare blog-*.html at the root is only a
     redirect stub, so it gets a normal page load. */
  var root = new URL('./', document.baseURI).pathname;
  function pageOf(u) {
    if (u.pathname.indexOf(root) !== 0) return null;
    var p = u.pathname.slice(root.length);
    if (p === '' || p === 'index.html') return 'index';
    if (p === 'gearbreak.html' || /^gearbreak\/[\w-]+\.html$/.test(p)) return p;
    return null;
  }
  var current = pageOf(location);
  var token = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  function themeOf(page) { return page === 'index' ? 'studio' : 'game'; }

  /* Keep the page's <base> in step with the page swapped in, so the shell's relative links still point at the root. */
  function syncBase(doc, href) {
    var b = document.head.querySelector('base'), nb = doc.head.querySelector('base');
    if (!nb) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('base'); document.head.insertBefore(b, document.head.firstChild); }
    b.setAttribute('href', new URL(nb.getAttribute('href'), href).href);
  }

  function swap(doc, href) {
    syncBase(doc, href);
    document.title = doc.title;
    document.body.className = doc.body.className;
    var h = document.documentElement, nh = doc.documentElement;
    Array.prototype.slice.call(h.attributes).forEach(function (at) { if (/^data-title-/.test(at.name)) h.removeAttribute(at.name); });
    Array.prototype.slice.call(nh.attributes).forEach(function (at) { if (/^data-title-/.test(at.name)) h.setAttribute(at.name, at.value); });
    ['meta[name="description"]', 'meta[name="theme-color"]'].forEach(function (sel) {
      var o = document.head.querySelector(sel), n = doc.head.querySelector(sel);
      if (o && n) o.setAttribute('content', n.getAttribute('content'));
    });
    document.head.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(function (n) { n.remove(); });
    doc.head.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(function (n) { document.head.appendChild(document.importNode(n, true)); });
    var m = document.querySelector('main');
    m.replaceWith(document.importNode(doc.querySelector('main'), true));
    var f = document.querySelector('footer'), nf = doc.querySelector('footer');
    if (f && nf) f.replaceWith(document.importNode(nf, true));
  }

  function scrollToHash(hash, smooth) {
    var t = null;
    if (hash) { try { t = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) {} }
    if (t) t.scrollIntoView(smooth ? undefined : { behavior: 'instant' });
    else window.scrollTo(smooth ? { top: 0 } : { top: 0, behavior: 'instant' });
  }

  function arrival(theme) {
    var h = document.documentElement;
    h.classList.remove('vt-in', 'vt-game', 'vt-studio');
    void h.offsetWidth;
    h.classList.add('vt-in', 'vt-' + theme);
    setTimeout(function () { h.classList.remove('vt-in', 'vt-' + theme); }, 1000);
  }

  function navigate(u, push) {
    var to = pageOf(u), mine = ++token;
    var destTheme = themeOf(to);
    var fade = themeOf(current) !== destTheme && !reduce.matches;
    var cover = null, wait = Promise.resolve();
    if (fade) {
      cover = document.createElement('div');
      cover.className = 'vt-leave vt-' + destTheme;
      document.body.appendChild(cover);
      requestAnimationFrame(function () { cover.classList.add('on'); });
      wait = new Promise(function (r) { setTimeout(r, 340); });
    }
    fetch(u.href.split('#')[0], { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.text(); })
      .then(function (html) { return wait.then(function () { return html; }); })
      .then(function (html) {
        if (mine !== token) { if (cover) cover.remove(); return; }
        var doc = new DOMParser().parseFromString(html, 'text/html');
        if (!doc.querySelector('main')) throw new Error('no main');
        if (push) history.pushState(null, '', u.href);   /* first, so the new main resolves against the new address */
        swap(doc, u.href);
        current = to;
        if (window.viI18n) window.viI18n.refresh();
        var lang = document.getElementById('lang');
        if (lang) { lang.classList.remove('is-open'); var t = lang.querySelector('.lang__btn'); if (t) t.setAttribute('aria-expanded', 'false'); }
        initLightbox();
        syncMusic();
        scrollToHash(u.hash, false);
        if (fade) arrival(destTheme);
        if (cover) cover.remove();
      })
      .catch(function () {
        if (cover) cover.remove();
        try { sessionStorage.setItem('vt', destTheme); } catch (e) {}
        location.href = u.href;
      });
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    var u; try { u = new URL(link.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin) return;
    var to = pageOf(u);
    if (!to) return;
    e.preventDefault();
    if (to === current) {
      if (u.href !== location.href) history.pushState(null, '', u.href);
      scrollToHash(u.hash, true);
      return;
    }
    navigate(u, true);
  });

  window.addEventListener('popstate', function () {
    var u = new URL(location.href), to = pageOf(u);
    if (!to) { location.reload(); return; }
    if (to === current) scrollToHash(u.hash, false);
    else navigate(u, false);
  });

  /* ---------- contact form ---------- */
  var contactMsg = {
    en: ['Sending...', 'Message sent! The imp got it.', 'Could not send right now. Please email vileimpgames@gmail.com.', 'Form not connected yet — replace YOUR_ACCESS_KEY in the HTML.'],
    pt: ['Enviando...', 'Mensagem enviada! O diabinho recebeu.', 'Não foi possível enviar agora. Envie para vileimpgames@gmail.com.', 'Formulário ainda não conectado — troque YOUR_ACCESS_KEY no HTML.'],
    es: ['Enviando...', '¡Mensaje enviado! El diablillo lo recibió.', 'No se pudo enviar ahora. Escribe a vileimpgames@gmail.com.', 'Formulario aún no conectado — cambia YOUR_ACCESS_KEY en el HTML.'],
    ja: ['送信中...', '送信しました！インプに届きました。', '送信できませんでした。vileimpgames@gmail.com までメールしてください。', 'フォームが未設定です。HTMLの YOUR_ACCESS_KEY を置き換えてください。'],
    zh: ['发送中...', '发送成功！小恶魔收到了。', '暂时无法发送，请发邮件至 vileimpgames@gmail.com。', '表单尚未配置——请在 HTML 中替换 YOUR_ACCESS_KEY。']
  };
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.id !== 'contact-form') return;
    e.preventDefault();
    var status = form.querySelector('#contact-status');
    var btn = form.querySelector('.contact__submit');
    var keyInput = form.querySelector('input[name="access_key"]');
    var lang = document.documentElement.lang.slice(0, 2);
    var m = contactMsg[lang] || contactMsg.en;
    if (!keyInput || !keyInput.value || keyInput.value === 'YOUR_ACCESS_KEY') {
      status.className = 'contact__status is-err';
      status.textContent = m[3];
      return;
    }
    var subjInput = form.querySelector('input[name="subject"]');
    var proj = form.querySelector('input[name="project"]:checked') || form.querySelector('input[name="project"][type="hidden"]');
    var topic = form.querySelector('input[name="topic"]:checked');
    if (subjInput) {
      subjInput.value = '[' + (proj ? proj.value : 'Vile Imp') + '] ' + (topic ? topic.value : 'Message');
    }
    btn.disabled = true;
    status.className = 'contact__status';
    status.textContent = m[0];
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (r) {
      return r.json().then(function (data) { return { ok: r.ok && data && data.success }; });
    }).then(function (res) {
      if (!res.ok) throw new Error('send failed');
      form.reset();
      status.className = 'contact__status is-ok';
      status.textContent = m[1];
    }).catch(function () {
      status.className = 'contact__status is-err';
      status.textContent = m[2];
    }).finally(function () {
      btn.disabled = false;
    });
  });

  initLightbox();
  syncMusic();
})();
