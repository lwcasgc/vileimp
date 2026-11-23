(function () {
  var pt = {
    'nav.games': 'Jogos',
    'nav.studio': 'Estúdio',
    'nav.contact': 'Contato',
    'hero.tag': 'Um estúdio independente de games fazendo <em>joguinhos barulhentos e malvados</em>.',
    'hero.cta': 'Ver nossos jogos',
    'marquee': 'JOGUINHOS MALVADOS ✦ FEITOS COM RANCOR ✦ E MUITO AMOR ✦&nbsp;',
    'games.title': 'Jogos',
    'games.badge': 'Em desenvolvimento',
    'games.kicker': 'Ação / briga · PC',
    'games.desc': 'Um lutador. Uma equipe de amigos. Um alvo: <strong>o Fundador</strong>. Abra caminho no soco pela máquina dele, engrenagem por engrenagem, e derrube tudo.',
    'games.f1': 'Combate corpo a corpo rápido e pesado',
    'games.f2': 'Recrute seus amigos e lute ao lado deles',
    'games.f3': 'Toda run termina com alguém levando um soco',
    'games.soon': 'Em breve',
    'studio.title': 'O estúdio',
    'studio.lead': 'A Vile Imp é um estúdio indie pequenininho do Brasil. Fazemos jogos <mark>rápidos</mark>, <mark>engraçados</mark> e um pouquinho <mark>mal-educados</mark>.',
    'studio.v1': 'Sensação primeiro. Se bater nas coisas não for divertido, nada mais importa.',
    'studio.v2': 'Equipe pequena, atitude grande. Corremos atrás de ideias estranhas de propósito.',
    'studio.v3': 'Feito para quem joga. Desenvolvemos em público e escutamos.',
    'contact.title': 'Diz oi.',
    'contact.sub': 'Imprensa, negócios, ou só quer gritar com o diabinho?',
    'footer': 'Todos os direitos reservados. Nenhum diabinho foi ferido.'
  };
  var nodes = document.querySelectorAll('[data-i18n]');
  var en = {};
  nodes.forEach(function (n) { en[n.dataset.i18n] = n.innerHTML; });
  var btn = document.getElementById('lang');

  function apply(lang) {
    var dict = lang === 'pt' ? pt : en;
    nodes.forEach(function (n) { var k = n.dataset.i18n; if (dict[k]) n.innerHTML = dict[k]; });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = lang === 'pt' ? 'Vile Imp — Estúdio Independente de Games' : 'Vile Imp — Independent Game Studio';
    btn.dataset.lang = lang;
    btn.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
    try { localStorage.setItem('vi-lang', lang); } catch (e) {}
  }

  btn.addEventListener('click', function () { apply(btn.dataset.lang === 'pt' ? 'en' : 'pt'); });
  var saved = null;
  try { saved = localStorage.getItem('vi-lang'); } catch (e) {}
  apply(saved === 'pt' ? 'pt' : 'en');
  document.getElementById('year').textContent = new Date().getFullYear();
})();
