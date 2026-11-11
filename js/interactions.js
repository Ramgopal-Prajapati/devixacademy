/**
 * DeviX Academy - Interactive Components
 *   1. Draggable Image Collage (Drag, Scatter, Reset, Double-Click Restore)
 *   2. Interactive Industry Solutions Switcher
 *   3. Five-Step Methodology Interactive Timeline (Desktop & Scroll-Sync)
 *   4. Masonry Events Gallery + Category Filter + Accessible Lightbox
 */

(function () {
  "use strict";

  const { resolvePath, escapeHTML, openProgramModal, jumpToEnquiryWithProgram } =
    window.DEVIX_UTILS || {};

  /* ========================================================================
     1. INTERACTIVE DRAGGABLE IMAGE COLLAGE
     ======================================================================== */
  function initDraggableCollage() {
    const stage = document.getElementById("collage-stage");
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll(".collage-card"));
    if (!cards.length) return;

    let topZ = 10;

    // Default percentage layout relative to stage width/height for responsive placement
    const defaultLayout = [
      { leftPct: 6, topPct: 7, rotate: -5 },
      { leftPct: 48, topPct: 5, rotate: 4 },
      { leftPct: 12, topPct: 49, rotate: 3 },
      { leftPct: 51, topPct: 47, rotate: -4 }
    ];

    const applyPosition = (card, leftPx, topPx, rotateDeg, animate = true) => {
      if (window.gsap && animate) {
        window.gsap.to(card, {
          left: leftPx,
          top: topPx,
          rotation: rotateDeg,
          duration: 0.45,
          ease: "power3.out"
        });
      } else {
        card.style.left = `${leftPx}px`;
        card.style.top = `${topPx}px`;
        card.style.transform = `rotate(${rotateDeg}deg)`;
      }
    };

    const resetLayout = (animate = true) => {
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      cards.forEach((card, i) => {
        const preset = defaultLayout[i % defaultLayout.length];
        const cardW = card.offsetWidth || 200;
        const cardH = card.offsetHeight || 180;
        const maxLeft = Math.max(8, stageW - cardW - 10);
        const maxTop = Math.max(8, stageH - cardH - 10);
        const left = Math.min(maxLeft, Math.max(8, (preset.leftPct / 100) * stageW));
        const top = Math.min(maxTop, Math.max(8, (preset.topPct / 100) * stageH));
        card.style.zIndex = String(i + 2);
        applyPosition(card, left, top, preset.rotate, animate);
      });
      topZ = cards.length + 3;
    };

    const scatterLayout = () => {
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      cards.forEach((card) => {
        const cardW = card.offsetWidth || 200;
        const cardH = card.offsetHeight || 180;
        const maxLeft = Math.max(12, stageW - cardW - 12);
        const maxTop = Math.max(12, stageH - cardH - 12);
        const randomLeft = 10 + Math.random() * (maxLeft - 10);
        const randomTop = 10 + Math.random() * (maxTop - 10);
        const randomRotate = (Math.random() - 0.5) * 18;
        card.style.zIndex = String(++topZ);
        applyPosition(card, randomLeft, randomTop, randomRotate, true);
      });
    };

    // Pointer Events Dragging (works identically on desktop mouse and mobile touch)
    cards.forEach((card) => {
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let origLeft = 0;
      let origTop = 0;

      card.addEventListener("pointerdown", (e) => {
        if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
        dragging = true;
        card.setPointerCapture(e.pointerId);
        card.classList.add("is-dragging");
        card.style.zIndex = String(++topZ);

        startX = e.clientX;
        startY = e.clientY;
        origLeft = parseFloat(card.style.left || card.offsetLeft || 0);
        origTop = parseFloat(card.style.top || card.offsetTop || 0);

        if (window.gsap) {
          window.gsap.killTweensOf(card);
          window.gsap.to(card, { scale: 1.04, rotation: 0, duration: 0.16 });
        }
      });

      card.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const maxLeft = Math.max(0, stage.clientWidth - card.offsetWidth);
        const maxTop = Math.max(0, stage.clientHeight - card.offsetHeight);
        const nextLeft = Math.min(maxLeft, Math.max(0, origLeft + dx));
        const nextTop = Math.min(maxTop, Math.max(0, origTop + dy));

        card.style.left = `${nextLeft}px`;
        card.style.top = `${nextTop}px`;
      });

      const endDrag = (e) => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove("is-dragging");
        try {
          card.releasePointerCapture(e.pointerId);
        } catch (_) {}
        if (window.gsap) {
          const gentleTilt = (Math.random() - 0.5) * 6;
          window.gsap.to(card, { scale: 1, rotation: gentleTilt, duration: 0.24 });
        }
      };

      card.addEventListener("pointerup", endDrag);
      card.addEventListener("pointercancel", endDrag);
    });

    // Double-click anywhere on stage or cards restores layout
    stage.addEventListener("dblclick", () => resetLayout(true));

    document.getElementById("collage-scatter-btn")?.addEventListener("click", scatterLayout);
    document.getElementById("collage-reset-btn")?.addEventListener("click", () => resetLayout(true));

    // Initial placement + responsive recalibration
    resetLayout(false);
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => resetLayout(false), 180);
    });
  }

  /* ========================================================================
     2. INTERACTIVE INDUSTRY SOLUTIONS SWITCHER
     ======================================================================== */
  function initIndustrySolutions() {
    const tabsWrap = document.getElementById("industry-tabs-list");
    const panel = document.getElementById("industry-detail-panel");
    const industries = window.DEVIX_DATA?.industries || [];
    const programs = window.DEVIX_DATA?.programs || [];
    if (!tabsWrap || !panel || !industries.length) return;

    const renderIndustry = (industryId) => {
      const item = industries.find((ind) => ind.id === industryId) || industries[0];
      const recommended = item.recommendedPrograms
        .map((slug) => programs.find((p) => p.slug === slug))
        .filter(Boolean);

      tabsWrap.querySelectorAll(".industry-tab-btn").forEach((btn) => {
        const active = btn.dataset.industryId === item.id;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });

      panel.innerHTML = `
        <div class="panel-enter">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="industry-tab-icon" style="width: 48px; height: 48px; font-size: 1.25rem; background: ${escapeHTML(item.accentColor)}22; border-color: ${escapeHTML(item.accentColor)}66; color: ${escapeHTML(item.accentColor)};">
                <i class="fa-solid ${escapeHTML(item.icon)}" aria-hidden="true"></i>
              </div>
              <div>
                <div class="font-mono-label text-cyan" style="font-size: 0.7rem;">Industry Blueprint</div>
                <h3 class="h3 text-white mb-0">${escapeHTML(item.name)}</h3>
              </div>
            </div>
            <button type="button" class="btn-devix-primary btn-devix-sm js-enquire-industry" data-industry="${escapeHTML(item.name)}">
              Enquire for ${escapeHTML(item.name)} <i class="fa-solid fa-arrow-right btn-arrow" aria-hidden="true"></i>
            </button>
          </div>

          <p class="lead text-white fw-semibold mb-2" style="font-size: 1.08rem;">${escapeHTML(item.tagline)}</p>
          <p class="text-secondary-custom mb-4">${escapeHTML(item.description)}</p>

          <div class="row g-4 align-items-stretch">
            <div class="col-lg-7">
              <div class="font-mono-label text-highlight mb-3" style="font-size: 0.73rem;">Key Technology Use Cases</div>
              <div class="d-grid gap-2">
                ${item.useCases
                  .map(
                    (uc) => `
                  <div class="industry-usecase-item">
                    <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <span>${escapeHTML(uc)}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="col-lg-5">
              <div class="industry-visual-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <span class="font-mono-label text-cyan" style="font-size: 0.7rem;">${escapeHTML(item.visualTitle)}</span>
                    <i class="fa-solid fa-microchip text-highlight" aria-hidden="true"></i>
                  </div>
                  <div class="d-grid gap-2 mb-4">
                    ${item.visualStats
                      .map(
                        (st) => `
                      <div class="p-2 rounded-3" style="background: rgba(21, 29, 53, 0.7); border: 1px solid var(--border-subtle);">
                        <div class="text-secondary-custom" style="font-size: 0.72rem;">${escapeHTML(st.label)}</div>
                        <div class="fw-semibold text-white small">${escapeHTML(st.value)}</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>

                <div>
                  <div class="font-mono-label text-secondary-custom mb-2" style="font-size: 0.68rem;">Recommended DeviX Tracks</div>
                  <div class="d-flex flex-wrap gap-2">
                    ${recommended
                      .map(
                        (p) => `
                      <button type="button" class="industry-program-chip js-industry-open-prog" data-slug="${escapeHTML(p.slug)}">
                        <i class="${escapeHTML(p.icon)}" aria-hidden="true"></i> ${escapeHTML(p.title)}
                      </button>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    tabsWrap.innerHTML = industries
      .map(
        (ind, idx) => `
        <button
          type="button"
          class="industry-tab-btn ${idx === 0 ? "is-active" : ""}"
          role="tab"
          aria-selected="${idx === 0 ? "true" : "false"}"
          data-industry-id="${escapeHTML(ind.id)}"
        >
          <span class="industry-tab-icon"><i class="fa-solid ${escapeHTML(ind.icon)}" aria-hidden="true"></i></span>
          <span>${escapeHTML(ind.name)}</span>
        </button>
      `
      )
      .join("");

    tabsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".industry-tab-btn");
      if (btn) {
        renderIndustry(btn.dataset.industryId);
      }
    });

    panel.addEventListener("click", (e) => {
      const progChip = e.target.closest(".js-industry-open-prog");
      if (progChip && typeof openProgramModal === "function") {
        openProgramModal(progChip.dataset.slug);
        return;
      }
      const enqBtn = e.target.closest(".js-enquire-industry");
      if (enqBtn && typeof jumpToEnquiryWithProgram === "function") {
        jumpToEnquiryWithProgram(
          "Corporate Training",
          "industry-enquiry",
          `We are looking for ${enqBtn.dataset.industry} technology and AI upskilling solutions.`
        );
      }
    });

    renderIndustry(industries[0].id);
  }

  /* ========================================================================
     3. FIVE-STEP METHODOLOGY INTERACTIVE TIMELINE
     ======================================================================== */
  function initMethodologyTimeline() {
    const rail = document.getElementById("methodology-desktop-rail");
    const panel = document.getElementById("methodology-stage-panel");
    const mobileList = document.getElementById("methodology-mobile-list");
    const steps = window.DEVIX_DATA?.methodology || [];
    if (!steps.length) return;

    let activeIndex = 0;

    const activateStep = (idx) => {
      activeIndex = Math.max(0, Math.min(steps.length - 1, idx));
      const step = steps[activeIndex];
      const progressBar = document.getElementById("methodology-track-progress");

      if (progressBar) {
        const pct = (activeIndex / (steps.length - 1)) * 100;
        progressBar.style.width = `${pct}%`;
      }

      if (rail) {
        rail.querySelectorAll(".timeline-step-node").forEach((node, i) => {
          node.classList.toggle("is-active", i === activeIndex);
          node.classList.toggle("is-passed", i < activeIndex);
          node.setAttribute("aria-selected", String(i === activeIndex));
        });
      }

      if (panel) {
        panel.innerHTML = `
          <div class="row g-4 align-items-center panel-enter">
            <div class="col-lg-7">
              <div class="font-mono-label text-cyan mb-2">Stage ${escapeHTML(step.step)} / 05 — ${escapeHTML(step.subtitle)}</div>
              <h3 class="h2 text-white mb-3">${escapeHTML(step.title)}</h3>
              <p class="text-secondary-custom mb-4">${escapeHTML(step.description)}</p>
              <div class="d-flex flex-wrap gap-2">
                <button type="button" class="btn-devix-outline btn-devix-sm js-step-prev" ${activeIndex === 0 ? "disabled" : ""}>
                  <i class="fa-solid fa-arrow-left me-1" aria-hidden="true"></i> Previous Stage
                </button>
                <button type="button" class="btn-devix-primary btn-devix-sm js-step-next">
                  ${activeIndex === steps.length - 1 ? "Start Stage 01 Again" : "Next Stage"}
                  <i class="fa-solid fa-arrow-right ms-1 btn-arrow" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="methodology-schematic">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="why-icon mb-0" style="width: 48px; height: 48px;">
                    <i class="fa-solid ${escapeHTML(step.icon)}" aria-hidden="true"></i>
                  </div>
                  <div>
                    <div class="font-mono-label text-highlight" style="font-size: 0.7rem;">Stage Deliverables</div>
                    <div class="fw-bold text-white">${escapeHTML(step.shortTitle)}</div>
                  </div>
                </div>
                <ul class="list-unstyled m-0 d-grid gap-2">
                  ${step.deliverables
                    .map(
                      (d) => `
                    <li class="p-2 px-3 rounded-3 small d-flex align-items-center gap-2" style="background: rgba(21, 29, 53, 0.72); border: 1px solid var(--border-subtle);">
                      <i class="fa-solid fa-check text-cyan" aria-hidden="true"></i>
                      <span>${escapeHTML(d)}</span>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
        `;
      }
    };

    if (rail) {
      rail.innerHTML = `
        <div class="timeline-track-bg">
          <div class="timeline-track-progress" id="methodology-track-progress"></div>
        </div>
        ${steps
          .map(
            (s, i) => `
          <button
            type="button"
            class="timeline-step-node ${i === 0 ? "is-active" : ""}"
            role="tab"
            aria-selected="${i === 0 ? "true" : "false"}"
            data-step-index="${i}"
          >
            <div class="timeline-step-circle">${escapeHTML(s.step)}</div>
            <div class="timeline-step-title">${escapeHTML(s.title)}</div>
          </button>
        `
          )
          .join("")}
      `;

      rail.addEventListener("click", (e) => {
        const node = e.target.closest(".timeline-step-node");
        if (node) {
          activateStep(parseInt(node.dataset.stepIndex, 10));
        }
      });
    }

    if (panel) {
      panel.addEventListener("click", (e) => {
        if (e.target.closest(".js-step-prev") && activeIndex > 0) {
          activateStep(activeIndex - 1);
        } else if (e.target.closest(".js-step-next")) {
          activateStep(activeIndex === steps.length - 1 ? 0 : activeIndex + 1);
        }
      });
    }

    if (mobileList) {
      mobileList.innerHTML = steps
        .map(
          (s) => `
        <article class="timeline-mobile-card">
          <div class="timeline-mobile-dot">${escapeHTML(s.step)}</div>
          <div class="font-mono-label text-cyan mb-1" style="font-size: 0.7rem;">${escapeHTML(s.subtitle)}</div>
          <h3 class="h5 text-white mb-2">${escapeHTML(s.title)}</h3>
          <p class="text-secondary-custom small mb-2">${escapeHTML(s.description)}</p>
          <div class="d-flex flex-wrap gap-1">
            ${s.deliverables.map((d) => `<span class="topic-chip">${escapeHTML(d)}</span>`).join("")}
          </div>
        </article>
      `
        )
        .join("");
    }

    activateStep(0);

    // Subtle ScrollTrigger activation on desktop first visit
    if (window.ScrollTrigger && rail) {
      let autoPlayed = false;
      window.ScrollTrigger.create({
        trigger: rail,
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (autoPlayed) return;
          autoPlayed = true;
          const progressBar = document.getElementById("methodology-track-progress");
          if (progressBar && activeIndex === 0) {
            progressBar.style.width = "12%";
            setTimeout(() => {
              if (activeIndex === 0 && progressBar) progressBar.style.width = "0%";
            }, 600);
          }
        }
      });
    }
  }

  /* ========================================================================
     4. MASONRY GALLERY + CATEGORY FILTERING + ACCESSIBLE LIGHTBOX
     ======================================================================== */
  function initEventsGallery() {
    const grid = document.getElementById("gallery-masonry");
    const items = window.DEVIX_DATA?.gallery || [];
    if (!grid || !items.length) return;

    let currentFiltered = items;
    let currentIndex = 0;

    const renderGallery = (cat = "all") => {
      currentFiltered = cat === "all" ? items : items.filter((g) => g.category === cat);
      grid.innerHTML = currentFiltered
        .map(
          (g, idx) => `
          <figure class="gallery-item panel-enter" tabindex="0" role="button" aria-label="Open ${escapeHTML(g.title)}" data-gallery-idx="${idx}">
            <div class="gallery-media-box">
              <img src="${resolvePath(g.image)}" alt="${escapeHTML(g.title)}" width="960" height="600" loading="lazy" />
              ${
                g.isVideoShowcase
                  ? `<span class="gallery-play-badge"><i class="fa-solid fa-play" aria-hidden="true"></i> Session Highlight</span>`
                  : ""
              }
            </div>
            <figcaption class="gallery-card-body">
              <span class="font-mono-label text-cyan" style="font-size: 0.68rem;">${escapeHTML(g.categoryLabel)}</span>
              <h3 class="h6 text-white mb-0">${escapeHTML(g.title)}</h3>
              <p class="small text-secondary-custom mb-0">${escapeHTML(g.caption)}</p>
            </figcaption>
          </figure>
        `
        )
        .join("");
    };

    renderGallery("all");

    document.querySelectorAll(".filter-pill-btn[data-gallery-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".filter-pill-btn[data-gallery-filter]")
          .forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderGallery(btn.dataset.galleryFilter);
      });
    });

    const lightbox = document.getElementById("devix-lightbox");
    if (!lightbox) return;

    const lbImg = document.getElementById("lightbox-img");
    const lbTitle = document.getElementById("lightbox-title");
    const lbCaption = document.getElementById("lightbox-caption");
    const lbCat = document.getElementById("lightbox-category");

    const showAt = (idx) => {
      if (!currentFiltered.length) return;
      currentIndex = (idx + currentFiltered.length) % currentFiltered.length;
      const g = currentFiltered[currentIndex];
      lbImg.src = resolvePath(g.image);
      lbImg.alt = g.title;
      lbTitle.textContent = g.title;
      lbCaption.textContent = g.caption;
      lbCat.textContent = g.categoryLabel;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    };

    const closeLb = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    };

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".gallery-item");
      if (card) showAt(parseInt(card.dataset.galleryIdx, 10));
    });
    grid.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const card = e.target.closest(".gallery-item");
        if (card) {
          e.preventDefault();
          showAt(parseInt(card.dataset.galleryIdx, 10));
        }
      }
    });

    document.getElementById("lightbox-close")?.addEventListener("click", closeLb);
    document.getElementById("lightbox-prev")?.addEventListener("click", () => showAt(currentIndex - 1));
    document.getElementById("lightbox-next")?.addEventListener("click", () => showAt(currentIndex + 1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showAt(currentIndex - 1);
      if (e.key === "ArrowRight") showAt(currentIndex + 1);
    });
  }

  /* ========================================================================
     5. INTERACTIVE MAGIC 3D EARTH CIRCLE ("GLOBAL TECH NEXUS")
     ======================================================================== */
  function initMagicEarthGlobe() {
    const stage = document.getElementById("earth-stage");
    const globeWrap = document.getElementById("earth-globe-wrap");
    const canvas = document.getElementById("earth-magic-canvas");
    if (!stage || !globeWrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const shockwave = document.getElementById("earth-shockwave");
    const coordsReadout = document.getElementById("earth-coords-readout");
    const modeReadout = document.getElementById("earth-mode-readout");
    const hubCard = document.getElementById("earth-hub-card");
    const hubRegionEl = document.getElementById("earth-hub-region");
    const hubTitleEl = document.getElementById("earth-hub-title");
    const hubDescEl = document.getElementById("earth-hub-desc");
    const hubChipsEl = document.getElementById("earth-hub-chips");
    const hubCtaEl = document.getElementById("earth-hub-cta");
    const nextHubBtn = document.getElementById("earth-next-hub-btn");
    const pulseBtn = document.getElementById("earth-pulse-btn");
    const modeButtons = Array.from(document.querySelectorAll(".magic-opt-btn[data-magic-mode]"));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DEG2RAD = Math.PI / 180;

    const globalHubs = [
      {
        region: "HUB 01 / 06 • INDIA TECH CORRIDOR",
        lat: 22.7,
        lon: 75.8,
        title: "Generative AI & Python Engineering",
        desc: "AI workflow automation, prompt engineering, and production Python systems taught through live practical build sprints.",
        chips: ["Generative AI", "Python Core", "Prompt Engineering"],
        programSlug: "artificial-intelligence"
      },
      {
        region: "HUB 02 / 06 • US CLOUD & DEVOPS CORRIDOR",
        lat: 37.4,
        lon: -122.1,
        title: "Cloud Computing & Infrastructure Lab",
        desc: "Core cloud architecture, deployment pipelines, hosting environments, and resilient infrastructure labs.",
        chips: ["Cloud Platforms", "Deployment", "Scalable Ops"],
        programSlug: "cloud-computing"
      },
      {
        region: "HUB 03 / 06 • EUROPE CYBER & FINTECH MESH",
        lat: 51.5,
        lon: -0.1,
        title: "Cyber Security & Defense Foundations",
        desc: "Network hardening, web vulnerability awareness, defensive audits, and secure engineering discipline.",
        chips: ["Network Security", "Web Defense", "Risk Hygiene"],
        programSlug: "cyber-security"
      },
      {
        region: "HUB 04 / 06 • SINGAPORE BI & DATA GATEWAY",
        lat: 1.35,
        lon: 103.8,
        title: "Data Analytics & Power BI Intelligence",
        desc: "Transform raw enterprise spreadsheets into executive SQL queries, automated Python reports, and Power BI visuals.",
        chips: ["SQL & Excel", "Power BI", "Business Intelligence"],
        programSlug: "data-analytics"
      },
      {
        region: "HUB 05 / 06 • DUBAI ENTERPRISE AI NODE",
        lat: 25.2,
        lon: 55.3,
        title: "Data Science & Applied Machine Learning",
        desc: "Statistical foundations, predictive modeling workflows, data visualization, and real-world analytical capstones.",
        chips: ["Machine Learning", "Statistics", "Python Analytics"],
        programSlug: "data-science"
      },
      {
        region: "HUB 06 / 06 • TOKYO FULL-STACK CORE",
        lat: 35.7,
        lon: 139.7,
        title: "Full Stack & Modern Web Systems",
        desc: "Responsive UI engineering, RESTful backend APIs, relational databases, and full lifecycle web deployment.",
        chips: ["Frontend UI", "Backend APIs", "Database Deploy"],
        programSlug: "full-stack-development"
      }
    ];

    const modeMeta = {
      network: { label: "MODE: AI NETWORK", className: "" },
      aurora: { label: "MODE: AURORA GLOW", className: "is-aurora" },
      hyperspin: { label: "MODE: HYPER SPIN", className: "is-hyperspin" },
      matrix: { label: "MODE: MATRIX HOLO", className: "is-matrix" }
    };

    // Approximate landmass mask so sphere points unmistakably form Earth continents
    const landBlobs = [
      // North America + Central America + Greenland
      [48, -104, 16, 25],
      [38, -92, 11, 16],
      [60, -118, 9, 22],
      [21, -101, 8, 6],
      [73, -42, 8, 14],
      // South America
      [-6, -60, 12, 13],
      [-18, -58, 12, 10],
      [-35, -66, 12, 6],
      // Europe + UK + Scandinavia
      [50, 14, 9, 17],
      [60, 18, 7, 10],
      [54, -2, 5, 4],
      [41, -4, 4, 5],
      // Africa + Madagascar
      [21, 12, 13, 22],
      [6, 22, 12, 16],
      [-15, 24, 13, 10],
      [-19, 46, 5, 3],
      // Middle East + India + Eurasia + SE Asia + Japan + Indonesia
      [25, 46, 9, 10],
      [21, 78, 10, 7],
      [29, 76, 7, 7],
      [56, 62, 14, 34],
      [58, 108, 13, 28],
      [36, 106, 12, 18],
      [16, 102, 8, 7],
      [36, 139, 5, 4],
      [-1, 114, 6, 14],
      // Australia + NZ
      [-25, 134, 10, 15],
      [-42, 172, 4, 3]
    ];

    function isLandCoordinate(latDeg, lonDeg) {
      for (let i = 0; i < landBlobs.length; i++) {
        const [clat, clon, rLat, rLon] = landBlobs[i];
        let dLon = lonDeg - clon;
        if (dLon > 180) dLon -= 360;
        if (dLon < -180) dLon += 360;
        const dist = (latDeg - clat) * (latDeg - clat) / (rLat * rLat) + (dLon * dLon) / (rLon * rLon);
        if (dist <= 1.0) return true;
      }
      return false;
    }

    // Generate Fibonacci sphere nodes separated into continent land nodes and subtle ocean grid points
    const spherePoints = [];
    const totalSamples = 860;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < totalSamples; i++) {
      const y = 1 - (i / (totalSamples - 1)) * 2;
      const rAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * rAtY;
      const z = Math.sin(theta) * rAtY;

      const latDeg = Math.asin(-y) / DEG2RAD;
      const lonDeg = Math.atan2(x, z) / DEG2RAD;
      const isLand = isLandCoordinate(latDeg, lonDeg);

      if (isLand || i % 7 === 0) {
        spherePoints.push({
          x,
          y,
          z,
          isLand,
          phase: (i * 0.37) % (Math.PI * 2),
          size: isLand ? 1.85 + (i % 3) * 0.45 : 0.9
        });
      }
    }

    // State
    let currentMode = "network";
    let activeHubIdx = 0;
    let camLon = globalHubs[0].lon * DEG2RAD;
    let tiltX = 0.28;
    let targetLon = null;
    let targetTiltX = null;
    let isHovered = false;
    let isDragging = false;
    let pointerX = 0;
    let pointerY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastDragX = 0;
    let lastDragY = 0;
    let dragDist = 0;
    let velLon = 0;
    let velTilt = 0;
    let pulseSparks = [];
    let radialWaves = [];
    let matrixSweep = -1;
    let canvasSize = 328;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId = null;
    let isVisible = true;
    let clock = 0;

    function latLonToUnit(latDeg, lonDeg) {
      const lat = latDeg * DEG2RAD;
      const lon = lonDeg * DEG2RAD;
      return {
        x: Math.cos(lat) * Math.sin(lon),
        y: -Math.sin(lat),
        z: Math.cos(lat) * Math.cos(lon)
      };
    }

    function projectPoint(pt, cLon, cTilt, cx, cy, R) {
      const cosY = Math.cos(cLon);
      const sinY = Math.sin(cLon);
      const x1 = pt.x * cosY - pt.z * sinY;
      const z1 = pt.z * cosY + pt.x * sinY;

      const cosX = Math.cos(cTilt);
      const sinX = Math.sin(cTilt);
      const y2 = pt.y * cosX + z1 * sinX;
      const z2 = z1 * cosX - pt.y * sinX;

      return {
        sx: cx + x1 * R,
        sy: cy + y2 * R,
        z: z2,
        scale: (z2 + 1.55) / 2.55
      };
    }

    function formatCoords(latDeg, lonDeg) {
      const latDir = latDeg >= 0 ? "N" : "S";
      const lonDir = lonDeg >= 0 ? "E" : "W";
      return `LAT ${Math.abs(latDeg).toFixed(1)}° ${latDir} • LON ${Math.abs(lonDeg).toFixed(1)}° ${lonDir}`;
    }

    function updateHubUI(idx, animateCard = true) {
      activeHubIdx = ((idx % globalHubs.length) + globalHubs.length) % globalHubs.length;
      const hub = globalHubs[activeHubIdx];

      if (hubRegionEl) hubRegionEl.textContent = hub.region;
      if (hubTitleEl) hubTitleEl.textContent = hub.title;
      if (hubDescEl) hubDescEl.textContent = hub.desc;
      if (hubChipsEl) {
        hubChipsEl.innerHTML = hub.chips
          .map((chip) => `<span class="topic-chip">${escapeHTML ? escapeHTML(chip) : chip}</span>`)
          .join("");
      }
      if (hubCtaEl) {
        hubCtaEl.dataset.slug = hub.programSlug;
      }
      if (coordsReadout && !isHovered) {
        coordsReadout.textContent = formatCoords(hub.lat, hub.lon);
      }

      if (hubCard && animateCard) {
        hubCard.classList.remove("is-pulsed");
        void hubCard.offsetWidth;
        hubCard.classList.add("is-pulsed");
      }

      targetLon = hub.lon * DEG2RAD;
      targetTiltX = Math.max(-0.55, Math.min(0.65, hub.lat * DEG2RAD * 0.72));
    }

    function triggerShockwaveAndSparks(originX, originY, sparkCount = 28) {
      const cx = canvasSize / 2;
      const cy = canvasSize / 2;
      const sx = typeof originX === "number" ? originX : cx;
      const sy = typeof originY === "number" ? originY : cy;

      if (shockwave) {
        shockwave.classList.remove("is-firing");
        void shockwave.offsetWidth;
        shockwave.classList.add("is-firing");
      }

      radialWaves.push({
        x: sx,
        y: sy,
        r: 6,
        maxR: canvasSize * 0.95,
        alpha: 0.95
      });

      const palette =
        currentMode === "matrix"
          ? ["#10B981", "#34D399", "#22D3EE", "#FFFFFF"]
          : currentMode === "aurora"
          ? ["#34D399", "#22D3EE", "#A78BFA", "#F472B6"]
          : ["#22D3EE", "#8B5CF6", "#A78BFA", "#FFFFFF"];

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.28;
        const speed = 1.6 + Math.random() * 3.8;
        pulseSparks.push({
          x: sx,
          y: sy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.018 + Math.random() * 0.02,
          size: 1.5 + Math.random() * 2.5,
          color: palette[i % palette.length]
        });
      }

      if (reducedMotion) {
        renderFrame(0.016);
      }
    }

    function setMagicMode(mode) {
      if (!modeMeta[mode]) return;
      currentMode = mode;

      stage.classList.remove("is-aurora", "is-hyperspin", "is-matrix");
      if (modeMeta[mode].className) {
        stage.classList.add(modeMeta[mode].className);
      }

      modeButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.magicMode === mode);
      });

      if (modeReadout) {
        modeReadout.textContent = modeMeta[mode].label;
      }

      triggerShockwaveAndSparks(canvasSize / 2, canvasSize / 2, 20);
    }

    function syncCanvasResolution() {
      const rect = globeWrap.getBoundingClientRect();
      const side = Math.max(200, Math.round(rect.width || 320));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasSize = side;
      canvas.width = Math.round(side * dpr);
      canvas.height = Math.round(side * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) renderFrame(0);
    }

    function drawSphereGraticule(cx, cy, R, cLon, cTilt) {
      const isMatrix = currentMode === "matrix";
      const strokeBase = isMatrix
        ? "rgba(16, 185, 129, 0.22)"
        : currentMode === "aurora"
        ? "rgba(52, 211, 153, 0.16)"
        : "rgba(34, 211, 238, 0.14)";

      ctx.save();
      ctx.lineWidth = isMatrix ? 1.1 : 0.85;
      ctx.strokeStyle = strokeBase;

      // Latitude parallels
      const lats = [-55, -25, 0, 25, 55];
      for (let li = 0; li < lats.length; li++) {
        const lat = lats[li];
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 10) {
          const p = projectPoint(latLonToUnit(lat, lon), cLon, cTilt, cx, cy, R);
          if (p.z > -0.05) {
            if (!started) {
              ctx.moveTo(p.sx, p.sy);
              started = true;
            } else {
              ctx.lineTo(p.sx, p.sy);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Longitude meridians
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -85; lat <= 85; lat += 8) {
          const p = projectPoint(latLonToUnit(lat, lon), cLon, cTilt, cx, cy, R);
          if (p.z > -0.05) {
            if (!started) {
              ctx.moveTo(p.sx, p.sy);
              started = true;
            } else {
              ctx.lineTo(p.sx, p.sy);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    function renderFrame(dt) {
      clock += dt;
      const W = canvasSize;
      const H = canvasSize;
      const cx = W / 2;
      const cy = H / 2;
      const R = W * 0.43;

      ctx.clearRect(0, 0, W, H);

      // Update globe rotation & easing
      if (!isDragging && !reducedMotion) {
        if (targetLon !== null) {
          let diffLon = targetLon - camLon;
          while (diffLon > Math.PI) diffLon -= Math.PI * 2;
          while (diffLon < -Math.PI) diffLon += Math.PI * 2;
          camLon += diffLon * 0.075;
          if (Math.abs(diffLon) < 0.015) targetLon = null;
        } else {
          const autoSpeed =
            currentMode === "hyperspin" ? 1.15 : isHovered ? 0.14 : 0.28;
          camLon += autoSpeed * dt + velLon;
        }

        if (targetTiltX !== null) {
          tiltX += (targetTiltX - tiltX) * 0.075;
          if (Math.abs(targetTiltX - tiltX) < 0.01) targetTiltX = null;
        } else {
          tiltX += velTilt;
        }

        velLon *= 0.92;
        velTilt *= 0.92;
        tiltX = Math.max(-0.75, Math.min(0.75, tiltX));
      }

      // Inner globe atmospheric backdrop
      const oceanGrad = ctx.createRadialGradient(
        cx - R * 0.28,
        cy - R * 0.28,
        R * 0.1,
        cx,
        cy,
        R
      );
      if (currentMode === "matrix") {
        oceanGrad.addColorStop(0, "rgba(16, 185, 129, 0.2)");
        oceanGrad.addColorStop(0.55, "rgba(7, 26, 28, 0.7)");
        oceanGrad.addColorStop(1, "rgba(3, 10, 12, 0.94)");
      } else if (currentMode === "aurora") {
        oceanGrad.addColorStop(0, "rgba(52, 211, 153, 0.22)");
        oceanGrad.addColorStop(0.5, "rgba(25, 36, 86, 0.72)");
        oceanGrad.addColorStop(1, "rgba(8, 11, 24, 0.95)");
      } else {
        oceanGrad.addColorStop(0, "rgba(34, 211, 238, 0.2)");
        oceanGrad.addColorStop(0.52, "rgba(21, 31, 68, 0.74)");
        oceanGrad.addColorStop(1, "rgba(6, 9, 22, 0.96)");
      }

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Atmospheric rim highlight
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = isHovered ? 2.2 : 1.4;
      ctx.strokeStyle =
        currentMode === "matrix"
          ? "rgba(16, 185, 129, 0.52)"
          : currentMode === "aurora"
          ? "rgba(52, 211, 153, 0.52)"
          : "rgba(34, 211, 238, 0.45)";
      ctx.stroke();

      // Aurora ribbon aura around upper/lower polar zones
      if (currentMode === "aurora") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();
        const waveShift = Math.sin(clock * 1.4) * R * 0.14;
        const auroraBand = ctx.createLinearGradient(0, cy - R, W, cy + R * 0.2);
        auroraBand.addColorStop(0, "rgba(52, 211, 153, 0.34)");
        auroraBand.addColorStop(0.5, "rgba(34, 211, 238, 0.18)");
        auroraBand.addColorStop(1, "rgba(167, 139, 250, 0.3)");
        ctx.fillStyle = auroraBand;
        ctx.beginPath();
        ctx.ellipse(cx + waveShift, cy - R * 0.65, R * 0.9, R * 0.35, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Wireframe sphere meridians & parallels
      drawSphereGraticule(cx, cy, R, camLon, tiltX);

      // Project landmass + grid sphere points and depth sort back-to-front
      const projected = [];
      for (let i = 0; i < spherePoints.length; i++) {
        const sp = spherePoints[i];
        const p = projectPoint(sp, camLon, tiltX, cx, cy, R);
        projected.push({
          sx: p.sx,
          sy: p.sy,
          z: p.z,
          scale: p.scale,
          isLand: sp.isLand,
          phase: sp.phase,
          size: sp.size
        });
      }
      projected.sort((a, b) => a.z - b.z);

      // Render Earth surface dots + hover magnetism
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const frontFactor = Math.max(0.08, (pt.z + 1) * 0.5);
        const twink = 0.78 + 0.22 * Math.sin(clock * 2.4 + pt.phase);

        let boost = 0;
        if (isHovered && pt.z > -0.1) {
          const dx = pt.sx - pointerX;
          const dy = pt.sy - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 4600) {
            boost = 1 - Math.sqrt(distSq) / 68;
          }
        }

        const radius = pt.size * pt.scale * (pt.isLand ? 1 : 0.72) + boost * 1.9;
        let alpha = pt.isLand
          ? (pt.z > 0 ? 0.32 + frontFactor * 0.66 : 0.08 + frontFactor * 0.14) * twink
          : (pt.z > 0 ? 0.18 : 0.04);
        alpha = Math.min(1, alpha + boost * 0.55);

        let fillColor;
        if (boost > 0.35) {
          fillColor = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        } else if (currentMode === "matrix") {
          fillColor = pt.isLand
            ? `rgba(52, 211, 153, ${alpha.toFixed(2)})`
            : `rgba(16, 185, 129, ${(alpha * 0.8).toFixed(2)})`;
        } else if (currentMode === "aurora") {
          const blend = Math.sin(pt.phase + clock * 0.9);
          fillColor =
            blend > 0
              ? `rgba(52, 211, 153, ${alpha.toFixed(2)})`
              : `rgba(167, 139, 250, ${alpha.toFixed(2)})`;
        } else if (currentMode === "hyperspin") {
          fillColor =
            i % 3 === 0
              ? `rgba(167, 139, 250, ${alpha.toFixed(2)})`
              : `rgba(34, 211, 238, ${alpha.toFixed(2)})`;
        } else {
          fillColor = pt.isLand
            ? pt.z > 0.35
              ? `rgba(34, 211, 238, ${alpha.toFixed(2)})`
              : `rgba(167, 139, 250, ${alpha.toFixed(2)})`
            : `rgba(167, 176, 197, ${alpha.toFixed(2)})`;
        }

        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Magnetic cursor filaments on hover
        if (boost > 0.45 && pt.isLand && pt.z > 0.1) {
          ctx.beginPath();
          ctx.moveTo(pt.sx, pt.sy);
          ctx.lineTo(pointerX, pointerY);
          ctx.strokeStyle =
            currentMode === "matrix"
              ? `rgba(52, 211, 153, ${(boost * 0.32).toFixed(2)})`
              : `rgba(34, 211, 238, ${(boost * 0.35).toFixed(2)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Great-circle neural connections between hubs + moving signal packets
      const hubProjected = globalHubs.map((h) =>
        projectPoint(latLonToUnit(h.lat, h.lon), camLon, tiltX, cx, cy, R)
      );

      for (let i = 0; i < hubProjected.length; i++) {
        const nextIdx = (i + 1) % hubProjected.length;
        const pA = hubProjected[i];
        const pB = hubProjected[nextIdx];
        if (pA.z > -0.15 || pB.z > -0.15) {
          const midX = (pA.sx + pB.sx) / 2;
          const midY = (pA.sy + pB.sy) / 2;
          const dx = midX - cx;
          const dy = midY - cy;
          const ctrlX = midX + dx * 0.42;
          const ctrlY = midY + dy * 0.42;

          ctx.beginPath();
          ctx.moveTo(pA.sx, pA.sy);
          ctx.quadraticCurveTo(ctrlX, ctrlY, pB.sx, pB.sy);
          ctx.strokeStyle =
            currentMode === "matrix"
              ? "rgba(52, 211, 153, 0.34)"
              : "rgba(34, 211, 238, 0.32)";
          ctx.lineWidth = currentMode === "hyperspin" ? 1.5 : 1.1;
          ctx.stroke();

          // Traveling glowing pulse bead
          const t = (clock * (currentMode === "hyperspin" ? 0.85 : 0.42) + i * 0.25) % 1;
          const inv = 1 - t;
          const qx = inv * inv * pA.sx + 2 * inv * t * ctrlX + t * t * pB.sx;
          const qy = inv * inv * pA.sy + 2 * inv * t * ctrlY + t * t * pB.sy;
          ctx.beginPath();
          ctx.arc(qx, qy, 2.3, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
        }
      }

      // Draw glowing hub beacons + sonar ping on active hub
      for (let i = 0; i < hubProjected.length; i++) {
        const hp = hubProjected[i];
        if (hp.z <= -0.08) continue;
        const isCurrent = i === activeHubIdx;
        const ringPulse = (clock * 1.4 + i * 0.3) % 1;

        if (isCurrent) {
          ctx.beginPath();
          ctx.arc(hp.sx, hp.sy, 4 + ringPulse * 14, 0, Math.PI * 2);
          ctx.strokeStyle =
            currentMode === "matrix"
              ? `rgba(52, 211, 153, ${(1 - ringPulse) * 0.75})`
              : `rgba(34, 211, 238, ${(1 - ringPulse) * 0.8})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(hp.sx, hp.sy, isCurrent ? 4.4 : 2.8, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? "#22D3EE" : "#A78BFA";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(hp.sx, hp.sy, isCurrent ? 2 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Matrix Holo vertical digital scanline
      if (currentMode === "matrix") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();
        matrixSweep += dt * 110;
        if (matrixSweep > H + 30) matrixSweep = -30;
        const scanGrad = ctx.createLinearGradient(0, matrixSweep - 24, 0, matrixSweep + 24);
        scanGrad.addColorStop(0, "transparent");
        scanGrad.addColorStop(0.5, "rgba(52, 211, 153, 0.24)");
        scanGrad.addColorStop(1, "transparent");
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, matrixSweep - 24, W, 48);
        ctx.restore();
      }

      // Internal radial click pulse waves
      for (let i = radialWaves.length - 1; i >= 0; i--) {
        const rw = radialWaves[i];
        rw.r += (currentMode === "hyperspin" ? 260 : 190) * dt;
        rw.alpha = Math.max(0, 1 - rw.r / rw.maxR);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(rw.x, rw.y, rw.r, 0, Math.PI * 2);
        ctx.strokeStyle =
          currentMode === "matrix"
            ? `rgba(52, 211, 153, ${rw.alpha.toFixed(2)})`
            : `rgba(34, 211, 238, ${rw.alpha.toFixed(2)})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();

        if (rw.alpha <= 0.02) radialWaves.splice(i, 1);
      }

      // Click / magic burst sparkles
      for (let i = pulseSparks.length - 1; i >= 0; i--) {
        const sp = pulseSparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        sp.life -= sp.decay;

        if (sp.life <= 0) {
          pulseSparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, sp.life);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    let lastTime = performance.now();
    function tick(now) {
      const dt = Math.min(0.05, Math.max(0.008, (now - lastTime) / 1000));
      lastTime = now;
      if (isVisible && !document.hidden) {
        renderFrame(dt);
      }
      if (!reducedMotion) {
        animId = window.requestAnimationFrame(tick);
      }
    }

    // Hover: 3D magnetic tilt + live pointer lat/lon HUD readout
    globeWrap.addEventListener("pointermove", (e) => {
      const rect = globeWrap.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - lastDragX;
        const dy = e.clientY - lastDragY;
        dragDist += Math.hypot(dx, dy);
        camLon -= dx * 0.0095;
        tiltX = Math.max(-0.75, Math.min(0.75, tiltX - dy * 0.0075));
        velLon = -dx * 0.0025;
        velTilt = -dy * 0.0018;
        targetLon = null;
        targetTiltX = null;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        if (reducedMotion) renderFrame(0);
        return;
      }

      isHovered = true;
      const nx = (pointerX / rect.width) * 2 - 1;
      const ny = (pointerY / rect.height) * 2 - 1;

      if (!reducedMotion) {
        globeWrap.style.transform = `rotateX(${(-ny * 10).toFixed(2)}deg) rotateY(${(nx * 10).toFixed(2)}deg) scale(1.03)`;
      }

      if (coordsReadout) {
        const estLat = -ny * 70 + (tiltX / DEG2RAD) * 0.5;
        const rawLon = (camLon / DEG2RAD + nx * 72 + 540) % 360 - 180;
        coordsReadout.textContent = formatCoords(
          Math.max(-85, Math.min(85, estLat)),
          rawLon
        );
      }
    });

    globeWrap.addEventListener("pointerenter", () => {
      isHovered = true;
    });

    globeWrap.addEventListener("pointerleave", () => {
      isHovered = false;
      isDragging = false;
      globeWrap.style.transform = "";
      if (coordsReadout) {
        const hub = globalHubs[activeHubIdx];
        coordsReadout.textContent = formatCoords(hub.lat, hub.lon);
      }
    });

    globeWrap.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      isDragging = true;
      dragDist = 0;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      targetLon = null;
      targetTiltX = null;
      try {
        globeWrap.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    const finishPointer = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        globeWrap.releasePointerCapture(e.pointerId);
      } catch (_) {}

      // Treat tap / click with negligible drag as magic shockwave + hub switch
      if (dragDist < 7) {
        const rect = globeWrap.getBoundingClientRect();
        const clickX = e.clientX ? e.clientX - rect.left : canvasSize / 2;
        const clickY = e.clientY ? e.clientY - rect.top : canvasSize / 2;
        updateHubUI(activeHubIdx + 1);
        triggerShockwaveAndSparks(clickX, clickY, 30);
      }
    };

    globeWrap.addEventListener("pointerup", finishPointer);
    globeWrap.addEventListener("pointercancel", finishPointer);

    // Keyboard accessibility for Enter / Space on Earth circle
    globeWrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        updateHubUI(activeHubIdx + 1);
        triggerShockwaveAndSparks(canvasSize / 2, canvasSize / 2, 28);
      }
    });

    // Mode option buttons
    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setMagicMode(btn.dataset.magicMode);
      });
    });

    // Supernova Pulse button
    pulseBtn?.addEventListener("click", () => {
      updateHubUI(activeHubIdx + 1);
      triggerShockwaveAndSparks(canvasSize / 2, canvasSize / 2, 42);
    });

    // Next Hub button inside telemetry card
    nextHubBtn?.addEventListener("click", () => {
      updateHubUI(activeHubIdx + 1);
      triggerShockwaveAndSparks(canvasSize / 2, canvasSize / 2, 24);
    });

    // Responsive sizing observer
    syncCanvasResolution();
    if (window.ResizeObserver) {
      const ro = new window.ResizeObserver(() => syncCanvasResolution());
      ro.observe(globeWrap);
    } else {
      window.addEventListener("resize", syncCanvasResolution);
    }

    // Visibility pause optimization
    if (window.IntersectionObserver) {
      const io = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      io.observe(stage);
    }

    updateHubUI(0, false);
    if (reducedMotion) {
      renderFrame(0.016);
    } else {
      animId = window.requestAnimationFrame(tick);
    }
  }

  /* ========================================================================
     6. INTERACTIVE QUANTUM SKILL GALAXY ("FUTURE SKILL UNIVERSE")
     ======================================================================== */
  function initMagicCosmosOrb() {
    const stage = document.getElementById("orb-stage");
    const orbWrap = document.getElementById("orb-globe-wrap");
    const canvas = document.getElementById("magic-orb-canvas");
    if (!stage || !orbWrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const shockwave = document.getElementById("orb-shockwave");
    const freqReadout = document.getElementById("orb-freq-readout");
    const modeReadout = document.getElementById("orb-mode-readout");
    const skillCard = document.getElementById("orb-milestone-card");
    const skillTagEl = document.getElementById("orb-skill-tag");
    const skillTitleEl = document.getElementById("orb-skill-title");
    const skillDescEl = document.getElementById("orb-skill-desc");
    const skillChipsEl = document.getElementById("orb-skill-chips");
    const skillCtaEl = document.getElementById("orb-skill-cta");
    const nextSkillBtn = document.getElementById("orb-next-btn");
    const burstBtn = document.getElementById("orb-burst-btn");
    const modeButtons = Array.from(document.querySelectorAll(".orb-opt-btn[data-orb-mode]"));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const skillNodes = [
      {
        tag: "ORBIT NODE 01 / 08 • CORE LOGIC",
        shortLabel: "PY",
        title: "Python Programming",
        desc: "Clean syntax, OOP architecture, algorithmic thinking, and live automation projects mentored step-by-step.",
        chips: ["Core Python", "OOP Systems", "Live Coding"],
        programSlug: "python-programming",
        orbitIncl: 0.42,
        orbitPhase: 0.0,
        orbitSpeed: 0.42,
        orbitR: 0.84
      },
      {
        tag: "ORBIT NODE 02 / 08 • GEN AI LAB",
        shortLabel: "AI",
        title: "Artificial Intelligence",
        desc: "Generative AI tooling, structured prompt engineering, LLM workflows, and applied intelligent automations.",
        chips: ["Generative AI", "Prompt Craft", "AI Agents"],
        programSlug: "artificial-intelligence",
        orbitIncl: -0.48,
        orbitPhase: 0.8,
        orbitSpeed: 0.48,
        orbitR: 0.78
      },
      {
        tag: "ORBIT NODE 03 / 08 • BI ANALYTICS",
        shortLabel: "BI",
        title: "Data Analytics",
        desc: "Executive KPI modeling with SQL queries, Excel automation, Python transformations, and interactive Power BI.",
        chips: ["SQL Queries", "Power BI", "Python Data"],
        programSlug: "data-analytics",
        orbitIncl: 0.55,
        orbitPhase: 1.7,
        orbitSpeed: 0.36,
        orbitR: 0.86
      },
      {
        tag: "ORBIT NODE 04 / 08 • ML SYSTEMS",
        shortLabel: "DS",
        title: "Data Science",
        desc: "Applied statistics, exploratory data visualization, supervised ML pipelines, and real dataset evaluations.",
        chips: ["Statistics", "Machine Learning", "Visualization"],
        programSlug: "data-science",
        orbitIncl: -0.35,
        orbitPhase: 2.5,
        orbitSpeed: 0.44,
        orbitR: 0.75
      },
      {
        tag: "ORBIT NODE 05 / 08 • MODERN WEB",
        shortLabel: "WEB",
        title: "Web Development",
        desc: "Semantic HTML5, responsive CSS architecture, interactive ES6 JavaScript, and structured backend data flows.",
        chips: ["HTML5 & CSS3", "JavaScript ES6", "Responsive UI"],
        programSlug: "web-development",
        orbitIncl: 0.32,
        orbitPhase: 3.3,
        orbitSpeed: 0.4,
        orbitR: 0.82
      },
      {
        tag: "ORBIT NODE 06 / 08 • FULL STACK",
        shortLabel: "FS",
        title: "Full Stack Development",
        desc: "End-to-end product engineering uniting polished interfaces, RESTful APIs, databases, and cloud deploys.",
        chips: ["Frontend + API", "Database Design", "Production"],
        programSlug: "full-stack-development",
        orbitIncl: -0.58,
        orbitPhase: 4.1,
        orbitSpeed: 0.38,
        orbitR: 0.88
      },
      {
        tag: "ORBIT NODE 07 / 08 • CLOUD OPS",
        shortLabel: "CLD",
        title: "Cloud Computing",
        desc: "Cloud architecture foundations, compute & storage deployments, CI/CD workflows, and resilient environments.",
        chips: ["Cloud Platforms", "Deployment", "Scalable Labs"],
        programSlug: "cloud-computing",
        orbitIncl: 0.62,
        orbitPhase: 4.9,
        orbitSpeed: 0.34,
        orbitR: 0.8
      },
      {
        tag: "ORBIT NODE 08 / 08 • SEC OPS",
        shortLabel: "SEC",
        title: "Cyber Security",
        desc: "Security essentials, network traffic inspection, web application hardening, and practical defensive discipline.",
        chips: ["Network Security", "Web Hardening", "Cyber Hygiene"],
        programSlug: "cyber-security",
        orbitIncl: -0.42,
        orbitPhase: 5.65,
        orbitSpeed: 0.46,
        orbitR: 0.76
      }
    ];

    const modeMeta = {
      neural: {
        label: "MODE: NEURAL CORE",
        className: "",
        primary: "#22D3EE",
        secondary: "#8B5CF6",
        accent: "#A78BFA",
        coreRgba: ["rgba(167, 139, 250, 0.92)", "rgba(34, 211, 238, 0.55)", "rgba(15, 19, 48, 0.96)"],
        palette: ["#22D3EE", "#A78BFA", "#8B5CF6", "#FFFFFF"]
      },
      supernova: {
        label: "MODE: SOLAR FLARE",
        className: "is-supernova",
        primary: "#FBBF24",
        secondary: "#F472B6",
        accent: "#FB7185",
        coreRgba: ["rgba(253, 224, 71, 0.95)", "rgba(244, 114, 182, 0.6)", "rgba(36, 12, 34, 0.96)"],
        palette: ["#FBBF24", "#FB923C", "#F472B6", "#FFFFFF"]
      },
      vortex: {
        label: "MODE: CYBER VORTEX",
        className: "is-vortex",
        primary: "#34D399",
        secondary: "#22D3EE",
        accent: "#6EE7B7",
        coreRgba: ["rgba(110, 231, 183, 0.92)", "rgba(34, 211, 238, 0.58)", "rgba(6, 26, 36, 0.96)"],
        palette: ["#34D399", "#22D3EE", "#10B981", "#FFFFFF"]
      },
      prism: {
        label: "MODE: PRISM HOLO",
        className: "is-prism",
        primary: "#38BDF8",
        secondary: "#C084FC",
        accent: "#F472B6",
        coreRgba: ["rgba(255, 255, 255, 0.95)", "rgba(56, 189, 248, 0.65)", "rgba(18, 22, 58, 0.95)"],
        palette: ["#38BDF8", "#A78BFA", "#F472B6", "#34D399", "#FBBF24"]
      }
    };

    // Build 3D Icosahedron core geometry (12 vertices, 30 edges)
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return { x: x / len, y: y / len, z: z / len };
    });

    const icoEdges = [];
    for (let i = 0; i < rawVerts.length; i++) {
      for (let j = i + 1; j < rawVerts.length; j++) {
        const d = Math.hypot(
          rawVerts[i].x - rawVerts[j].x,
          rawVerts[i].y - rawVerts[j].y,
          rawVerts[i].z - rawVerts[j].z
        );
        if (d < 1.15) icoEdges.push([i, j]);
      }
    }

    // 130 swirling stardust particles in 3D cosmos volume
    const stardust = [];
    for (let i = 0; i < 130; i++) {
      const theta = i * 2.3999632; // golden angle
      const u = ((i % 29) / 28) * 2 - 1;
      const rFactor = 0.28 + ((i * 17) % 100) / 145;
      stardust.push({
        baseR: rFactor,
        theta,
        lat: Math.asin(u * 0.85),
        speed: (0.18 + (i % 7) * 0.05) * (i % 2 === 0 ? 1 : -0.8),
        phase: (i * 0.43) % (Math.PI * 2),
        size: 1.0 + (i % 4) * 0.52,
        hueSlot: i % 4
      });
    }

    // State
    let currentMode = "neural";
    let activeSkillIdx = 0;
    let spinYaw = 0.4;
    let spinPitch = 0.25;
    let targetYaw = null;
    let targetPitch = null;
    let velYaw = 0;
    let velPitch = 0;
    let isHovered = false;
    let isDragging = false;
    let pointerX = 0;
    let pointerY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastDragX = 0;
    let lastDragY = 0;
    let dragDist = 0;
    let energyKick = 0;
    let radialWaves = [];
    let burstSparks = [];
    let canvasSize = 328;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId = null;
    let isVisible = true;
    let clock = 0;

    function rotate3D(vx, vy, vz, yaw, pitch, roll = 0) {
      // Yaw around Y
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const x1 = vx * cy - vz * sy;
      const z1 = vz * cy + vx * sy;

      // Pitch around X
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y2 = vy * cp - z1 * sp;
      const z2 = z1 * cp + vy * sp;

      if (roll === 0) return { x: x1, y: y2, z: z2 };

      // Optional Roll around Z
      const cr = Math.cos(roll);
      const sr = Math.sin(roll);
      return {
        x: x1 * cr - y2 * sr,
        y: x1 * sr + y2 * cr,
        z: z2
      };
    }

    function project3D(vx, vy, vz, cx, cy, R) {
      const fov = 2.6;
      const depth = fov / (fov - vz * 0.65);
      return {
        sx: cx + vx * R * depth,
        sy: cy + vy * R * depth,
        z: vz,
        depth
      };
    }

    function updateSkillUI(idx, animateCard = true) {
      activeSkillIdx = ((idx % skillNodes.length) + skillNodes.length) % skillNodes.length;
      const node = skillNodes[activeSkillIdx];

      if (skillTagEl) skillTagEl.textContent = node.tag;
      if (skillTitleEl) skillTitleEl.textContent = node.title;
      if (skillDescEl) skillDescEl.textContent = node.desc;
      if (skillChipsEl) {
        skillChipsEl.innerHTML = node.chips
          .map((chip) => `<span class="topic-chip">${escapeHTML ? escapeHTML(chip) : chip}</span>`)
          .join("");
      }
      if (skillCtaEl) {
        skillCtaEl.dataset.slug = node.programSlug;
      }

      if (skillCard && animateCard) {
        skillCard.classList.remove("is-pulsed");
        void skillCard.offsetWidth;
        skillCard.classList.add("is-pulsed");
      }

      // Smoothly orient core towards active node inclination
      targetPitch = Math.max(-0.65, Math.min(0.65, node.orbitIncl * 0.65));
      targetYaw = spinYaw + 0.55;
    }

    function triggerOrbPulse(originX, originY, sparkCount = 34) {
      const cx = canvasSize / 2;
      const cy = canvasSize / 2;
      const sx = typeof originX === "number" ? originX : cx;
      const sy = typeof originY === "number" ? originY : cy;

      if (shockwave) {
        shockwave.classList.remove("is-firing");
        void shockwave.offsetWidth;
        shockwave.classList.add("is-firing");
      }

      energyKick = 1.0;

      radialWaves.push(
        { x: sx, y: sy, r: 8, maxR: canvasSize * 0.96, alpha: 0.95, width: 2.5 },
        { x: sx, y: sy, r: 2, maxR: canvasSize * 0.78, alpha: 0.85, width: 1.6 }
      );

      const palette = modeMeta[currentMode].palette;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.3;
        const speed = 1.7 + Math.random() * 4.2;
        burstSparks.push({
          x: sx,
          y: sy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.017 + Math.random() * 0.018,
          size: 1.6 + Math.random() * 2.6,
          color: palette[i % palette.length]
        });
      }

      if (reducedMotion) {
        renderOrbFrame(0.016);
      }
    }

    function setOrbMode(mode) {
      if (!modeMeta[mode]) return;
      currentMode = mode;

      stage.classList.remove("is-supernova", "is-vortex", "is-prism");
      if (modeMeta[mode].className) {
        stage.classList.add(modeMeta[mode].className);
      }

      modeButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.orbMode === mode);
      });

      if (modeReadout) {
        modeReadout.textContent = modeMeta[mode].label;
      }

      triggerOrbPulse(canvasSize / 2, canvasSize / 2, 26);
    }

    function syncOrbCanvas() {
      const rect = orbWrap.getBoundingClientRect();
      const side = Math.max(200, Math.round(rect.width || 320));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasSize = side;
      canvas.width = Math.round(side * dpr);
      canvas.height = Math.round(side * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) renderOrbFrame(0);
    }

    function drawGyroRing(cx, cy, R, ringR, inclX, inclZ, yawOffset, strokeColor, lineWidth) {
      const steps = 64;
      const pts = [];
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        const rx = Math.cos(a) * ringR;
        const ry = Math.sin(a) * ringR;
        const p3 = rotate3D(rx, ry, 0, spinYaw + yawOffset, spinPitch + inclX, inclZ);
        pts.push(project3D(p3.x, p3.y, p3.z, cx, cy, R));
      }

      ctx.save();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      for (let s = 0; s < pts.length; s++) {
        if (s === 0) ctx.moveTo(pts[s].sx, pts[s].sy);
        else ctx.lineTo(pts[s].sx, pts[s].sy);
      }
      ctx.stroke();
      ctx.restore();
    }

    function renderOrbFrame(dt) {
      clock += dt;
      energyKick = Math.max(0, energyKick - dt * 1.45);

      const W = canvasSize;
      const H = canvasSize;
      const cx = W / 2;
      const cy = H / 2;
      const R = W * 0.44;
      const cfg = modeMeta[currentMode];

      ctx.clearRect(0, 0, W, H);

      // Update gyroscope & vortex spin
      if (!isDragging && !reducedMotion) {
        if (targetYaw !== null) {
          spinYaw += (targetYaw - spinYaw) * 0.06;
          if (Math.abs(targetYaw - spinYaw) < 0.015) targetYaw = null;
        } else {
          const baseSpeed = currentMode === "vortex" ? 0.95 : currentMode === "supernova" ? 0.6 : 0.36;
          spinYaw += (baseSpeed + energyKick * 1.4) * dt + velYaw;
        }

        if (targetPitch !== null) {
          spinPitch += (targetPitch - spinPitch) * 0.06;
          if (Math.abs(targetPitch - spinPitch) < 0.012) targetPitch = null;
        } else {
          spinPitch += velPitch + Math.sin(clock * 0.45) * 0.08 * dt;
        }

        velYaw *= 0.92;
        velPitch *= 0.92;
        spinPitch = Math.max(-0.85, Math.min(0.85, spinPitch));
      }

      // Cosmic deep backdrop
      const spaceGrad = ctx.createRadialGradient(
        cx - R * 0.22,
        cy - R * 0.22,
        R * 0.08,
        cx,
        cy,
        R * 1.05
      );
      spaceGrad.addColorStop(0, cfg.coreRgba[1]);
      spaceGrad.addColorStop(0.42, "rgba(14, 18, 44, 0.85)");
      spaceGrad.addColorStop(1, "rgba(4, 6, 16, 0.98)");

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = spaceGrad;
      ctx.fill();

      // Mode-specific Vortex spiral arms or Solar Flare corona
      if (currentMode === "vortex") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();
        for (let arm = 0; arm < 4; arm++) {
          ctx.beginPath();
          const baseArmAngle = (arm * Math.PI) / 2 - clock * 1.9;
          for (let step = 2; step < 36; step++) {
            const frac = step / 36;
            const ang = baseArmAngle + frac * 3.6;
            const rad = frac * R * 0.96;
            const px = cx + Math.cos(ang) * rad;
            const py = cy + Math.sin(ang) * rad;
            if (step === 2) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = arm % 2 === 0 ? "rgba(52, 211, 153, 0.26)" : "rgba(34, 211, 238, 0.24)";
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }
        ctx.restore();
      } else if (currentMode === "supernova") {
        const corona = ctx.createRadialGradient(cx, cy, R * 0.14, cx, cy, R * (0.72 + Math.sin(clock * 3) * 0.06));
        corona.addColorStop(0, "rgba(253, 224, 71, 0.42)");
        corona.addColorStop(0.5, "rgba(244, 114, 182, 0.22)");
        corona.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = corona;
        ctx.fill();
      } else if (currentMode === "prism") {
        const prismShift = Math.sin(clock * 1.2) * R * 0.18;
        const prismGrad = ctx.createLinearGradient(cx - R, cy - prismShift, cx + R, cy + prismShift);
        prismGrad.addColorStop(0, "rgba(56, 189, 248, 0.18)");
        prismGrad.addColorStop(0.5, "rgba(167, 139, 250, 0.2)");
        prismGrad.addColorStop(1, "rgba(244, 114, 182, 0.18)");
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = prismGrad;
        ctx.fill();
      }

      // Spherical glass rim glow
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = isHovered ? 2.4 : 1.5;
      ctx.strokeStyle = cfg.primary;
      ctx.globalAlpha = isHovered ? 0.72 : 0.42;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // 3 Inclined 3D Gyroscope Rings
      drawGyroRing(cx, cy, R, 0.9, 0.52, 0.18, 0, cfg.secondary + "55", 1.25);
      drawGyroRing(cx, cy, R, 0.8, -0.58, -0.35, 0.9, cfg.primary + "66", 1.35);
      drawGyroRing(cx, cy, R, 0.68, 0.2, 0.62, -0.6, cfg.accent + "55", 1.1);

      // Compute & draw 3D stardust particles with hover magnetic filaments
      const projectedDust = [];
      for (let i = 0; i < stardust.length; i++) {
        const d = stardust[i];
        const liveTheta = d.theta + clock * d.speed;
        const r = d.baseR;
        const vx = Math.cos(liveTheta) * Math.cos(d.lat) * r;
        const vy = Math.sin(d.lat) * r;
        const vz = Math.sin(liveTheta) * Math.cos(d.lat) * r;

        const rot = rotate3D(vx, vy, vz, spinYaw * 0.75, spinPitch * 0.75);
        const proj = project3D(rot.x, rot.y, rot.z, cx, cy, R);
        projectedDust.push({
          sx: proj.sx,
          sy: proj.sy,
          z: proj.z,
          depth: proj.depth,
          size: d.size,
          phase: d.phase,
          hueSlot: d.hueSlot
        });
      }
      projectedDust.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projectedDust.length; i++) {
        const pt = projectedDust[i];
        let boost = 0;
        if (isHovered) {
          const dx = pt.sx - pointerX;
          const dy = pt.sy - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 6400) {
            boost = 1 - Math.sqrt(distSq) / 80;
          }
        }

        const twinkle = 0.65 + 0.35 * Math.sin(clock * 2.8 + pt.phase);
        const frontOpacity = Math.max(0.14, (pt.z + 1) * 0.45) * twinkle;
        const radius = pt.size * pt.depth * 0.85 + boost * 1.9;
        const col = boost > 0.42 ? "#FFFFFF" : cfg.palette[pt.hueSlot % cfg.palette.length];

        ctx.globalAlpha = Math.min(1, frontOpacity + boost * 0.55);
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();

        // Magnetic pointer filament lines on hover
        if (boost > 0.32 && pt.z > -0.25) {
          ctx.globalAlpha = boost * 0.45;
          ctx.beginPath();
          ctx.moveTo(pt.sx, pt.sy);
          ctx.lineTo(pointerX, pointerY);
          ctx.strokeStyle = cfg.primary;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Central 3D Icosahedron Neural Core
      const coreScale = 0.34 + Math.sin(clock * 2.5) * 0.015 + energyKick * 0.06;
      const projCoreVerts = rawVerts.map((v) => {
        const rot = rotate3D(v.x * coreScale, v.y * coreScale, v.z * coreScale, spinYaw * 1.35, spinPitch * 1.15);
        return project3D(rot.x, rot.y, rot.z, cx, cy, R);
      });

      // Inner Plasma Core Heart
      const pulseHeart = ctx.createRadialGradient(cx, cy, 2, cx, cy, R * (0.28 + energyKick * 0.09));
      pulseHeart.addColorStop(0, cfg.coreRgba[0]);
      pulseHeart.addColorStop(0.5, cfg.coreRgba[1]);
      pulseHeart.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, R * (0.3 + energyKick * 0.09), 0, Math.PI * 2);
      ctx.fillStyle = pulseHeart;
      ctx.fill();

      // Icosahedron Mesh Edges
      ctx.lineWidth = 1.2 + energyKick * 0.8;
      for (let e = 0; e < icoEdges.length; e++) {
        const [aIdx, bIdx] = icoEdges[e];
        const va = projCoreVerts[aIdx];
        const vb = projCoreVerts[bIdx];
        const avgZ = (va.z + vb.z) * 0.5;
        ctx.globalAlpha = Math.max(0.22, 0.55 + avgZ * 0.45);
        ctx.strokeStyle = e % 2 === 0 ? cfg.primary : cfg.accent;
        ctx.beginPath();
        ctx.moveTo(va.sx, va.sy);
        ctx.lineTo(vb.sx, vb.sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Icosahedron Vertex Nodes
      for (let v = 0; v < projCoreVerts.length; v++) {
        const pv = projCoreVerts[v];
        ctx.beginPath();
        ctx.arc(pv.sx, pv.sy, pv.z > 0 ? 2.4 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = pv.z > 0 ? "#FFFFFF" : cfg.accent;
        ctx.fill();
      }

      // Project 8 Orbiting Skill Satellites & Active Laser Beam
      const satProjected = skillNodes.map((node, idx) => {
        const theta = node.orbitPhase + clock * node.orbitSpeed;
        const rOrbit = node.orbitR;
        const lx = Math.cos(theta) * rOrbit;
        const ly = Math.sin(theta) * Math.sin(node.orbitIncl) * rOrbit;
        const lz = Math.sin(theta) * Math.cos(node.orbitIncl) * rOrbit;
        const rot = rotate3D(lx, ly, lz, spinYaw * 0.45, spinPitch * 0.45);
        const proj = project3D(rot.x, rot.y, rot.z, cx, cy, R);
        return { node, idx, sx: proj.sx, sy: proj.sy, z: proj.z, depth: proj.depth };
      });
      satProjected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < satProjected.length; i++) {
        const sp = satProjected[i];
        const isCurrent = sp.idx === activeSkillIdx;

        // Active Satellite Energy Tether from Core
        if (isCurrent) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(sp.sx, sp.sy);
          ctx.strokeStyle = cfg.primary;
          ctx.globalAlpha = 0.72;
          ctx.lineWidth = 1.6;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.restore();

          // Ping halo around active skill node
          const ping = (clock * 1.5) % 1;
          ctx.beginPath();
          ctx.arc(sp.sx, sp.sy, 7 + ping * 15, 0, Math.PI * 2);
          ctx.strokeStyle = cfg.primary;
          ctx.globalAlpha = (1 - ping) * 0.8;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        const nodeR = isCurrent ? 13 : 9.5;
        ctx.globalAlpha = sp.z < -0.2 && !isCurrent ? 0.45 : 0.96;

        ctx.beginPath();
        ctx.arc(sp.sx, sp.sy, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? cfg.primary : "rgba(16, 22, 42, 0.9)";
        ctx.fill();
        ctx.lineWidth = isCurrent ? 2 : 1.1;
        ctx.strokeStyle = isCurrent ? "#FFFFFF" : cfg.accent;
        ctx.stroke();

        // Compact Track Label inside Node
        ctx.fillStyle = isCurrent ? "#060916" : "#FFFFFF";
        ctx.font = `700 ${isCurrent ? 8.5 : 7.5}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sp.node.shortLabel, sp.sx, sp.sy + 0.5);
        ctx.globalAlpha = 1;
      }

      // Hover Lens Halo on Pointer
      if (isHovered) {
        const lens = ctx.createRadialGradient(pointerX, pointerY, 2, pointerX, pointerY, 44);
        lens.addColorStop(0, "rgba(255, 255, 255, 0.25)");
        lens.addColorStop(0.5, cfg.secondary + "22");
        lens.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, 44, 0, Math.PI * 2);
        ctx.fillStyle = lens;
        ctx.fill();
      }

      // Radial Magic Shockwave Rings inside Sphere
      for (let i = radialWaves.length - 1; i >= 0; i--) {
        const rw = radialWaves[i];
        rw.r += (currentMode === "supernova" ? 265 : 205) * dt;
        rw.alpha = Math.max(0, 1 - rw.r / rw.maxR);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(rw.x, rw.y, rw.r, 0, Math.PI * 2);
        ctx.strokeStyle = cfg.primary;
        ctx.globalAlpha = rw.alpha;
        ctx.lineWidth = rw.width;
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha = 1;

        if (rw.alpha <= 0.02) radialWaves.splice(i, 1);
      }

      // Firework Sparkles on Click / Mode Switch / Pulse CTA
      for (let i = burstSparks.length - 1; i >= 0; i--) {
        const sp = burstSparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.955;
        sp.vy *= 0.955;
        sp.life -= sp.decay;

        if (sp.life <= 0) {
          burstSparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, sp.life);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    let lastTime = performance.now();
    function tick(now) {
      const dt = Math.min(0.05, Math.max(0.008, (now - lastTime) / 1000));
      lastTime = now;
      if (isVisible && !document.hidden) {
        renderOrbFrame(dt);
      }
      if (!reducedMotion) {
        animId = window.requestAnimationFrame(tick);
      }
    }

    // Hover magnetics, 3D tilt & live HUD frequency update
    orbWrap.addEventListener("pointermove", (e) => {
      const rect = orbWrap.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - lastDragX;
        const dy = e.clientY - lastDragY;
        dragDist += Math.hypot(dx, dy);
        spinYaw -= dx * 0.01;
        spinPitch = Math.max(-0.85, Math.min(0.85, spinPitch + dy * 0.008));
        velYaw = -dx * 0.0028;
        velPitch = dy * 0.002;
        targetYaw = null;
        targetPitch = null;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        if (reducedMotion) renderOrbFrame(0);
        return;
      }

      isHovered = true;
      const nx = (pointerX / rect.width) * 2 - 1;
      const ny = (pointerY / rect.height) * 2 - 1;

      if (!reducedMotion) {
        orbWrap.style.transform = `rotateX(${(-ny * 10).toFixed(2)}deg) rotateY(${(nx * 10).toFixed(2)}deg) scale(1.03)`;
      }

      if (freqReadout) {
        const distFromCenter = Math.min(1, Math.hypot(nx, ny));
        const hz = 96.4 + distFromCenter * 48.2;
        const az = Math.round(((Math.atan2(ny, nx) * 180) / Math.PI + 360) % 360);
        freqReadout.textContent = `RESONANCE: ${hz.toFixed(1)} Hz • AZ ${az}°`;
      }
    });

    orbWrap.addEventListener("pointerenter", () => {
      isHovered = true;
    });

    orbWrap.addEventListener("pointerleave", () => {
      isHovered = false;
      isDragging = false;
      orbWrap.style.transform = "";
      if (freqReadout) {
        freqReadout.textContent = "RESONANCE: 96.4 Hz • ORBIT LOCK";
      }
    });

    orbWrap.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      isDragging = true;
      dragDist = 0;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      targetYaw = null;
      targetPitch = null;
      try {
        orbWrap.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    const finishOrbPointer = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        orbWrap.releasePointerCapture(e.pointerId);
      } catch (_) {}

      if (dragDist < 7) {
        const rect = orbWrap.getBoundingClientRect();
        const clickX = e.clientX ? e.clientX - rect.left : canvasSize / 2;
        const clickY = e.clientY ? e.clientY - rect.top : canvasSize / 2;
        updateSkillUI(activeSkillIdx + 1);
        triggerOrbPulse(clickX, clickY, 36);
      }
    };

    orbWrap.addEventListener("pointerup", finishOrbPointer);
    orbWrap.addEventListener("pointercancel", finishOrbPointer);

    orbWrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        updateSkillUI(activeSkillIdx + 1);
        triggerOrbPulse(canvasSize / 2, canvasSize / 2, 32);
      }
    });

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setOrbMode(btn.dataset.orbMode);
      });
    });

    burstBtn?.addEventListener("click", () => {
      updateSkillUI(activeSkillIdx + 1);
      triggerOrbPulse(canvasSize / 2, canvasSize / 2, 44);
    });

    nextSkillBtn?.addEventListener("click", () => {
      updateSkillUI(activeSkillIdx + 1);
      triggerOrbPulse(canvasSize / 2, canvasSize / 2, 26);
    });

    syncOrbCanvas();
    if (window.ResizeObserver) {
      const ro = new window.ResizeObserver(() => syncOrbCanvas());
      ro.observe(orbWrap);
    } else {
      window.addEventListener("resize", syncOrbCanvas);
    }

    if (window.IntersectionObserver) {
      const io = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      io.observe(stage);
    }

    updateSkillUI(0, false);
    if (reducedMotion) {
      renderOrbFrame(0.016);
    } else {
      animId = window.requestAnimationFrame(tick);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDraggableCollage();
    initMagicEarthGlobe();
    initMagicCosmosOrb();
    initIndustrySolutions();
    initMethodologyTimeline();
    initEventsGallery();
  });
})();
