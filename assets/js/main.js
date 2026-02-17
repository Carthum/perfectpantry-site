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
    const target = "support@perfectpantryapp.com";
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

      const subject = `Perfect Pantry support: ${String(data.get("category") || "General")}`;
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
        "Your mail app should open now with the support draft. If it does not, email support@perfectpantryapp.com directly.",
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

    const close = () => {
      modal.setAttribute("aria-hidden", "true");
      image.removeAttribute("src");
      image.removeAttribute("alt");
      document.body.style.overflow = "";
    };

    const open = (node) => {
      const src = node.dataset.src;
      if (!src) return;

      image.src = src;
      image.alt = node.dataset.title || "Perfect Pantry screenshot";
      title.textContent = node.dataset.title || "Screenshot";
      copy.textContent = node.dataset.caption || "";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
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
      if (event.key === "Escape") close();
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
