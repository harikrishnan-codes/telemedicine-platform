document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const body = document.body;

  const openSignInBtn = document.getElementById('openSignInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  const closeSignInBtn = document.getElementById('closeSignInBtn');
  const signInModal = document.getElementById('signInModal');

  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  /* ===================================================
     1. SCROLL-LOCK HANDLERS
     =================================================== */
  function lockScroll() {
    body.classList.add('scroll-locked');
  }

  function unlockScroll() {
    const isDrawerOpen = mobileDrawer.classList.contains('open');
    const isModalOpen = signInModal.classList.contains('is-visible');
    if (!isDrawerOpen && !isModalOpen) {
      body.classList.remove('scroll-locked');
    }
  }

  /* ===================================================
     2. HAMBURGER OPEN & SEPARATE CLOSE LOGIC
     =================================================== */
  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    lockScroll();
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    unlockScroll();
  }

  hamburgerBtn.addEventListener('click', openMobileMenu);
  drawerCloseBtn.addEventListener('click', closeMobileMenu);

  // Close on browser resize if expanding to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ===================================================
     3. ACTIVE NAVIGATION LINK HIGHLIGHTING
     =================================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  function updateActiveLink(targetHref) {
    [...navLinks, ...mobileNavLinks].forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === targetHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  updateActiveLink(currentPath);

  function bindLinkClicks(linkList) {
    linkList.forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        updateActiveLink(href);
        closeMobileMenu();
      });
    });
  }

  bindLinkClicks(navLinks);
  bindLinkClicks(mobileNavLinks);

  /* ===================================================
     4. SIGN IN MODAL LOGIC
     =================================================== */
  function openModal() {
    closeMobileMenu(); // Close drawer if modal is opened from mobile view
    signInModal.classList.add('is-visible');
    signInModal.setAttribute('aria-hidden', 'false');
    lockScroll();
  }

  function closeModal() {
    signInModal.classList.remove('is-visible');
    signInModal.setAttribute('aria-hidden', 'true');
    unlockScroll();
  }

  openSignInBtn?.addEventListener('click', openModal);
  mobileSignInBtn?.addEventListener('click', openModal);
  closeSignInBtn?.addEventListener('click', closeModal);

  // Close when clicking modal backdrop
  signInModal.addEventListener('click', (e) => {
    if (e.target === signInModal) closeModal();
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (signInModal.classList.contains('is-visible')) closeModal();
      if (mobileDrawer.classList.contains('open')) closeMobileMenu();
    }
  });

  /* ===================================================
     5. HEADER SCROLL ELEVATION
     =================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
});






document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  /* ===================================================
     1. 60FPS COUNT-UP ENGINE
     =================================================== */
  function countUp(el) {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const rawTarget = el.getAttribute('data-target') || '0';
    const targetVal = parseFloat(rawTarget);
    const hasDecimal = rawTarget.includes('.') || el.getAttribute('data-decimal') === '1';
    const decimalPlaces = hasDecimal ? (rawTarget.split('.')[1]?.length || 1) : 0;

    const countTracker = { val: 0 };

    gsap.to(countTracker, {
      val: targetVal,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = hasDecimal 
          ? countTracker.val.toFixed(decimalPlaces) 
          : Math.floor(countTracker.val);
      },
      onComplete: () => {
        el.textContent = hasDecimal ? targetVal.toFixed(decimalPlaces) : targetVal;
      }
    });
  }

  /* ===================================================
     2. HERO ENTRANCE TIMELINE (clearProps included)
     =================================================== */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });

  heroTl
    .fromTo('.classy-badge', 
      { opacity: 0, y: -15 }, 
      { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
    )
    .fromTo('.classy-hero-title', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0 }, 
      '-=0.3'
    )
    .fromTo('.classy-hero-desc', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0 }, 
      '-=0.4'
    )
    .fromTo('.classy-cta-group .btn', 
      { opacity: 0, y: 20 }, 
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.12, 
        clearProps: 'all' // Strips all inline styles so buttons are always visible
      }, 
      '-=0.4'
    )
    .fromTo('.classy-metrics-strip', 
      { opacity: 0, y: 15 }, 
      { 
        opacity: 1, 
        y: 0, 
        onStart: () => {
          document.querySelectorAll('.classy-metrics-strip .counter').forEach(countUp);
        }
      }, 
      '-=0.3'
    )
    .fromTo('.stage-outer-card', 
      { opacity: 0, scale: 0.94, y: 20 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1 }, 
      '-=0.8'
    );

  /* ===================================================
     3. 3D CARD PARALLAX TILT (Desktop Only > 768px)
     =================================================== */
  const heroStage = document.querySelector('.classy-hero-stage');
  const stageCard = document.getElementById('stageCard');

  if (heroStage && stageCard && window.innerWidth > 768) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 7;
      const rotY = (x / (rect.width / 2)) * 7;

      gsap.to(stageCard, {
        rotateX: rotX,
        rotateY: rotY,
        duration: 0.3,
        ease: 'power1.out'
      });
    });

    heroStage.addEventListener('mouseleave', () => {
      gsap.to(stageCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  }
});







