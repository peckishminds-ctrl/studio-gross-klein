(function () {
  'use strict';

  var hero = document.getElementById('split-hero');
  if (!hero) return;

  var gross = hero.querySelector('.split-hero__layer--gross');
  var klein = hero.querySelector('.split-hero__layer--klein');
  var centerBias = 0.5;
  var current = 0.5;
  var target = 0.5;
  var raf = null;

  function clipPaths(t) {
    var g1 = (t * 100).toFixed(1);
    var g2 = (100 - t * 100).toFixed(1);
    var skew = 12;
    gross.style.clipPath =
      'polygon(0 0, ' + g1 + '% 0, ' + (parseFloat(g1) - skew) + '% 100%, 0 100%)';
    klein.style.clipPath =
      'polygon(' + g1 + '% 0, 100% 0, 100% 100%, ' + (parseFloat(g1) - skew) + '% 100%)';
  }

  function lerp(a, b, f) {
    return a + (b - a) * f;
  }

  function tick() {
    current = lerp(current, target, 0.08);
    if (Math.abs(current - target) < 0.001) current = target;
    clipPaths(current);
    if (current !== target) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  function startTick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  clipPaths(0.5);

  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    target = 0.3 + x * 0.4;
    startTick();
  });

  hero.addEventListener('mouseleave', function () {
    target = 0.5;
    startTick();
  });

  var touchStartX = null;
  hero.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  hero.addEventListener('touchmove', function (e) {
    if (touchStartX === null) return;
    var rect = hero.getBoundingClientRect();
    var x = (e.touches[0].clientX - rect.left) / rect.width;
    target = 0.3 + x * 0.4;
    startTick();
  }, { passive: true });

  hero.addEventListener('touchend', function () {
    touchStartX = null;
    target = 0.5;
    startTick();
  });

  hero.addEventListener('click', function (e) {
    var rect = hero.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    var lang = document.documentElement.lang === 'de' ? 'de' : 'en';
    var section = lang === 'de' ? 'projekte' : 'projects';

    if (x < 0.45) {
      window.location.href = '/studio-gross-klein/' + lang + '/' + section + '/#filter=gross';
    } else if (x > 0.55) {
      window.location.href = '/studio-gross-klein/' + lang + '/' + section + '/#filter=klein';
    }
  });
})();
