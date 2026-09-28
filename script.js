/* ==========================================================================
   100 DAYS OF LOVE - JAVASCRIPT
   Interactive Features, Animated Counters, Canvas Background & Confetti
   ========================================================================== */

// --- CONFIGURABLE DEFAULT NAMES ---
// You can directly change these strings to customize the website!
let HER_NAME = "Rameen Ejaz";
let MY_NAME = "Abdullah Umer";

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. INITIALIZE NAMES & CUSTOMIZER
     -------------------------------------------------------------------------- */
  const herNameInputs = document.querySelectorAll('.herNameDisplay');
  const myNameInputs = document.querySelectorAll('.myNameDisplay');
  const customizeToggle = document.getElementById('customizeToggle');
  const customizeDropdown = document.getElementById('customizeDropdown');
  const herNameInput = document.getElementById('herNameInput');
  const myNameInput = document.getElementById('myNameInput');
  const saveNamesBtn = document.getElementById('saveNamesBtn');

  function updateNamesOnPage(her, my) {
    HER_NAME = her || "Rameen Ejaz";
    MY_NAME = my || "Abdullah Umer";
    
    herNameInputs.forEach(el => el.textContent = HER_NAME);
    myNameInputs.forEach(el => el.textContent = MY_NAME);
  }

  // Toggle customize drawer
  if (customizeToggle && customizeDropdown) {
    customizeToggle.addEventListener('click', () => {
      customizeDropdown.classList.toggle('active');
    });

    saveNamesBtn.addEventListener('click', () => {
      updateNamesOnPage(herNameInput.value.trim(), myNameInput.value.trim());
      customizeDropdown.classList.remove('active');
      triggerConfettiBurst(50);
    });
  }

  // Set initial names
  updateNamesOnPage(HER_NAME, MY_NAME);


  /* --------------------------------------------------------------------------
     2. LIVE 100 COUNTER ANIMATION
     -------------------------------------------------------------------------- */
  const daysCounter = document.getElementById('daysCounter');
  if (daysCounter) {
    const target = 100;
    const duration = 2000; // 2 seconds
    const startTimestamp = performance.now();

    function step(currentTimestamp) {
      const elapsed = currentTimestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutProgress * target);
      
      daysCounter.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        daysCounter.textContent = target;
      }
    }

    // Start counter animation
    requestAnimationFrame(step);
  }


  /* --------------------------------------------------------------------------
     3. BACKGROUND FLOATING HEARTS & SPARKLES CANVAS
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = window.innerWidth < 600 ? 15 : 30;
    const colors = ['#fb6f92', '#ff85a1', '#fbb1bd', '#ffcad4', '#b5e2fa'];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = Math.random() * 14 + 8;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 0.5;
        this.type = Math.random() > 0.3 ? 'heart' : 'sparkle';
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;

        if (this.y < -20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        if (this.type === 'heart') {
          // Draw heart
          ctx.beginPath();
          const topCurveHeight = this.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
          ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
          ctx.fill();
        } else {
          // Draw 4-point sparkle star
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.quadraticCurveTo(0, 0, this.size / 2, 0);
          ctx.quadraticCurveTo(0, 0, 0, this.size / 2);
          ctx.quadraticCurveTo(0, 0, -this.size / 2, 0);
          ctx.quadraticCurveTo(0, 0, 0, -this.size / 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animateParticles();
    }
  }


  /* --------------------------------------------------------------------------
     4. CURSOR TRAIL OF MINI HEARTS (DESKTOP)
     -------------------------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    let lastTime = 0;
    const heartSymbols = ['💕', '💖', '✨', '🌸', '❤️'];

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < 60) return; // Throttle to 60ms
      lastTime = now;

      const heart = document.createElement('span');
      heart.className = 'cursor-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = e.clientX + 'px';
      heart.style.top = e.clientY + 'px';

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1000);
    });
  }


  /* --------------------------------------------------------------------------
     5. BACKGROUND MUSIC TOGGLE & SYNTH MUSIC FALLBACK
     -------------------------------------------------------------------------- */
  const audioToggle = document.getElementById('audioToggle');
  const bgMusic = document.getElementById('bgMusic');
  let isPlaying = false;
  let synthAudioCtx = null;
  let synthInterval = null;

  // Romantic synthesized chime tune fallback
  function startSyntheticMelody() {
    if (synthAudioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      synthAudioCtx = new AudioContext();
      
      // Gentle romantic notes (frequencies)
      const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 493.88];
      let noteIdx = 0;

      synthInterval = setInterval(() => {
        if (!isPlaying || !synthAudioCtx) return;
        const osc = synthAudioCtx.createOscillator();
        const gain = synthAudioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx], synthAudioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.05, synthAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, synthAudioCtx.currentTime + 1.2);
        
        osc.connect(gain);
        gain.connect(synthAudioCtx.destination);
        
        osc.start();
        osc.stop(synthAudioCtx.currentTime + 1.2);

        noteIdx = (noteIdx + 1) % notes.length;
      }, 600);
    } catch (e) {
      console.log('Audio synth not supported');
    }
  }

  function stopSyntheticMelody() {
    if (synthInterval) clearInterval(synthInterval);
    if (synthAudioCtx) {
      synthAudioCtx.close();
      synthAudioCtx = null;
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      isPlaying = !isPlaying;

      if (isPlaying) {
        audioToggle.classList.remove('muted');
        // Try audio file first
        if (bgMusic && bgMusic.getAttribute('src')) {
          bgMusic.play().catch(() => startSyntheticMelody());
        } else {
          startSyntheticMelody();
        }
      } else {
        audioToggle.classList.add('muted');
        if (bgMusic) bgMusic.pause();
        stopSyntheticMelody();
      }
    });

    // Default muted state
    audioToggle.classList.add('muted');
  }


  /* --------------------------------------------------------------------------
     6. FLIP CARDS & CHEEK PINCH ANIMATION
     -------------------------------------------------------------------------- */
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });

    // Touch / Click toggle fallback
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // Cheek Pinch Interactive Card
  const cheekCard = document.getElementById('cheekCard');
  if (cheekCard) {
    cheekCard.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      cheekCard.classList.add('pinched');
      
      // Floating blush hearts
      for (let i = 0; i < 4; i++) {
        const p = document.createElement('span');
        p.className = 'cursor-heart';
        p.textContent = '🍑';
        p.style.left = (e.clientX || (window.innerWidth / 2)) + (Math.random() * 40 - 20) + 'px';
        p.style.top = (e.clientY || (window.innerHeight / 2)) + (Math.random() * 40 - 20) + 'px';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
      }

      setTimeout(() => cheekCard.classList.remove('pinched'), 400);
    });
  }


  /* --------------------------------------------------------------------------
     7. TORTOISE CRAWL ANIMATION ON SCROLL
     -------------------------------------------------------------------------- */
  const tortoiseRunner = document.getElementById('tortoiseRunner');
  const tortoiseSection = document.getElementById('tortoiseSection');
  let tortoiseCrawled = false;

  if (tortoiseSection && tortoiseRunner) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !tortoiseCrawled) {
          tortoiseCrawled = true;
          let progress = 0;
          const duration = 4500; // 4.5 seconds crawl
          const startTime = performance.now();

          function animateTortoise(now) {
            const elapsed = now - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            // Move tortoise from 2% to 82% across track
            const currentPos = 2 + (progress * 80);
            tortoiseRunner.style.left = currentPos + '%';

            if (progress < 1) {
              requestAnimationFrame(animateTortoise);
            } else {
              // Finish heart burst
              tortoiseRunner.innerHTML = '🐢💖';
            }
          }

          requestAnimationFrame(animateTortoise);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(tortoiseSection);
  }


  /* --------------------------------------------------------------------------
     8. HARVARD ACHIEVEMENT CONFETTI BURST
     -------------------------------------------------------------------------- */
  const harvardCard = document.getElementById('harvardCard');
  let harvardTriggered = false;

  if (harvardCard) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !harvardTriggered) {
          harvardTriggered = true;
          triggerConfettiBurst(80);
        }
      });
    }, { threshold: 0.6 });

    observer.observe(harvardCard);
  }


  /* --------------------------------------------------------------------------
     9. GENERAL SCROLL FADE-IN ANIMATIONS
     -------------------------------------------------------------------------- */
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => fadeObserver.observe(el));


  /* --------------------------------------------------------------------------
     10. POLAROID LIGHTBOX GALLERY
     -------------------------------------------------------------------------- */
  const polaroids = document.querySelectorAll('.polaroid-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-caption');
      if (img && lightboxModal) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
      }
    });
  }


  /* --------------------------------------------------------------------------
     11. SURPRISE BUTTON & MODAL
     -------------------------------------------------------------------------- */
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const modalClose = document.getElementById('modalClose');
  const modalOkBtn = document.getElementById('modalOkBtn');

  if (surpriseBtn && surpriseModal) {
    surpriseBtn.addEventListener('click', () => {
      surpriseModal.classList.add('active');
      surpriseModal.setAttribute('aria-hidden', 'false');
      triggerConfettiBurst(120);
    });

    const closeModal = () => {
      surpriseModal.classList.remove('active');
      surpriseModal.setAttribute('aria-hidden', 'true');
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', () => {
      closeModal();
      triggerConfettiBurst(60);
    });

    surpriseModal.addEventListener('click', (e) => {
      if (e.target === surpriseModal) closeModal();
    });
  }


  /* --------------------------------------------------------------------------
     12. CONFETTI BURST UTILITY
     -------------------------------------------------------------------------- */
  function triggerConfettiBurst(count = 70) {
    // If canvas-confetti library is loaded
    if (typeof confetti === 'function') {
      confetti({
        particleCount: count,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fb6f92', '#ff4d6d', '#ffb703', '#ffd1dc', '#ffffff']
      });
    } else {
      // Custom fallback burst using DOM elements
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'cursor-heart';
        p.textContent = ['💖', '🎉', '✨', '💐', '🎓'][Math.floor(Math.random() * 5)];
        p.style.left = (window.innerWidth / 2 + (Math.random() * 200 - 100)) + 'px';
        p.style.top = (window.innerHeight / 2 + (Math.random() * 200 - 100)) + 'px';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    }
  }

});
