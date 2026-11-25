/* A short fade between the studio page and the game's page (the destination's colour, the game's gear for Gearbreak).
   The arriving page covers itself at once (the inline script in <head> sets html.vt-in) and fades the cover out in CSS. */
(function () {
  function dest(href) {
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    if (u.origin !== location.origin) return null;
    var p = u.pathname.split('/').pop();
    var inGame = /(gearbreak|blog-[\w-]+)\.html$/.test(location.pathname);
    if (p === 'gearbreak.html' && !inGame) return 'game';
    if ((p === 'index.html' || p === '') && inGame) return 'studio';
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    var d = dest(a.href);
    if (!d || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    try { sessionStorage.setItem('vt', d); } catch (x) {}
    var o = document.createElement('div');
    o.className = 'vt-leave vt-' + d;
    document.body.appendChild(o);
    requestAnimationFrame(function () { o.classList.add('on'); });
    setTimeout(function () { location.href = a.href; }, 340);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) document.querySelectorAll('.vt-leave').forEach(function (n) { n.remove(); });
  });
})();
