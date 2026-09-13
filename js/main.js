(function () {
  'use strict';

  /* Bootstrap's bundle JS (data-bs-toggle="collapse") already handles the
     navbar hamburger toggle — no custom JS needed for that. */

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  function updateHeaderShadow() {
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  /* Collapse the mobile menu after a nav link is tapped */
  var primaryNav = document.getElementById('primaryNav');
  if (primaryNav && window.bootstrap) {
    var collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(primaryNav, { toggle: false });
    primaryNav.querySelectorAll('a.nav-link, a.btn').forEach(function (link) {
      link.addEventListener('click', function () {
        if (primaryNav.classList.contains('show')) {
          collapseInstance.hide();
        }
      });
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
      var headerHeight = header.offsetHeight;
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
      { threshold: 0.15 }
    );
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Active nav-link highlighting on scroll ---------- */
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
  var navSections = [];
  navLinks.forEach(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    if (section) navSections.push({ link: link, section: section });
  });

  if (navSections.length && 'IntersectionObserver' in window) {
    var setActiveLink = function (targetSection) {
      navSections.forEach(function (entry) {
        entry.link.classList.toggle('is-active', entry.section === targetSection);
      });
    };

    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var match = navSections.find(function (item) {
              return item.section === entry.target;
            });
            if (match) setActiveLink(match.section);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    navSections.forEach(function (entry) {
      navObserver.observe(entry.section);
    });
  }

  /* ---------- Contact form validation + Web3Forms submission ---------- */
  var form = document.getElementById('contactForm');
  var successAlert = document.getElementById('form-success');
  var errorAlert = document.getElementById('form-error');
  var emailInput = document.getElementById('email');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showFormSuccess() {
    errorAlert.classList.add('d-none');
    successAlert.classList.remove('d-none');
  }

  function showFormError() {
    successAlert.classList.add('d-none');
    errorAlert.classList.remove('d-none');
  }

  emailInput.addEventListener('input', function () {
    emailInput.setCustomValidity(
      emailInput.value && !emailPattern.test(emailInput.value) ? 'invalid' : ''
    );
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!emailPattern.test(emailInput.value)) {
      emailInput.setCustomValidity('invalid');
    }

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    form.classList.add('was-validated');
    successAlert.classList.add('d-none');
    errorAlert.classList.add('d-none');

    var formData = new FormData(form);
    var payload = Object.fromEntries(formData);

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      var response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      var result = await response.json();

      if (result.success) {
        form.reset();
        form.classList.remove('was-validated');
        showFormSuccess();
      } else {
        showFormError();
      }
    } catch (error) {
      showFormError();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

})();
