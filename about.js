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
     2. ABOUT HERO ENTRANCE TIMELINE
     =================================================== */
  const aboutTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });

  aboutTl
    .fromTo('.about-lead-badge', 
      { opacity: 0, y: -15 }, 
      { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
    )
    .fromTo('.about-hero-title', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0 }, 
      '-=0.3'
    )
    .fromTo('.about-hero-lead', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0 }, 
      '-=0.4'
    )
    .fromTo('.pillar-bullet', 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, stagger: 0.12 }, 
      '-=0.4'
    )
    .fromTo('.about-cta-group .btn', 
      { opacity: 0, y: 20 }, 
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.12, 
        clearProps: 'all' // Clears inline styles so buttons are always visible and interactive
      }, 
      '-=0.4'
    )
    .fromTo('.about-metrics-deck', 
      { opacity: 0, y: 15 }, 
      { 
        opacity: 1, 
        y: 0, 
        onStart: () => {
          document.querySelectorAll('.about-metrics-deck .counter').forEach(runCounter);
        }
      }, 
      '-=0.3'
    )
    .fromTo('.about-stage-card', 
      { opacity: 0, scale: 0.94, y: 20 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1 }, 
      '-=0.8'
    );

  /* ===================================================
     3. 3D CARD PARALLAX TILT (Desktop Only > 768px)
     =================================================== */
  const heroStage = document.querySelector('.about-hero-stage');
  const stageCard = document.getElementById('aboutStageCard');

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
  const imageCards = document.querySelectorAll('.interactive-image-card');
  const contentPanels = document.querySelectorAll('.content-panel');

  function switchMatrixPanel(targetId) {
    const targetPanel = document.getElementById(`panel-${targetId}`);
    if (!targetPanel || targetPanel.classList.contains('active')) return;

    // 1. Update image card trigger states
    imageCards.forEach(card => {
      if (card.getAttribute('data-target') === targetId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // 2. Crossfade content panels with GSAP
    contentPanels.forEach(panel => {
      if (panel.classList.contains('active')) {
        if (typeof gsap !== 'undefined') {
          gsap.to(panel, {
            opacity: 0,
            y: -10,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              panel.classList.remove('active');
              showTargetPanel(targetPanel);
            }
          });
        } else {
          panel.classList.remove('active');
          targetPanel.classList.add('active');
        }
      }
    });
  }

  function showTargetPanel(panel) {
    panel.classList.add('active');
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(panel, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      );
    }
  }

  // Bind Mouseover (Desktop) and Click (Touch Devices)
  imageCards.forEach(card => {
    const target = card.getAttribute('data-target');

    // Desktop hover switch
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        switchMatrixPanel(target);
      }
    });

    // Touch click switch
    card.addEventListener('click', () => {
      switchMatrixPanel(target);
    });
  });
});









document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger library missing. Make sure CDN scripts are loaded.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ===================================================
     1. ROBUST 60FPS COUNT-UP ENGINE
     =================================================== */
  function countUp(el) {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const rawTarget = el.getAttribute('data-target') || '0';
    const targetVal = parseFloat(rawTarget);
    const hasDecimal = rawTarget.includes('.') || el.getAttribute('data-decimal');
    const decimalPlaces = hasDecimal ? (rawTarget.split('.')[1]?.length || parseInt(el.getAttribute('data-decimal'), 10) || 1) : 0;

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
     2. AURORA CONSOLE ENTRANCE & COUNTER TRIGGER
     =================================================== */
  const consoleCard = document.querySelector('.aurora-glass-console');

  if (consoleCard) {
    gsap.from(consoleCard, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#clinicalInnovation',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          consoleCard.querySelectorAll('.counter').forEach(countUp);
        }
      }
    });

    gsap.from('.aurora-feature-card', {
      opacity: 0,
      y: 30,
      duration: 0.75,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.aurora-cards-grid',
        start: 'top 85%',
        once: true
      }
    });
  }
});









