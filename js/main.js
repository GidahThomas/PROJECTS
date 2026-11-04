(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  function updateHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  if (header) {
    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  }

  /* Keep the mobile menu working even if Bootstrap's script is unavailable. */
  var primaryNav = document.getElementById('primaryNav');
  var toggler = document.querySelector('[data-bs-target="#primaryNav"]');
  if (primaryNav) {
    var collapseInstance = window.bootstrap
      ? window.bootstrap.Collapse.getOrCreateInstance(primaryNav, { toggle: false })
      : null;

    function closePrimaryNav() {
      if (collapseInstance) {
        collapseInstance.hide();
      } else {
        primaryNav.classList.remove('show');
        if (toggler) toggler.setAttribute('aria-expanded', 'false');
      }
    }

    primaryNav.querySelectorAll('a.nav-link, a.btn').forEach(function (link) {
      link.addEventListener('click', closePrimaryNav);
    });

    if (toggler && !collapseInstance) {
      toggler.addEventListener('click', function () {
        var isExpanded = toggler.getAttribute('aria-expanded') === 'true';
        primaryNav.classList.toggle('show', !isExpanded);
        toggler.setAttribute('aria-expanded', String(!isExpanded));
      });
    }
  }

  /* ---------- Portfolio case-study filters ---------- */
  var portfolioFilters = document.querySelectorAll('[data-portfolio-filter]');
  var portfolioProjects = document.querySelectorAll('.portfolio-project[data-category]');
  var portfolioStatus = document.getElementById('portfolio-filter-status');
  if (portfolioFilters.length && portfolioProjects.length) {
    portfolioFilters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        var category = filter.getAttribute('data-portfolio-filter');
        var visibleCount = 0;

        portfolioFilters.forEach(function (button) {
          var isSelected = button === filter;
          button.classList.toggle('is-active', isSelected);
          button.setAttribute('aria-pressed', String(isSelected));
        });

        portfolioProjects.forEach(function (project) {
          var isVisible = category === 'all' || project.getAttribute('data-category') === category;
          project.hidden = !isVisible;
          if (isVisible) visibleCount += 1;
        });

        if (portfolioStatus) {
          portfolioStatus.textContent = visibleCount + (visibleCount === 1 ? ' project shown' : ' projects shown');
        }
      });
    });
  }

  /* ---------- Printable company profile ---------- */
  var printProfileButton = document.querySelector('[data-print-profile]');
  if (printProfileButton) {
    printProfileButton.addEventListener('click', function () {
      window.print();
    });
  }

  /* ---------- Smooth scroll for in-page anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll-triggered fade-in ---------- */
  var fadeEls = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

})();
