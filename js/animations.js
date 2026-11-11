/**
 * DeviX Academy - Animations, Hero Neural Canvas, Smooth Scroll & Number Counters
 */

(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * 1. Lenis Smooth Scrolling (disabled automatically when reduced-motion is preferred)
   */
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof window.Lenis !== "function") return;
    const lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4
    });

    window.devixLenis = lenis;

    if (window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap?.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      window.gsap?.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /**
   * 2. Lightweight Interactive Neural Particle Network in Hero Canvas
   */
  function initHeroNeuralCanvas() {
    const canvas = document.getElementById("hero-particles");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = null;
    let isHeroVisible = true;
    const pointer = { x: null, y: null };

    const particleCount = window.innerWidth < 768 ? 28 : 54;
    const maxDist = window.innerWidth < 768 ? 110 : 145;
    const particles = [];

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    }

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 1.8 + 1.1,
          color: i % 2 === 0 ? "rgba(139, 92, 246, 0.72)" : "rgba(34, 211, 238, 0.72)"
        });
      }
    }

    function drawFrame() {
      if (!isHeroVisible || document.hidden) {
        animationId = requestAnimationFrame(drawFrame);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gentle mouse attraction/repulsion glow
        if (pointer.x !== null && pointer.y !== null) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dist / 140) * 0.35})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawFrame);
    }

    const heroEl = canvas.closest(".hero-section");
    if (heroEl) {
      heroEl.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      });
      heroEl.addEventListener("mouseleave", () => {
        pointer.x = null;
        pointer.y = null;
      });

      const visObserver = new IntersectionObserver(
        (entries) => {
          isHeroVisible = entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      );
      visObserver.observe(heroEl);
    }

    window.addEventListener("resize", resize);
    resize();
    createParticles();
    if (!animationId) drawFrame();
  }

  /**
   * 3. Animated Number Counters triggered on viewport entry
   */
  function initCounters() {
    const counters = document.querySelectorAll(".counter-value[data-target]");
    if (!counters.length) return;

    const animateCounter = (el) => {
      if (el.dataset.counted === "true") return;
      el.dataset.counted = "true";

      const target = parseInt(el.dataset.target || "0", 10);
      const suffix = el.dataset.suffix || "";

      if (prefersReducedMotion || target <= 0) {
        el.textContent = `${target}${suffix}`;
        return;
      }

      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = `${current}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /**
   * 4. GSAP + ScrollTrigger Entrance & Subtle Parallax Reveals
   */
  function initGSAPMotion() {
    if (prefersReducedMotion || !window.gsap) return;

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    // Hero text staggered entrance (runs immediately, crisp and fast)
    const heroReveals = document.querySelectorAll(".hero-reveal");
    if (heroReveals.length) {
      window.gsap.from(heroReveals, {
        y: 26,
        opacity: 0,
        duration: 0.72,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform,opacity"
      });
    }

    // Subtle scroll-triggered section header reveals
    if (window.ScrollTrigger) {
      document.querySelectorAll(".reveal-up").forEach((el) => {
        window.gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            once: true
          },
          y: 24,
          opacity: 0,
          duration: 0.62,
          ease: "power2.out",
          clearProps: "transform,opacity"
        });
      });

      setTimeout(() => {
        try {
          window.ScrollTrigger.refresh();
        } catch (_) {}
      }, 450);

      // Subtle parallax float on hero visual frame
      const heroVisual = document.querySelector(".hero-main-frame");
      if (heroVisual && window.innerWidth >= 992) {
        window.gsap.to(heroVisual, {
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
          },
          y: 34,
          ease: "none"
        });
      }
    }
  }

  /**
   * 5. Optional AOS initialization where marked
   */
  function initAOS() {
    if (window.AOS) {
      window.AOS.init({
        duration: 650,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
        disable: () => prefersReducedMotion
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initHeroNeuralCanvas();
    initCounters();
    initGSAPMotion();
    initAOS();
  });
})();