document.addEventListener('DOMContentLoaded', () => {
  const pillarCards = document.querySelectorAll('.pillar-card');

  function activateCard(targetCard) {
    if (targetCard.classList.contains('active')) return;

    // Remove active from previous card
    pillarCards.forEach(card => card.classList.remove('active'));

    // Activate selected card
    targetCard.classList.add('active');
  }

  pillarCards.forEach(card => {
    // 1. Click / Touch Event (Works seamlessly across mobile & tablet)
    card.addEventListener('click', () => {
      activateCard(card);
    });

    // 2. Desktop Hover (Expands smoothly on mouse enter)
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        activateCard(card);
      }
    });
  });
});








document.addEventListener('DOMContentLoaded', () => {
  // Physical push switches
  const micSwitch = document.getElementById('micSwitch');
  const camSwitch = document.getElementById('camSwitch');
  const audioDial = document.getElementById('audioDial');

  function bindToggle(button) {
    if (!button) return;
    button.addEventListener('click', () => {
      button.classList.toggle('active');
    });
  }

  bindToggle(micSwitch);
  bindToggle(camSwitch);

  // Rotary Knob Rotation on Click/Tap
  let currentRotation = 0;
  audioDial?.addEventListener('click', () => {
    currentRotation = (currentRotation + 45) % 360;
    audioDial.style.transform = `rotate(${currentRotation}deg)`;
  });
});







document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dots .dot');

  let currentIdx = 0;
  const slideDuration = 5000; // 5 seconds per testimonial

  function switchTestimonial(newIndex) {
    // 1. Remove active state from current
    slides[currentIdx].classList.remove('active');
    if (dots.length) dots[currentIdx].classList.remove('active');

    // 2. Compute looped index
    currentIdx = (newIndex + slides.length) % slides.length;

    const nextSlide = slides[currentIdx];

    // 3. Force reflow to re-trigger child CSS animations cleanly
    const quote = nextSlide.querySelector('.testimonial-quote');
    const author = nextSlide.querySelector('.testimonial-author');
    [quote, author].forEach(el => {
      if (el) {
        el.style.animation = 'none';
        void el.offsetHeight; // Forces DOM layout recalculation
        el.style.animation = '';
      }
    });

    // 4. Activate new slide and corresponding dot
    nextSlide.classList.add('active');
    if (dots.length) dots[currentIdx].classList.add('active');
  }

  // Automatic looping interval (hands-free)
  setInterval(() => {
    switchTestimonial(currentIdx + 1);
  }, slideDuration);

  // Manual dot click listener
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
      switchTestimonial(targetIdx);
    });
  });
});







