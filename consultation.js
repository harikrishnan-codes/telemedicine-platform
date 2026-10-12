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

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');

      // Close all other dropdowns
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

    // Option Click Handler
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.querySelector('span')?.textContent || option.textContent;

        if (hiddenInput) hiddenInput.value = value;
        if (selectedText) selectedText.textContent = text;
        dropdown.setAttribute('data-value', value);

        options.forEach(opt => {
          opt.classList.remove('active');
          opt.setAttribute('aria-selected', 'false');
        });
        option.classList.add('active');
        option.setAttribute('aria-selected', 'true');

        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');

        // Dynamic Right-Stage Tele-Suite Sync
        if (dropdown.id === 'consultDeptDropdown') {
          syncConsultStage(value);
        }
      });
    });
  });

  // Click outside to close dropdowns
  document.addEventListener('click', () => {
    customDropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
      dropdown.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ===================================================
     2. DYNAMIC STAGE TELE-SUITE SYNCHRONIZATION
     =================================================== */
  const stageData = {
    cardiology: {
      suite: 'TELE-SUITE #CRD-01 READY',
      docName: 'Dr. Sarah Jenkins, MD',
      docDept: 'Cardiovascular ICU Chief • Harvard Fellow',
      telemetry: 'Signal: 1,000 Hz • Lead II ECG',
      img: './assets/img 1.webp'
    },
    dental: {
      suite: 'TELE-SUITE #DNT-02 READY',
      docName: 'Dr. Marcus Sterling, DDS',
      docDept: 'Chief of Oral & Maxillofacial Surgery',
      telemetry: 'Stream: 4K Macro Intraoral Scan',
      img: './assets/img 2.webp'
    },
    pediatrics: {
      suite: 'TELE-SUITE #PED-03 READY',
      docName: 'Dr. Elena Rostova, MD',
      docDept: 'Pediatric Fellow • Harvard Child Health',
      telemetry: 'Vitals: Infant Respiratory & SPO2',
      img: './assets/img 3.webp'
    },
    dermatology: {
      suite: 'TELE-SUITE #DRM-04 READY',
      docName: 'Dr. Aris Thorne, MD',
      docDept: 'Director of Advanced Teledermatology',
      telemetry: 'Analysis: Dual-Spectrum Dermoscopy',
      img: './assets/img 12.webp'
    },
    general: {
      suite: 'TELE-SUITE #EMG-05 READY',
      docName: 'Dr. Sarah Jenkins, MD',
      docDept: 'Emergency Triage Director',
      telemetry: 'Acuity: Priority Level 1 Triage',
      img: './assets/img 1.webp'
    }
  };

  function syncConsultStage(deptKey) {
    const data = stageData[deptKey];
    if (!data) return;

    const docImg = document.getElementById('consultDocImg');
    const suiteId = document.getElementById('stageSuiteId');
    const docName = document.getElementById('stageDocName');
    const docDept = document.getElementById('stageDocDept');
    const telemetryRate = document.getElementById('hudTelemetryRate');

    if (docImg) {
      docImg.style.opacity = '0.3';
      setTimeout(() => {
        docImg.src = data.img;
        docImg.style.opacity = '1';
      }, 150);
    }

    if (suiteId) suiteId.textContent = data.suite;
    if (docName) docName.textContent = data.docName;
    if (docDept) docDept.textContent = data.docDept;
    if (telemetryRate) telemetryRate.textContent = data.telemetry;
  }

  /* ===================================================
     3. INTAKE MODALITY TOGGLE
     =================================================== */
  const modalityBtns = document.querySelectorAll('.modality-toggle-btn');
  const hudSignalStatus = document.getElementById('hudSignalStatus');

  modalityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      if (hudSignalStatus) {
        if (mode === 'video') hudSignalStatus.textContent = 'WEBRTC FEED: 1080P HD ACTIVE';
        if (mode === 'biosensor') hudSignalStatus.textContent = 'WEARABLE STREAM: BIOSENSOR SYNCED';
        if (mode === 'audio') hudSignalStatus.textContent = 'VOIP STREAM: ENCRYPTED AUDIO LINE';
      }
    });
  });

  /* ===================================================
     4. DIRECT COUNT-UP ANIMATION
     =================================================== */
  function startCounters() {
    const counterElements = document.querySelectorAll('#consultHero .counter');

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
            el.textContent = isDecimal ? targetVal.toFixed(decimals) : targetVal;
          }
        });
      } else {
        el.textContent = rawTarget;
      }
    });
  }

  /* ===================================================
     5. GSAP ENTRANCE TIMELINE
     =================================================== */
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ 
      defaults: { ease: 'power3.out', duration: 0.85 },
      onComplete: () => {
        startCounters();
      }
    });

    heroTl
      .fromTo('.consult-lead-badge', 
        { opacity: 0, y: -15 }, 
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
      )
      .fromTo('.consult-hero-title', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0 }, 
        '-=0.3'
      )
      .fromTo('.consult-hero-lead', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0 }, 
        '-=0.4'
      )
      .fromTo('.consult-intake-card', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0 }, 
        '-=0.3'
      )
      .fromTo('.consult-submit-3d-btn', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, clearProps: 'all' }, 
        '-=0.3'
      )
      .fromTo('.consult-metrics-strip', 
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
      .fromTo('.consult-stage-card', 
        { opacity: 0, scale: 0.94, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1 }, 
        '-=0.8'
      );
  } else {
    startCounters();
  }

  /* ===================================================
     6. 3D CARD PARALLAX TILT (Desktop Only > 768px)
     =================================================== */
  const heroStage = document.querySelector('.consult-hero-stage');
  const stageCard = document.getElementById('consultStageCard');

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
  /* ===================================================
     1. HARDWARE TOGGLE CONTROLS (MIC, CAM, SHARING)
     =================================================== */
  const toggleMicBtn = document.getElementById('toggleMicBtn');
  const toggleCamBtn = document.getElementById('toggleCamBtn');
  const shareScreenBtn = document.getElementById('shareScreenBtn');
  const attachFileBtn = document.getElementById('attachFileBtn');

  function setupToggle(btn, activeIcon, inactiveIcon) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (icon && activeIcon && inactiveIcon) {
        if (btn.classList.contains('active')) {
          icon.className = activeIcon;
        } else {
          icon.className = inactiveIcon;
        }
      }
    });
  }

  setupToggle(toggleMicBtn, 'fa-solid fa-microphone', 'fa-solid fa-microphone-slash');
  setupToggle(toggleCamBtn, 'fa-solid fa-video', 'fa-solid fa-video-slash');
  setupToggle(shareScreenBtn, 'fa-solid fa-wave-square', 'fa-solid fa-wave-square');
  setupToggle(attachFileBtn, 'fa-solid fa-paperclip', 'fa-solid fa-paperclip');

  /* ===================================================
     2. GSAP SCROLLTRIGGER ENTRANCE
     =================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.workspace-cockpit-frame', {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'all', // Clears inline styling locks so buttons stay 100% interactive
      scrollTrigger: {
        trigger: '#consultWorkspace',
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

  // Staggered Entrance for Bento Grid Panels
  gsap.from('.timeline-stages-card', {
    opacity: 0,
    y: 35,
    duration: 0.85,
    ease: 'power3.out',
    clearProps: 'all', // Clears inline styling locks so buttons stay 100% interactive
    scrollTrigger: {
      trigger: '#diagnosticHub',
      start: 'top 80%',
      once: true
    }
  });

  gsap.from('.timeline-telemetry-card', {
    opacity: 0,
    y: 45,
    duration: 0.85,
    delay: 0.15,
    ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: {
      trigger: '#diagnosticHub',
      start: 'top 80%',
      once: true
    }
  });
});










document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. SPECIALTY DOCTOR DATABASE MAPPING
     =================================================== */
  const specialtyRoster = {
    cardio: {
      badge: 'CARDIOVASCULAR ICU',
      name: 'Dr. Sarah Jenkins, MD',
      dept: 'Chief of Cardiovascular Intensive Care',
      wait: '< 35 Seconds',
      protocol: 'Lead II ECG Telemetry',
      img: './assets/img 1.webp'
    },
    derma: {
      badge: 'ADVANCED TELEDERMATOLOGY',
      name: 'Dr. Aris Thorne, MD',
      dept: 'Director of Dermal Pathology Lab',
      wait: '< 25 Seconds',
      protocol: 'Dual-Spectrum Dermoscopy',
      img: './assets/img 12.webp'
    },
    dental: {
      badge: 'ORAL & MAXILLOFACIAL',
      name: 'Dr. Marcus Sterling, DDS',
      dept: 'Chief of Emergency Dental Telemedicine',
      wait: '< 20 Seconds',
      protocol: '4K Macro Intraoral Scan',
      img: './assets/img 2.webp'
    },
    peds: {
      badge: 'PEDIATRIC CRITICAL CARE',
      name: 'Dr. Elena Rostova, MD',
      dept: 'Pediatric Fellow • Harvard Child Health',
      wait: '< 45 Seconds',
      protocol: 'Infant Respiratory & SPO2',
      img: './assets/img 3.webp'
    }
  };

  /* ===================================================
     2. DYNAMIC SYMPTOM TAG CLICK HANDLER
     =================================================== */
  const symptomChips = document.querySelectorAll('.symptom-tag-chip');
  const matchedBadge = document.getElementById('matchedSpecialtyBadge');
  const matchedDocName = document.getElementById('matchedDocName');
  const matchedDocDept = document.getElementById('matchedDocDept');
  const matchedWaitTime = document.getElementById('matchedWaitTime');
  const matchedProtocol = document.getElementById('matchedProtocolId');
  const matchedDocImg = document.getElementById('matchedDoctorImg');

  symptomChips.forEach(chip => {
    chip.addEventListener('click', () => {
      symptomChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const specialtyKey = chip.getAttribute('data-specialty');
      const data = specialtyRoster[specialtyKey];

      if (data) {
        if (matchedDocImg) {
          matchedDocImg.style.opacity = '0.3';
          setTimeout(() => {
            matchedDocImg.src = data.img;
            matchedDocImg.style.opacity = '1';
          }, 150);
        }

        if (matchedBadge) matchedBadge.textContent = data.badge;
        if (matchedDocName) matchedDocName.textContent = data.name;
        if (matchedDocDept) matchedDocDept.textContent = data.dept;
        if (matchedWaitTime) matchedWaitTime.textContent = data.wait;
        if (matchedProtocol) matchedProtocol.textContent = data.protocol;
      }
    });
  });

  /* ===================================================
     3. ACUITY SLIDER SEVERITY UPDATE
     =================================================== */
  const acuitySlider = document.getElementById('acuitySlider');
  const acuityBadge = document.getElementById('acuityLevelBadge');

  const acuityLevels = {
    1: 'LEVEL 1 // ROUTINE CHECK',
    2: 'LEVEL 2 // MODERATE',
    3: 'LEVEL 3 // HIGH ACUITY',
    4: 'LEVEL 4 // CRITICAL IMMEDIATE'
  };

  if (acuitySlider && acuityBadge) {
    acuitySlider.addEventListener('input', (e) => {
      const val = e.target.value;
      acuityBadge.textContent = acuityLevels[val] || 'LEVEL 2 // MODERATE';
      if (val >= 3) {
        acuityBadge.style.backgroundColor = '#fee2e2';
        acuityBadge.style.color = 'var(--danger, #e63946)';
      } else {
        acuityBadge.style.backgroundColor = 'var(--primary-light)';
        acuityBadge.style.color = 'var(--primary)';
      }
    });
  }

  /* ===================================================
     4. GSAP SCROLLTRIGGER ENTRANCE
     =================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.router-matrix-card', {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'all', // Clears inline styling locks so buttons stay 100% interactive
      scrollTrigger: {
        trigger: '#symptomRouter',
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

  const pricingCards = document.querySelectorAll('.pricing-tier-card');

  if (pricingCards.length) {
    gsap.from(pricingCards, {
      opacity: 0,
      y: 40,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'all', // Clears inline styling locks so buttons stay 100% interactive
      scrollTrigger: {
        trigger: '#consultationTiers',
        start: 'top 80%',
        once: true
      }
    });

    gsap.from('.insurance-clearing-bar', {
      opacity: 0,
      y: 20,
      duration: 0.65,
      delay: 0.35,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#consultationTiers',
        start: 'top 75%',
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

  const ctaCard = document.querySelector('.consult-cta-shell');
  if (ctaCard) {
    const isMobile = window.innerWidth <= 768;

    gsap.from(ctaCard, {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'all', // Clears inline styling locks so buttons stay 100% interactive
      scrollTrigger: {
        trigger: '#consultationFinalCta',
        start: 'top 82%',
        once: true
      }
    });

    if (!isMobile) {
      gsap.from('.tele-suite-room-card', {
        opacity: 0,
        x: 35,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '#consultationFinalCta',
          start: 'top 80%',
          once: true
        }
      });
    }
  }
});