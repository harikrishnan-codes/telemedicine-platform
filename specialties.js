document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  /* ===================================================
     1. HIGH-PRECISION NUMERIC COUNTER ENGINE
     =================================================== */
  function runCounter(el) {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const targetRaw = el.getAttribute('data-target') || '0';
    const targetVal = parseFloat(targetRaw);
    const hasDecimal = targetRaw.includes('.') || el.getAttribute('data-decimal') === '1';
    const decimals = hasDecimal ? (targetRaw.split('.')[1]?.length || 1) : 0;

    const countTracker = { val: 0 };

    gsap.to(countTracker, {
      val: targetVal,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = hasDecimal 
          ? countTracker.val.toFixed(decimals) 
          : Math.floor(countTracker.val);
      },
      onComplete: () => {
        el.textContent = hasDecimal ? targetVal.toFixed(decimals) : targetVal;
      }
    });
  }

  /* ===================================================
     2. SPECIALTIES HERO ENTRANCE TIMELINE
     =================================================== */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });

  heroTl
    .fromTo('.spec-lead-badge', 
      { opacity: 0, y: -15 }, 
      { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
    )
    .fromTo('.spec-hero-title', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0 }, 
      '-=0.3'
    )
    .fromTo('.spec-hero-lead', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0 }, 
      '-=0.4'
    )
    .fromTo('.spec-track-picker', 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0 }, 
      '-=0.3'
    )
    .fromTo('.spec-cta-group .btn', 
      { opacity: 0, y: 20 }, 
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.12, 
        clearProps: 'all' // Strips inline styles so buttons stay visible
      }, 
      '-=0.4'
    )
    .fromTo('.spec-metrics-deck', 
      { opacity: 0, y: 15 }, 
      { 
        opacity: 1, 
        y: 0, 
        onStart: () => {
          document.querySelectorAll('.spec-metrics-deck .counter').forEach(runCounter);
        }
      }, 
      '-=0.3'
    )
    .fromTo('.spec-stage-card', 
      { opacity: 0, scale: 0.94, y: 20 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1 }, 
      '-=0.8'
    );

  /* ===================================================
     3. INTERACTIVE TRACK SWITCHER LOGIC
     =================================================== */
  const trackPills = document.querySelectorAll('.spec-track-pill');
  const docsCountEl = document.getElementById('activeDocsCount');
  const waitTimeEl = document.getElementById('activeWaitTime');
  const hudTrackLabel = document.getElementById('hudTrackLabel');

  trackPills.forEach(pill => {
    pill.addEventListener('click', () => {
      trackPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const docs = pill.getAttribute('data-docs');
      const wait = pill.getAttribute('data-wait');
      const trackName = pill.textContent.trim();

      // Elastic tap bounce feedback
      gsap.fromTo(pill, 
        { scale: 0.94 }, 
        { scale: 1, duration: 0.35, ease: 'back.out(2)' }
      );

      // Smooth metric transitions
      if (docsCountEl) {
        gsap.to(docsCountEl, {
          opacity: 0,
          y: -8,
          duration: 0.2,
          onComplete: () => {
            docsCountEl.innerHTML = `${docs}`;
            gsap.to(docsCountEl, { opacity: 1, y: 0, duration: 0.3 });
          }
        });
      }

      if (waitTimeEl) {
        gsap.to(waitTimeEl, {
          opacity: 0,
          y: -8,
          duration: 0.2,
          onComplete: () => {
            waitTimeEl.innerHTML = `&lt; ${wait}`;
            gsap.to(waitTimeEl, { opacity: 1, y: 0, duration: 0.3 });
          }
        });
      }

      if (hudTrackLabel) {
        hudTrackLabel.textContent = `TELEMETRY STREAM: ${trackName.toUpperCase()}`;
      }
    });
  });

  /* ===================================================
     4. 3D CARD PARALLAX TILT (Desktop Only > 768px)
     =================================================== */
  const heroStage = document.querySelector('.spec-hero-stage');
  const stageCard = document.getElementById('specStageCard');

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
  /* ===================================================
     1. TOUCH TAP-TO-FLIP SUPPORT (Mobile & Tablet)
     =================================================== */
  const flipCards = document.querySelectorAll('.flip-card');

  flipCards.forEach(card => {
    // Enable tap-to-flip for touch screens
    card.addEventListener('click', (e) => {
      // Allow direct button clicks inside without re-flipping
      if (e.target.closest('.flip-action-btn')) return;

      if (window.innerWidth <= 992) {
        card.classList.toggle('flipped');
      }
    });

    // Keyboard Accessibility (Enter / Space bar flip)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('.flip-action-btn')) {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      }
    });
  });

  /* ===================================================
     2. GSAP SCROLLTRIGGER STAGGERED ENTRANCE
     =================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(flipCards, {
      opacity: 0,
      y: 45,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '.flip-cards-grid',
        start: 'top 82%',
        once: true
      }
    });
  }
});









document.addEventListener('DOMContentLoaded', () => {
  const stepCards = document.querySelectorAll('.workflow-step-card');
  const stageLayers = document.querySelectorAll('.stage-layer');
  const phaseLabel = document.getElementById('stagePhaseLabel');

  const phaseNames = {
    1: 'PHASE 01: INTAKE & TRIAGE ACTIVE',
    2: 'PHASE 02: SPECIALIST ROOM CONNECTED',
    3: 'PHASE 03: DIGITAL e-Rx DISPATCHED',
    4: 'PHASE 04: AMBULATORY MONITORING'
  };

  /* ===================================================
     1. ACTIVE STEP & MEDIA LAYER SWITCHER
     =================================================== */
  function setActiveStep(stepIndex) {
    // 1. Update Left Column Step Card Highlights
    stepCards.forEach(card => {
      const cardStep = parseInt(card.getAttribute('data-step'), 10);
      if (cardStep === stepIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // 2. Cross-fade Right Column Stage Layers
    stageLayers.forEach(layer => {
      const layerStep = parseInt(layer.getAttribute('data-layer'), 10);
      if (layerStep === stepIndex) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });

    // 3. Update Console Header Label
    if (phaseLabel && phaseNames[stepIndex]) {
      phaseLabel.textContent = phaseNames[stepIndex];
    }
  }

  /* ===================================================
     2. SCROLL TRIGGER OBSERVER
     =================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepNum = parseInt(entry.target.getAttribute('data-step'), 10);
        setActiveStep(stepNum);
      }
    });
  }, observerOptions);

  stepCards.forEach(card => stepObserver.observe(card));

  // Click on step cards to jump immediately
  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const stepNum = parseInt(card.getAttribute('data-step'), 10);
      setActiveStep(stepNum);
    });
  });
});









document.addEventListener('DOMContentLoaded', () => {
  const polaroidCards = document.querySelectorAll('.polaroid-card');

  /* ===================================================
     1. GSAP SCROLLTRIGGER STAGGERED ENTRANCE
     =================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(polaroidCards, {
      opacity: 0,
      y: 40,
      scale: 0.94,
      duration: 0.85,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'opacity', // Retains CSS transforms for rotation tilts
      scrollTrigger: {
        trigger: '.polaroid-grid',
        start: 'top 82%',
        once: true
      }
    });
  }

  /* ===================================================
     2. 3D MOUSE PARALLAX TILT (Desktop Only > 768px)
     =================================================== */
  if (window.innerWidth > 768) {
    polaroidCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotX = -(y / (rect.height / 2)) * 6;
        const rotY = (x / (rect.width / 2)) * 6;

        card.style.transform = `translateY(-10px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        // Reset back to original class-based tilt
        card.style.transform = '';
      });
    });
  }
});









document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ===================================================
     1. SCROLLTRIGGER STAGGERED ENTRANCE
     =================================================== */
  const ecgChassis = document.querySelector('.ecg-visualizer-chassis');
  const metricCards = document.querySelectorAll('.ecg-metrics-grid .metric-block');

  if (ecgChassis) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#signalPipeline',
        start: 'top 80%',
        once: true
      }
    });

    tl
      .from(ecgChassis, {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.9,
        ease: 'power3.out'
      })
      .from(metricCards, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4');
  }
});








document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const ctaCard = document.querySelector('.white-cta-card');
  if (ctaCard) {
    const isMobile = window.innerWidth <= 768;

    gsap.from(ctaCard, {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#specialtiesFinalCta',
        start: 'top 82%',
        once: true
      }
    });

    if (!isMobile) {
      gsap.from('.clinical-preview-box', {
        opacity: 0,
        x: 35,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#specialtiesFinalCta',
          start: 'top 80%',
          once: true
        }
      });
    }
  }
});