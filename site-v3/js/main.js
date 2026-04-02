(function () {
  'use strict';

  /* --- Nav: scroll hide/show --------------------------------------- */
  var nav = document.getElementById('site-nav');
  var lastY = 0;
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (y > 80 && y > lastY) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Hero: shrink on scroll -------------------------------------- */
  var hero = document.getElementById('split-hero');
  if (hero) {
    var heroH = hero.offsetHeight;
    var shrinkTicking = false;

    function onHeroScroll() {
      if (shrinkTicking) return;
      shrinkTicking = true;
      requestAnimationFrame(function () {
        var progress = Math.min(window.scrollY / (heroH * 0.5), 1);
        var scale = 1 - progress * 0.05;
        var radius = 32 + progress * 24;
        hero.style.transform = 'scale(' + scale + ')';
        hero.style.borderRadius = '0 0 ' + radius + 'px ' + radius + 'px';
        shrinkTicking = false;
      });
    }

    window.addEventListener('scroll', onHeroScroll, { passive: true });
    window.addEventListener('resize', function () { heroH = hero.offsetHeight; }, { passive: true });
  }

  /* --- Nav: mobile hamburger --------------------------------------- */
  var burger = document.getElementById('nav-burger');
  var links = document.getElementById('nav-links');

  if (burger && links) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-open');
      links.classList.toggle('is-open');
      document.body.style.overflow = links.classList.contains('is-open') ? 'hidden' : '';
    });

    links.addEventListener('click', function (e) {
      if (e.target.classList.contains('site-nav__link')) {
        burger.classList.remove('is-open');
        links.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  /* --- Scroll Reveal (IntersectionObserver) ------------------------ */
  var reveals = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
