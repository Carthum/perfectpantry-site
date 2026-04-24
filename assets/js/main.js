(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const openNav = (isOpen, button, nav) => {
    nav.setAttribute("data-open", String(isOpen));
    button.setAttribute("aria-expanded", String(isOpen));
  };

  const setupNav = () => {
    const button = $("[data-menu-toggle]");
    const nav = $("[data-nav]");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = nav.getAttribute("data-open") === "true";
      openNav(!isOpen, button, nav);
    });

    document.addEventListener("click", (event) => {
      if (nav.contains(event.target) || button.contains(event.target)) return;
      openNav(false, button, nav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      openNav(false, button, nav);
    });
  };

  const setupAnchorClose = () => {
    const button = $("[data-menu-toggle]");
    const nav = $("[data-nav]");
    if (!button || !nav) return;

    $$("a", nav).forEach((anchor) => {
      anchor.addEventListener("click", () => {
        openNav(false, button, nav);
      });
    });
  };

  const setupReveal = () => {
    const revealNodes = $$('[data-reveal]');
    if (!revealNodes.length) return;

    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    revealNodes.forEach((node) => observer.observe(node));
  };

  const setupYear = () => {
    const year = String(new Date().getFullYear());
    $$('[data-year]').forEach((node) => {
      node.textContent = year;
    });
  };

  const showMessage = (node, message, state) => {
    if (!node) return;
    node.hidden = false;
    node.textContent = message;
    node.dataset.state = state;
  };

  const buildMailto = (subject, bodyLines) => {
    const target = "support@pantryandplate.app";
    const payload = bodyLines.join("\n");
    return `mailto:${target}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(payload)}`;
  };

  const setupSupportForm = () => {
    const form = $("#supportForm");
    const msg = $("#supportMessage");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const email = String(data.get("email") || "").trim();
      const details = String(data.get("details") || "").trim();

      if (!email || !details) {
        showMessage(
          msg,
          "Please include your email and a short description so we can help.",
          "error",
        );
        return;
      }

      const subject = `Pantry & Plate support: ${String(data.get("category") || "General")}`;
      const lines = [
        "Support request",
        "",
        `Name: ${String(data.get("name") || "").trim() || "Not provided"}`,
        `Email: ${email}`,
        `Category: ${String(data.get("category") || "General")}`,
        `Device: ${String(data.get("device") || "Not provided")}`,
        `App version: ${String(data.get("app_version") || "Not provided")}`,
        "",
        "Details:",
        details,
      ];

      window.location.href = buildMailto(subject, lines);
      showMessage(
        msg,
        "Your mail app should open now with the support draft. If it does not, email support@pantryandplate.app directly.",
        "success",
      );
      form.reset();
    });
  };

  const setupShotFilter = () => {
    const group = $("[data-filter-group]");
    if (!group) return;

    const buttons = $$("[data-filter]", group);
    const cards = $$("[data-shot]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const activeKey = button.dataset.filter || "all";

        buttons.forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });

        cards.forEach((card) => {
          const cardKey = card.dataset.shot || "";
          const show = activeKey === "all" || activeKey === cardKey;
          card.hidden = !show;
        });
      });
    });
  };

  const setupLightbox = () => {
    const modal = $("[data-lightbox-modal]");
    const image = $("[data-lightbox-image]");
    const title = $("[data-lightbox-title]");
    const copy = $("[data-lightbox-caption]");
    const closeButton = $("[data-lightbox-close]");

    if (!modal || !image || !title || !copy) return;

    title.id = title.id || "lightbox-title";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", title.id);
    modal.tabIndex = -1;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    let lastFocused = null;

    const focusableNodes = () =>
      Array.from(modal.querySelectorAll(focusableSelector)).filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

    const close = () => {
      const wasOpen = modal.getAttribute("aria-hidden") === "false";
      modal.setAttribute("aria-hidden", "true");
      image.removeAttribute("src");
      image.removeAttribute("alt");
      document.body.style.overflow = "";
      if (wasOpen && lastFocused && document.contains(lastFocused)) {
        lastFocused.focus({ preventScroll: true });
      }
      lastFocused = null;
    };

    const open = (node) => {
      const src = node.dataset.src;
      if (!src) return;

      lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      image.src = src;
      image.alt = node.dataset.title || "Pantry & Plate screenshot";
      title.textContent = node.dataset.title || "Screenshot";
      copy.textContent = node.dataset.caption || "";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(() => {
        const target = closeButton || focusableNodes()[0] || modal;
        if (target && typeof target.focus === "function") target.focus({ preventScroll: true });
      });
    };

    $$('[data-lightbox]').forEach((node) => {
      const activate = () => open(node);

      node.addEventListener("click", activate);
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", close);
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });

    document.addEventListener("keydown", (event) => {
      if (modal.getAttribute("aria-hidden") !== "false") return;
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusableNodes();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    });
  };

  setupNav();
  setupAnchorClose();
  setupReveal();
  setupYear();
  setupSupportForm();
  setupShotFilter();
  setupLightbox();
})();