document.addEventListener('DOMContentLoaded', () => {
  /* ===================================================
     1. GSAP SCROLLTRIGGER ENTRANCE ANIMATION
     =================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.team-member-card', {
      opacity: 0,
      y: 45,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.team-cards-grid',
        start: 'top 82%',
        once: true
      }
    });
  }

  /* ===================================================
     2. TOUCH DEVICE FALLBACK (Toggle on Tap for Mobile)
     =================================================== */
  const teamCards = document.querySelectorAll('.team-member-card');

  teamCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking directly on the action link, let navigation occur
      if (e.target.closest('.team-action-btn')) return;

      if (window.innerWidth <= 768) {
        const isHovered = card.classList.contains('touch-active');

        // Close any other active touch cards
        teamCards.forEach(c => {
          c.classList.remove('touch-active');
          const curtain = c.querySelector('.member-reveal-curtain');
          if (curtain) {
            curtain.style.opacity = '';
            curtain.style.visibility = '';
            curtain.style.transform = '';
          }
        });

        const currentCurtain = card.querySelector('.member-reveal-curtain');
        if (!isHovered && currentCurtain) {
          card.classList.add('touch-active');
          currentCurtain.style.opacity = '1';
          currentCurtain.style.visibility = 'visible';
          currentCurtain.style.transform = 'translateY(0)';
        }
      }
    });
  });
});










document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger CDN is missing.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ===================================================
     1. CIRCLE GEOMETRY CONSTANTS
     Circumference C = 2 * PI * r = 2 * 3.14159 * 70 ≈ 439.82
     Formula: offset = C - (percent / 100) * C
     =================================================== */
  const CIRCUMFERENCE = 439.82;

  function animateRingAndCounter(card) {
    if (card.dataset.hasAnimated === 'true') return;
    card.dataset.hasAnimated = 'true';

    const percent = parseFloat(card.getAttribute('data-percent')) || 0;
    const targetOffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

    const ringCircle = card.querySelector('.ring-progress-bar');
    const counterEl = card.querySelector('.counter');
    const targetVal = parseFloat(counterEl.getAttribute('data-target')) || percent;
    const isDecimal = counterEl.getAttribute('data-decimal') === '1';

    // 1. Animate SVG Stroke Dashoffset
    gsap.to(ringCircle, {
      strokeDashoffset: targetOffset,
      duration: 2,
      ease: 'power2.out'
    });

    // 2. Animate Numeric Counter concurrently
    const counterObj = { val: 0 };
    gsap.to(counterObj, {
      val: targetVal,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        counterEl.textContent = isDecimal 
          ? counterObj.val.toFixed(1) 
          : Math.floor(counterObj.val);
      },
      onComplete: () => {
        counterEl.textContent = isDecimal ? targetVal.toFixed(1) : targetVal;
      }
    });
  }

  /* ===================================================
     2. SCROLLTRIGGER STAGGER
     =================================================== */
  const ringCards = document.querySelectorAll('.ring-card');

  ScrollTrigger.create({
    trigger: '.benchmark-rings-grid',
    start: 'top 82%',
    once: true,
    onEnter: () => {
      // Stagger card entrance animations
      gsap.from(ringCards, {
        opacity: 0,
        y: 35,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Trigger ring offsets & counters
      ringCards.forEach(card => animateRingAndCounter(card));
    }
  });
});









document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const ctaCard = document.querySelector('.about-cta-card');
  if (ctaCard) {
    const isMobile = window.innerWidth <= 768;

    gsap.from(ctaCard, {
      opacity: 0,
      y: 40,
      scale: 0.97,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#aboutFinalCta',
        start: 'top 82%',
        once: true
      }
    });

    if (!isMobile) {
      gsap.from('.tele-suite-card', {
        opacity: 0,
        x: 35,
        duration: 0.85,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#aboutFinalCta',
          start: 'top 80%',
          once: true
        }
      });
    }
  }
});