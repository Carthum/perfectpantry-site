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
  const actionSelectTab = (tab) => ({ type: "select_tab", tab });

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
      id: "home-add-recipe-link",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Recipe", kind: "add_recipe", mode: "link", align: "center" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Recipe",
        description:
          "Paste a recipe link to import it. This mirrors the app's link-import flow (preview only).",
      },
    },
    {
      id: "home-add-recipe-photo",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Recipe", kind: "add_recipe", mode: "photo", align: "center" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Recipe",
        description:
          "Capture a recipe from a photo or your library. Layout only for now (preview only).",
      },
    },
    {
      id: "home-add-recipe-ai",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Recipe", kind: "add_recipe", mode: "ai", align: "center" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Recipe",
        description:
          "Describe what you want to cook and let the app draft a recipe. Layout only for now (preview only).",
      },
    },
    {
      id: "home-add-recipe-manual",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Recipe", kind: "add_recipe", mode: "manual", align: "center" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Recipe",
        description:
          "Create a recipe by typing it in. We'll refine fields and spacing to match the app.",
      },
    },
    {
      id: "home-add-pantry-search",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Pantry Item", kind: "add_pantry_item", mode: "search", align: "center" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Pantry Item",
        description:
          "Search foods and products to add them to your pantry (preview only).",
      },
    },
    {
      id: "home-add-pantry-scan",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Pantry Item", kind: "add_pantry_item", mode: "scan", align: "center" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Pantry Item",
        description:
          "Scan a UPC to add an item. Layout only for now (preview only).",
      },
    },
    {
      id: "home-add-pantry-manual",
      bg: "home",
      tab: "home",
      sheet: { title: "Add Pantry Item", kind: "add_pantry_item", mode: "manual", align: "center" },
      copy: {
        kicker: "Quick Actions",
        title: "Add Pantry Item",
        description:
          "Add an item manually. We'll tighten the details once you confirm the exact UI.",
      },
    },
    {
      id: "home-add-pantry-bulk",
      bg: "home",
      tab: "home",
      sheet: { title: "Bulk add", kind: "add_pantry_item", mode: "bulk", align: "left" },
      copy: {
        kicker: "Quick Actions",
        title: "Bulk add",
        description:
          "Tap items to add. Your added items stay pinned while you browse (preview only).",
      },
    },
    {
      id: "recipe-view",
      bg: "cookbook",
      tab: "cookbook",
      page: { kind: "recipe_view" },
      copy: {
        kicker: "What's For Dinner?",
        title: "View Recipe",
        description:
          "This is a demo preview of the recipe detail page. Buttons here will prompt you to download the app.",
      },
    },
    {
      id: "cook-view",
      bg: "cookbook",
      tab: "cookbook",
      page: { kind: "cook_view" },
      copy: {
        kicker: "What's For Dinner?",
        title: "Cook Now",
        description:
          "This is a demo preview of cooking mode (steps, read-aloud, and hands-free concept).",
      },
    },
    {
      id: "shop-staples",
      bg: "shopping",
      tab: "shop",
      sheet: { title: "Shop staples", kind: "shop_staples", align: "left" },
      copy: {
        kicker: "Shop",
        title: "Shop staples",
        description:
          "Bulk picker demo. Add-to-list is preview only and will prompt an app download.",
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
    link:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M10.7 13.3a1.1 1.1 0 0 1 0-1.6l2.9-2.9a3 3 0 1 1 4.2 4.2l-1.8 1.8a3 3 0 0 1-4.2 0 1.1 1.1 0 1 1 1.6-1.6.8.8 0 0 0 1.1 0l1.8-1.8a.8.8 0 1 0-1.1-1.1l-2.9 2.9a1.1 1.1 0 0 1-1.6 0z"/><path fill="currentColor" d="M13.3 10.7a1.1 1.1 0 0 1 0 1.6l-2.9 2.9a3 3 0 1 1-4.2-4.2l1.8-1.8a3 3 0 0 1 4.2 0 1.1 1.1 0 1 1-1.6 1.6.8.8 0 0 0-1.1 0l-1.8 1.8a.8.8 0 1 0 1.1 1.1l2.9-2.9a1.1 1.1 0 0 1 1.6 0z"/></svg>',
    camera:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M8.3 6.5 9.3 5c.3-.5.8-.8 1.4-.8h2.6c.6 0 1.1.3 1.4.8l1 1.5H19a2.3 2.3 0 0 1 2.3 2.3v8.3A2.3 2.3 0 0 1 19 19.4H5A2.3 2.3 0 0 1 2.7 17V8.8A2.3 2.3 0 0 1 5 6.5h3.3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" clip-rule="evenodd"/></svg>',
    image:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M6 4.5h12A2.5 2.5 0 0 1 20.5 7v10A2.5 2.5 0 0 1 18 19.5H6A2.5 2.5 0 0 1 3.5 17V7A2.5 2.5 0 0 1 6 4.5zm0 2.2a.3.3 0 0 0-.3.3v8.2l2.8-2.8a1.3 1.3 0 0 1 1.9 0l5.1 5.1H18a.3.3 0 0 0 .3-.3V7a.3.3 0 0 0-.3-.3H6zm3.2 3.6a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z" clip-rule="evenodd"/></svg>',
    barcode:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M6 6.2c.6 0 1.1.5 1.1 1.1v9.4a1.1 1.1 0 1 1-2.2 0V7.3c0-.6.5-1.1 1.1-1.1zm3 0c.6 0 1.1.5 1.1 1.1v9.4a1.1 1.1 0 1 1-2.2 0V7.3c0-.6.5-1.1 1.1-1.1zm3 0c.6 0 1.1.5 1.1 1.1v9.4a1.1 1.1 0 1 1-2.2 0V7.3c0-.6.5-1.1 1.1-1.1zm3 0c.6 0 1.1.5 1.1 1.1v9.4a1.1 1.1 0 1 1-2.2 0V7.3c0-.6.5-1.1 1.1-1.1zm3 0c.6 0 1.1.5 1.1 1.1v9.4a1.1 1.1 0 1 1-2.2 0V7.3c0-.6.5-1.1 1.1-1.1z"/></svg>',
    utensils:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M6.6 3.5c.6 0 1.1.5 1.1 1.1v6.4c0 1.4-1 2.6-2.3 2.8v6.7a1.1 1.1 0 1 1-2.2 0v-6.7A2.9 2.9 0 0 1 1 11V4.6a1.1 1.1 0 1 1 2.2 0v6.4c0 .4.3.7.7.7s.7-.3.7-.7V4.6c0-.6.5-1.1 1.1-1.1zM17.7 3.5c1.8 0 3.3 1.5 3.3 3.3v3.8c0 1.6-1.1 3-2.7 3.3v6.6a1.1 1.1 0 1 1-2.2 0V3.8c.4-.2 1-.3 1.6-.3z"/></svg>',
    list:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M6 6.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM8.2 6.1h12a1.1 1.1 0 0 1 0 2.2h-12a1.1 1.1 0 0 1 0-2.2zM6 12a1.1 1.1 0 1 1-2.2 0A1.1 1.1 0 0 1 6 12zM8.2 11h12a1.1 1.1 0 0 1 0 2.2h-12a1.1 1.1 0 0 1 0-2.2zM6 17.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM8.2 16h12a1.1 1.1 0 1 1 0 2.2h-12a1.1 1.1 0 0 1 0-2.2z"/></svg>',
    cart:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M6.1 6.2H3.8a1.2 1.2 0 1 1 0-2.4H7c.56 0 1.05.39 1.16.94l.3 1.46H20a1.2 1.2 0 0 1 1.16 1.5l-1.35 5.0a3 3 0 0 1-2.9 2.24H10.2a3 3 0 0 1-2.94-2.34L6.1 6.2z" clip-rule="evenodd"/><path fill="currentColor" d="M9.6 19.0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM17.4 19.0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"/></svg>',
    star:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.7l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.95L12 2.6z"/></svg>',
    play:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M9 7.4v9.2c0 .7.8 1.1 1.4.7l8-4.6c.6-.3.6-1.1 0-1.4l-8-4.6c-.6-.4-1.4 0-1.4.7z"/></svg>',
    pause:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M7.8 6.8c0-.6.5-1.1 1.1-1.1h1.2c.6 0 1.1.5 1.1 1.1v10.4c0 .6-.5 1.1-1.1 1.1H8.9c-.6 0-1.1-.5-1.1-1.1V6.8zm5.9 0c0-.6.5-1.1 1.1-1.1H16c.6 0 1.1.5 1.1 1.1v10.4c0 .6-.5 1.1-1.1 1.1h-1.3c-.6 0-1.1-.5-1.1-1.1V6.8z"/></svg>',
    restart:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 5.1a6.9 6.9 0 1 1-6.6 5H3.2a1.1 1.1 0 1 1 0-2.2h3.9c.6 0 1 .5 1 1.1a1.1 1.1 0 0 1-1 1.1H7a4.7 4.7 0 1 0 5-3.9 4.8 4.8 0 0 0-3.4 1.4 1.1 1.1 0 0 1-1.6-1.6A6.9 6.9 0 0 1 12 5.1z"/></svg>',
    speaker:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M4.8 9.3h2.4l3.7-3.1c.7-.6 1.8-.1 1.8.8v10c0 .9-1.1 1.4-1.8.8l-3.7-3.1H4.8c-.6 0-1.1-.5-1.1-1.1v-3.2c0-.6.5-1.1 1.1-1.1z"/><path fill="currentColor" d="M16.2 8.2a1.1 1.1 0 0 1 1.6 0 5.7 5.7 0 0 1 0 8.1 1.1 1.1 0 1 1-1.6-1.6 3.5 3.5 0 0 0 0-4.9 1.1 1.1 0 0 1 0-1.6z"/></svg>',
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
    sheet.dataset.ppAlign = "center";
    const sheetHandle = el("div", "pp-app-sheet-handle");
    const sheetHeader = el("div", "pp-app-sheet-header");
    const sheetSpacer = el("div", "pp-app-sheet-spacer");
    const sheetTitle = el("h3", "pp-app-sheet-title", "");
    const sheetClose = document.createElement("button");
    sheetClose.type = "button";
    sheetClose.className = "pp-app-sheet-close";
    sheetClose.setAttribute("aria-label", "Close");
    const closeIcon = iconEl("close");
    if (closeIcon) sheetClose.appendChild(closeIcon);
    sheetHeader.appendChild(sheetSpacer);
    sheetHeader.appendChild(sheetTitle);
    sheetHeader.appendChild(sheetClose);
    const sheetBody = el("div", "pp-app-sheet-body");
    const sheetFooter = el("div", "pp-app-sheet-footer");
    sheet.appendChild(sheetHandle);
    sheet.appendChild(sheetHeader);
    sheet.appendChild(sheetBody);
    sheet.appendChild(sheetFooter);
    modal.appendChild(scrim);
    modal.appendChild(sheet);

    const page = el("div", "pp-app-page");
    page.setAttribute("aria-hidden", "true");

    const download = el("div", "pp-app-download");
    download.setAttribute("aria-hidden", "true");
    const downloadScrim = el("div", "pp-app-download-scrim");
    const downloadCard = el("div", "pp-app-download-card");
    const downloadHeader = el("div", "pp-app-download-header");
    const downloadTitle = el("h3", "pp-app-download-title", "Get Perfect Pantry");
    const downloadClose = document.createElement("button");
    downloadClose.type = "button";
    downloadClose.className = "pp-app-download-close";
    downloadClose.setAttribute("aria-label", "Close");
    const dlCloseIcon = iconEl("close");
    if (dlCloseIcon) downloadClose.appendChild(dlCloseIcon);
    downloadHeader.appendChild(downloadTitle);
    downloadHeader.appendChild(downloadClose);
    const downloadBody = el(
      "p",
      "pp-app-download-body",
      "This is a website demo. Download the app to complete this action.",
    );
    const downloadBtns = el("div", "pp-app-download-btns");
    const mkStoreBtn = (label, href) => {
      const a = document.createElement("a");
      a.className = "pp-app-download-btn";
      a.href = href;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = label;
      return a;
    };
    downloadBtns.appendChild(mkStoreBtn("App Store", "https://example.com/app-store"));
    downloadBtns.appendChild(mkStoreBtn("Google Play", "https://example.com/google-play"));
    const downloadNote = el("p", "pp-app-download-note", "Coming soon.");
    downloadCard.appendChild(downloadHeader);
    downloadCard.appendChild(downloadBody);
    downloadCard.appendChild(downloadBtns);
    downloadCard.appendChild(downloadNote);
    download.appendChild(downloadScrim);
    download.appendChild(downloadCard);

    stage.appendChild(bg);
    stage.appendChild(objectsLayer);
    stage.appendChild(appContent);
    stage.appendChild(fabsLayer);

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

      if (typeof onAction === "function") {
        btn.addEventListener("click", () => onAction(actionSelectTab(tab)));
      }

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
    app.appendChild(modal);
    app.appendChild(page);
    app.appendChild(download);

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
      const viewBtn = buildPill({ label: "View Recipe", className: "pp-app-pill--title" });
      if (typeof onAction === "function") {
        viewBtn.addEventListener("click", () => onAction(actionOpenModal("recipe-view")));
      }
      ctas.appendChild(viewBtn);

      const cookBtn = buildPill({ label: "Cook Now", className: "pp-app-pill--title" });
      if (typeof onAction === "function") {
        cookBtn.addEventListener("click", () => onAction(actionOpenModal("cook-view")));
      }
      ctas.appendChild(cookBtn);
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
          action: actionOpenModal("home-add-recipe-ai"),
        }),
      );
      actions.appendChild(
        mkAction({
          iconSvg: TAB_SVGS.pantry,
          label: "Add Pantry\nItem",
          action: actionOpenModal("home-add-pantry-bulk"),
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
        if (typeof onAction === "function") {
          card.addEventListener("click", () => onAction(actionOpenModal("recipe-view")));
        }
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
        const startCooking = buildPill({ label: "Start Cooking" });
        if (typeof onAction === "function") {
          startCooking.addEventListener("click", () => onAction(actionOpenModal("cook-view")));
        }
        actions.appendChild(startCooking);
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
      const shoppingBtn = buildPill({ label: "Shopping", className: "pp-app-pill--title" });
      if (typeof onAction === "function") {
        shoppingBtn.addEventListener("click", () => onAction(actionOpenModal("shop-staples")));
      }
      topRow.appendChild(shoppingBtn);
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
      const complete = buildPill({ label: "Complete shopping", className: "pp-app-pill--wide" });
      complete.dataset.downloadCta = "true";
      bar.appendChild(complete);
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

    let isSheetOpen = false;
    let isPageOpen = false;
    let isDownloadOpen = false;

    const allowBackdropClose = () =>
      !!(
        window.matchMedia &&
        window.matchMedia("(min-width: 961px) and (hover: hover) and (pointer: fine)").matches
      );

    const syncOverlayChrome = () => {
      const anyOverlay = isSheetOpen || isPageOpen || isDownloadOpen;
      // Hide tab bar + decorative layers so overlays feel like real app screens.
      app.classList.toggle("is-overlay-open", anyOverlay);
      nav.classList.toggle("is-hidden", anyOverlay);
      objectsLayer.classList.toggle("is-hidden", anyOverlay);
      fabsLayer.classList.toggle("is-hidden", anyOverlay);
      // Lock the outer page scroll while any in-phone overlay is open.
      // This prevents the scroll-driven state machine from advancing and closing overlays.
      document.documentElement.classList.toggle("pp-tour-locked", anyOverlay);
    };

    const closeDownload = () => {
      isDownloadOpen = false;
      download.classList.remove("is-open");
      download.setAttribute("aria-hidden", "true");
      syncOverlayChrome();
    };

    const openDownload = () => {
      isDownloadOpen = true;
      download.classList.add("is-open");
      download.setAttribute("aria-hidden", "false");
      syncOverlayChrome();
    };

    const closePage = () => {
      isPageOpen = false;
      page.classList.remove("is-open");
      page.setAttribute("aria-hidden", "true");
      delete page.dataset.ppKind;
      clear(page);
      syncOverlayChrome();
    };

    const closeSheet = () => {
      isSheetOpen = false;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      sheet.dataset.ppAlign = "center";
      sheetTitle.textContent = "";
      clear(sheetBody);
      clear(sheetFooter);
      sheetFooter.hidden = true;
      syncOverlayChrome();
    };

    const buildSheetBtn = ({
      label,
      icon,
      variant,
      disabled,
      disabledLook,
      downloadCta,
      ariaLabel,
      onClick,
    }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = variant
        ? `pp-app-sheet-btn pp-app-sheet-btn--${variant}`
        : "pp-app-sheet-btn";
      if (ariaLabel) btn.setAttribute("aria-label", ariaLabel);
      btn.disabled = !!disabled;
      if (disabledLook && !disabled) {
        btn.classList.add("is-soft-disabled");
        btn.setAttribute("aria-disabled", "true");
      }
      if (downloadCta) btn.dataset.downloadCta = "true";
      if (icon) {
        const svg = iconEl(icon);
        if (svg) btn.appendChild(svg);
      }
      btn.appendChild(document.createTextNode(String(label || "")));
      if (typeof onClick === "function") btn.addEventListener("click", onClick);
      return btn;
    };

    const buildSeg = ({ options, selectedId }) => {
      const wrap = el("div", "pp-app-seg");
      wrap.setAttribute("role", "tablist");
      (options || []).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pp-app-seg-btn";
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", String(opt.id === selectedId));
        btn.textContent = String(opt.label || opt.id || "");
        if (opt.openId && typeof onAction === "function") {
          btn.addEventListener("click", () => onAction(actionOpenModal(opt.openId)));
        }
        wrap.appendChild(btn);
      });
      return wrap;
    };

    const buildField = ({ icon, placeholder, multiline }) => {
      const field = el("label", "pp-app-field");
      const svg = icon ? iconEl(icon) : null;
      if (svg) {
        field.appendChild(svg);
      } else {
        field.classList.add("pp-app-field--noicon");
        field.appendChild(el("span", "", ""));
      }

      if (multiline) {
        const ta = document.createElement("textarea");
        ta.placeholder = placeholder || "";
        ta.rows = 3;
        field.appendChild(ta);
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = placeholder || "";
        field.appendChild(input);
      }

      return field;
    };

    // Local-only state for demo overlays.
    let addRecipeSaveAs = "private";
    let addRecipeServings = 4;
    let pantryBulkCategory = "Staples";
    const pantryBulkSelected = new Set();
    let shopStaplesCategory = "Staples";
    const shopStaplesSelected = new Set();

    const buildMiniSeg = ({ options, value, onSelect }) => {
      const wrap = el("div", "pp-app-mini-seg");
      (options || []).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pp-app-mini-seg-btn";
        btn.setAttribute("aria-selected", String(opt.id === value));
        btn.textContent = String(opt.label || opt.id || "");
        btn.addEventListener("click", () => {
          const next = String(opt.id || "");
          if (!next) return;
          if (typeof onSelect === "function") onSelect(next);
          wrap.querySelectorAll(".pp-app-mini-seg-btn").forEach((node) => {
            node.setAttribute(
              "aria-selected",
              String(node === btn),
            );
          });
        });
        wrap.appendChild(btn);
      });
      return wrap;
    };

    const buildSaveAsCard = () => {
      const card = el("div", "pp-app-sheet-surface");
      const head = el("div", "pp-app-sheet-surface-head");
      head.appendChild(el("div", "pp-app-sheet-surface-title", "Save as"));
      card.appendChild(head);

      const note = el(
        "div",
        "pp-app-sheet-surface-note",
        addRecipeSaveAs === "public" ? "Visible to everyone" : "Private to your household",
      );

      const seg = buildMiniSeg({
        value: addRecipeSaveAs,
        options: [
          { id: "private", label: "Private" },
          { id: "public", label: "Public" },
        ],
        onSelect(next) {
          addRecipeSaveAs = next;
          note.textContent = addRecipeSaveAs === "public" ? "Visible to everyone" : "Private to your household";
        },
      });
      card.appendChild(seg);
      card.appendChild(note);
      return card;
    };

    const buildStepper = ({ label, value, onChange }) => {
      const row = el("div", "pp-app-stepper");
      row.appendChild(el("div", "pp-app-stepper-label", label));

      const controls = el("div", "pp-app-stepper-controls");
      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "pp-app-stepper-btn";
      minus.textContent = "–";

      const val = el("div", "pp-app-stepper-val", String(value));

      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "pp-app-stepper-btn";
      plus.textContent = "+";

      const apply = (next) => {
        const safe = clamp(Number(next) || 1, 1, 24);
        val.textContent = String(safe);
        if (typeof onChange === "function") onChange(safe);
        val.classList.remove("is-bump");
        // Restart animation.
        void val.offsetWidth;
        val.classList.add("is-bump");
      };

      minus.addEventListener("click", () => apply((Number(val.textContent) || 1) - 1));
      plus.addEventListener("click", () => apply((Number(val.textContent) || 1) + 1));

      controls.appendChild(minus);
      controls.appendChild(val);
      controls.appendChild(plus);
      row.appendChild(controls);
      return row;
    };

    const renderSheetContent = (sheetSpec) => {
      const kind = sheetSpec && sheetSpec.kind ? String(sheetSpec.kind) : "";
      const mode = sheetSpec && sheetSpec.mode ? String(sheetSpec.mode) : "";

      const bodyNodes = [];
      const footerNodes = [];

      const addCancelFooter = (
        primaryLabel,
        {
          softDisabled = false,
          hardDisabled = false,
          downloadCta = true,
          icon = null,
        } = {},
      ) => {
        footerNodes.push(
          buildSheetBtn({
            label: primaryLabel,
            variant: "primary",
            icon,
            disabled: !!hardDisabled,
            disabledLook: !!softDisabled,
            downloadCta: !!downloadCta,
          }),
        );
        footerNodes.push(
          buildSheetBtn({
            label: "Cancel",
            variant: "secondary",
            onClick: () => {
              if (typeof onAction === "function") onAction(actionCloseModal());
            },
          }),
        );
      };

      if (kind === "add_recipe") {
        bodyNodes.push(
          buildSeg({
            selectedId: mode || "ai",
            options: [
              { id: "ai", label: "AI", openId: "home-add-recipe-ai" },
              { id: "link", label: "Link", openId: "home-add-recipe-link" },
              { id: "photo", label: "Photo", openId: "home-add-recipe-photo" },
              { id: "manual", label: "Manual", openId: "home-add-recipe-manual" },
            ],
          }),
        );

        const addRecipeFooter = () => {
          bodyNodes.push(buildSaveAsCard());
          addCancelFooter("Save Recipe", { softDisabled: true, downloadCta: true });
        };

        if (mode === "photo") {
          const grid = el("div", "pp-app-sheet-grid2");
          grid.appendChild(
            buildSheetBtn({ label: "Photo", icon: "camera", variant: "primary", downloadCta: true }),
          );
          grid.appendChild(
            buildSheetBtn({ label: "Library", icon: "image", variant: "primary", downloadCta: true }),
          );
          bodyNodes.push(grid);
          bodyNodes.push(
            buildSheetBtn({
              label: "Extract recipe from photo",
              variant: "primary",
              disabledLook: true,
              downloadCta: true,
            }),
          );
          bodyNodes.push(
            el(
              "p",
              "pp-app-sheet-tip",
              "We'll extract the title, servings, ingredients, and steps. Then you can edit before saving.",
            ),
          );
          addRecipeFooter();
          return { bodyNodes, footerNodes };
        }

        if (mode === "ai") {
          bodyNodes.push(el("p", "pp-app-sheet-sub", "Describe what you want to cook"));
          bodyNodes.push(
            buildField({
              icon: null,
              placeholder: "e.g. Give me a great spicy chicken chili recipe",
              multiline: true,
            }),
          );
          const filters = el("div", "pp-app-sheet-stack");
          [
            "Protein: Any",
            "Prep time: Any",
            "Cuisine: Any",
            "Method: Any",
          ].forEach((label) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "pp-app-sheet-pill pp-app-sheet-pill--filter";
            btn.appendChild(document.createTextNode(label));
            const chev = iconEl("chevron_down");
            if (chev) btn.appendChild(chev);
            filters.appendChild(btn);
          });
          bodyNodes.push(filters);
          bodyNodes.push(
            buildStepper({
              label: "Servings",
              value: addRecipeServings,
              onChange(next) {
                addRecipeServings = next;
              },
            }),
          );
          addRecipeFooter();
          return { bodyNodes, footerNodes };
        }

        if (mode === "manual") {
          bodyNodes.push(buildField({ icon: "utensils", placeholder: "Recipe Name" }));
          bodyNodes.push(buildField({ icon: "list", placeholder: "Description (optional)", multiline: true }));
          bodyNodes.push(
            buildStepper({
              label: "Servings",
              value: addRecipeServings,
              onChange(next) {
                addRecipeServings = next;
              },
            }),
          );
          bodyNodes.push(el("p", "pp-app-sheet-section", "Ingredients"));
          const ingRow = el("div", "pp-app-inline-add");
          ingRow.appendChild(buildField({ icon: null, placeholder: "Ingredient" }));
          const plusBtn = buildSheetBtn({
            label: "",
            icon: "plus",
            variant: "secondary",
            ariaLabel: "Add ingredient",
            downloadCta: true,
          });
          plusBtn.classList.add("pp-app-inline-add-btn");
          ingRow.appendChild(plusBtn);
          bodyNodes.push(ingRow);
          const addLine = document.createElement("button");
          addLine.type = "button";
          addLine.className = "pp-app-inline-link";
          addLine.dataset.downloadCta = "true";
          const addLinePlus = iconEl("plus");
          if (addLinePlus) addLine.appendChild(addLinePlus);
          addLine.appendChild(document.createTextNode("Add ingredient line"));
          bodyNodes.push(addLine);
          addRecipeFooter();
          return { bodyNodes, footerNodes };
        }

        // Default: link import.
        bodyNodes.push(buildField({ icon: "link", placeholder: "Paste a recipe link here" }));
        bodyNodes.push(buildSheetBtn({ label: "Import from Link", variant: "primary", downloadCta: true }));
        bodyNodes.push(
          el(
            "p",
            "pp-app-sheet-tip",
            "Tip: Many recipe sites include a \"Recipe\" JSON block. We'll try to read that automatically.",
          ),
        );
        addRecipeFooter();
        return { bodyNodes, footerNodes };
      }

      if (kind === "add_pantry_item") {
        bodyNodes.push(
          buildSeg({
            selectedId: mode || "bulk",
            options: [
              { id: "bulk", label: "Bulk", openId: "home-add-pantry-bulk" },
              { id: "scan", label: "Scan", openId: "home-add-pantry-scan" },
              { id: "search", label: "Search", openId: "home-add-pantry-search" },
              { id: "manual", label: "Manual", openId: "home-add-pantry-manual" },
            ],
          }),
        );

        if (mode === "scan") {
          bodyNodes.push(buildSheetBtn({ label: "Scan UPC", icon: "barcode", variant: "primary", downloadCta: true }));
          addCancelFooter("Add to Pantry", { softDisabled: true, downloadCta: true });
          return { bodyNodes, footerNodes };
        }

        if (mode === "manual") {
          bodyNodes.push(buildField({ icon: "plus", placeholder: "Item name" }));
          const qtyRow = el("div", "pp-app-sheet-grid2");
          qtyRow.appendChild(buildField({ icon: null, placeholder: "Quantity" }));
          qtyRow.appendChild(buildField({ icon: "chevron_down", placeholder: "Unit" }));
          bodyNodes.push(qtyRow);
          bodyNodes.push(buildField({ icon: "chevron_down", placeholder: "Expiration date (optional)" }));
          addCancelFooter("Add to Pantry", { downloadCta: true });
          return { bodyNodes, footerNodes };
        }

        if (mode === "bulk") {
          bodyNodes.push(
            el(
              "p",
              "pp-app-sheet-sub",
              "Tap items to add. Your added items stay pinned while you browse.",
            ),
          );

          const row = el("div", "pp-app-sheet-row");
          const category = document.createElement("button");
          category.type = "button";
          category.className = "pp-app-sheet-pill";
          const catLabel = document.createElement("span");
          catLabel.textContent = pantryBulkCategory;
          category.appendChild(catLabel);
          const chevron = iconEl("chevron_down");
          if (chevron) category.appendChild(chevron);
          row.appendChild(category);
          const searchBtn = buildCircle({
            icon: "search",
            className: "pp-app-circle--sheet",
            ariaLabel: "Search (preview)",
          });
          searchBtn.dataset.downloadCta = "true";
          row.appendChild(searchBtn);
          bodyNodes.push(row);

          const menu = el("div", "pp-app-sheet-menu");
          menu.hidden = true;
          const categories = [
            "Staples",
            "Produce",
            "Meat",
            "Seafood",
            "Dairy",
            "Pantry",
            "Spices",
            "Baking",
            "Snacks",
            "Frozen",
            "Beverages",
            "Condiments",
          ];
          categories.forEach((label) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "pp-app-sheet-menu-item";
            btn.textContent = label;
            btn.addEventListener("click", () => {
              menu.hidden = true;
              if (label !== "Staples") {
                openDownload();
                pantryBulkCategory = "Staples";
                catLabel.textContent = pantryBulkCategory;
                return;
              }
              pantryBulkCategory = "Staples";
              catLabel.textContent = pantryBulkCategory;
            });
            menu.appendChild(btn);
          });
          category.addEventListener("click", () => {
            menu.hidden = !menu.hidden;
          });
          bodyNodes.push(menu);

          bodyNodes.push(el("p", "pp-app-sheet-section", "Tap to add"));
          const grid = el("div", "pp-app-tile-grid");
          const items = [
            { id: "milk", label: "Milk", src: "assets/ingredients/milk.png" },
            { id: "bread", label: "Bread", src: "assets/ingredients/bread.png" },
            { id: "eggs", label: "Eggs", src: "assets/ingredients/eggs.png" },
            { id: "butter", label: "Butter", src: "assets/ingredients/butter.png" },
            { id: "banana", label: "Banana", src: "assets/ingredients/banana.png" },
            { id: "apple", label: "Apple", src: "assets/ingredients/apple.png" },
            { id: "onion", label: "Onion", src: "assets/ingredients/onion.png" },
            { id: "garlic", label: "Garlic", src: "assets/ingredients/garlic.png" },
            { id: "tomato", label: "Tomato", src: "assets/ingredients/tomato.png" },
          ];

          const addBtn = buildSheetBtn({
            label: "Add to pantry",
            icon: "plus",
            variant: "primary",
            disabled: pantryBulkSelected.size === 0,
            downloadCta: true,
          });

          const refreshAddBtn = () => {
            addBtn.disabled = pantryBulkSelected.size === 0;
          };

          items.forEach((item) => {
            const tile = document.createElement("button");
            tile.type = "button";
            tile.className = "pp-app-tile";
            const media = el("div", "pp-app-tile-media");
            if (item.src) {
              media.appendChild(imgEl({ src: item.src, className: "", alt: "" }));
            } else {
              media.appendChild(el("span", "pp-app-emoji", item.emoji || ""));
            }
            tile.appendChild(media);
            tile.appendChild(el("div", "pp-app-tile-label", item.label));
            tile.classList.toggle("is-selected", pantryBulkSelected.has(item.id));
            tile.addEventListener("click", () => {
              const id = String(item.id || item.label || "");
              if (!id) return;
              if (pantryBulkSelected.has(id)) pantryBulkSelected.delete(id);
              else pantryBulkSelected.add(id);
              tile.classList.toggle("is-selected", pantryBulkSelected.has(id));
              refreshAddBtn();
            });
            grid.appendChild(tile);
          });
          bodyNodes.push(grid);

          footerNodes.push(addBtn);
          footerNodes.push(
            buildSheetBtn({
              label: "Cancel",
              variant: "secondary",
              onClick: () => {
                if (typeof onAction === "function") onAction(actionCloseModal());
              },
            }),
          );
          return { bodyNodes, footerNodes };
        }

        // Default: search.
        bodyNodes.push(buildField({ icon: "search", placeholder: "Search foods & products" }));
        bodyNodes.push(
          buildSheetBtn({
            label: "Search foods & products",
            icon: "search",
            variant: "primary",
            downloadCta: true,
          }),
        );
        addCancelFooter("Add to Pantry", { softDisabled: true, downloadCta: true });
        return { bodyNodes, footerNodes };
      }

      if (kind === "shop_staples") {
        bodyNodes.push(
          el(
            "p",
            "pp-app-sheet-sub",
            "Tap items to add. Your added items stay pinned while you browse.",
          ),
        );

        const row = el("div", "pp-app-sheet-row");
        const category = document.createElement("button");
        category.type = "button";
        category.className = "pp-app-sheet-pill";
        const catLabel = document.createElement("span");
        catLabel.textContent = shopStaplesCategory;
        category.appendChild(catLabel);
        const chevron = iconEl("chevron_down");
        if (chevron) category.appendChild(chevron);
        row.appendChild(category);

        const searchBtn = buildCircle({
          icon: "search",
          className: "pp-app-circle--sheet",
          ariaLabel: "Search (preview)",
        });
        searchBtn.dataset.downloadCta = "true";
        row.appendChild(searchBtn);
        bodyNodes.push(row);

        const menu = el("div", "pp-app-sheet-menu");
        menu.hidden = true;
        [
          "Staples",
          "Produce",
          "Meat",
          "Seafood",
          "Dairy",
          "Pantry",
          "Spices",
          "Baking",
          "Snacks",
          "Frozen",
          "Beverages",
          "Condiments",
        ].forEach((label) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pp-app-sheet-menu-item";
          btn.textContent = label;
          btn.addEventListener("click", () => {
            menu.hidden = true;
            if (label !== "Staples") {
              openDownload();
              shopStaplesCategory = "Staples";
              catLabel.textContent = shopStaplesCategory;
              return;
            }
            shopStaplesCategory = "Staples";
            catLabel.textContent = shopStaplesCategory;
          });
          menu.appendChild(btn);
        });
        category.addEventListener("click", () => {
          menu.hidden = !menu.hidden;
        });
        bodyNodes.push(menu);

        bodyNodes.push(el("p", "pp-app-sheet-section", "Tap to add"));
        const grid = el("div", "pp-app-tile-grid");
        const items = [
          { id: "milk", label: "Milk", src: "assets/ingredients/milk.png" },
          { id: "bread", label: "Bread", src: "assets/ingredients/bread.png" },
          { id: "eggs", label: "Eggs", src: "assets/ingredients/eggs.png" },
          { id: "butter", label: "Butter", src: "assets/ingredients/butter.png" },
          { id: "banana", label: "Banana", src: "assets/ingredients/banana.png" },
          { id: "apple", label: "Apple", src: "assets/ingredients/apple.png" },
          { id: "onion", label: "Onion", src: "assets/ingredients/onion.png" },
          { id: "garlic", label: "Garlic", src: "assets/ingredients/garlic.png" },
          { id: "tomato", label: "Tomato", src: "assets/ingredients/tomato.png" },
        ];

        const addBtn = buildSheetBtn({
          label: "Add to list",
          icon: "plus",
          variant: "primary",
          disabled: shopStaplesSelected.size === 0,
          downloadCta: true,
        });
        const refreshAddBtn = () => {
          addBtn.disabled = shopStaplesSelected.size === 0;
        };

        items.forEach((item) => {
          const tile = document.createElement("button");
          tile.type = "button";
          tile.className = "pp-app-tile";
          const media = el("div", "pp-app-tile-media");
          if (item.src) media.appendChild(imgEl({ src: item.src, className: "", alt: "" }));
          else media.appendChild(el("span", "pp-app-emoji", item.emoji || ""));
          tile.appendChild(media);
          tile.appendChild(el("div", "pp-app-tile-label", item.label));
          tile.classList.toggle("is-selected", shopStaplesSelected.has(item.id));
          tile.addEventListener("click", () => {
            const id = String(item.id || item.label || "");
            if (!id) return;
            if (shopStaplesSelected.has(id)) shopStaplesSelected.delete(id);
            else shopStaplesSelected.add(id);
            tile.classList.toggle("is-selected", shopStaplesSelected.has(id));
            refreshAddBtn();
          });
          grid.appendChild(tile);
        });
        bodyNodes.push(grid);

        footerNodes.push(addBtn);
        footerNodes.push(
          buildSheetBtn({
            label: "Cancel",
            variant: "secondary",
            onClick: () => {
              if (typeof onAction === "function") onAction(actionCloseModal());
            },
          }),
        );
        return { bodyNodes, footerNodes };
      }

      // Fallback.
      bodyNodes.push(el("p", "", "Preview only."));
      return { bodyNodes, footerNodes };
    };

    const buildTopBarBtn = ({ icon, label, downloadCta, onClick, className }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = className ? `pp-page-topbar-btn ${className}` : "pp-page-topbar-btn";
      if (label) btn.setAttribute("aria-label", label);
      if (downloadCta) btn.dataset.downloadCta = "true";
      const svg = icon ? iconEl(icon) : null;
      if (svg) btn.appendChild(svg);
      else if (label) btn.appendChild(document.createTextNode(label));
      if (typeof onClick === "function") btn.addEventListener("click", onClick);
      return btn;
    };

    const buildRecipeViewPage = () => {
      const root = el("div", "pp-page pp-page--recipe");
      const scroll = el("div", "pp-page-scroll");

      const top = el("div", "pp-page-topbar");
      const back = buildTopBarBtn({
        icon: "chevron_left",
        label: "Back",
        onClick: () => {
          if (typeof onAction === "function") onAction(actionCloseModal());
        },
      });
      top.appendChild(back);
      scroll.appendChild(top);

      const headerCard = el("div", "pp-recipe-head pp-app-card");
      const headRow = el("div", "pp-recipe-head-row");
      const fav = document.createElement("button");
      fav.type = "button";
      fav.className = "pp-recipe-fav";
      fav.setAttribute("aria-label", "Favorite (preview)");
      const heartSvg = iconEl("heart");
      if (heartSvg) fav.appendChild(heartSvg);
      headRow.appendChild(fav);
      const headText = el("div", "pp-recipe-head-text");
      headText.appendChild(el("div", "pp-recipe-title", "Shredded Flank Steak with Peppers, (Ropa Vieja)"));
      const rating = el("div", "pp-recipe-rating");
      const starSvg = iconEl("star");
      if (starSvg) rating.appendChild(starSvg);
      rating.appendChild(el("span", "", "5.0"));
      rating.appendChild(el("span", "pp-recipe-rating-sub", "(1)"));
      headText.appendChild(rating);
      headRow.appendChild(headText);
      headerCard.appendChild(headRow);
      scroll.appendChild(headerCard);

      const hero = el("div", "pp-recipe-hero");
      // Placeholder: styling matters most for the demo; swap with a real photo later.
      hero.appendChild(el("div", "pp-recipe-hero-ph"));
      scroll.appendChild(hero);

      const nut = el("div", "pp-recipe-nut pp-app-card");
      const nutHead = el("div", "pp-recipe-nut-head");
      const nutTitle = el("div", "pp-recipe-nut-title");
      const listSvg = iconEl("list");
      if (listSvg) nutTitle.appendChild(listSvg);
      nutTitle.appendChild(el("span", "", "Nutrition & tags"));
      nutHead.appendChild(nutTitle);
      nutHead.appendChild(el("div", "pp-recipe-nut-servings", "4 servings"));
      nut.appendChild(nutHead);

      const pills = el("div", "pp-recipe-nut-pills");
      [
        { k: "Calories", v: "926 kcal" },
        { k: "Protein", v: "76 g" },
        { k: "Carbs", v: "129 g" },
        { k: "Fat", v: "20 g" },
      ].forEach((p) => {
        const pill = el("div", "pp-recipe-pill");
        pill.appendChild(el("div", "pp-recipe-pill-k", p.k));
        pill.appendChild(el("div", "pp-recipe-pill-v", p.v));
        pills.appendChild(pill);
      });
      nut.appendChild(pills);

      const tags = el("div", "pp-recipe-tags");
      ["Gluten-free", "Dairy-free", "gluten free", "dairy free"].forEach((t) => {
        tags.appendChild(el("span", "pp-recipe-tag", t));
      });
      nut.appendChild(tags);
      nut.appendChild(el("div", "pp-recipe-nut-note", "Analysis via Spoonacular (cached on Supabase)"));
      scroll.appendChild(nut);

      const ingCard = el("div", "pp-recipe-ing pp-app-card");
      ingCard.appendChild(el("div", "pp-recipe-section-title", "Ingredients"));
      const ingSubRow = el("div", "pp-recipe-ing-subrow");
      ingSubRow.appendChild(el("div", "pp-recipe-ing-sub", "You have 0 of 16 for this recipe"));
      const addAll = document.createElement("button");
      addAll.type = "button";
      addAll.className = "pp-recipe-addall";
      addAll.dataset.downloadCta = "true";
      const cartSvg = iconEl("cart");
      if (cartSvg) addAll.appendChild(cartSvg);
      addAll.appendChild(document.createTextNode("Add All"));
      ingSubRow.appendChild(addAll);
      ingCard.appendChild(ingSubRow);

      const ingList = el("div", "pp-recipe-ing-list");
      const ingredients = [
        { id: "steak", src: "assets/ingredients/flank_steak.png", icon: "🥩", name: "Flank Steak", sub: "2 lb  •  steak" },
        { id: "onion", src: "assets/ingredients/onion.png", icon: "🧅", name: "Onions", sub: "2" },
        { id: "greenpep", src: "assets/ingredients/green_pepper.png", icon: "🫑", name: "Green Pepper", sub: "1" },
        { id: "redpep", src: "assets/ingredients/red_pepper.png", icon: "🌶️", name: "Red Pepper", sub: "6 oz" },
        { id: "chili", src: "assets/ingredients/red_chili_pepper.png", icon: "🌶️", name: "Red Chili Pepper", sub: "1" },
        { id: "garlic", src: "assets/ingredients/garlic.png", icon: "🧄", name: "Garlic", sub: "3 cloves" },
        { id: "oil", src: "assets/ingredients/olive_oil.png", icon: "🫒", name: "Olive Oil", sub: "1 tbsp" },
        { id: "tomatoes", src: "assets/ingredients/tomato.png", icon: "🍅", name: "Tomatoes", sub: "14 1/2 can  •  chopped" },
        { id: "sauce", src: "assets/ingredients/tomato_sauce.png", icon: "🫙", name: "Tomato Sauce", sub: "1/4 cup" },
        { id: "bay", src: "assets/ingredients/bay_leaves.png", icon: "🌿", name: "Bay Leaves", sub: "2" },
        { id: "salt", icon: "🧂", name: "Salt", sub: "2 tsp" },
        { id: "wine", src: "assets/ingredients/red_wine.png", icon: "🍷", name: "Red Wine", sub: "1/4 cup" },
        { id: "cumin", icon: "🌿", name: "Cumin", sub: "1 tsp" },
        { id: "oregano", icon: "🌿", name: "Oregano", sub: "1 tsp" },
        { id: "parsley", icon: "🌿", name: "Parsley", sub: "1 tbsp" },
        { id: "lime", src: "assets/ingredients/lime.png", icon: "🍋", name: "Lime", sub: "1" },
      ];

      const mkIngRow = (ing) => {
        const row = el("div", "pp-ing-row");
        const check = document.createElement("button");
        check.type = "button";
        check.className = "pp-ing-check";
        check.setAttribute("aria-pressed", "false");
        check.addEventListener("click", () => {
          const next = check.getAttribute("aria-pressed") !== "true";
          check.setAttribute("aria-pressed", String(next));
          row.classList.toggle("is-checked", next);
        });
        row.appendChild(check);

        const ico = el("div", "pp-ing-ico");
        if (ing && ing.src) {
          ico.appendChild(imgEl({ src: ing.src, className: "pp-ing-ico-img", alt: "" }));
        } else {
          ico.appendChild(document.createTextNode(String((ing && ing.icon) || "")));
        }
        row.appendChild(ico);

        const mid = el("div", "pp-ing-mid");
        mid.appendChild(el("div", "pp-ing-name", ing.name));
        mid.appendChild(el("div", "pp-ing-sub", ing.sub));
        row.appendChild(mid);

        const cartBtn = document.createElement("button");
        cartBtn.type = "button";
        cartBtn.className = "pp-ing-cart";
        cartBtn.dataset.downloadCta = "true";
        const svg = iconEl("cart");
        if (svg) cartBtn.appendChild(svg);
        cartBtn.setAttribute("aria-label", "Add to list (preview)");
        row.appendChild(cartBtn);
        return row;
      };

      const visibleCount = 6;
      ingredients.slice(0, visibleCount).forEach((ing) => ingList.appendChild(mkIngRow(ing)));

      const gated = el("div", "pp-gated");
      const gatedContent = el("div", "pp-gated-content");
      ingredients.slice(visibleCount).forEach((ing) => gatedContent.appendChild(mkIngRow(ing)));
      const gatedOverlay = el("div", "pp-gated-overlay");
      const dlBtn = document.createElement("button");
      dlBtn.type = "button";
      dlBtn.className = "pp-gated-cta";
      dlBtn.dataset.downloadCta = "true";
      dlBtn.textContent = "Download to see full ingredient list";
      gatedOverlay.appendChild(dlBtn);
      gated.appendChild(gatedContent);
      gated.appendChild(gatedOverlay);
      ingList.appendChild(gated);

      ingCard.appendChild(ingList);
      scroll.appendChild(ingCard);

      const actions = el("div", "pp-recipe-actions");
      const startBtn = buildSheetBtn({ label: "Start Cooking", variant: "primary", downloadCta: true });
      const planBtn = buildSheetBtn({ label: "Add to Plan", variant: "secondary", downloadCta: true });
      startBtn.classList.add("pp-recipe-action-btn");
      planBtn.classList.add("pp-recipe-action-btn");
      actions.appendChild(startBtn);
      actions.appendChild(planBtn);
      scroll.appendChild(actions);

      const dirCard = el("div", "pp-recipe-dir pp-app-card");
      dirCard.appendChild(el("div", "pp-recipe-section-title", "Directions"));
      const dirList = el("div", "pp-dir-list");
      const steps = [
        "Brown one onion and 1 clove of garlic with 1 tsp of salt in a pressure cooker.",
        "Add the skirt steak and cover with water, cook for 45 minutes or until tender.",
        "Remove the meat and shred with a fork. Add the peppers, the 2nd onion, the last 2 cloves of garlic and saute in a large frying pan with remaining one tsp of salt.",
        "Once softened, add the Spanish red wine, tomatoes, tomato sauce, bay leaves, cumin, oregano and parsley.",
        "Mix well and add the shredded meat. Simmer on low for 15 minutes. If you like lime, at the end, squeeze in a little lime to taste and remove the 2 bay leaves prior to serving.",
        "Serve with white rice, black beans, plantains, etc.",
      ];
      const mkStep = (idx, textVal) => {
        const row = el("div", "pp-dir-row");
        row.appendChild(el("div", "pp-dir-num", String(idx + 1)));
        row.appendChild(el("div", "pp-dir-text", textVal));
        return row;
      };
      steps.slice(0, 2).forEach((t, idx) => dirList.appendChild(mkStep(idx, t)));
      const dirGate = el("div", "pp-gated");
      const dirGateContent = el("div", "pp-gated-content");
      steps.slice(2).forEach((t, idx) => dirGateContent.appendChild(mkStep(idx + 2, t)));
      const dirGateOverlay = el("div", "pp-gated-overlay");
      const dirDl = document.createElement("button");
      dirDl.type = "button";
      dirDl.className = "pp-gated-cta";
      dirDl.dataset.downloadCta = "true";
      dirDl.textContent = "Download to see full directions";
      dirGateOverlay.appendChild(dirDl);
      dirGate.appendChild(dirGateContent);
      dirGate.appendChild(dirGateOverlay);
      dirList.appendChild(dirGate);
      dirCard.appendChild(dirList);
      scroll.appendChild(dirCard);

      root.appendChild(scroll);
      return root;
    };

    const buildCookViewPage = () => {
      const root = el("div", "pp-page pp-page--cook");
      const scroll = el("div", "pp-page-scroll");

      // Local-only cooking step state (demo).
      const steps = [
        {
          title: "Brown one onion and 1 clove of garlic with 1 tsp of salt in a pressure cooker.",
          ingredients: [
            { name: "Onions", qty: "2" },
            { name: "Garlic", qty: "3 cloves" },
            { name: "Salt", qty: "2 teaspoons" },
          ],
          next: "Add the skirt steak and cover with water, cook for 45 minutes or until tender.",
        },
        {
          title: "Add the skirt steak and cover with water, cook for 45 minutes or until tender.",
          ingredients: [
            { name: "Flank steak", qty: "2 lb" },
            { name: "Water", qty: "to cover" },
            { name: "Salt", qty: "1 tsp" },
          ],
          next: "Remove the meat and shred with a fork. Add peppers and saute.",
        },
        {
          title: "Remove the meat and shred with a fork. Add peppers and saute in a frying pan.",
          ingredients: [
            { name: "Green pepper", qty: "1" },
            { name: "Red pepper", qty: "6 oz" },
            { name: "Olive oil", qty: "1 tbsp" },
          ],
          next: "Finish the sauce and simmer everything together.",
        },
      ];

      let stepIndex = 0;

      const topbar = el("div", "pp-cook-topbar");
      const back = buildTopBarBtn({
        icon: "chevron_left",
        label: "Back",
        onClick: () => {
          if (typeof onAction === "function") onAction(actionCloseModal());
        },
      });
      topbar.appendChild(back);
      topbar.appendChild(el("div", "pp-cook-topbar-title", "Cooking"));
      const topIcons = el("div", "pp-cook-topbar-icons");
      topIcons.appendChild(buildTopBarBtn({ icon: "speaker", label: "Read aloud (preview)", downloadCta: true }));
      topIcons.appendChild(buildTopBarBtn({ icon: "list", label: "All steps (preview)", downloadCta: true }));
      topbar.appendChild(topIcons);
      const finish = document.createElement("button");
      finish.type = "button";
      finish.className = "pp-cook-finish";
      finish.dataset.downloadCta = "true";
      finish.textContent = "Finish";
      topbar.appendChild(finish);
      scroll.appendChild(topbar);

      const progressCard = el("div", "pp-cook-progress pp-app-card");
      const progressTitle = el("div", "pp-cook-progress-title", "Shredded Flank Steak with Peppers, (Ropa Vieja)");
      progressCard.appendChild(progressTitle);
      const progressRow = el("div", "pp-cook-progress-row");
      progressRow.appendChild(el("div", "pp-cook-progress-sub", "Step 1 of 6"));
      const allSteps = document.createElement("button");
      allSteps.type = "button";
      allSteps.className = "pp-cook-allsteps";
      allSteps.dataset.downloadCta = "true";
      allSteps.textContent = "All steps";
      progressRow.appendChild(allSteps);
      progressCard.appendChild(progressRow);
      const bar = el("div", "pp-cook-bar");
      const fill = el("div", "pp-cook-bar-fill");
      bar.appendChild(fill);
      progressCard.appendChild(bar);
      scroll.appendChild(progressCard);

      const callout = el(
        "div",
        "pp-cook-callout",
        "Hands-free: cover the proximity sensor / face camera to advance. Steps can be read aloud.",
      );
      scroll.appendChild(callout);

      const stepCard = el("div", "pp-cook-step pp-app-card");
      const stepHead = el("div", "pp-cook-step-head");
      const stepLabel = el("div", "pp-cook-step-label", "Step 1");
      stepHead.appendChild(stepLabel);
      const stepBtns = el("div", "pp-cook-step-btns");
      stepBtns.appendChild(
        buildTopBarBtn({ icon: "play", label: "Play (preview)", downloadCta: true, className: "pp-cook-iconbtn" }),
      );
      stepBtns.appendChild(
        buildTopBarBtn({ icon: "pause", label: "Pause (preview)", downloadCta: true, className: "pp-cook-iconbtn" }),
      );
      stepBtns.appendChild(
        buildTopBarBtn({
          icon: "restart",
          label: "Restart (preview)",
          downloadCta: true,
          className: "pp-cook-iconbtn",
        }),
      );
      stepHead.appendChild(stepBtns);
      const stepText = el("div", "pp-cook-step-text", steps[0].title);
      stepCard.appendChild(stepHead);
      stepCard.appendChild(stepText);
      scroll.appendChild(stepCard);

      const ingCard = el("div", "pp-cook-ing pp-app-card");
      const ingHead = el("div", "pp-cook-ing-head");
      ingHead.appendChild(el("div", "pp-cook-ing-title", "Ingredients in this step"));
      const viewAll = document.createElement("button");
      viewAll.type = "button";
      viewAll.className = "pp-cook-viewall";
      viewAll.dataset.downloadCta = "true";
      viewAll.textContent = "View All";
      ingHead.appendChild(viewAll);
      ingCard.appendChild(ingHead);
      const ingList = el("div", "pp-cook-ing-list");
      ingCard.appendChild(ingList);
      scroll.appendChild(ingCard);

      const nextStrip = el("div", "pp-cook-next pp-app-card");
      nextStrip.appendChild(el("div", "pp-cook-next-text", `Next: ${steps[0].next}`));
      scroll.appendChild(nextStrip);

      const bottom = el("div", "pp-cook-bottom");
      const backBtn = buildSheetBtn({ label: "Back", variant: "secondary", downloadCta: false });
      const nextBtn = buildSheetBtn({ label: "Next", variant: "primary", downloadCta: false });
      backBtn.classList.add("pp-cook-navbtn");
      nextBtn.classList.add("pp-cook-navbtn");
      bottom.appendChild(backBtn);
      bottom.appendChild(nextBtn);
      scroll.appendChild(bottom);

      const renderStep = () => {
        const safe = clamp(stepIndex, 0, steps.length - 1);
        stepIndex = safe;
        const displayStep = safe + 1;
        progressRow.querySelector(".pp-cook-progress-sub").textContent = `Step ${displayStep} of 6`;
        stepLabel.textContent = `Step ${displayStep}`;
        stepText.textContent = steps[safe].title;
        nextStrip.querySelector(".pp-cook-next-text").textContent = `Next: ${steps[safe].next}`;

        // Progress: Step 1 of 6 even if we only demo a few steps.
        fill.style.width = `${clamp(displayStep / 6, 0.08, 1) * 100}%`;

        ingList.replaceChildren(
          ...steps[safe].ingredients.map((ing) => {
            const row = el("div", "pp-cook-ing-row");
            row.appendChild(el("div", "pp-cook-ing-bullet", "•"));
            row.appendChild(el("div", "pp-cook-ing-name", ing.name));
            row.appendChild(el("div", "pp-cook-ing-qty", ing.qty));
            return row;
          }),
        );

        const isFirst = safe === 0;
        backBtn.disabled = isFirst;
        backBtn.classList.toggle("is-soft-disabled", isFirst);
      };

      backBtn.addEventListener("click", () => {
        if (stepIndex <= 0) return;
        stepIndex -= 1;
        renderStep();
      });

      nextBtn.addEventListener("click", () => {
        if (stepIndex >= steps.length - 1) {
          openDownload();
          return;
        }
        stepIndex += 1;
        renderStep();
      });

      renderStep();

      root.appendChild(scroll);
      return root;
    };

    const openPage = (pageSpec) => {
      if (!pageSpec) return closePage();
      clear(page);
      const kind = pageSpec && pageSpec.kind ? String(pageSpec.kind) : "";
      const node =
        kind === "recipe_view"
          ? buildRecipeViewPage()
          : kind === "cook_view"
            ? buildCookViewPage()
            : el("div", "pp-page", "Preview only.");
      page.appendChild(node);
      page.dataset.ppKind = kind;
      isPageOpen = true;
      page.classList.add("is-open");
      page.setAttribute("aria-hidden", "false");
      syncOverlayChrome();
    };

    const openSheet = (sheetSpec) => {
      if (!sheetSpec) return closeSheet();
      sheet.dataset.ppAlign = String(sheetSpec.align || "center");
      sheetTitle.textContent = String(sheetSpec.title || "Preview");
      const { bodyNodes, footerNodes } = renderSheetContent(sheetSpec);
      sheetBody.replaceChildren(...(bodyNodes || []));
      sheetFooter.replaceChildren(...(footerNodes || []));
      sheetFooter.hidden = !(footerNodes && footerNodes.length);
      isSheetOpen = true;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      syncOverlayChrome();
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
      closePage();
      closeDownload();
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
      const pageSpec = screenState && screenState.page ? screenState.page : null;

      if (!tab) {
        setSplash();
        return;
      }

      setTab(tab);
      // Download prompt is a transient overlay: always close it when the underlying screen changes.
      closeDownload();
      if (pageSpec) {
        openPage(pageSpec);
        closeSheet();
      } else if (sheetSpec) {
        openSheet(sheetSpec);
        closePage();
      } else {
        closeSheet();
        closePage();
      }
    };

    scrim.addEventListener("click", () => {
      if (!allowBackdropClose()) return;
      if (typeof onAction === "function") onAction(actionCloseModal());
    });

    sheetClose.addEventListener("click", () => {
      if (typeof onAction === "function") onAction(actionCloseModal());
    });

    downloadScrim.addEventListener("click", () => {
      if (!allowBackdropClose()) return;
      closeDownload();
    });

    downloadClose.addEventListener("click", () => {
      closeDownload();
    });

    // Single handler for any CTA that should prompt the "Download the app" hook.
    app.addEventListener("click", (event) => {
      const target =
        event.target instanceof Element ? event.target.closest("[data-download-cta=\"true\"]") : null;
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      openDownload();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (isDownloadOpen) {
        closeDownload();
        return;
      }
      if (isSheetOpen || isPageOpen) {
        if (typeof onAction === "function") onAction(actionCloseModal());
      }
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
      "assets/ingredients/milk.png",
      "assets/ingredients/bread.png",
      "assets/ingredients/eggs.png",
      "assets/ingredients/butter.png",
      "assets/ingredients/onion.png",
      "assets/ingredients/garlic.png",
      "assets/ingredients/tomato.png",
      "assets/ingredients/flank_steak.png",
      "assets/ingredients/green_pepper.png",
      "assets/ingredients/red_pepper.png",
      "assets/ingredients/red_chili_pepper.png",
      "assets/ingredients/tomato_sauce.png",
      "assets/ingredients/bay_leaves.png",
      "assets/ingredients/red_wine.png",
      "assets/ingredients/lime.png",
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

        switch (action.type) {
          case "open_modal": {
            const nextId = String(action.id || "");
            if (!nextId || !modalById.has(nextId)) return;
            activeModalId = nextId;
            break;
          }
          case "select_tab": {
            if (stageMode) return;
            const nextTab = String(action.tab || "");
            const idx = STEPS.findIndex((s) => s && s.tab === nextTab);
            if (idx < 0) return;
            activeStepIndex = idx;
            activeModalId = null;
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
        if (stageMode) {
          stage.dataset.ppBg = screen.bg || baseStep().bg || "home";
          setActiveCopyStep(stepNodesById, screen.id);
        }
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
      // Non-stage mode: fall back to a standard stacked layout and keep the phone interactive
      // so users can still explore overlays on smaller viewports.
      stage.classList.add("pp-tour-static");
      stepNodesById.forEach((node) => setNodeInert(node, false));
      activeStepIndex = STEPS.length > 1 ? 1 : 0; // default to Home vs splash
      stage.dataset.ppBg = STEPS[activeStepIndex].bg || "home";
      phone.setScreen(STEPS[activeStepIndex]);
    }

    if (reduceMotion) stage.classList.add("pp-reduce-motion");

    // Ensure initial sizing is correct even before the first resize.
    syncPhoneWidth();
    if (stageMode) render();
  };

  window.PPDemo = { init };
})();
