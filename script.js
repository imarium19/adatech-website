// Minimal JavaScript for AdaSphere Tech
// - Mobile navigation toggle
// - Dynamic footer year

document.addEventListener("DOMContentLoaded", () => {
  // Hero carousel (Print House)
  const heroCarousel = document.querySelector(".hero-carousel");
  if (heroCarousel) {
    const slides = heroCarousel.querySelectorAll(".hero-slide");
    const dots = heroCarousel.querySelectorAll(".hero-dot");
    const prevBtn = heroCarousel.querySelector(".hero-prev");
    const nextBtn = heroCarousel.querySelector(".hero-next");
    const total = slides.length;
    let current = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
      current = (index + total) % total;
      slides.forEach((s, i) => s.classList.toggle("hero-slide-active", i === current));
      dots.forEach((d, i) => {
        d.classList.toggle("hero-dot-active", i === current);
        d.setAttribute("aria-selected", i === current);
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    heroCarousel.addEventListener("mouseenter", stopAutoplay);
    heroCarousel.addEventListener("mouseleave", startAutoplay);

    prevBtn?.addEventListener("click", () => { goToSlide(current - 1); startAutoplay(); });
    nextBtn?.addEventListener("click", () => { goToSlide(current + 1); startAutoplay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => { goToSlide(i); startAutoplay(); });
    });

    startAutoplay();
  }

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) {
        document.querySelectorAll(".nav-item--dropdown.is-open").forEach(el => {
          el.classList.remove("is-open");
          const t = el.querySelector(".nav-trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        });
      }
    });

    // Close nav when clicking a link (mobile)
    nav.addEventListener("click", event => {
      const target = event.target;
      if (target instanceof HTMLElement && target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.querySelectorAll(".nav-item--dropdown.is-open").forEach(el => {
          el.classList.remove("is-open");
          const t = el.querySelector(".nav-trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  // Services dropdown: mobile expand/collapse
  const servicesTrigger = document.querySelector(".nav-trigger");
  const servicesDropdown = document.querySelector(".nav-item--dropdown");
  if (servicesTrigger && servicesDropdown) {
    servicesTrigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = servicesDropdown.classList.toggle("is-open");
        servicesTrigger.setAttribute("aria-expanded", String(isOpen));
      }
    });
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // Subnav scrollspy: set .active on the link whose section is in view
  const subnav = document.querySelector(".subnav");
  if (subnav) {
    const links = subnav.querySelectorAll('a[href^="#"]');
    const sectionIds = Array.from(links).map(a => a.getAttribute("href").slice(1));
    const offset = 120;

    function setActive() {
      const y = window.scrollY + offset;
      let current = "";
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) {
          current = id;
        }
      });
      if (!current && sectionIds.length) current = sectionIds[0];
      links.forEach(a => {
        const href = a.getAttribute("href").slice(1);
        a.classList.toggle("active", href === current);
      });
    }

    setActive();
    window.addEventListener("scroll", setActive, { passive: true });
  }

  // Certifications interactive detail panel (Print House page)
  const certGrid = document.querySelector(".certifications-section .cert-grid");
  const certDetailPanel = document.querySelector(".certifications-section .cert-detail-panel");

  if (certGrid && certDetailPanel) {
    const certCards = certGrid.querySelectorAll(".cert-item");
    const detailCloseBtn = certDetailPanel.querySelector(".cert-detail-close");
    const detailTitle = certDetailPanel.querySelector(".cert-detail-title");
    const detailBody = certDetailPanel.querySelector(".cert-detail-body");
    const detailList = certDetailPanel.querySelector(".cert-detail-list");
    const detailLink = certDetailPanel.querySelector(".cert-detail-link");

    const certDetails = {
      "g7-expert": {
        title: "G7+™ Expert",
        body:
          "Individuals certified by PRINTING United Alliance\u00ae who lead implementation, calibration, and maintenance of G7\u00ae across devices and facilities. AdaSphere supports G7\u00ae-aligned production; certification authority is PRINTING United Alliance\u00ae.",
        bullets: [
          "Leads neutral gray calibration and process control.",
          "Advises on proof-to-press and device alignment.",
          "Supports standard operating procedures for color.",
          "Provides guidance on continuous improvement programs."
        ]
      },
      "cmp": {
        title: "Color Management Professional (CMP)",
        body:
          "Individual training focused on building and maintaining predictable color workflows from file preparation through print.",
        bullets: [
          "Understands device characterization and profiling.",
          "Connects creative intent with measurable print targets.",
          "Helps translate brand color requirements into production."
        ]
      },
      "idealliance": {
        title: "PRINTING United Alliance\u00ae",
        body:
          "Global print and graphic arts association that administers G7\u00ae and related certification programs.",
        bullets: [],
        linkHref: "https://www.printing.org/",
        linkLabel: "Learn More on PRINTING United \u2192"
      }
    };

    function setPanelHeight() {
      // Reset to allow recalculation, then set to new scrollHeight for smooth animation
      certDetailPanel.style.maxHeight = "0px";
      requestAnimationFrame(() => {
        const targetHeight = certDetailPanel.scrollHeight;
        certDetailPanel.style.maxHeight = `${targetHeight}px`;
      });
    }

    function closeCertificationPanel() {
      certDetailPanel.classList.remove("is-open");
      certDetailPanel.setAttribute("aria-expanded", "false");
      certDetailPanel.hidden = true;
      certDetailPanel.style.maxHeight = "0px";
      certCards.forEach(c => c.classList.remove("is-active"));
    }

    function renderCertification(key) {
      const data = certDetails[key];
      if (!data || !detailTitle || !detailBody || !detailList) return;

      detailTitle.textContent = data.title;
      detailBody.textContent = data.body;

      detailList.innerHTML = "";
      if (data.bullets && data.bullets.length) {
        detailList.hidden = false;
        data.bullets.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          detailList.appendChild(li);
        });
      } else {
        detailList.hidden = true;
      }

      if (detailLink) {
        if (data.linkHref) {
          detailLink.href = data.linkHref;
          detailLink.textContent = data.linkLabel || "Learn More";
          detailLink.hidden = false;
        } else {
          detailLink.hidden = true;
        }
      }

      if (certDetailPanel.hasAttribute("hidden")) {
        certDetailPanel.removeAttribute("hidden");
      }
      certDetailPanel.classList.add("is-open");
      certDetailPanel.setAttribute("aria-expanded", "true");
      setPanelHeight();
    }

    certCards.forEach(card => {
      card.addEventListener("click", () => {
        const key = card.getAttribute("data-cert");
        if (!key) return;

        certCards.forEach(c => c.classList.toggle("is-active", c === card));
        renderCertification(key);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    detailCloseBtn?.addEventListener("click", () => {
      closeCertificationPanel();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!certDetailPanel.classList.contains("is-open")) return;
      closeCertificationPanel();
      detailCloseBtn?.blur();
    });
  }

  // Color control video modal
  const videoModal = document.getElementById("video-modal");
  const videoModalPlayer = document.getElementById("video-modal-player");
  const videoModalClose = document.querySelector(".video-modal-close");
  const videoModalBackdrop = document.querySelector(".video-modal-backdrop");
  const colorControlCards = document.querySelectorAll(".color-control-video-card");

  function openVideoModal(src) {
    if (!videoModal || !videoModalPlayer) return;
    const source = videoModalPlayer.querySelector("source");
    if (source) {
      source.src = src;
      videoModalPlayer.load();
    }
    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeVideoModal() {
    if (!videoModal || !videoModalPlayer) return;
    videoModalPlayer.pause();
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (videoModal) {
    videoModalClose?.addEventListener("click", closeVideoModal);
    videoModalBackdrop?.addEventListener("click", closeVideoModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && videoModal.classList.contains("is-open")) {
        closeVideoModal();
      }
    });
  }

  colorControlCards.forEach((card) => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-video-src");
      if (src) openVideoModal(src);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Certificate lightbox (Print House)
  const certLightbox = document.getElementById("certificate-lightbox");
  const certLightboxImg = document.getElementById("certificate-lightbox-img");
  const certLightboxClose = document.querySelector(".certificate-lightbox-close");
  const certLightboxBackdrop = document.querySelector(".certificate-lightbox-backdrop");
  const certificateCards = document.querySelectorAll(".certificate-card");

  function openCertificateLightbox(src, alt) {
    if (!certLightbox || !certLightboxImg) return;
    certLightboxImg.src = src;
    certLightboxImg.alt = alt || "Certificate";
    certLightbox.classList.add("is-open");
    certLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCertificateLightbox() {
    if (!certLightbox || !certLightboxImg) return;
    certLightbox.classList.remove("is-open");
    certLightbox.setAttribute("aria-hidden", "true");
    certLightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  if (certLightbox) {
    certLightboxClose?.addEventListener("click", closeCertificateLightbox);
    certLightboxBackdrop?.addEventListener("click", closeCertificateLightbox);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && certLightbox.classList.contains("is-open")) {
        closeCertificateLightbox();
      }
    });
  }

  certificateCards.forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector(".certificate-frame img");
      if (img?.src) {
        openCertificateLightbox(img.src, img.alt || "Certificate");
      }
    });
  });

  const certTrack = document.querySelector(".certificate-track");
  const certScrollPrev = document.querySelector(".certificate-scroll-prev");
  const certScrollNext = document.querySelector(".certificate-scroll-next");
  if (certTrack && (certScrollPrev || certScrollNext)) {
    function getScrollStep() {
      const first = certTrack.querySelector(".certificate-card");
      const gap = 24;
      return first ? first.offsetWidth + gap : 304;
    }
    function updateCertScrollButtons() {
      const atStart = certTrack.scrollLeft <= 1;
      const atEnd = certTrack.scrollLeft >= certTrack.scrollWidth - certTrack.clientWidth - 1;
      certScrollPrev?.classList.toggle("is-at-start", atStart);
      certScrollNext?.classList.toggle("is-at-end", atEnd);
    }
    certTrack.addEventListener("scroll", updateCertScrollButtons);
    window.addEventListener("resize", updateCertScrollButtons);
    updateCertScrollButtons();
    certScrollPrev?.addEventListener("click", () => {
      certTrack.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });
    certScrollNext?.addEventListener("click", () => {
      certTrack.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });
  }

  // Contact form -> Google Apps Script endpoint
  const contactForm = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  const ENDPOINT_URL =
    "https://script.google.com/macros/s/AKfycbwVeqQ7WB7M_M_wTDyX2qPUl24acJgTqRxIqBmk9G8oThGG3jAFeGuXJjwfVXmw94zX/exec";

  if (contactForm) {
    contactForm.addEventListener("submit", async event => {
      event.preventDefault();

      if (statusEl) {
        statusEl.textContent = "";
        statusEl.classList.remove("form-status--success", "form-status--error");
      }

      const formData = new FormData(contactForm);
      const payload = {
        name: (formData.get("name") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        company: (formData.get("company") || "").toString().trim(),
        message: (formData.get("message") || "").toString().trim()
      };

      if (!payload.name || !payload.email || !payload.message) {
        if (statusEl) {
          statusEl.textContent = "Please fill in all required fields.";
          statusEl.classList.add("form-status--error");
        }
        return;
      }

      try {
        // Send JSON without custom headers so the request stays "simple"
        // and avoids a CORS preflight that Apps Script blocks.
        const response = await fetch(ENDPOINT_URL, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        // If the request reaches Apps Script, treat it as success.
        if (!response || !response.ok) {
          throw new Error(`Request failed`);
        }

        contactForm.reset();

        if (statusEl) {
          statusEl.textContent = "Thank you. Your message has been sent.";
          statusEl.classList.add("form-status--success");
        }
      } catch (error) {
        console.error(error);
        if (statusEl) {
          statusEl.textContent =
            "Sorry, something went wrong. Please try again in a moment.";
          statusEl.classList.add("form-status--error");
        }
      }
    });
  }

  // Production Workflow Solutions: hover image swap, click dropdown
  const workflowBlocks = document.querySelectorAll(".workflow-block");
  workflowBlocks.forEach((block) => {
    const imagePanel = block.querySelector(".workflow-image-panel");
    const images = block.querySelectorAll(".workflow-image");
    const listItems = block.querySelectorAll(".workflow-list-item");

    if (!imagePanel || !images.length || !listItems.length) return;

    function setActiveImage(itemId) {
      images.forEach((img) => {
        const isActive = itemId
          ? img.getAttribute("data-item") === itemId
          : img === imagePanel.querySelector(".workflow-image:first-child");
        img.classList.toggle("workflow-image-active", isActive);
      });
    }

    function setDefaultImage() {
      images.forEach((img, i) => {
        img.classList.toggle("workflow-image-active", i === 0);
      });
    }

    listItems.forEach((item) => {
      const itemId = item.getAttribute("data-image");

      item.addEventListener("mouseenter", () => setActiveImage(itemId));
      item.addEventListener("mouseleave", () => {
        const openItem = block.querySelector(".workflow-list-item.is-open");
        if (!openItem) setDefaultImage();
        else setActiveImage(openItem.getAttribute("data-image"));
      });

      item.addEventListener("click", (e) => {
        if (e.target.closest("a[href^='http']")) return;
        e.preventDefault();
        const wasOpen = item.classList.contains("is-open");
        listItems.forEach((li) => li.classList.remove("is-open"));
        if (!wasOpen) {
          item.classList.add("is-open");
          setActiveImage(itemId);
        } else {
          setDefaultImage();
        }
      });
    });
  });
});

