// Gereja Alfa Omega · interaksi ringan: menu ponsel, animasi masuk, tahun footer.
(function () {
  document.documentElement.classList.add('js');

  // Menu ponsel
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var buka = nav.classList.toggle('terbuka');
      toggle.setAttribute('aria-expanded', String(buka));
      toggle.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
    });
    nav.querySelectorAll('.nav-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('terbuka');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('terbuka')) toggle.click();
    });
  }

  // Animasi masuk saat digulir
  var reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('masuk'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveal.forEach(function (el) { io.observe(el); });
    // pengaman: apa pun yang terjadi, semua isi tampil setelah 2 detik
    setTimeout(function () { reveal.forEach(function (el) { el.classList.add('masuk'); }); }, 2000);
  } else {
    reveal.forEach(function (el) { el.classList.add('masuk'); });
  }

  // Tahun di footer
  var tahun = document.getElementById('tahun');
  if (tahun) tahun.textContent = String(new Date().getFullYear());
})();
