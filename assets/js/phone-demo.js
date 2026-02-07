(() => {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const readCssPxVar = (name, fallback) => {
    const raw = String(
      getComputedStyle(document.documentElement).getPropertyValue(name) || "",
    ).trim();
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const prefersReducedMotion = () =>
    !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

  const actionOpenModal = (id) => ({ type: "open_modal", id });
  const actionCloseModal = () => ({ type: "close_modal" });

  // Single source of truth for the demo.
  // Each step owns BOTH the left copy and the right phone UI state.
  // Later we can add `hotspots` per-step without touching the scroll engine.
  const STEPS = [
    {
      id: "welcome",
      bg: "home",
      tab: null,
      copy: {
        variant: "hero",
        eyebrow: "Mobile app in active development",
        title: "The weekly food loop, finally in one place.",
        description:
          "Perfect Pantry connects recipes, pantry inventory, meal planning, and shopping into one calm loop so dinner decisions get faster, grocery runs get cleaner, and food waste drops.",
        ctas: [
          { label: "Get early access", href: "#waitlist", className: "btn btn-primary" },
          { label: "Start the demo", href: "#guided-tour", className: "btn btn-outline" },
          { label: "Skip tour", href: "#tour-after", className: "btn btn-ghost" },
        ],
        notes: [
          "Scroll to move the phone through Home, Pantry, Cookbook, Plan, and Shop.",
          "Marketing site only for now. No memberships or checkout on the website.",
        ],
      },
    },
    {
      id: "home",
      bg: "home",
      tab: "home",
      copy: {
        kicker: "Home",
        title: "Start with a calm weekly dashboard",
        description:
          "Home keeps the week visible: what is coming up, what needs restocking, and what to do next without digging through multiple views.",
        bullets: [
          { strong: "Try it:", text: "tap the Quick Actions area on the phone." },
          { strong: "Why it matters:", text: "fewer decisions, faster momentum." },
        ],
      },
    },
    {
      id: "pantry",
      bg: "pantry",
      tab: "pantry",
      copy: {
        kicker: "Pantry",
        title: "Inventory that stays lightweight",
        description:
          "Track staples, quantities, and timing without turning your pantry into a second job. List and shelf-style views keep it usable.",
        bullets: [
          { strong: "Try it:", text: "tap an item row to open the detail preview." },
          {
            strong: "Why it matters:",
            text: "plan and shop with real coverage, not guesses.",
          },
        ],
      },
    },
    {
      id: "cookbook",
      bg: "cookbook",
      tab: "cookbook",
      copy: {
        kicker: "Cookbook",
        title: "Your household cookbook, private by default",
        description:
          "Save recipes your household actually repeats. The detail view is optimized for cooking flow, not endless scrolling.",
        bullets: [
          { strong: "Try it:", text: "tap a recipe card to preview the detail layout." },
          {
            strong: "Why it matters:",
            text: "reliable repeats and faster weeknight execution.",
          },
        ],
      },
    },
    {
      id: "plan",
      bg: "home",
      tab: "plan",
      copy: {
        kicker: "Plan",
        title: "Place meals into the week in seconds",
        description:
          "Build a realistic baseline plan, then adjust without breaking everything. Planning is where time and pantry coverage tradeoffs become clear.",
        bullets: [
          { strong: "Try it:", text: "tap a meal slot to open the slot detail preview." },
          {
            strong: "Why it matters:",
            text: "fewer midweek pivots and less last-minute shopping.",
          },
        ],
      },
    },
    {
      id: "shop",
      bg: "shopping",
      tab: "shop",
      copy: {
        kicker: "Shop",
        title: "Shop the gap, not the whole pantry",
        description:
          "The list is generated from what your plan needs compared to what your pantry already covers, so trips stay clean and focused.",
        bullets: [
          {
            strong: "Try it:",
            text: "tap an item to preview the bulk picker and detail view.",
          },
          { strong: "Why it matters:", text: "fewer duplicates, less waste." },
        ],
        ctas: [
          { label: "Continue down the page", href: "#tour-after", className: "btn btn-primary" },
        ],
      },
    },
  ];

  const MODAL_SCREENS = [
    {
      id: "home-add-recipe",
      bg: "home",
      tab: "home",
      sheet: { title: "Add New Recipe", kind: "add_recipe" },
      copy: {
        kicker: "Quick Actions",
        title: "Add New Recipe",
        description:
          "This opens the same add-recipe surface the app uses. We'll refine the fields and buttons next.",
      },
    },
    {
      id: "home-add-pantry-item",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Pantry Item", kind: "add_pantry_item" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Pantry Item",
        description:
          "This opens the same add-item surface the app uses. We'll tighten the flow once you confirm the exact UI.",
      },
    },
  ];

  const preloadImages = (paths) => {
    const uniq = Array.from(new Set((paths || []).filter(Boolean)));
    uniq.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    });
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  };

  const setNodeInert = (node, inert) => {
    if (!node) return;
    if ("inert" in node) node.inert = !!inert;
    node.setAttribute("aria-hidden", inert ? "true" : "false");
  };

  const setActiveCopyStep = (stepNodesById, activeId) => {
    stepNodesById.forEach((node, stepId) => {
      const isActive = stepId === activeId;
      node.classList.toggle("is-active", isActive);
      setNodeInert(node, !isActive);
    });
  };

  const buildCtas = (ctas) => {
    if (!Array.isArray(ctas) || !ctas.length) return null;
    const wrap = el("div", "hero-cta");
    ctas.forEach((cta) => {
      const a = document.createElement("a");
      a.className = cta.className || "btn btn-primary";
      a.href = cta.href || "#";
      a.textContent = cta.label || "Learn more";
      wrap.appendChild(a);
    });
    return wrap;
  };

  const buildBullets = (bullets) => {
    if (!Array.isArray(bullets) || !bullets.length) return null;
    const ul = el("ul", "list-clean pp-tour-bullets");
    bullets.forEach((b) => {
      const li = document.createElement("li");
      if (b && b.strong) {
        const strong = document.createElement("strong");
        strong.textContent = String(b.strong);
        li.appendChild(strong);
        li.appendChild(document.createTextNode(" "));
      }
      li.appendChild(document.createTextNode(String((b && b.text) || "")));
      ul.appendChild(li);
    });
    return ul;
  };

  const buildCopyArticle = (step, index) => {
    const article = document.createElement("article");
    article.className = `pp-tour-step surface${index === 0 ? " is-active" : ""}`;
    article.dataset.ppStep = step.id;

    const copy = step.copy || {};

    if (copy.variant === "hero") {
      if (copy.eyebrow) article.appendChild(el("p", "eyebrow", copy.eyebrow));
      article.appendChild(el("h1", "", copy.title || ""));
      if (copy.description) article.appendChild(el("p", "hero-lead", copy.description));

      const ctas = buildCtas(copy.ctas);
      if (ctas) article.appendChild(ctas);

      (copy.notes || []).forEach((note, idx) => {
        const p = el("p", "small", note);
        if (idx === 0) p.style.marginTop = "0.25rem";
        article.appendChild(p);
      });

      return article;
    }

    if (copy.kicker) article.appendChild(el("p", "pp-tour-kicker", copy.kicker));
    article.appendChild(el("h2", "", copy.title || ""));
    if (copy.description) article.appendChild(el("p", "muted", copy.description));

    const bullets = buildBullets(copy.bullets);
    if (bullets) article.appendChild(bullets);

    const ctas = buildCtas(copy.ctas);
    if (ctas) {
      ctas.style.marginTop = "0.9rem";
      article.appendChild(ctas);
    }

    return article;
  };

  const getStepNodesById = (stack) => {
    const map = new Map();
    stack.querySelectorAll(".pp-tour-step[data-pp-step]").forEach((node) => {
      map.set(String(node.dataset.ppStep || ""), node);
    });
    return map;
  };

  const svgElementFromString = (rawSvg) => {
    if (!rawSvg) return null;
    const tpl = document.createElement("template");
    tpl.innerHTML = String(rawSvg).trim();
    return tpl.content.firstElementChild;
  };

  const slugToLabel = (slug) => {
    switch (slug) {
      case "home":
        return "Home";
      case "pantry":
        return "Pantry";
      case "cookbook":
        return "Cookbook";
      case "plan":
        return "Plan";
      case "shop":
        return "Shop";
      default:
        return slug;
    }
  };

  // Inline SVG icons so they inherit `currentColor`.
  const TAB_SVGS = {
    home:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M10.7 3.7a1.8 1.8 0 0 1 2.6 0l7 6.9a1.2 1.2 0 0 1-1.7 1.7l-.6-.6V20a1.6 1.6 0 0 1-1.6 1.6H7.6A1.6 1.6 0 0 1 6 20v-8.3l-.6.6a1.2 1.2 0 1 1-1.7-1.7l7-6.9zM9 20h6v-6.2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V20z"/></svg>',
    pantry:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M5.5 3.5h13a2 2 0 0 1 2 2V20a1.2 1.2 0 0 1-2.4 0v-1H5.9v1A1.2 1.2 0 0 1 3.5 20V5.5a2.3 2.3 0 0 1 2-2zm.4 2.4v3.1h12.2V5.9H5.9zm0 5.5v5.2h12.2v-5.2H5.9zm2 1.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1v2.8a1 1 0 0 1-1 1H8.9a1 1 0 0 1-1-1v-2.8zm6.1-1h1.6a1 1 0 0 1 1 1v1.2a1 1 0 0 1-1 1H14a1 1 0 0 1-1-1v-1.2a1 1 0 0 1 1-1z" clip-rule="evenodd"/></svg>',
    cookbook:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M6.3 3.2h11.2A2.6 2.6 0 0 1 20 5.8v12.4a2.6 2.6 0 0 1-2.5 2.6H7.3A3.3 3.3 0 0 0 4 17.5V5.5a2.3 2.3 0 0 1 2.3-2.3zm.1 2.4a.8.8 0 0 0-.8.8v10.8c.5-.3 1.1-.4 1.7-.4h10.2c.2 0 .3-.15.3-.33V5.9c0-.17-.14-.3-.3-.3H6.4z" clip-rule="evenodd"/><path fill="currentColor" d="M14.9 18.1v3.2l-1.9-1-1.9 1v-3.2h3.8z"/></svg>',
    plan:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M7 2.8a1 1 0 0 1 1 1V5h8V3.8a1 1 0 1 1 2 0V5h.8A3.2 3.2 0 0 1 22 8.2v10.6A3.2 3.2 0 0 1 18.8 22H5.2A3.2 3.2 0 0 1 2 18.8V8.2A3.2 3.2 0 0 1 5.2 5H6V3.8a1 1 0 0 1 1-1zm-1.8 6.6v9.4c0 .44.36.8.8.8h13.6c.44 0 .8-.36.8-.8V9.4H5.2z" clip-rule="evenodd"/></svg>',
    shop:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M6.1 6.2H3.8a1.2 1.2 0 1 1 0-2.4H7c.56 0 1.05.39 1.16.94l.3 1.46H20a1.2 1.2 0 0 1 1.16 1.5l-1.35 5.0a3 3 0 0 1-2.9 2.24H10.2a3 3 0 0 1-2.94-2.34L6.1 6.2z" clip-rule="evenodd"/><path fill="currentColor" d="M9.6 19.0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM17.4 19.0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"/></svg>',
  };

  const UI_SVGS = {
    menu:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M5 7.5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1zm0 4.5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1zm1 3.5a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2H6z"/></svg>',
    search:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M10.6 4a6.6 6.6 0 1 0 4.1 11.8l3.2 3.2a1.1 1.1 0 0 0 1.6-1.6l-3.2-3.2A6.6 6.6 0 0 0 10.6 4zm-4.4 6.6a4.4 4.4 0 1 1 8.8 0 4.4 4.4 0 0 1-8.8 0z" clip-rule="evenodd"/></svg>',
    chevron_down:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M6.7 9.4a1.1 1.1 0 0 1 1.6 0l3.7 3.8 3.7-3.8a1.1 1.1 0 0 1 1.6 1.6l-4.5 4.6a1.1 1.1 0 0 1-1.6 0L6.7 11a1.1 1.1 0 0 1 0-1.6z"/></svg>',
    chevron_left:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M14.8 6.7a1.1 1.1 0 0 1 0 1.6L11 12l3.8 3.7a1.1 1.1 0 0 1-1.6 1.6l-4.6-4.5a1.1 1.1 0 0 1 0-1.6l4.6-4.5a1.1 1.1 0 0 1 1.6 0z"/></svg>',
    chevron_right:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M9.2 6.7a1.1 1.1 0 0 1 1.6 0l4.6 4.5a1.1 1.1 0 0 1 0 1.6l-4.6 4.5a1.1 1.1 0 1 1-1.6-1.6L13 12 9.2 8.3a1.1 1.1 0 0 1 0-1.6z"/></svg>',
    sparkles:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 2.5c.5 3.7 1.2 5.3 4.9 5.8-3.7.5-4.4 2.1-4.9 5.8-.5-3.7-1.2-5.3-4.9-5.8 3.7-.5 4.4-2.1 4.9-5.8zM6.5 13.4c.3 2.1.7 3 2.8 3.3-2.1.3-2.5 1.2-2.8 3.3-.3-2.1-.7-3-2.8-3.3 2.1-.3 2.5-1.2 2.8-3.3z"/></svg>',
    swap:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M7.2 7.3h10l-1.6-1.6a1.1 1.1 0 0 1 1.6-1.6l3.4 3.4a1.1 1.1 0 0 1 0 1.6l-3.4 3.4a1.1 1.1 0 0 1-1.6-1.6l1.6-1.6h-10a1.1 1.1 0 0 1 0-2.2zm9.6 9.4H6.8l1.6 1.6a1.1 1.1 0 1 1-1.6 1.6l-3.4-3.4a1.1 1.1 0 0 1 0-1.6l3.4-3.4a1.1 1.1 0 0 1 1.6 1.6l-1.6 1.6h10a1.1 1.1 0 1 1 0 2.2z"/></svg>',
    heart:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 21s-7.5-4.7-9.5-9.1C.9 8.6 2.7 5.5 6 5.5c2 0 3.3 1 4 2 0 0 1.7-2 4-2 3.3 0 5.1 3.1 3.5 6.4C19.5 16.3 12 21 12 21z"/></svg>',
    plus:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z"/></svg>',
    close:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M7 7a1.1 1.1 0 0 1 1.6 0l3.4 3.4L15.4 7A1.1 1.1 0 1 1 17 8.6L13.6 12l3.4 3.4a1.1 1.1 0 0 1-1.6 1.6L12 13.6 8.6 17A1.1 1.1 0 0 1 7 15.4L10.4 12 7 8.6A1.1 1.1 0 0 1 7 7z"/></svg>',
    gear:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm9 3.5a7.8 7.8 0 0 0-.1-1.2l-2.2-.4a7.3 7.3 0 0 0-.7-1.6l1.3-1.8a9.2 9.2 0 0 0-1.7-1.7l-1.8 1.3a7.3 7.3 0 0 0-1.6-.7L13.2 3a8.6 8.6 0 0 0-2.4 0l-.4 2.2a7.3 7.3 0 0 0-1.6.7L7 4.6A9.2 9.2 0 0 0 5.3 6.3l1.3 1.8a7.3 7.3 0 0 0-.7 1.6l-2.2.4a8.6 8.6 0 0 0 0 2.4l2.2.4c.2.6.4 1.1.7 1.6l-1.3 1.8a9.2 9.2 0 0 0 1.7 1.7l1.8-1.3c.5.3 1 .5 1.6.7l.4 2.2a8.6 8.6 0 0 0 2.4 0l.4-2.2c.6-.2 1.1-.4 1.6-.7l1.8 1.3a9.2 9.2 0 0 0 1.7-1.7l-1.3-1.8c.3-.5.5-1 .7-1.6l2.2-.4c.1-.4.1-.8.1-1.2z"/></svg>',
  };

  const iconEl = (name) => {
    const svg = svgElementFromString(UI_SVGS[name]);
    if (!svg) return null;
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    return svg;
  };

  const tabIconEl = (tab) => {
    const svg = svgElementFromString(TAB_SVGS[tab]);
    if (!svg) return null;
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    return svg;
  };

  const imgEl = ({ src, className, alt }) => {
    const img = document.createElement("img");
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
    img.className = className || "";
    img.alt = alt || "";
    return img;
  };

  const buildPill = ({ label, className, leftIcon, rightIcon }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className ? `pp-app-pill ${className}` : "pp-app-pill";

    if (leftIcon) {
      const left = iconEl(leftIcon);
      if (left) btn.appendChild(left);
    }

    const span = document.createElement("span");
    span.textContent = label || "";
    btn.appendChild(span);

    if (rightIcon) {
      const right = iconEl(rightIcon);
      if (right) btn.appendChild(right);
    }

    return btn;
  };

  const buildCircle = ({ icon, className, ariaLabel }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className ? `pp-app-circle ${className}` : "pp-app-circle";
    if (ariaLabel) btn.setAttribute("aria-label", ariaLabel);
    const svg = iconEl(icon);
    if (svg) btn.appendChild(svg);
    return btn;
  };

  const bgKeyForTab = (tab) => {
    switch (tab) {
      case "home":
      case "plan":
        return "home";
      case "pantry":
        return "pantry";
      case "cookbook":
        return "cookbook";
      case "shop":
        return "shopping";
      default:
        return "home";
    }
  };

  const createAppSimPhone = ({ mount, onAction }) => {
    const wrap = document.createElement("div");
    wrap.className = "pp-demo pp-demo--appsim";

    const phone = el("div", "pp-phone");
    const frame = el("div", "pp-phone-frame");
    const screen = el("div", "pp-phone-screen");

    const splashImg = document.createElement("img");
    splashImg.className = "pp-phone-scene";
    splashImg.decoding = "async";
    splashImg.loading = "eager";
    splashImg.alt = "Perfect Pantry loading screen";
    splashImg.src = "assets/brand/pp-splash-ios-source.png";

    const overlay = el("div", "pp-phone-overlay");

    const app = el("div", "pp-app");
    app.setAttribute("aria-hidden", "true");
    app.dataset.ppBg = "home";
    app.dataset.ppTab = "";

    const stage = el("div", "pp-app-stage");
    const bg = el("div", "pp-app-bg");
    const objectsLayer = el("div", "pp-app-objects");
    objectsLayer.setAttribute("aria-hidden", "true");
    const appContent = el("div", "pp-app-content");
    const fabsLayer = el("div", "pp-app-fabs");
    fabsLayer.setAttribute("aria-hidden", "true");

    const modal = el("div", "pp-app-modal");
    modal.setAttribute("aria-hidden", "true");
    const scrim = el("div", "pp-app-scrim");
    const sheet = el("div", "pp-app-sheet");
    sheet.dataset.ppScrollable = "true";
    const sheetHeader = el("div", "pp-app-sheet-header");
    const sheetTitle = el("h3", "pp-app-sheet-title", "");
    const sheetClose = document.createElement("button");
    sheetClose.type = "button";
    sheetClose.className = "pp-app-sheet-close";
    sheetClose.setAttribute("aria-label", "Close");
    const closeIcon = iconEl("close");
    if (closeIcon) sheetClose.appendChild(closeIcon);
    sheetHeader.appendChild(sheetTitle);
    sheetHeader.appendChild(sheetClose);
    const sheetBody = el("div", "pp-app-sheet-body");
    sheetBody.style.marginTop = "12px";
    sheet.appendChild(sheetHeader);
    sheet.appendChild(sheetBody);
    modal.appendChild(scrim);
    modal.appendChild(sheet);

    stage.appendChild(bg);
    stage.appendChild(objectsLayer);
    stage.appendChild(appContent);
    stage.appendChild(fabsLayer);
    stage.appendChild(modal);

    const nav = el("nav", "pp-app-nav");
    nav.setAttribute("aria-label", "App tabs");

    const navButtons = new Map();
    ["home", "pantry", "cookbook", "plan", "shop"].forEach((tab) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pp-app-nav-btn";
      btn.dataset.tab = tab;
      btn.setAttribute("aria-label", slugToLabel(tab));
      btn.setAttribute("aria-selected", "false");

      const icon = tabIconEl(tab);
      if (icon) icon.classList.add("pp-app-nav-icon");
      if (icon) btn.appendChild(icon);

      const label = el("span", "pp-app-nav-label", slugToLabel(tab));
      btn.appendChild(label);

      const indicator = el("span", "pp-app-nav-indicator");
      btn.appendChild(indicator);

      navButtons.set(tab, btn);
      nav.appendChild(btn);
    });

    app.appendChild(stage);
    app.appendChild(nav);

    screen.appendChild(splashImg);
    screen.appendChild(overlay);
    screen.appendChild(app);

    frame.appendChild(screen);
    phone.appendChild(frame);
    wrap.appendChild(phone);

    mount.replaceChildren(wrap);

    const clear = (node) => node.replaceChildren();

    const setSelectedNavUi = (tab) => {
      navButtons.forEach((btn, key) => {
        btn.setAttribute("aria-selected", String(key === tab));
      });
    };

    const renderObjectsForTab = (tab) => {
      clear(objectsLayer);

      const add = (src, cls) => {
        objectsLayer.appendChild(imgEl({ src, className: `pp-obj ${cls}`, alt: "" }));
      };

      if (tab === "home") {
        add("assets/objects/obj_fridge_note.png", "pp-obj--fridge-note");
        add("assets/objects/obj_fridge_pic.png", "pp-obj--fridge-pic");
        return;
      }

      if (tab === "plan") {
        add("assets/objects/obj_fridge_note.png", "pp-obj--fridge-note");
        add("assets/objects/obj_fridge_pic.png", "pp-obj--fridge-pic");
        add("assets/objects/obj_fridge_calendar.png", "pp-obj--fridge-calendar");
        add("assets/objects/obj_unicorn.png", "pp-obj--unicorn");
        return;
      }

      if (tab === "cookbook") {
        add("assets/objects/obj_cookbook.png", "pp-obj--cookbook");
        return;
      }

      if (tab === "pantry") {
        add("assets/objects/obj_pantry_shelf.png", "pp-obj--pantry-shelf");
        add("assets/objects/obj_pantry_item_shelf.png", "pp-obj--pantry-board-top");
        add("assets/objects/obj_pantry_item_shelf.png", "pp-obj--pantry-board-bottom");
      }
    };

    const renderFabsForTab = (tab) => {
      clear(fabsLayer);

      const addFabSvg = ({ cls, icon, ariaLabel }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `pp-app-fab ${cls}`;
        btn.setAttribute("aria-label", ariaLabel || "Preview only");
        const svg = iconEl(icon);
        if (svg) btn.appendChild(svg);
        fabsLayer.appendChild(btn);
      };

      const addFabImg = ({ cls, src, ariaLabel }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `pp-app-fab ${cls}`;
        btn.setAttribute("aria-label", ariaLabel || "Preview only");
        btn.appendChild(imgEl({ src, className: "", alt: "" }));
        fabsLayer.appendChild(btn);
      };

      if (tab === "home") {
        addFabSvg({ cls: "pp-app-fab--gear", icon: "gear", ariaLabel: "Settings (preview)" });
      }

      if (tab === "pantry") {
        addFabImg({
          cls: "pp-app-fab--spice",
          src: "assets/objects/obj_tan_spice.png",
          ariaLabel: "Tools (preview)",
        });
        addFabSvg({ cls: "pp-app-fab--plus", icon: "plus", ariaLabel: "Add item (preview)" });
      }

      if (tab === "cookbook") {
        addFabSvg({ cls: "pp-app-fab--plus", icon: "plus", ariaLabel: "Add recipe (preview)" });
      }

      if (tab === "shop") {
        addFabSvg({ cls: "pp-app-fab--plus", icon: "plus", ariaLabel: "Add item (preview)" });
      }
    };

    const renderHome = () => {
      const root = el("div", "pp-screen pp-screen-home");

      const weekCard = el("div", "pp-app-card");
      weekCard.appendChild(el("p", "pp-app-card-title", "Meals This Week"));
      weekCard.appendChild(el("p", "pp-app-card-sub", "Plan your life, Live your plan"));
      weekCard.appendChild(el("p", "pp-app-card-sub", "Feb 2–Feb 8  •  Today is Fri, Feb 6"));
      weekCard.appendChild(el("div", "pp-app-divider"));
      weekCard.appendChild(el("p", "pp-app-card-sub", "1/5 meals planned"));
      weekCard.appendChild(el("p", "pp-app-card-sub", "1/7 scheduled for the week"));
      weekCard.appendChild(el("p", "pp-app-card-sub", "Pantry coverage: 0/10 on hand  •  10 to buy"));
      root.appendChild(weekCard);

      const dinnerCard = el("div", "pp-app-card");
      dinnerCard.appendChild(el("p", "pp-app-card-title", "What's For Dinner?"));
      dinnerCard.appendChild(el("p", "pp-meal-title", "One-Pot Creamy Tuscan Pasta"));
      dinnerCard.appendChild(el("p", "pp-app-card-sub", "Pantry coverage: 0/10 on hand  •  10 to buy"));
      dinnerCard.appendChild(el("div", "pp-app-divider"));
      const ctas = el("div", "pp-home-cta-row");
      ctas.appendChild(buildPill({ label: "View Recipe", className: "pp-app-pill--title" }));
      ctas.appendChild(buildPill({ label: "Cook Now", className: "pp-app-pill--title" }));
      dinnerCard.appendChild(ctas);
      root.appendChild(dinnerCard);

      const actionsCard = el("div", "pp-app-card");
      actionsCard.appendChild(el("p", "pp-app-card-title", "Quick Actions"));
      const actions = el("div", "pp-home-actions");

      const mkAction = ({ iconSvg, label, action }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pp-home-action";

        if (action && typeof onAction === "function") {
          btn.addEventListener("click", () => onAction(action));
        }

        const iconWrap = el("div", "pp-home-action-icon");
        const svg = svgElementFromString(iconSvg);
        if (svg) {
          svg.setAttribute("aria-hidden", "true");
          svg.setAttribute("focusable", "false");
          iconWrap.appendChild(svg);
        }
        btn.appendChild(iconWrap);
        btn.appendChild(el("div", "pp-home-action-label", label));
        return btn;
      };

      actions.appendChild(
        mkAction({
          iconSvg: TAB_SVGS.cookbook,
          label: "Add New\nRecipe",
          action: actionOpenModal("home-add-recipe"),
        }),
      );
      actions.appendChild(
        mkAction({
          iconSvg: TAB_SVGS.pantry,
          label: "Add Pantry\nItem",
          action: actionOpenModal("home-add-pantry-item"),
        }),
      );
      actionsCard.appendChild(actions);
      root.appendChild(actionsCard);

      return root;
    };

    const renderPantry = () => {
      const root = el("div", "pp-screen pp-screen-pantry");

      const topRow = el("div", "pp-top-row");
      topRow.appendChild(buildPill({ label: "List", className: "pp-app-pill--title", leftIcon: "menu" }));
      topRow.appendChild(
        buildPill({
          label: "All Items (8)",
          className: "pp-app-pill--title",
          rightIcon: "chevron_down",
        }),
      );
      topRow.appendChild(buildCircle({ icon: "search", className: "pp-app-circle--muted", ariaLabel: "Search (preview)" }));
      root.appendChild(topRow);

      const chipWrap = el("div", "pp-chip-wrap");
      chipWrap.appendChild(el("span", "pp-app-chip", "Produce 3"));
      root.appendChild(chipWrap);

      const stageNode = el("div", "pp-pantry-stage");
      stageNode.appendChild(
        imgEl({
          src: "assets/ingredients/apple.png",
          className: "pp-pantry-item pp-pantry-item--apple",
          alt: "",
        }),
      );
      stageNode.appendChild(
        imgEl({
          src: "assets/ingredients/banana.png",
          className: "pp-pantry-item pp-pantry-item--banana",
          alt: "",
        }),
      );
      stageNode.appendChild(
        imgEl({
          src: "assets/ingredients/avocado.png",
          className: "pp-pantry-item pp-pantry-item--avocado",
          alt: "",
        }),
      );

      const label = ({ cls, title, sub }) => {
        const node = document.createElement("div");
        node.className = `pp-pantry-label ${cls}`;
        node.appendChild(el("strong", "", title));
        node.appendChild(el("span", "", sub));
        return node;
      };

      stageNode.appendChild(label({ cls: "pp-pantry-label--apple", title: "Apple", sub: "Exp 1d" }));
      stageNode.appendChild(label({ cls: "pp-pantry-label--banana", title: "Banana", sub: "Exp 1d" }));
      stageNode.appendChild(label({ cls: "pp-pantry-label--avocado", title: "Avocado", sub: "Exp 1d" }));

      root.appendChild(stageNode);
      return root;
    };

    const renderCookbook = () => {
      const root = el("div", "pp-screen pp-screen-cookbook");

      const hud = el("div", "pp-cookbook-hud");

      const row = el("div", "pp-cookbook-row");
      row.appendChild(buildPill({ label: "Cookbook", className: "pp-app-pill--title", rightIcon: "chevron_down" }));
      row.appendChild(buildCircle({ icon: "search", className: "pp-app-circle--muted", ariaLabel: "Search (preview)" }));
      hud.appendChild(row);

      const filterRow = el("div", "pp-cookbook-row pp-cookbook-row--filters");
      filterRow.appendChild(buildCircle({ icon: "swap", className: "pp-app-circle--muted", ariaLabel: "Swap (preview)" }));
      filterRow.appendChild(buildPill({ label: "Main Dish", className: "pp-app-pill--title", rightIcon: "chevron_down" }));
      hud.appendChild(filterRow);

      const chips = el("div", "pp-cookbook-chips");
      ["All", "Burgers", "Casseroles", "Deep Fried"].forEach((labelText, idx) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = idx === 0 ? "pp-cookbook-chip is-selected" : "pp-cookbook-chip";
        chip.textContent = labelText;
        chips.appendChild(chip);
      });
      hud.appendChild(chips);

      root.appendChild(hud);

      const grid = el("div", "pp-app-grid");
      const recipes = [
        { title: "Bang Bang Shrimp", meta: "25 min  •  4 servings" },
        { title: "Chicken Tikka Masala", meta: "45 min  •  4 servings" },
        { title: "Pico de Gallo", meta: "15 min  •  6 servings" },
        { title: "Skillet tacos", meta: "20 min  •  4 servings" },
      ];
      recipes.forEach((r) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "pp-app-recipe-card";
        card.appendChild(el("div", "pp-app-recipe-thumb"));
        card.appendChild(el("p", "pp-app-recipe-title", r.title));
        card.appendChild(el("p", "pp-app-recipe-meta", r.meta));
        grid.appendChild(card);
      });
      root.appendChild(grid);

      return root;
    };

    const renderPlan = () => {
      const root = el("div", "pp-screen pp-screen-plan");

      const hud = el("div", "pp-plan-hud");
      const weekRow = el("div", "pp-plan-week-row");
      weekRow.appendChild(buildCircle({ icon: "chevron_left", className: "pp-app-circle--muted", ariaLabel: "Previous week (preview)" }));
      weekRow.appendChild(buildPill({ label: "Week of 2/2", className: "pp-plan-week-pill pp-app-pill--title", rightIcon: "chevron_down" }));
      weekRow.appendChild(buildCircle({ icon: "chevron_right", className: "pp-app-circle--muted", ariaLabel: "Next week (preview)" }));
      hud.appendChild(weekRow);
      hud.appendChild(buildPill({ label: "Auto-fill this week", className: "pp-app-pill--wide pp-app-pill--title", leftIcon: "sparkles" }));
      root.appendChild(hud);

      const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday"];
      const meals = [
        "Vegetarian BLT with Avocado",
        "Chicken Avocado Wrap - Paleo",
        "Salmon in Green Chili Cream Sauce",
        "Spicy Avocado Chicken",
      ];
      dayNames.forEach((day, idx) => {
        const card = el("div", "pp-app-card pp-meal-card");
        card.appendChild(el("div", "pp-meal-thumb"));
        const meta = el("div", "pp-meal-meta");
        meta.appendChild(el("p", "pp-meal-title", `${day}  •  2/${idx + 2}`));
        meta.appendChild(el("p", "pp-meal-sub", meals[idx]));
        meta.appendChild(el("p", "pp-meal-sub", `${idx + 1} of ${idx + 7} from pantry`));
        card.appendChild(meta);

        const actions = el("div", "pp-meal-actions");
        actions.appendChild(buildPill({ label: "Start Cooking" }));
        actions.appendChild(buildPill({ label: "Replan Meal" }));
        card.appendChild(actions);

        root.appendChild(card);
      });

      return root;
    };

    const renderShop = () => {
      const root = el("div", "pp-screen pp-screen-shop");

      const topRow = el("div", "pp-top-row");
      topRow.appendChild(buildPill({ label: "List", className: "pp-app-pill--title", leftIcon: "menu" }));
      topRow.appendChild(buildPill({ label: "Shopping", className: "pp-app-pill--title" }));
      topRow.appendChild(buildCircle({ icon: "search", className: "pp-app-circle--muted", ariaLabel: "Search (preview)" }));
      root.appendChild(topRow);

      root.appendChild(buildPill({ label: "Tomatillo Salsa Verde", className: "pp-app-pill--title pp-shop-recipe-pill" }));

      const stageNode = el("div", "pp-shop-stage");
      const itemsWrap = el("div", "pp-shop-items");

      itemsWrap.appendChild(imgEl({ src: "assets/objects/obj_garlic.png", className: "pp-shop-item pp-shop-item--garlic", alt: "" }));
      itemsWrap.appendChild(imgEl({ src: "assets/ingredients/jalapeno.png", className: "pp-shop-item pp-shop-item--jalapeno", alt: "" }));
      itemsWrap.appendChild(imgEl({ src: "assets/objects/obj_tan_spice.png", className: "pp-shop-item pp-shop-item--salt", alt: "" }));
      itemsWrap.appendChild(imgEl({ src: "assets/ingredients/olive_oil.png", className: "pp-shop-item pp-shop-item--oliveoil", alt: "" }));
      itemsWrap.appendChild(imgEl({ src: "assets/ingredients/white_onion.png", className: "pp-shop-item pp-shop-item--onion", alt: "" }));

      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--garlic", "Garlic"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--jalapeno", "Jalapeno"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--salt", "Kosher Salt"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--oliveoil", "Olive oil"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--onion", "White Onion"));

      stageNode.appendChild(itemsWrap);

      const bar = el("div", "pp-shop-bar");
      bar.appendChild(buildCircle({ icon: "close", className: "pp-app-circle--danger", ariaLabel: "Cancel (preview)" }));
      bar.appendChild(buildPill({ label: "Complete shopping", className: "pp-app-pill--wide" }));
      bar.appendChild(buildCircle({ icon: "plus", ariaLabel: "Add item (preview)" }));
      stageNode.appendChild(bar);

      root.appendChild(stageNode);
      return root;
    };

    const renderOverviewForTab = (tab) => {
      switch (tab) {
        case "home":
          return renderHome();
        case "pantry":
          return renderPantry();
        case "cookbook":
          return renderCookbook();
        case "plan":
          return renderPlan();
        case "shop":
          return renderShop();
        default:
          return el("div", "pp-screen", "");
      }
    };

    let lastUiTab = null;
    let activeTab = null;

    const closeSheet = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      sheetTitle.textContent = "";
      clear(sheetBody);
    };

    const renderSheetContent = (kind) => {
      const root = document.createElement("div");

      const mkCard = ({ title, sub, actions }) => {
        const card = el("div", "pp-app-card");
        card.appendChild(el("p", "pp-app-card-title", title));
        if (sub) card.appendChild(el("p", "pp-app-card-sub", sub));
        if (actions && actions.length) {
          card.appendChild(el("div", "pp-app-divider"));
          const row = el("div", "pp-app-pill-row");
          actions.forEach((label) => {
            row.appendChild(buildPill({ label, className: "pp-app-pill--wide pp-app-pill--title" }));
          });
          card.appendChild(row);
        }
        return card;
      };

      if (kind === "add_recipe") {
        root.appendChild(
          mkCard({
            title: "Add New Recipe",
            sub: "Choose how you want to add a recipe. (Preview only.)",
            actions: ["Import from URL", "Create manually"],
          }),
        );
        return root;
      }

      if (kind === "add_pantry_item") {
        root.appendChild(
          mkCard({
            title: "Add Pantry Item",
            sub: "Choose a capture method. (Preview only.)",
            actions: ["Scan barcode", "Search items"],
          }),
        );
        return root;
      }

      root.appendChild(el("p", "", "Preview only."));
      return root;
    };

    const openSheet = (sheetSpec) => {
      if (!sheetSpec) return closeSheet();
      sheetTitle.textContent = String(sheetSpec.title || "Preview");
      clear(sheetBody);
      sheetBody.appendChild(renderSheetContent(String(sheetSpec.kind || "")));
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    };

    const setSplash = () => {
      activeTab = null;
      splashImg.style.display = "block";
      app.setAttribute("aria-hidden", "true");
      setSelectedNavUi(null);
      clear(appContent);
      clear(objectsLayer);
      clear(fabsLayer);
      closeSheet();
    };

    const setTab = (tab) => {
      if (!tab) return setSplash();
      if (tab === activeTab) return;

      activeTab = tab;
      splashImg.style.display = "none";
      app.setAttribute("aria-hidden", "false");

      app.dataset.ppTab = tab;
      app.dataset.ppBg = bgKeyForTab(tab);

      renderObjectsForTab(tab);
      renderFabsForTab(tab);

      const fixedLayout = tab === "pantry" || tab === "shop";
      appContent.classList.toggle("pp-app-content--fixed", fixedLayout);
      if (tab !== lastUiTab) {
        appContent.scrollTop = 0;
        lastUiTab = tab;
      }

      clear(appContent);
      appContent.appendChild(renderOverviewForTab(tab));
      setSelectedNavUi(tab);
    };

    const setScreen = (screenState) => {
      const tab = screenState && screenState.tab ? String(screenState.tab) : "";
      const sheetSpec = screenState && screenState.sheet ? screenState.sheet : null;

      if (!tab) {
        setSplash();
        return;
      }

      setTab(tab);
      if (sheetSpec) openSheet(sheetSpec);
      else closeSheet();
    };

    scrim.addEventListener("click", () => {
      if (typeof onAction === "function") onAction(actionCloseModal());
    });

    sheetClose.addEventListener("click", () => {
      if (typeof onAction === "function") onAction(actionCloseModal());
    });

    // Initialize in splash.
    setSplash();

    return { setScreen };
  };

  const createScrollStageController = ({ stage, steps, onStepIndex, onResize }) => {
    let activeStep = -1;
    let stageTop = 0;
    let stageHeight = 0;
    let viewportHeight = 1;
    let rafId = 0;

    stage.style.setProperty("--pp-step-count", String(steps.length));

    const measure = () => {
      const navHeight = readCssPxVar("--nav-height", 0);
      viewportHeight = Math.max(1, window.innerHeight - navHeight);

      const rect = stage.getBoundingClientRect();
      stageTop = rect.top + (window.scrollY || window.pageYOffset || 0);
      stageHeight = stage.offsetHeight || rect.height || 0;

      if (typeof onResize === "function") onResize({ viewportHeight });
    };

    const computeProgress = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const range = Math.max(1, stageHeight - viewportHeight);
      return clamp((y - stageTop) / range, 0, 1);
    };

    const progressToStepIndex = (progress01) => {
      if (steps.length <= 1) return 0;
      return clamp(
        Math.round(progress01 * (steps.length - 1)),
        0,
        steps.length - 1,
      );
    };

    const tick = () => {
      rafId = 0;
      const next = progressToStepIndex(computeProgress());
      if (next === activeStep) return;
      activeStep = next;
      if (typeof onStepIndex === "function") onStepIndex(activeStep);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(tick);
    };

    const onScroll = () => schedule();
    const onWindowResize = () => {
      measure();
      schedule();
    };

    measure();
    tick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onWindowResize);

    // Keep measurements accurate when fonts/layout settle.
    window.addEventListener("load", onWindowResize, { once: true });
    window.setTimeout(onWindowResize, 250);

    // Also react to stage height changes (e.g. responsive text wraps).
    let ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => onWindowResize());
      ro.observe(stage);
    }

    return {
      destroy() {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onWindowResize);
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
        if (ro) ro.disconnect();
      },
    };
  };

  const init = ({ mountSelector, stageSelector } = {}) => {
    const stage = document.querySelector(stageSelector || "#guided-tour");
    const mount = document.querySelector(mountSelector || "#ppDemoMount");
    if (!stage || !mount) return;

    const stack = stage.querySelector("[data-pp-tour-stack]");
    if (!stack) return;

    const reduceMotion = prefersReducedMotion();
    const stageMode =
      !reduceMotion &&
      window.matchMedia &&
      window.matchMedia("(min-width: 961px) and (hover: hover) and (pointer: fine)")
        .matches;

    const modalById = new Map(MODAL_SCREENS.map((s) => [s.id, s]));

    // Preload assets early so scroll-driven swaps don't flash.
    preloadImages([
      "assets/brand/pp-splash-ios-source.png",
      "assets/backgrounds/bg_home.jpg",
      "assets/backgrounds/bg_pantry.jpg",
      "assets/backgrounds/bg_cookbook.jpg",
      "assets/backgrounds/bg_shopping.jpg",
      "assets/objects/obj_fridge_note.png",
      "assets/objects/obj_fridge_pic.png",
      "assets/objects/obj_fridge_calendar.png",
      "assets/objects/obj_unicorn.png",
      "assets/objects/obj_cookbook.png",
      "assets/objects/obj_pantry_shelf.png",
      "assets/objects/obj_pantry_item_shelf.png",
      "assets/objects/obj_tan_spice.png",
      "assets/objects/obj_garlic.png",
      "assets/ingredients/apple.png",
      "assets/ingredients/banana.png",
      "assets/ingredients/avocado.png",
      "assets/ingredients/jalapeno.png",
      "assets/ingredients/olive_oil.png",
      "assets/ingredients/white_onion.png",
    ]);

    // Build left copy from the screen model (guarantees sync with phone).
    // In stage mode we include modal screens so the copy can swap when a hotspot is tapped.
    const copyScreens = stageMode ? [...STEPS, ...MODAL_SCREENS] : [...STEPS];
    stack.replaceChildren(...copyScreens.map((screen, idx) => buildCopyArticle(screen, idx)));
    const stepNodesById = getStepNodesById(stack);

    let activeStepIndex = 0;
    let activeModalId = null;

    const baseStep = () => STEPS[activeStepIndex] || STEPS[0];
    const activeScreen = () => {
      if (!activeModalId) return baseStep();
      return modalById.get(activeModalId) || baseStep();
    };

    const phone = createAppSimPhone({
      mount,
      onAction(action) {
        if (!action || typeof action !== "object") return;
        if (!stageMode) return;

        switch (action.type) {
          case "open_modal": {
            const nextId = String(action.id || "");
            if (!nextId || !modalById.has(nextId)) return;
            activeModalId = nextId;
            break;
          }
          case "close_modal": {
            activeModalId = null;
            break;
          }
          default:
            return;
        }

        const screen = activeScreen();
        stage.dataset.ppBg = screen.bg || baseStep().bg || "home";
        setActiveCopyStep(stepNodesById, screen.id);
        phone.setScreen(screen);
      },
    });

    const render = () => {
      const screen = activeScreen();
      stage.dataset.ppBg = screen.bg || baseStep().bg || "home";
      setActiveCopyStep(stepNodesById, screen.id);
      phone.setScreen(screen);
    };

    const syncPhoneWidth = () => {
      const navHeight = readCssPxVar("--nav-height", 0);
      const stickyH = Math.max(1, window.innerHeight - navHeight);

      const aside = mount.closest(".pp-tour-right");
      const tip = aside ? aside.querySelector(".pp-tour-tip") : null;
      const tipH = tip ? tip.getBoundingClientRect().height : 0;
      const tipMargins = tip
        ? (() => {
            const cs = getComputedStyle(tip);
            return (
              (Number.parseFloat(cs.marginTop) || 0) +
              (Number.parseFloat(cs.marginBottom) || 0)
            );
          })()
        : 0;

      const sticky = stage.querySelector(".pp-scrolly-sticky");
      const stickyRectH = sticky ? sticky.getBoundingClientRect().height : stickyH;
      const stickyPads = sticky
        ? (() => {
            const cs = getComputedStyle(sticky);
            return (
              (Number.parseFloat(cs.paddingTop) || 0) +
              (Number.parseFloat(cs.paddingBottom) || 0)
            );
          })()
        : 0;
      const stickyContentH = Math.max(1, stickyRectH - stickyPads);

      // Phone screen is iPhone screenshot ratio (1170x2532).
      const screenAspect = 1170 / 2532;
      const framePad = 14 * 2; // `.pp-phone-frame` padding in CSS

      const safe = 10; // breathing room inside the sticky region
      const tipSpace = tipH + tipMargins;
      const maxPhoneOuterH = Math.max(320, stickyContentH - tipSpace - safe);
      const maxWByH = Math.floor((maxPhoneOuterH - framePad) * screenAspect);

      const colW = aside ? aside.getBoundingClientRect().width : mount.getBoundingClientRect().width;
      const maxWByCol = Math.floor(colW - 4);

      const minW = 280;
      const maxW = 400;
      const target = clamp(Math.min(maxWByH, maxWByCol, maxW), minW, maxW);
      stage.style.setProperty("--pp-phone-demo-w", `${target}px`);
    };

    if (stageMode) {
      // In stage mode, only the active step should be focusable.
      stepNodesById.forEach((node) => setNodeInert(node, true));
      createScrollStageController({
        stage,
        steps: STEPS,
        onStepIndex(stepIndex) {
          activeStepIndex = stepIndex;
          // Any scroll-driven step change closes transient modal UI so the demo stays deterministic.
          activeModalId = null;
          render();
        },
        onResize: syncPhoneWidth,
      });
    } else {
      // Non-stage mode: fall back to a standard stacked layout and keep the phone on the welcome shot.
      stage.classList.add("pp-tour-static");
      stepNodesById.forEach((node) => setNodeInert(node, false));
      stage.dataset.ppBg = STEPS[0].bg || "home";
      phone.setScreen(STEPS[0]);
    }

    if (reduceMotion) stage.classList.add("pp-reduce-motion");

    // Ensure initial sizing is correct even before the first resize.
    syncPhoneWidth();
    if (stageMode) render();
  };

  window.PPDemo = { init };
})();
