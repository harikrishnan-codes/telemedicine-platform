document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. CUSTOM DROPDOWN ENGINE (NO NATIVE SELECT)
     =================================================== */
  const customDropdowns = document.querySelectorAll('.custom-dropdown');

  customDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const selectedText = dropdown.querySelector('.selected-text');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const options = dropdown.querySelectorAll('.dropdown-option');

    // Toggle dropdown open/close
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');

      // Close all other open dropdowns first
      customDropdowns.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('open');
          d.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Handle Option Click
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.querySelector('span')?.textContent || option.textContent;

        // Update hidden input and trigger display text
        if (hiddenInput) hiddenInput.value = value;
        if (selectedText) selectedText.textContent = text;
        dropdown.setAttribute('data-value', value);

        // Update active class state
        options.forEach(opt => {
          opt.classList.remove('active');
          opt.setAttribute('aria-selected', 'false');
        });
        option.classList.add('active');
        option.setAttribute('aria-selected', 'true');

        // Close dropdown menu
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');

        // Feedback bounce
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(trigger, { scale: 0.98 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
        }
      });
    });
  });

  // Click outside to auto-close all dropdowns
  document.addEventListener('click', () => {
    customDropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
      dropdown.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      customDropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
        dropdown.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ===================================================
     2. DIRECT 60FPS COUNT-UP ENGINE
     =================================================== */
  function startCounters() {
    const counterElements = document.querySelectorAll('.counter');

    counterElements.forEach((el) => {
      const rawTarget = el.getAttribute('data-target') || '0';
      const targetVal = parseFloat(rawTarget);
      const isDecimal = rawTarget.includes('.') || el.getAttribute('data-decimal') === '1';
      const decimals = isDecimal ? (rawTarget.split('.')[1]?.length || 1) : 0;

      const counterTracker = { val: 0 };

      if (typeof gsap !== 'undefined') {
        gsap.to(counterTracker, {
          val: targetVal,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = isDecimal 
              ? counterTracker.val.toFixed(decimals) 
              : Math.floor(counterTracker.val);
          },
          onComplete: () => {
            el.textContent = isDecimal 
              ? targetVal.toFixed(decimals) 
              : targetVal;
          }
        });
      } else {
        el.textContent = rawTarget;
      }
    });
  }

  /* ===================================================
     3. HERO ENTRANCE TIMELINE
     =================================================== */
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ 
      defaults: { ease: 'power3.out', duration: 0.85 },
      onComplete: () => {
        startCounters();
      }
    });

    heroTl
      .fromTo('.doctors-badge', 
        { opacity: 0, y: -15 }, 
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
      )
      .fromTo('.doctors-hero-title', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0 }, 
        '-=0.3'
      )
      .fromTo('.doctors-hero-lead', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0 }, 
        '-=0.4'
      )
      .fromTo('.doc-search-console', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0 }, 
        '-=0.3'
      )
      .fromTo('.doc-search-btn', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, clearProps: 'all' }, 
        '-=0.3'
      )
      .fromTo('.doctors-metrics-strip', 
        { opacity: 0, y: 15 }, 
        { 
          opacity: 1, 
          y: 0, 
          onStart: () => {
            startCounters();
          }
        }, 
        '-=0.3'
      )
      .fromTo('.doctor-stage-card', 
        { opacity: 0, scale: 0.94, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1 }, 
        '-=0.8'
      );
  } else {
    startCounters();
  }

  /* ===================================================
     4. 3D CARD PARALLAX TILT (Desktop Only > 768px)
     =================================================== */
  const heroStage = document.querySelector('.doctors-hero-stage');
  const stageCard = document.getElementById('doctorStageCard');

  if (heroStage && stageCard && window.innerWidth > 768 && typeof gsap !== 'undefined') {
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
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const facultyCards = document.querySelectorAll('.faculty-offset-card');
  const isMobile = window.innerWidth <= 768;

  if (facultyCards.length) {
    gsap.from(facultyCards, {
      opacity: 0,
      y: isMobile ? 35 : 50,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'all', // Clears all inline opacity/transform locks
      scrollTrigger: {
        trigger: '.offset-cards-grid',
        start: 'top 82%',
        once: true
      }
    });
  }
});