document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion-item');

  // Helper to open a specific item
  function openAccordion(item) {
    const trigger = item.querySelector('.accordion-trigger');
    const body = item.querySelector('.accordion-body');

    item.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    // Set explicit pixel scrollHeight for CSS transition
    body.style.maxHeight = body.scrollHeight + 'px';
  }

  // Helper to close a specific item
  function closeAccordion(item) {
    const trigger = item.querySelector('.accordion-trigger');
    const body = item.querySelector('.accordion-body');

    item.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    body.style.maxHeight = '0px';
  }

  // Initialize any item marked 'active' in HTML
  accordionItems.forEach(item => {
    if (item.classList.contains('active')) {
      const body = item.querySelector('.accordion-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });

  // Click handler
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');

    trigger.addEventListener('click', () => {
      const isAlreadyOpen = item.classList.contains('active');

      // Close all other sibling items (Single open accordion behavior)
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          closeAccordion(otherItem);
        }
      });

      // Toggle clicked item
      if (isAlreadyOpen) {
        closeAccordion(item);
      } else {
        openAccordion(item);
      }
    });
  });

  // Recalculate max-height on window resize so responsive text wrapping doesn't get clipped
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.accordion-item.active');
    if (activeItem) {
      const body = activeItem.querySelector('.accordion-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});












document.addEventListener('DOMContentLoaded', () => {
  const footerNavLinks = document.querySelectorAll('.footer-nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  function updateFooterActiveLink(targetHref) {
    footerNavLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === targetHref) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Highlight active link matching page filename
  updateFooterActiveLink(currentPath);

  // Update on click
  footerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      updateFooterActiveLink(href);
    });
  });
});


// mail id verification js code.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const inputGroup = document.getElementById('newsletterGroup');
  const errorMsg = document.getElementById('newsletterError');

  // RFC-compliant email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailValue = emailInput.value.trim();

    // 1. Validation check
    if (!emailValue) {
      showError('Please enter an email address.');
      return;
    }

    if (!emailRegex.test(emailValue)) {
      showError('Please enter a valid email (e.g. name@domain.com).');
      return;
    }

    // 2. Clear any previous error states
    clearError();

    // 3. Clear the input value automatically
    emailInput.value = '';

    // 4. Redirect to error / 404 page
    // Change to 'error.html' or '404.html' according to your file name
    window.location.href = 'error.html';
  });

  // Clear error as soon as user begins typing again
  emailInput.addEventListener('input', () => {
    if (inputGroup.classList.contains('has-error')) {
      clearError();
    }
  });

  function showError(message) {
    inputGroup.classList.add('has-error');
    errorMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    errorMsg.classList.add('visible');
    emailInput.focus();
  }

  function clearError() {
    inputGroup.classList.remove('has-error');
    errorMsg.textContent = '';
    errorMsg.classList.remove('visible');
  }
});







