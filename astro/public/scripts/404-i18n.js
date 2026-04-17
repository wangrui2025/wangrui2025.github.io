(function() {
  var isZh = window.location.pathname.startsWith('/zh/');
  document.documentElement.lang = isZh ? 'zh-CN' : 'en';
  var enEls = document.querySelectorAll('.en-404');
  var zhEls = document.querySelectorAll('.zh-404');
  enEls.forEach(function(el) { el.classList.toggle('hidden', isZh); });
  zhEls.forEach(function(el) { el.classList.toggle('hidden', !isZh); });
})();