document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('telemetryCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  // Responsive Canvas Resize
  function resizeCanvas() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    initParticles();
  }

  // Particle Node Blueprint
  class NodeParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1.2;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.35 ? '#0e8388' : '#f4a261'; // Teal / Amber mix
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wall Bounce
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse Proximity Repulsion / Interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const dirX = dx / distance;
          const dirY = dy / distance;
          this.x -= dirX * force * 3;
          this.y -= dirY * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const particleDensity = window.innerWidth <= 768 ? 40 : 85;
    for (let i = 0; i < particleDensity; i++) {
      particles.push(new NodeParticle());
    }
  }

  // Draw connecting plexus lines
  function connectNodes() {
    const maxDistance = window.innerWidth <= 768 ? 85 : 125;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.25;
          ctx.strokeStyle = `rgba(14, 131, 136, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop (60 FPS)
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connectNodes();
    requestAnimationFrame(animate);
  }

  // Mouse Move Event Listener
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();

  /* ===================================================
     GSAP COUNTER & ENTRANCE TIMELINE
     =================================================== */
  function startCounters() {
    const counters = document.querySelectorAll('#networkSection .counter');
    counters.forEach(el => {
      const rawTarget = el.getAttribute('data-target') || '0';
      const targetVal = parseFloat(rawTarget);
      const isDecimal = rawTarget.includes('.') || el.getAttribute('data-decimal') === '2';
      const decimals = isDecimal ? 2 : 0;

      const tracker = { val: 0 };
      if (typeof gsap !== 'undefined') {
        gsap.to(tracker, {
          val: targetVal,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = isDecimal ? tracker.val.toFixed(decimals) : Math.floor(tracker.val);
          },
          onComplete: () => {
            el.textContent = isDecimal ? targetVal.toFixed(decimals) : targetVal;
          }
        });
      } else {
        el.textContent = rawTarget;
      }
    });
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.network-glass-console', {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#networkSection',
        start: 'top 80%',
        once: true,
        onEnter: () => startCounters()
      }
    });
  } else {
    startCounters();
  }
});









document.addEventListener('DOMContentLoaded', () => {
  const modalityCards = document.querySelectorAll('.modality-card');
  const datePills = document.querySelectorAll('.date-pill');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');

  const summaryModeText = document.getElementById('summaryModeText');
  const summaryDateText = document.getElementById('summaryDateText');
  const summaryTimeText = document.getElementById('summaryTimeText');

  /* ===================================================
     1. MODALITY SWITCHER
     =================================================== */
  modalityCards.forEach(card => {
    card.addEventListener('click', () => {
      modalityCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const mode = card.getAttribute('data-mode');
      if (summaryModeText) {
        summaryModeText.textContent = mode === 'video' 
          ? 'HD Video Tele-Suite' 
          : 'Live Biosensor Sync';
      }
    });
  });

  /* ===================================================
     2. DATE SELECTOR
     =================================================== */
  datePills.forEach(pill => {
    pill.addEventListener('click', () => {
      datePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const dateLabel = pill.getAttribute('data-date');
      const numLabel = pill.querySelector('.pill-num')?.textContent || '';
      if (summaryDateText) {
        summaryDateText.textContent = `${dateLabel} (${numLabel} 2026)`;
      }
    });
  });

  /* ===================================================
     3. TIME SLOT SELECTOR
     =================================================== */
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const timeLabel = btn.getAttribute('data-time');
      if (summaryTimeText) {
        summaryTimeText.textContent = timeLabel;
      }
    });
  });

  /* ===================================================
     4. GSAP ENTRANCE ANIMATION
     =================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.booking-wizard-card', {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'all', // Ensures 3D button styling stays unlocked
      scrollTrigger: {
        trigger: '#bookingWizard',
        start: 'top 80%',
        once: true
      }
    });
  }
});









document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth <= 768;

  // Staggered Entrance for Left & Right Halves
  gsap.from('.split-pane-left .pane-content-wrapper', {
    opacity: 0,
    x: isMobile ? 0 : -40,
    y: isMobile ? 30 : 0,
    duration: 0.85,
    ease: 'power3.out',
    clearProps: 'all', // Clears opacity locks so buttons stay fully interactive
    scrollTrigger: {
      trigger: '#dualSplitSection',
      start: 'top 78%',
      once: true
    }
  });

  gsap.from('.split-pane-right .pane-content-wrapper', {
    opacity: 0,
    x: isMobile ? 0 : 40,
    y: isMobile ? 30 : 0,
    duration: 0.85,
    delay: isMobile ? 0 : 0.2,
    ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: {
      trigger: '#dualSplitSection',
      start: 'top 78%',
      once: true
    }
  });
});








document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('snapGalleryTrack');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const dots = document.querySelectorAll('.snap-dot');
  const slides = document.querySelectorAll('.snap-slide-card');

  if (!track || !slides.length) return;

  /* ===================================================
     1. ARROW BUTTON NAVIGATION (NEXT / PREVIOUS)
     =================================================== */
  function scrollToIndex(index) {
    if (index < 0 || index >= slides.length) return;
    slides[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const activeIdx = getCurrentIndex();
      const nextIdx = (activeIdx + 1) % slides.length;
      scrollToIndex(nextIdx);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const activeIdx = getCurrentIndex();
      const prevIdx = (activeIdx - 1 + slides.length) % slides.length;
      scrollToIndex(prevIdx);
    });
  }

  /* ===================================================
     2. SNAP POSITION CALCULATOR
     =================================================== */
  function getCurrentIndex() {
    const trackCenter = track.getBoundingClientRect().left + track.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    slides.forEach((slide, idx) => {
      const slideCenter = slide.getBoundingClientRect().left + slide.offsetWidth / 2;
      const distance = Math.abs(trackCenter - slideCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    return closestIndex;
  }

  /* ===================================================
     3. SYNC PROGRESS DOTS ON SCROLL
     =================================================== */
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const currentIdx = getCurrentIndex();
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIdx);
      });
    }, 60);
  });

  // Dot Click Jump
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      scrollToIndex(targetIndex);
    });
  });

  /* ===================================================
     4. GSAP SCROLLTRIGGER ENTRANCE
     =================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.gallery-title-group', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#suiteTour',
        start: 'top 82%',
        once: true
      }
    });

    gsap.from('.snap-slide-card', {
      opacity: 0,
      y: 40,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'all', // Clears opacity locks so buttons stay fully interactive
      scrollTrigger: {
        trigger: '#snapGalleryTrack',
        start: 'top 80%',
        once: true
      }
    });
  }
});








document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const ctaCard = document.querySelector('.cta-command-shell');
  if (ctaCard) {
    const isMobile = window.innerWidth <= 768;

    gsap.from(ctaCard, {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'all', // Clears opacity locks so 3D buttons stay fully interactive
      scrollTrigger: {
        trigger: '#doctorsFinalCta',
        start: 'top 82%',
        once: true
      }
    });

    if (!isMobile) {
      gsap.from('.live-telemetry-hud-card', {
        opacity: 0,
        x: 35,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '#doctorsFinalCta',
          start: 'top 80%',
          once: true
        }
      });
    }
  }
});