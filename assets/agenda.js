/* Agendamento via Calendly: abre em janela sobre a página e repassa a origem (UTM) da visita */
(function () {
  var BASE = 'https://calendly.com/deltaomni/30min';

  function bookingUrl(lang) {
    var here = new URLSearchParams(location.search);
    var out = new URLSearchParams();
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      if (here.get(k)) out.set(k, here.get(k));
    });
    if (!out.get('utm_source')) out.set('utm_source', 'site');
    if (!out.get('utm_medium')) out.set('utm_medium', (location.pathname.replace(/^\/|\.html$/g, '').replace(/\//g, '-') || 'home') + (lang === 'en' ? '-en' : ''));
    return BASE + '?' + out.toString();
  }

  function open(e) {
    var a = e.currentTarget;
    var url = bookingUrl(document.documentElement.lang.indexOf('en') === 0 ? 'en' : 'pt');
    if (window.Calendly && Calendly.initPopupWidget) {
      e.preventDefault();
      Calendly.initPopupWidget({ url: url });
      try { if (window.gtag) gtag('event', 'abrir_agendamento', { local: a.dataset.where || '' }); } catch (_) {}
    } else {
      a.href = url; // sem o script da Calendly, abre a página de agendamento normalmente
    }
  }

  document.querySelectorAll('a.js-agenda').forEach(function (a) {
    a.href = bookingUrl(document.documentElement.lang.indexOf('en') === 0 ? 'en' : 'pt');
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', open);
  });
})();
