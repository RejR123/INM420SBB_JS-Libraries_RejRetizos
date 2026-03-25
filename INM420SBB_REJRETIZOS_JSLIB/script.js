/**
 * ============================================================
 * island hopping in the philippines — script.js
 *
 * libraries initialised here:
 *   1. glide.js   – hero slider + islands carousel
 *   2. aos        – animate on scroll
 *   3. lightbox2  – gallery lightbox (configured)
 *   4. leaflet    – interactive map
 *   5. chart.js   – budget stacked bar chart
 *
 * custom features:
 *   – scroll progress bar
 *   – sticky header (scrolled class)
 *   – mobile navigation toggle
 *   – back-to-top button
 *   – smooth scroll with header offset
 *   – contact form validation
 * ============================================================
 */

/* ── wait for full dom parse before running anything ── */
document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     BACKGROUND IMAGE INJECTION
     hero slides use data-bg to keep all css out of html;
     this reads the attribute and sets the inline style via js
  ============================================================ */
  (function injectBgImages() {
    document.querySelectorAll('[data-bg]').forEach(function (el) {
      el.style.backgroundImage = "url('" + el.getAttribute('data-bg') + "')";
    });
  }());


  /* ============================================================
     SCROLL PROGRESS BAR
     creates a thin line at the top of the viewport
  ============================================================ */
  (function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);

    window.addEventListener('scroll', function () {
      var scrolled  = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct       = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }());


  /* ============================================================
     STICKY HEADER
     adds .scrolled class after 60px of vertical scroll
  ============================================================ */
  (function initStickyHeader() {
    var header = document.getElementById('site-header');
    if (!header) { return; }

    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }());


  /* ============================================================
     MOBILE NAVIGATION TOGGLE
     slides overlay in/out using .is-open class + CSS transform
  ============================================================ */
  (function initMobileNav() {
    var toggle  = document.getElementById('nav-toggle');
    var links   = document.getElementById('nav-links');
    var siteHdr = document.getElementById('site-header');
    if (!toggle || !links) { return; }

    function openMenu() {
      links.classList.add('is-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'close navigation menu');
      document.body.style.overflow = 'hidden';
      if (siteHdr) { siteHdr.classList.add('menu-open'); }
    }

    function closeMenu() {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'open navigation menu');
      document.body.style.overflow = '';
      if (siteHdr) { siteHdr.classList.remove('menu-open'); }
    }

    toggle.addEventListener('click', function () {
      if (links.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* close when any nav link is clicked */
    links.querySelectorAll('.nav__link').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    /* close on ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }());


  /* ============================================================
     BACK-TO-TOP BUTTON
     appears after 400px scroll; smooth-scrolls to top on click
  ============================================================ */
  (function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '&#8593;';
    btn.setAttribute('aria-label', 'back to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }());


  /* ============================================================
     SMOOTH SCROLL  –  all in-page anchor links
     accounts for fixed header height
  ============================================================ */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) { return; }
        e.preventDefault();
        var header    = document.getElementById('site-header');
        var offset    = header ? header.offsetHeight + 12 : 12;
        var targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });
  }());


  /* ============================================================
     1. GLIDE.JS — HERO SLIDER
     carousel, 5.5 s autoplay, keyboard-accessible
  ============================================================ */
  (function initHeroSlider() {
    var el = document.getElementById('hero-glide');
    if (!el || typeof Glide === 'undefined') { return; }

    new Glide(el, {
      type:                'carousel',
      autoplay:            5500,
      hoverpause:          true,
      animationDuration:   900,
      animationTimingFunc: 'cubic-bezier(0.4,0,0.2,1)'
    }).mount();
  }());


  /* ============================================================
     1. GLIDE.JS — ISLANDS CAROUSEL
     responsive perView: 1 / 2 / 3 cards
  ============================================================ */
  (function initIslandsSlider() {
    var el = document.getElementById('islands-glide');
    if (!el || typeof Glide === 'undefined') { return; }

    new Glide(el, {
      type:     'carousel',
      perView:  3,
      gap:      24,
      autoplay: false,
      breakpoints: {
        1023: { perView: 2 },
        639:  { perView: 1 }
      }
    }).mount();
  }());


  /* ============================================================
     2. AOS — ANIMATE ON SCROLL
     once: true means animations do not repeat on scroll-up
  ============================================================ */
  (function initAOS() {
    if (typeof AOS === 'undefined') { return; }

    AOS.init({
      duration: 700,
      easing:   'ease-out-cubic',
      once:     true,
      offset:   70
    });
  }());


  /* ============================================================
     3. LIGHTBOX2 — GALLERY LIGHTBOX
     configure options; the data-lightbox attributes on anchors
     do all the actual wiring automatically
  ============================================================ */
  (function initLightbox() {
    if (typeof lightbox === 'undefined') { return; }

    lightbox.option({
      resizeDuration:   300,
      fadeDuration:     400,
      wrapAround:       true,
      albumLabel:       'Image %1 of %2',
      disableScrolling: true
    });
  }());


  /* ============================================================
     4. LEAFLET.JS — INTERACTIVE MAP
     centres on the Philippine archipelago;
     custom div-icon pin markers with popups
  ============================================================ */
  (function initMap() {
    var mapEl = document.getElementById('ph-map');
    if (!mapEl || typeof L === 'undefined') { return; }

    /* create map, disable scroll-wheel zoom for embedded UX */
    var map = L.map('ph-map', {
      center:          [12.0, 122.5],
      zoom:            6,
      scrollWheelZoom: false
    });

    /* openstreetmap tile layer */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    /* factory: returns a coloured teardrop div-icon */
    function makePin(colour) {
      return L.divIcon({
        className: '',
        html: '<div style="'
          + 'width:30px;height:30px;'
          + 'background:' + colour + ';'
          + 'border:3px solid #fff;'
          + 'border-radius:50% 50% 50% 0;'
          + 'transform:rotate(-45deg);'
          + 'box-shadow:0 3px 10px rgba(0,0,0,0.3);'
          + '"></div>',
        iconSize:   [30, 30],
        iconAnchor: [15, 30],
        popupAnchor:[0, -34]
      });
    }

    /* island data — lat/lng sourced from geographic centres */
    var islands = [
      {
        name:   'Palawan',
        lat:    10.1674,
        lng:    118.7417,
        colour: '#0b3d6b',
        desc:   'UNESCO Underground River, El Nido lagoons, and Coron dive sites.',
        tags:   '⛵ Island Hopping · 🤿 Diving'
      },
      {
        name:   'Boracay',
        lat:    11.9674,
        lng:    121.9248,
        colour: '#00c9b4',
        desc:   '4 km of powdery White Beach, world-class water sports, and vibrant nightlife.',
        tags:   '🏄 Water Sports · 🌅 Sunsets'
      },
      {
        name:   'Cebu',
        lat:    10.3157,
        lng:    123.8854,
        colour: '#f6b93b',
        desc:   'Colonial heritage, Kawasan Falls, and whale shark encounters in Oslob.',
        tags:   '🦈 Whale Sharks · 🏛 Heritage'
      },
      {
        name:   'Bohol',
        lat:    9.6700,
        lng:    124.0645,
        colour: '#1a5e9a',
        desc:   'Over 1,200 Chocolate Hills, Philippine tarsiers, and Panglao white beaches.',
        tags:   '🌿 Nature · 🐒 Wildlife'
      },
      {
        name:   'Siargao',
        lat:    9.8482,
        lng:    126.0458,
        colour: '#ff6b5b',
        desc:   'Cloud 9 surf break, Sugba Lagoon, and the most laid-back island vibe.',
        tags:   '🏄 Surfing · 🌊 Lagoons'
      }
    ];

    /* add each island as a marker with a styled popup */
    islands.forEach(function (island) {
      var popupHtml =
        '<div class="map-popup">'
        + '<h4>' + island.name + '</h4>'
        + '<p>' + island.desc + '</p>'
        + '<small>' + island.tags + '</small>'
        + '</div>';

      L.marker([island.lat, island.lng], { icon: makePin(island.colour), title: island.name })
       .bindPopup(popupHtml, { maxWidth: 230, offset: [0, -8] })
       .addTo(map);
    });
  }());


  /* ============================================================
     5. CHART.JS — TRAVEL BUDGET STACKED BAR CHART
     compares estimated daily costs across five islands
  ============================================================ */
  (function initBudgetChart() {
    var canvas = document.getElementById('budget-chart');
    if (!canvas || typeof Chart === 'undefined') { return; }

    /* estimated usd per person per day, split by category */
    var labels = ['Palawan', 'Boracay', 'Cebu', 'Bohol', 'Siargao'];

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label:           'Accommodation',
            data:            [45, 60, 40, 30, 35],
            backgroundColor: 'rgba(11,61,107,0.87)',
            borderRadius:    4,
            borderSkipped:   false
          },
          {
            label:           'Food & Drinks',
            data:            [20, 25, 18, 15, 18],
            backgroundColor: 'rgba(0,201,180,0.87)',
            borderRadius:    4,
            borderSkipped:   false
          },
          {
            label:           'Transport',
            data:            [15, 12, 10, 12, 10],
            backgroundColor: 'rgba(246,185,59,0.87)',
            borderRadius:    4,
            borderSkipped:   false
          },
          {
            label:           'Activities',
            data:            [25, 20, 15, 18, 22],
            backgroundColor: 'rgba(255,107,91,0.87)',
            borderRadius:    4,
            borderSkipped:   false
          }
        ]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,  /* let CSS height control the canvas */
        plugins: {
          /* hide built-in legend – using custom html legend in markup */
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ' ' + ctx.dataset.label + ': $' + ctx.raw + '/day';
              }
            },
            backgroundColor: 'rgba(11,61,107,0.94)',
            titleFont: { family: "'Cormorant Garamond',serif", size: 13 },
            bodyFont:  { family: "'Outfit',sans-serif",        size: 11 },
            padding:      10,
            cornerRadius:  8
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: {
              /* shrink label font on small screens */
              font: function (ctx) {
                var w = ctx.chart.width;
                return {
                  family: "'Outfit',sans-serif",
                  size:   w < 400 ? 9 : 12,
                  weight: '600'
                };
              },
              color: '#1a2e40',
              maxRotation: 0,   /* never rotate labels – keeps them readable */
              minRotation: 0
            }
          },
          y: {
            stacked: true,
            grid: {
              color:      'rgba(220,233,245,0.8)',
              drawBorder: false
            },
            ticks: {
              callback: function (v) { return '$' + v; },
              font: function (ctx) {
                var w = ctx.chart.width;
                return {
                  family: "'Outfit',sans-serif",
                  size:   w < 400 ? 9 : 11
                };
              },
              color: '#4a6278',
              maxTicksLimit: 6
            },
            border: { display: false }
          }
        }
      }
    });
  }());


  /* ============================================================
     CONTACT FORM VALIDATION
     validates on blur (live) and on submit
  ============================================================ */
  (function initContactForm() {
    var form       = document.getElementById('contact-form');
    if (!form) { return; }

    var fName      = document.getElementById('f-name');
    var fEmail     = document.getElementById('f-email');
    var fDest      = document.getElementById('f-dest');
    var fDate      = document.getElementById('f-date');
    var fSuccess   = document.getElementById('form-success');
    var EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* ── helpers ── */
    function showErr(input, errId, msg) {
      var errEl = document.getElementById(errId);
      if (errEl) { errEl.textContent = msg; }
      input.classList.add('is-error');
    }

    function clearErr(input, errId) {
      var errEl = document.getElementById(errId);
      if (errEl) { errEl.textContent = ''; }
      input.classList.remove('is-error');
    }

    function isFutureDate(val) {
      var chosen = new Date(val);
      var today  = new Date();
      today.setHours(0, 0, 0, 0);
      return chosen >= today;
    }

    /* ── live blur validation ── */
    if (fName) {
      fName.addEventListener('blur', function () {
        if (!this.value.trim()) {
          showErr(this, 'f-name-error', 'Please enter your full name.');
        } else {
          clearErr(this, 'f-name-error');
        }
      });
    }

    if (fEmail) {
      fEmail.addEventListener('blur', function () {
        if (!this.value.trim()) {
          showErr(this, 'f-email-error', 'Please enter your email address.');
        } else if (!EMAIL_RE.test(this.value)) {
          showErr(this, 'f-email-error', 'Please enter a valid email address.');
        } else {
          clearErr(this, 'f-email-error');
        }
      });
    }

    if (fDest) {
      fDest.addEventListener('change', function () {
        if (!this.value) {
          showErr(this, 'f-dest-error', 'Please choose a destination.');
        } else {
          clearErr(this, 'f-dest-error');
        }
      });
    }

    if (fDate) {
      fDate.addEventListener('blur', function () {
        if (!this.value) {
          showErr(this, 'f-date-error', 'Please choose a travel date.');
        } else if (!isFutureDate(this.value)) {
          showErr(this, 'f-date-error', 'Please select a future date.');
        } else {
          clearErr(this, 'f-date-error');
        }
      });
    }

    /* ── submit validation ── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      /* name */
      if (!fName.value.trim()) {
        showErr(fName, 'f-name-error', 'Please enter your full name.');
        valid = false;
      } else {
        clearErr(fName, 'f-name-error');
      }

      /* email */
      if (!fEmail.value.trim()) {
        showErr(fEmail, 'f-email-error', 'Please enter your email address.');
        valid = false;
      } else if (!EMAIL_RE.test(fEmail.value)) {
        showErr(fEmail, 'f-email-error', 'Please enter a valid email address.');
        valid = false;
      } else {
        clearErr(fEmail, 'f-email-error');
      }

      /* destination */
      if (!fDest.value) {
        showErr(fDest, 'f-dest-error', 'Please choose a destination.');
        valid = false;
      } else {
        clearErr(fDest, 'f-dest-error');
      }

      /* date */
      if (!fDate.value) {
        showErr(fDate, 'f-date-error', 'Please choose a travel date.');
        valid = false;
      } else if (!isFutureDate(fDate.value)) {
        showErr(fDate, 'f-date-error', 'Please select a future date.');
        valid = false;
      } else {
        clearErr(fDate, 'f-date-error');
      }

      if (!valid) { return; }

      /* simulate submission */
      var submitBtn = form.querySelector('.btn--submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn__text').textContent = 'Sending…';
      }

      setTimeout(function () {
        form.reset();
        if (fSuccess) {
          fSuccess.hidden = false;
          fSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn__text').textContent = 'Send My Enquiry';
        }
        /* hide success message after 7 s */
        setTimeout(function () {
          if (fSuccess) { fSuccess.hidden = true; }
        }, 7000);
      }, 900);
    });
  }());

}); /* end DOMContentLoaded */