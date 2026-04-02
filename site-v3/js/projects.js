(function () {
  'use strict';

  /* --- Filter pills ------------------------------------------------ */
  var pills = document.querySelectorAll('.filter-pill');
  var items = document.querySelectorAll('.project-grid__item');

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      pills.forEach(function (p) { p.classList.remove('is-active'); });
      this.classList.add('is-active');

      items.forEach(function (item) {
        var audience = item.getAttribute('data-audience') || '';
        if (filter === 'all' || audience.indexOf(filter) !== -1) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  /* --- Check for filter in hash on load ---------------------------- */
  var hash = window.location.hash;
  if (hash.indexOf('filter=') !== -1) {
    var f = hash.split('filter=')[1];
    if (f === 'gross' || f === 'klein') {
      var pill = document.querySelector('.filter-pill[data-filter="' + f + '"]');
      if (pill) pill.click();
    }
  }

  /* --- Project detail overlay -------------------------------------- */
  var overlay = document.getElementById('project-overlay');
  var overlayContent = document.getElementById('project-overlay-content');
  var dataEl = document.getElementById('projects-data');
  var projects = null;

  if (dataEl) {
    try { projects = JSON.parse(dataEl.textContent); } catch (err) { /* skip */ }
  }

  function getLabel(key) {
    var labels = overlay ? overlay.getAttribute('data-labels') : '';
    try { return JSON.parse(labels)[key] || key; } catch (e) { return key; }
  }

  function openProject(slug) {
    if (!projects || !overlay || !overlayContent) return;

    var p = null;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].slug === slug) { p = projects[i]; break; }
    }
    if (!p) return;

    var html = '';
    html += '<div class="project-detail">';
    html += '<h1 class="project-detail__title">' + esc(p.title) + '</h1>';
    if (p.subtitle) {
      html += '<p class="project-detail__subtitle">' + esc(p.subtitle) + '</p>';
    }
    html += '<dl class="project-detail__meta">';
    html += '<div><dt>' + esc(getLabel('client')) + '</dt><dd>' + esc(p.client) + '</dd></div>';
    html += '<div><dt>' + esc(getLabel('year')) + '</dt><dd>' + esc(p.year) + '</dd></div>';
    html += '<div><dt>' + esc(getLabel('services')) + '</dt><dd>' + esc(p.services) + '</dd></div>';
    html += '</dl>';
    html += '<p class="project-detail__desc">' + esc(p.description) + '</p>';
    html += '<div class="project-detail__gallery">';
    if (p.image_files) {
      p.image_files.forEach(function (f) {
        if (f.endsWith('.gif')) return;
        var depth = window.location.pathname.split('/').filter(Boolean).length;
        var prefix = depth <= 2 ? '../../media/' : '../'.repeat(depth - 1) + 'media/';
        html += '<img src="' + prefix + p.slug + '/images/' + f + '" alt="" width="1200" height="800" loading="lazy">';
      });
    }
    html += '</div></div>';

    overlayContent.innerHTML = html;
    overlay.classList.add('is-open');
    overlay.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    history.replaceState(null, '', '#' + slug);
  }

  function closeProject() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname);
  }

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* Listen for card clicks */
  document.addEventListener('click', function (e) {
    var card = e.target.closest('.project-grid__card');
    if (card) {
      e.preventDefault();
      var slug = card.getAttribute('data-slug');
      if (slug) openProject(slug);
    }

    if (e.target.closest('.project-overlay__close')) {
      closeProject();
    }
  });

  /* Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProject();
  });

  /* Open from hash on load */
  if (hash && hash.length > 1 && hash.indexOf('filter=') === -1 && projects) {
    var slug = hash.substring(1);
    openProject(slug);
  }

  /* Popstate */
  window.addEventListener('popstate', function () {
    var h = window.location.hash;
    if (h && h.length > 1 && h.indexOf('filter=') === -1) {
      openProject(h.substring(1));
    } else {
      closeProject();
    }
  });
})();
