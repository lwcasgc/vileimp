(function () {
  var pt = {
    'nav.games': 'Jogos',
    'nav.studio': 'Estúdio',
    'nav.contact': 'Contato',
    'hero.tag': 'Um estúdio independente de games fazendo <em>joguinhos barulhentos e malvados</em>.',
    'hero.cta': 'Ver nossos jogos',
    'marquee': 'JOGUINHOS MALVADOS ✦ FEITOS COM RANCOR ✦ E MUITO AMOR ✦&nbsp;',
    'games.title': 'Jogos',
    'games.more': 'Saiba mais',
    'gb.genres': 'Beat \'em up · Roguelite · Pixel art isométrica · Ação',
    'gb.tagline': 'Desmonte a Fundição. Devolva as vozes da cidade.',
    'gb.short': 'Gearbreak é um beat \'em up roguelite isométrico em pixel art. Lance robôs, faça malabarismo com eles, esmague-os nas paredes e uns contra os outros, e monte um estilo de luta novo a cada partida.',
    'gb.back': 'Todos os jogos',
    'gb.g1': 'Beat \'em up', 'gb.g2': 'Roguelite', 'gb.g3': 'Pixel art isométrica', 'gb.g4': 'Ação',
    'gb.marquee': 'LANÇAR ✦ MALABARISMO ✦ NA PAREDE ✦ BATE-ESTACA ✦ GIRO GIGANTE ✦ PANCADA NO CHÃO ✦&nbsp;',
    'gb.aboutTitle': 'O jogo',
    'gb.p1': 'Todo mundo na cidade conversava pelo Circuito, até a Fundição ficar mais alta que todos e começar a construir máquinas que nunca dizem não.',
    'gb.p2': 'Depois da última rua, num pequeno posto avançado, alguns amigos ainda dizem não. Você é o Tranco, o lutador deles.',
    'gb.p3': 'Entre as lutas, escolha peças que mudam o seu jeito de jogar e volte ao posto avançado mais forte para a próxima partida.',
    'gb.p4': 'Entre as lutas, escolha peças que mudam o seu jeito de jogar: ricochetes, ondas de choque, ímãs e muito mais. De volta ao posto avançado, a equipe ajuda você a ficar mais forte para a próxima tentativa.',
    'gb.fStatus': 'Status', 'gb.fGenre': 'Gêneros', 'gb.fRun': 'Uma partida',
    'gb.fRunV': 'Partidas rápidas e rejogáveis pela Fundição',
    'gb.fBoss': 'Chefes', 'gb.fBossV': 'Widowmaker · Slagheap', 'gb.fDev': 'Desenvolvedora',
    'gb.shotsTitle': 'Imagens',
    'gb.c1t': 'Combate', 'gb.c1': 'Lance robôs e encadeie golpes diferentes para subir o seu multiplicador de estilo.',
    'gb.c2t': 'Peças', 'gb.c2': 'Escolha uma peça depois de cada luta e monte uma build nova a cada partida.',
    'gb.c3t': 'Depósitos de suprimentos', 'gb.c3': 'Gaste suas engrenagens em peças novas, reparos e reposições.',
    'gb.c4t': 'Encontros', 'gb.c4': 'Conheça robôs esquisitos entre as lutas, como um que adora uma boa aposta.',
    'gb.alt0': 'Um agarrão pelas costas arremessa um robô contra outros robôs e caixas, causando uma reação em cadeia.',
    'gb.alt1': 'Tranco lança um grupo de robôs numa sala isométrica enquanto o medidor de combo conta os golpes.',
    'gb.alt2': 'Wrench oferece quatro peças para escolher, entre elas Hang Time, Iron Grip e Bank Shot.',
    'gb.alt3': 'A loja de Token no depósito de suprimentos, com quatro peças à venda e serviços para repor, reparar e desmontar.',
    'gb.alt4': 'Taps oferece três apostas: uma aposta pequena, apostar metade das suas engrenagens ou um tiro no escuro.',
    'gb.featTitle': 'Destaques',
    'gb.ft1': 'Combate de brigão baseado em lançamentos, malabarismos, esmagadas na parede e reações em cadeia.',
    'gb.ft2': 'Agarrões e golpes marcantes como o Bate-Estaca, o Giro Gigante e a Pancada no Chão.',
    'gb.ft3': 'Um multiplicador de estilo que recompensa variar os golpes em vez de repeti-los.',
    'gb.ft4': 'Partidas cheias de lutas, arenas de sobrevivência, lojas e chefes.',
    'gb.ft5': 'Muitas peças para montar um lutador diferente a cada partida.',
    'gb.ft6': 'Um posto avançado com uma equipe animada e melhorias permanentes.',
    'gb.ft7': 'Pixel art isométrica feita à mão.',
    'gb.ctaTitle': 'Em breve.',
    'gb.ctaSub': 'A Fundição ainda está construindo. A gente também.',
    'gb.ctaBtn': 'Fale com o estúdio',
    'games.badge': 'Em desenvolvimento',
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
  var alts = document.querySelectorAll('[data-i18n-alt]');
  alts.forEach(function (n) { en[n.dataset.i18nAlt] = n.alt; });
  var btn = document.getElementById('lang');

  function apply(lang) {
    var dict = lang === 'pt' ? pt : en;
    nodes.forEach(function (n) { var k = n.dataset.i18n; if (dict[k]) n.innerHTML = dict[k]; });
    alts.forEach(function (n) { var k = n.dataset.i18nAlt; if (dict[k]) n.alt = dict[k]; });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    var t = document.documentElement.dataset['title' + (lang === 'pt' ? 'Pt' : 'En')];
    if (t) document.title = t;
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
