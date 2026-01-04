(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav toggle
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  if (menuBtn && navLinks) {
    const toggle = () => {
      const open = navLinks.getAttribute("data-open") === "true";
      navLinks.setAttribute("data-open", String(!open));
      menuBtn.setAttribute("aria-expanded", String(!open));
    };
    menuBtn.addEventListener("click", toggle);
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.setAttribute("data-open", "false");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scroll for same-page anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = id && id !== "#" ? $(id) : null;
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // close menu on mobile
        if (navLinks) navLinks.setAttribute("data-open", "false");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Lightbox
  const lb = $("#lightbox");
  const lbImg = $("#lightboxImg");
  const lbTitle = $("#lightboxTitle");
  const lbClose = $("#lightboxClose");

  const openLightbox = (src, title) => {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = title || "Screenshot";
    if (lbTitle) lbTitle.textContent = title || "Screenshot";
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lb) return;
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lbImg) lbImg.src = "";
  };

  if (lb && lbClose) {
    lbClose.addEventListener("click", closeLightbox);
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  $$("[data-lightbox]").forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
      const title = btn.getAttribute("data-title") || btn.querySelector("figcaption")?.textContent?.trim();
      if (src) openLightbox(src, title);
    });
  });

  // Simple screenshot filters (optional)
  const filterWrap = $("#shotFilters");
  if (filterWrap) {
    const items = $$("[data-shot]", document);
    $$("#shotFilters button").forEach(b => {
      b.addEventListener("click", () => {
        const key = b.getAttribute("data-filter");
        $$("#shotFilters button").forEach(x => x.classList.remove("btn-primary"));
        b.classList.add("btn-primary");
        items.forEach(it => {
          const cat = it.getAttribute("data-shot");
          it.style.display = (!key || key === "all" || cat === key) ? "" : "none";
        });
      });
    });
  }

  // Demo form helper: prevent blank submissions
  const contactForm = $("#contactForm");
  const formMsg = $("#formMsg");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      // Keep as front-end only. In Wix, replace with Wix Forms.
      e.preventDefault();
      if (formMsg) {
        formMsg.textContent = "Thanks! This template form doesn’t send messages yet. In Wix, replace it with a Wix Form (or connect this form to a backend).";
        formMsg.style.display = "block";
      }
      contactForm.reset();
    });
  }
})();