document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger CDN is missing.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth <= 768;

  /* ===================================================
     1. HERO SECTION ENTRANCE (Loads Immediately)
     =================================================== */
  const activeSlide = document.querySelector('.hero-slide.active');
  if (activeSlide) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });
    
    heroTl
      .from(activeSlide.querySelector('.hero-tag'), { opacity: 0, y: -20, delay: 0.15 })
      .from(activeSlide.querySelector('.hero-title'), { opacity: 0, y: 30 }, '-=0.5')
      .from(activeSlide.querySelector('.hero-description'), { opacity: 0, y: 20 }, '-=0.5')
      .from(activeSlide.querySelectorAll('.hero-cta-group .btn'), { 
        opacity: 0, 
        y: 20, 
        stagger: 0.15 
      }, '-=0.5')
      .from(activeSlide.querySelector('.visual-wrapper'), { 
        opacity: 0, 
        scale: 0.92, 
        duration: 1 
      }, '-=0.7');
  }

  /* ===================================================
     2. EXPANDABLE PILLARS SECTION (Horizontal Stagger)
     =================================================== */
  const pillars = document.querySelectorAll('.pillar-card');
  if (pillars.length) {
    gsap.from(pillars, {
      opacity: 0,
      y: isMobile ? 30 : 50,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#carePillars',
        start: 'top 80%',
        once: true
      }
    });
  }

  /* ===================================================
     3. RETRO-FUTURISM & VAPORWAVE BANNER
     =================================================== */
  const retroCard = document.querySelector('.retro-card');
  if (retroCard) {
    const retroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#cyberTelemetry',
        start: 'top 75%',
        once: true
      }
    });

    retroTl
      .from(retroCard, { opacity: 0, scale: 0.95, duration: 0.8, ease: 'power2.out' })
      .from('.retro-tag-wrap', { opacity: 0, y: -15, duration: 0.5 }, '-=0.4')
      .from('.retro-headline', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
      .from('.telemetry-deck .deck-item', { opacity: 0, y: 20, stagger: 0.12, duration: 0.6 }, '-=0.3')
      .from('.retro-cta-group .btn', { opacity: 0, y: 15, stagger: 0.1 }, '-=0.3');
  }

  /* ===================================================
     4. VIDEO CONSULTATION TEXT OVERLAY BANNER
     =================================================== */
  const teleconsultCard = document.querySelector('.banner-glass-card');
  if (teleconsultCard) {
    gsap.from(teleconsultCard, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#instantCareBanner',
        start: 'top 78%',
        once: true
      }
    });

    gsap.from('.feature-chip', {
      opacity: 0,
      y: 25,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.banner-features-grid',
        start: 'top 85%',
        once: true
      }
    });
  }

  /* ===================================================
     5. SKEUOMORPHIC LUXURY CRAFT UI
     =================================================== */
  const dossierCard = document.querySelector('.craft-dossier-card');
  const consoleCard = document.querySelector('.craft-console-card');

  if (dossierCard && consoleCard) {
    gsap.from(dossierCard, {
      opacity: 0,
      x: isMobile ? 0 : -50,
      y: isMobile ? 30 : 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#conciergeSuite',
        start: 'top 75%',
        once: true
      }
    });

    gsap.from(consoleCard, {
      opacity: 0,
      x: isMobile ? 0 : 50,
      y: isMobile ? 30 : 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#conciergeSuite',
        start: 'top 75%',
        once: true
      }
    });
  }

  /* ===================================================
     6. MASONRY GRID (Waterfall Stagger)
     =================================================== */
  const masonryItems = document.querySelectorAll('.masonry-item');
  if (masonryItems.length) {
    gsap.from(masonryItems, {
      opacity: 0,
      y: 40,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.masonry-wall',
        start: 'top 82%',
        once: true
      }
    });
  }

  /* ===================================================
     7. SPLIT-SCREEN COMPARISON (Directional Reveal)
     =================================================== */
  const leftPanel = document.querySelector('.panel-traditional');
  const rightPanel = document.querySelector('.panel-virtual');

  if (leftPanel && rightPanel) {
    gsap.from(leftPanel, {
      opacity: 0,
      x: isMobile ? 0 : -40,
      y: isMobile ? 30 : 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#careComparison',
        start: 'top 75%',
        once: true
      }
    });

    gsap.from(rightPanel, {
      opacity: 0,
      x: isMobile ? 0 : 40,
      y: isMobile ? 30 : 0,
      duration: 0.8,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#careComparison',
        start: 'top 75%',
        once: true
      }
    });
  }

  /* ===================================================
     8. TESTIMONIALS SLIDER SECTION
     =================================================== */
  const testimonialBanner = document.querySelector('.testimonial-banner');
  if (testimonialBanner) {
    gsap.from(testimonialBanner, {
      opacity: 0,
      scale: 0.96,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#testimonials',
        start: 'top 80%',
        once: true
      }
    });
  }

  /* ===================================================
     9. FINAL CALL-TO-ACTION (CTA) SECTION
     =================================================== */
  const finalCta = document.querySelector('.final-cta-card');
  if (finalCta) {
    gsap.from(finalCta, {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#finalCta',
        start: 'top 82%',
        once: true
      }
    });
  }
});





