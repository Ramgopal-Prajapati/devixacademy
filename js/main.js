/**
 * DeviX Academy - Core Application Boot, Navigation, Rendering & Helpers
 */

(function () {
  "use strict";

  const SITE_IN_PAGES = window.location.pathname.replace(/\\/g, "/").includes("/pages/");
  const ROOT_PREFIX = SITE_IN_PAGES ? "../" : "";

  /**
   * Build safe relative asset or page path regardless of index vs /pages/ route.
   */
  function resolvePath(relativePath) {
    if (!relativePath) return "";
    if (/^(https?:|mailto:|tel:|#)/i.test(relativePath)) return relativePath;
    return ROOT_PREFIX + relativePath.replace(/^\/+/, "");
  }

  /**
   * Build official WhatsApp deep link with URL-encoded pre-filled text.
   */
  function buildWhatsAppUrl(customMessage) {
    const cfg = window.DEVIX_CONFIG.whatsapp;
    const msg = encodeURIComponent(customMessage || cfg.defaultMessage);
    return `https://wa.me/${cfg.rawNumber}?text=${msg}`;
  }

  /**
   * Escape untrusted string for safe HTML interpolation.
   */
  function escapeHTML(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Dismiss subtle entrance loader immediately once DOM is interactive.
   */
  function initLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    const hide = () => loader.classList.add("is-hidden");
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(hide, 180);
    } else {
      document.addEventListener("DOMContentLoaded", () => setTimeout(hide, 180));
    }
    setTimeout(hide, 650);
  }

  /**
   * Initialize sticky navbar scroll styling, scroll progress bar, back-to-top, and active nav spy.
   */
  function initNavigationAndScrollUI() {
    const header = document.getElementById("site-header");
    const progressBar = document.getElementById("scroll-progress-bar");
    const backToTop = document.getElementById("back-to-top-btn");

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

      if (progressBar) {
        progressBar.style.width = `${pct.toFixed(2)}%`;
      }
      if (header) {
        header.classList.toggle("is-scrolled", scrollTop > 32 || SITE_IN_PAGES);
      }
      if (backToTop) {
        backToTop.classList.toggle("is-visible", scrollTop > 420);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        if (window.devixLenis) {
          window.devixLenis.scrollTo(0, { duration: 1.0 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

    // Mobile drawer toggling
    const menuBtn = document.getElementById("mobile-menu-toggle");
    const drawer = document.getElementById("mobile-drawer");
    if (menuBtn && drawer) {
      const toggleDrawer = (forceState) => {
        const next = typeof forceState === "boolean" ? forceState : !drawer.classList.contains("is-open");
        menuBtn.classList.toggle("is-active", next);
        menuBtn.setAttribute("aria-expanded", String(next));
        drawer.classList.toggle("is-open", next);
        document.body.style.overflow = next ? "hidden" : "";
      };

      menuBtn.addEventListener("click", () => toggleDrawer());
      drawer.querySelectorAll("a[data-close-drawer='true']").forEach((link) => {
        link.addEventListener("click", () => toggleDrawer(false));
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && drawer.classList.contains("is-open")) {
          toggleDrawer(false);
        }
      });

      const mobileProgTrigger = document.getElementById("mobile-programs-toggle");
      const mobileProgList = document.getElementById("mobile-programs-sublist");
      if (mobileProgTrigger && mobileProgList) {
        mobileProgTrigger.addEventListener("click", () => {
          const open = mobileProgList.classList.toggle("is-open");
          mobileProgTrigger.setAttribute("aria-expanded", String(open));
        });
      }
    }

    // Desktop dropdown toggle for touch / keyboard support
    const dropdown = document.querySelector(".nav-dropdown");
    const dropdownBtn = document.getElementById("nav-programs-trigger");
    if (dropdown && dropdownBtn) {
      dropdownBtn.addEventListener("click", (e) => {
        if (window.innerWidth >= 1200) {
          // Allow direct keyboard toggle if already focused, or open menu cleanly
          const isOpen = dropdown.classList.toggle("is-open");
          dropdownBtn.setAttribute("aria-expanded", String(isOpen));
          e.preventDefault();
        }
      });
      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("is-open");
          dropdownBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Populate dropdown programs list dynamically from DEVIX_DATA
    const dropdownGrid = document.getElementById("nav-programs-dropdown-grid");
    if (dropdownGrid && window.DEVIX_DATA?.programs) {
      dropdownGrid.innerHTML = window.DEVIX_DATA.programs
        .map(
          (p) => `
          <a class="dropdown-program-item" href="${resolvePath("pages/programs.html?program=" + encodeURIComponent(p.slug))}">
            <div class="dropdown-program-icon"><i class="${escapeHTML(p.icon)}" aria-hidden="true"></i></div>
            <div>
              <div class="dropdown-program-title">${escapeHTML(p.title)}</div>
              <div class="dropdown-program-meta">${escapeHTML(p.categoryLabel)}</div>
            </div>
          </a>
        `
        )
        .join("");
    }

    // Smooth scroll for same-page anchor links + active section observer on home page
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          if (window.devixLenis) {
            window.devixLenis.scrollTo(targetEl, { offset: -72, duration: 0.95 });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });

    if (!SITE_IN_PAGES) {
      const spySections = ["hero", "about", "programs", "industries", "methodology", "corporate", "testimonials", "enquiry"];
      const navLinks = document.querySelectorAll(".desktop-nav .nav-item-link[data-section]");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              navLinks.forEach((link) => {
                link.classList.toggle("active", link.dataset.section === id);
              });
            }
          });
        },
        { rootMargin: "-35% 0px -50% 0px", threshold: 0.05 }
      );
      spySections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }
  }

  /**
   * Initialize WhatsApp links dynamically across header, floating CTA, forms, and footer.
   */
  function initWhatsAppBindings() {
    const pageTitle = document.title.split("|")[0].trim();
    const pageContextMsg = `Hello DeviX Academy, I am browsing "${pageTitle}" and would like information about your training programs.`;

    document.querySelectorAll("[data-wa-link]").forEach((el) => {
      const custom = el.getAttribute("data-wa-message") || pageContextMsg;
      el.setAttribute("href", buildWhatsAppUrl(custom));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    // Update email / address placeholders from central config
    const emailEl = document.querySelectorAll("[data-config-email]");
    emailEl.forEach((el) => {
      el.textContent = window.DEVIX_CONFIG.contact.email;
      if (el.tagName === "A") {
        el.setAttribute("href", `mailto:${window.DEVIX_CONFIG.contact.email}`);
      }
    });
    document.querySelectorAll("[data-config-phone]").forEach((el) => {
      el.textContent = window.DEVIX_CONFIG.contact.phoneDisplay;
    });
    document.querySelectorAll("[data-config-address]").forEach((el) => {
      el.textContent = window.DEVIX_CONFIG.contact.address;
    });
  }

  /**
   * Populate Partners infinite marquee track seamlessly.
   */
  function renderPartnersMarquee() {
    const track = document.getElementById("partners-marquee-track");
    if (!track || !window.DEVIX_DATA?.partners) return;
    const items = window.DEVIX_DATA.partners;
    const html = [...items, ...items]
      .map(
        (partner) => `
        <div class="partner-pill">
          <div class="partner-icon-box"><i class="fa-solid ${escapeHTML(partner.icon)}" aria-hidden="true"></i></div>
          <div>
            <div class="fw-semibold text-white small">${escapeHTML(partner.name)}</div>
            <div class="text-secondary-custom" style="font-size: 0.72rem;">${escapeHTML(partner.sub)}</div>
          </div>
        </div>
      `
      )
      .join("");
    track.innerHTML = html;
  }

  /**
   * Render Hero + Achievements editable stats.
   */
  function renderStatistics() {
    const heroStats = document.getElementById("hero-stats-grid");
    const bandStats = document.getElementById("achievements-stats-grid");
    const stats = window.DEVIX_DATA?.stats || [];

    if (heroStats) {
      heroStats.innerHTML = stats
        .map(
          (s) => `
          <div class="hero-stat-card">
            <div class="hero-stat-num">
              <span class="counter-value" data-target="${s.value}" data-suffix="${escapeHTML(s.suffix)}">0${escapeHTML(s.suffix)}</span>
            </div>
            <div class="hero-stat-label">${escapeHTML(s.label)}</div>
            <span class="hero-stat-note">${escapeHTML(s.note)}</span>
          </div>
        `
        )
        .join("");
    }

    if (bandStats) {
      bandStats.innerHTML = stats
        .map(
          (s) => `
          <div class="stat-banner-card">
            <div class="stat-banner-icon"><i class="fa-solid ${escapeHTML(s.icon)}" aria-hidden="true"></i></div>
            <div class="stat-banner-num gradient-text">
              <span class="counter-value" data-target="${s.value}" data-suffix="${escapeHTML(s.suffix)}">0${escapeHTML(s.suffix)}</span>
            </div>
            <h3 class="h6 mb-1 text-white">${escapeHTML(s.label)}</h3>
            <div class="font-mono-label text-secondary-custom" style="font-size: 0.68rem;">${escapeHTML(s.note)}</div>
          </div>
        `
        )
        .join("");
    }
  }

  /**
   * Render Program Cards with Category Filter + Course Details Modal Hook + Brochure Handling.
   */
  function renderProgramsGrid() {
    const grid = document.getElementById("programs-grid");
    if (!grid || !window.DEVIX_DATA?.programs) return;

    const programs = window.DEVIX_DATA.programs;
    const renderCards = (filter = "all") => {
      const list = filter === "all" ? programs : programs.filter((p) => p.category === filter);
      grid.innerHTML = list
        .map(
          (p) => `
          <article class="program-card panel-enter" data-program-slug="${escapeHTML(p.slug)}">
            <div class="program-media">
              <img src="${resolvePath(p.image)}" alt="${escapeHTML(p.imageAlt)}" width="640" height="400" loading="lazy" />
              <div class="program-media-badges">
                <span class="program-badge">${escapeHTML(p.badge)}</span>
                <span class="program-icon-badge" aria-hidden="true"><i class="${escapeHTML(p.icon)}"></i></span>
              </div>
            </div>
            <div class="program-body">
              <div class="font-mono-label text-cyan mb-2" style="font-size: 0.7rem;">${escapeHTML(p.categoryLabel)} • ${p.curriculum.length} Modules</div>
              <h3 class="program-title">${escapeHTML(p.title)}</h3>
              <p class="program-desc">${escapeHTML(p.shortDesc)}</p>
              <div class="program-topics">
                ${p.topics.map((t) => `<span class="topic-chip">${escapeHTML(t)}</span>`).join("")}
              </div>
              <div class="program-footer-actions">
                <div class="program-btn-row">
                  <button type="button" class="btn-devix-outline btn-devix-sm w-100 js-open-program-modal" data-slug="${escapeHTML(p.slug)}">
                    Course Details <i class="fa-solid fa-arrow-right ms-1" aria-hidden="true"></i>
                  </button>
                  <button type="button" class="btn-devix-primary btn-devix-sm w-100 js-enquire-program" data-program="${escapeHTML(p.title)}">
                    Enquire Now
                  </button>
                </div>
                ${
                  p.brochureUrl
                    ? `<a href="${resolvePath(p.brochureUrl)}" download class="program-brochure-link">
                        <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Syllabus PDF
                       </a>`
                    : `<button type="button" class="program-brochure-link js-request-syllabus" data-program="${escapeHTML(p.title)}">
                        <i class="fa-regular fa-file-lines" aria-hidden="true"></i> Request Program Syllabus
                       </button>`
                }
              </div>
            </div>
          </article>
        `
        )
        .join("");
    };

    renderCards("all");

    document.querySelectorAll(".filter-pill-btn[data-program-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".filter-pill-btn[data-program-filter]")
          .forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderCards(btn.dataset.programFilter);
      });
    });

    // Event delegation for card actions (Details modal, Enquire, Request Syllabus)
    document.addEventListener("click", (e) => {
      const modalTrigger = e.target.closest(".js-open-program-modal");
      if (modalTrigger) {
        openProgramModal(modalTrigger.dataset.slug);
        return;
      }
      const enquireTrigger = e.target.closest(".js-enquire-program");
      if (enquireTrigger) {
        jumpToEnquiryWithProgram(enquireTrigger.dataset.program, "program-enquiry");
        return;
      }
      const syllabusTrigger = e.target.closest(".js-request-syllabus");
      if (syllabusTrigger) {
        jumpToEnquiryWithProgram(
          syllabusTrigger.dataset.program,
          "syllabus-request",
          `Please send me the detailed curriculum syllabus and upcoming batch schedule for ${syllabusTrigger.dataset.program}.`
        );
      }
    });

    // Support direct URL query ?program=slug on programs.html or index.html
    const params = new URLSearchParams(window.location.search);
    const slugFromQuery = params.get("program");
    if (slugFromQuery) {
      const targetProgram = programs.find((p) => p.slug === slugFromQuery);
      if (targetProgram) {
        setTimeout(() => openProgramModal(targetProgram.slug), 250);
      }
    }
  }

  /**
   * Open accessible Bootstrap modal populated with selected course curriculum & brochure info.
   */
  function openProgramModal(slug) {
    const program = window.DEVIX_DATA?.programs?.find((p) => p.slug === slug);
    const modalEl = document.getElementById("programDetailModal");
    if (!program || !modalEl) return;

    modalEl.querySelector("#modal-prog-title").textContent = program.title;
    modalEl.querySelector("#modal-prog-badge").textContent = `${program.categoryLabel} • ${program.badge}`;
    modalEl.querySelector("#modal-prog-desc").textContent = program.shortDesc;

    const overviewEl = modalEl.querySelector("#modal-prog-overview");
    if (overviewEl) {
      overviewEl.textContent = program.overview || "";
      overviewEl.style.display = program.overview ? "" : "none";
    }

    modalEl.querySelector("#modal-prog-duration").textContent = program.duration;
    modalEl.querySelector("#modal-prog-mode").textContent = program.mode;
    modalEl.querySelector("#modal-prog-audience").textContent = program.audience;
    modalEl.querySelector("#modal-prog-img").src = resolvePath(program.image);
    modalEl.querySelector("#modal-prog-img").alt = program.imageAlt;

    const toolsEl = modalEl.querySelector("#modal-prog-tools");
    const toolsWrap = modalEl.querySelector("#modal-prog-tools-wrap");
    if (toolsEl && Array.isArray(program.tools) && program.tools.length) {
      toolsEl.innerHTML = program.tools
        .map((tool) => `<span class="topic-chip">${escapeHTML(tool)}</span>`)
        .join("");
      if (toolsWrap) toolsWrap.style.display = "";
    } else if (toolsWrap) {
      toolsWrap.style.display = "none";
    }

    modalEl.querySelector("#modal-prog-modules").innerHTML = `<div class="row g-2">${program.curriculum
      .map(
        (c) => `
        <div class="col-md-6">
          <div class="modal-module-card">
            <div class="fw-semibold text-white small mb-1">${escapeHTML(c.module)}</div>
            <div class="text-secondary-custom small">${escapeHTML(c.details)}</div>
          </div>
        </div>
      `
      )
      .join("")}</div>`;

    const projectsEl = modalEl.querySelector("#modal-prog-projects");
    const projectsWrap = modalEl.querySelector("#modal-prog-projects-wrap");
    if (projectsEl && Array.isArray(program.projects) && program.projects.length) {
      projectsEl.innerHTML = program.projects
        .map(
          (proj) => `
          <div class="col-md-4">
            <div class="modal-project-pill h-100">
              <i class="fa-solid fa-diagram-project text-cyan mt-1 flex-shrink-0" aria-hidden="true"></i>
              <span>${escapeHTML(proj)}</span>
            </div>
          </div>
        `
        )
        .join("");
      if (projectsWrap) projectsWrap.style.display = "";
    } else if (projectsWrap) {
      projectsWrap.style.display = "none";
    }

    modalEl.querySelector("#modal-prog-outcomes").innerHTML = program.outcomes
      .map(
        (o) => `<li class="mb-2 text-secondary-custom small"><i class="fa-solid fa-circle-check text-cyan me-2"></i>${escapeHTML(o)}</li>`
      )
      .join("");

    const waBtn = modalEl.querySelector("#modal-prog-wa");
    if (waBtn) {
      waBtn.href = buildWhatsAppUrl(
        `Hello DeviX Academy, I would like to request the syllabus and next batch details for the ${program.title} program.`
      );
    }

    const enquireBtn = modalEl.querySelector("#modal-prog-enquire");
    if (enquireBtn) {
      enquireBtn.onclick = () => {
        const bsModal = window.bootstrap?.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
        jumpToEnquiryWithProgram(program.title, "program-enquiry");
      };
    }

    const brochureWrap = modalEl.querySelector("#modal-prog-brochure-wrap");
    if (brochureWrap) {
      if (program.brochureUrl) {
        brochureWrap.innerHTML = `<a href="${resolvePath(program.brochureUrl)}" download class="btn-devix-outline btn-devix-sm"><i class="fa-solid fa-file-arrow-down me-1"></i> Download Brochure</a>`;
      } else {
        brochureWrap.innerHTML = `<button type="button" class="btn-devix-outline btn-devix-sm" id="modal-request-syllabus-btn"><i class="fa-regular fa-file-lines me-1"></i> Request Syllabus</button>`;
        brochureWrap.querySelector("#modal-request-syllabus-btn").onclick = () => {
          const bsModal = window.bootstrap?.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
          jumpToEnquiryWithProgram(
            program.title,
            "syllabus-request",
            `Please share the detailed syllabus brochure for ${program.title}.`
          );
        };
      }
    }

    if (window.bootstrap?.Modal) {
      const instance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      instance.show();
    }
  }

  /**
   * Scroll to main enquiry form (or navigate to contact page) and pre-fill the selected program.
   */
  function jumpToEnquiryWithProgram(programTitle, contextType, customMsg) {
    const enquirySection = document.getElementById("enquiry");
    const corporateSection = document.getElementById("corporate-enquiry");

    if (!enquirySection && corporateSection) {
      const corpMsg = document.getElementById("corp-message");
      if (corpMsg && customMsg) {
        corpMsg.value = customMsg;
      } else if (corpMsg && programTitle) {
        corpMsg.value = `We are interested in ${programTitle} corporate training for our organization.`;
      }
      if (window.devixLenis) {
        window.devixLenis.scrollTo(corporateSection, { offset: -72, duration: 0.9 });
      } else {
        corporateSection.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => {
        document.getElementById("corp-company")?.focus({ preventScroll: true });
      }, 550);
      return;
    }

    if (!enquirySection) {
      const targetUrl = resolvePath(
        `pages/contact.html?program=${encodeURIComponent(programTitle)}#enquiry`
      );
      window.location.href = targetUrl;
      return;
    }

    const selectEl = document.getElementById("enquiry-program");
    if (selectEl) {
      const matchOption = Array.from(selectEl.options).find(
        (opt) => opt.value.toLowerCase() === programTitle.toLowerCase()
      );
      if (matchOption) {
        selectEl.value = matchOption.value;
      }
    }

    const msgEl = document.getElementById("enquiry-message");
    if (msgEl && customMsg) {
      msgEl.value = customMsg;
    } else if (msgEl && contextType === "program-enquiry" && !msgEl.value.trim()) {
      msgEl.value = `I am interested in learning more about the ${programTitle} training program.`;
    }

    if (window.devixLenis) {
      window.devixLenis.scrollTo(enquirySection, { offset: -72, duration: 0.9 });
    } else {
      enquirySection.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      document.getElementById("enquiry-name")?.focus({ preventScroll: true });
    }, 550);
  }

  /**
   * Render Why Choose Us cards.
   */
  function renderWhyChooseUs() {
    const grid = document.getElementById("why-choose-grid");
    if (!grid || !window.DEVIX_DATA?.whyChooseUs) return;

    grid.innerHTML = window.DEVIX_DATA.whyChooseUs
      .map(
        (item) => `
        <article class="why-card">
          <div class="why-icon"><i class="fa-solid ${escapeHTML(item.icon)}" aria-hidden="true"></i></div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.desc)}</p>
        </article>
      `
      )
      .join("");

    // Subtle pointer spotlight on desktop hover
    grid.querySelectorAll(".why-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    });
  }

  /**
   * Render Corporate Tracks list.
   */
  function renderCorporateTracks() {
    const list = document.getElementById("corporate-tracks-list");
    if (!list || !window.DEVIX_DATA?.corporateTracks) return;

    list.innerHTML = window.DEVIX_DATA.corporateTracks
      .map(
        (t) => `
        <div class="col-md-6">
          <div class="corporate-track-item h-100">
            <div class="corporate-track-icon"><i class="${escapeHTML(t.icon.startsWith("fa-brands") ? t.icon : "fa-solid " + t.icon)}" aria-hidden="true"></i></div>
            <div>
              <h4 class="h6 text-white mb-1">${escapeHTML(t.title)}</h4>
              <p class="text-secondary-custom small mb-0">${escapeHTML(t.desc)}</p>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  /**
   * Render Testimonials Carousel (Swiper.js).
   */
  function renderTestimonials() {
    const wrapper = document.getElementById("testimonials-swiper-wrapper");
    if (!wrapper || !window.DEVIX_DATA?.testimonials) return;

    wrapper.innerHTML = window.DEVIX_DATA.testimonials
      .map((item) => {
        const initials = item.name
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("");
        const stars = Array.from({ length: item.rating || 5 })
          .map(() => `<i class="fa-solid fa-star" aria-hidden="true"></i>`)
          .join("");
        const avatarHtml = item.avatar
          ? `<div class="testimonial-avatar"><img src="${resolvePath(item.avatar)}" alt="${escapeHTML(item.name)}" width="50" height="50" loading="lazy" /></div>`
          : `<div class="testimonial-avatar" aria-hidden="true">${escapeHTML(initials)}</div>`;
        return `
          <div class="swiper-slide h-auto">
            <article class="testimonial-card">
              <div>
                <div class="d-flex align-items-center justify-content-between gap-2">
                  <div class="testimonial-stars" aria-label="${item.rating} out of 5 stars">${stars}</div>
                  <span class="badge rounded-pill" style="background: rgba(139,92,246,0.16); color: #A78BFA; border: 1px solid rgba(167,139,250,0.3); font-size: 0.68rem;">
                    ${escapeHTML(item.program)}
                  </span>
                </div>
                <p class="testimonial-quote">"${escapeHTML(item.quote)}"</p>
              </div>
              <div class="d-flex align-items-center gap-3 pt-3 border-top" style="border-color: var(--border-subtle) !important;">
                ${avatarHtml}
                <div>
                  <div class="fw-semibold text-white small">${escapeHTML(item.name)}</div>
                  <div class="text-secondary-custom" style="font-size: 0.78rem;">${escapeHTML(item.role)}</div>
                  <div class="text-cyan" style="font-size: 0.72rem;">${escapeHTML(item.organization)}</div>
                </div>
              </div>
            </article>
          </div>
        `;
      })
      .join("");

    if (window.Swiper) {
      const swiperEl = document.getElementById("testimonials-swiper");
      if (swiperEl) {
        const swiperInstance = new window.Swiper(swiperEl, {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 4800,
            disableOnInteraction: false
          },
          pagination: {
            el: "#testimonials-pagination",
            clickable: true
          },
          navigation: {
            prevEl: "#testimonials-prev",
            nextEl: "#testimonials-next"
          },
          breakpoints: {
            768: { slidesPerView: 2 },
            1100: { slidesPerView: 3 }
          }
        });

        swiperEl.addEventListener("mouseenter", () => swiperInstance.autoplay?.stop());
        swiperEl.addEventListener("mouseleave", () => swiperInstance.autoplay?.start());
      }
    }
  }

  /**
   * Render Lead Trainer + Specialist Mentors Team Grid.
   */
  function renderTrainers() {
    const leadSlot = document.getElementById("lead-trainer-slot");
    const teamGrid = document.getElementById("team-trainers-grid");
    const trainers = window.DEVIX_DATA?.trainers || [];
    const lead = trainers.find((t) => t.isLead);
    const others = trainers.filter((t) => !t.isLead);

    if (leadSlot && lead) {
      const reviewsBtn = lead.social?.reviews
        ? `<a href="${escapeHTML(lead.social.reviews)}" target="_blank" rel="noopener noreferrer" class="btn-devix-outline btn-devix-sm ms-2" style="padding: 6px 14px; font-size: 0.78rem;">Verified Student Reviews <i class="fa-solid fa-arrow-up-right-from-square ms-1"></i></a>`
        : "";
      leadSlot.innerHTML = `
        <article class="lead-trainer-card" style="${others.length === 0 ? "margin-bottom: 0;" : ""}">
          <div class="row align-items-center g-4">
            <div class="col-md-auto text-center text-md-start">
              <img src="${resolvePath(lead.image)}" alt="${escapeHTML(lead.imageAlt)}" class="lead-trainer-photo mx-auto" width="260" height="260" loading="lazy" />
            </div>
            <div class="col-md">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span class="section-kicker mb-0"><span class="kicker-dot"></span>Lead Technical Trainer</span>
                <span class="font-mono-label text-cyan" style="font-size: 0.72rem;">${escapeHTML(lead.badgeNote || "@iamramsir • Indore, India")}</span>
              </div>
              <h3 class="h3 text-white mb-1">${escapeHTML(lead.name)}</h3>
              <div class="text-cyan fw-semibold mb-3">${escapeHTML(lead.designation)}</div>
              <p class="text-secondary-custom mb-3">${escapeHTML(lead.bio)}</p>
              <div class="d-flex flex-wrap gap-2 mb-3">
                ${lead.expertise.map((skill) => `<span class="topic-chip">${escapeHTML(skill)}</span>`).join("")}
              </div>
              <div class="d-flex flex-wrap align-items-center gap-2">
                <a href="${escapeHTML(lead.social.github)}" target="_blank" rel="noopener noreferrer" class="trainer-social-btn" aria-label="Ramgopal Prajapati GitHub"><i class="fa-brands fa-github"></i></a>
                <a href="${escapeHTML(lead.social.linkedin)}" target="_blank" rel="noopener noreferrer" class="trainer-social-btn" aria-label="Ramgopal Prajapati LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                ${reviewsBtn}
              </div>
            </div>
          </div>
        </article>
      `;
    }

    if (teamGrid) {
      if (!others.length) {
        teamGrid.style.display = "none";
        teamGrid.innerHTML = "";
        return;
      }
      teamGrid.style.display = "";
      teamGrid.innerHTML = others
        .map(
          (t) => `
          <div class="col-md-6 col-lg-4">
            <article class="trainer-card">
              <img src="${resolvePath(t.image)}" alt="${escapeHTML(t.imageAlt)}" class="trainer-photo" width="380" height="380" loading="lazy" />
              <h3 class="h5 text-white mb-1">${escapeHTML(t.name)}</h3>
              <div class="text-cyan small fw-semibold mb-2">${escapeHTML(t.designation)}</div>
              <p class="text-secondary-custom small mb-3 flex-grow-1">${escapeHTML(t.bio)}</p>
              <div class="d-flex flex-wrap gap-1 mb-3">
                ${t.expertise.map((skill) => `<span class="topic-chip">${escapeHTML(skill)}</span>`).join("")}
              </div>
              <div class="d-flex align-items-center gap-2 pt-2 border-top" style="border-color: var(--border-subtle) !important;">
                <a href="${escapeHTML(t.social.linkedin)}" target="_blank" rel="noopener noreferrer" class="trainer-social-btn" aria-label="${escapeHTML(t.name)} LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="${escapeHTML(t.social.github)}" target="_blank" rel="noopener noreferrer" class="trainer-social-btn" aria-label="${escapeHTML(t.name)} GitHub"><i class="fa-brands fa-github"></i></a>
              </div>
            </article>
          </div>
        `
        )
        .join("");
    }
  }

  /**
   * Populate FAQ Accordion cleanly with ARIA attributes.
   */
  function renderFAQs() {
    const list = document.getElementById("faq-accordion-list");
    if (!list || !window.DEVIX_DATA?.faqs) return;

    list.innerHTML = window.DEVIX_DATA.faqs
      .map(
        (faq, idx) => `
        <article class="faq-item ${idx === 0 ? "is-open" : ""}">
          <h3 class="m-0">
            <button
              type="button"
              class="faq-trigger"
              aria-expanded="${idx === 0 ? "true" : "false"}"
              aria-controls="faq-panel-${idx}"
              id="faq-btn-${idx}"
            >
              <span>${escapeHTML(faq.question)}</span>
              <span class="faq-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-down"></i></span>
            </button>
          </h3>
          <div id="faq-panel-${idx}" class="faq-panel" role="region" aria-labelledby="faq-btn-${idx}">
            <div class="faq-panel-inner">
              <p class="faq-answer">${escapeHTML(faq.answer)}</p>
            </div>
          </div>
        </article>
      `
      )
      .join("");

    list.querySelectorAll(".faq-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item = trigger.closest(".faq-item");
        const isOpen = item.classList.contains("is-open");
        // Smooth toggle without locking other items strictly, or clean accordion toggle
        item.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /**
   * Populate Program <select> options inside Enquiry & Internship forms.
   */
  function populateProgramSelects() {
    const programs = window.DEVIX_DATA?.programs || [];
    const params = new URLSearchParams(window.location.search);
    const preselected = params.get("program");

    const mainSelect = document.getElementById("enquiry-program");
    if (mainSelect) {
      const currentVal = mainSelect.value;
      const optionsHtml = [
        `<option value="">Select Interested Program</option>`,
        ...programs.map((p) => `<option value="${escapeHTML(p.title)}">${escapeHTML(p.title)}</option>`),
        `<option value="Corporate Training">Corporate / Custom Team Training</option>`,
        `<option value="Guidance / Consultation">Not sure yet — Recommend a Program</option>`
      ].join("");
      mainSelect.innerHTML = optionsHtml;

      if (preselected) {
        const match = Array.from(mainSelect.options).find(
          (o) =>
            o.value.toLowerCase() === preselected.toLowerCase() ||
            o.value.toLowerCase().replace(/\s+/g, "-") === preselected.toLowerCase()
        );
        if (match) mainSelect.value = match.value;
      } else if (currentVal) {
        mainSelect.value = currentVal;
      }
    }

    const internSelect = document.getElementById("intern-technology");
    if (internSelect) {
      const currentInternVal = internSelect.value;
      internSelect.innerHTML = [
        `<option value="">Select Interested Technology</option>`,
        ...programs.map((p) => `<option value="${escapeHTML(p.title)}">${escapeHTML(p.title)}</option>`)
      ].join("");
      if (currentInternVal) {
        internSelect.value = currentInternVal;
      }
    }
  }

  // Expose helper utilities cleanly
  window.DEVIX_UTILS = {
    resolvePath,
    buildWhatsAppUrl,
    escapeHTML,
    openProgramModal,
    jumpToEnquiryWithProgram
  };

  document.addEventListener("DOMContentLoaded", () => {
    const safeRun = (fn) => {
      try {
        fn();
      } catch (err) {
        if (window.console && typeof window.console.error === "function") {
          window.console.error("[DeviX Init Error]", fn?.name || "step", err);
        }
      }
    };

    safeRun(initLoader);
    safeRun(populateProgramSelects);
    safeRun(initWhatsAppBindings);
    safeRun(initNavigationAndScrollUI);
    safeRun(renderPartnersMarquee);
    safeRun(renderStatistics);
    safeRun(renderProgramsGrid);
    safeRun(renderWhyChooseUs);
    safeRun(renderCorporateTracks);
    safeRun(renderTestimonials);
    safeRun(renderTrainers);
    safeRun(renderFAQs);
  });
})();
