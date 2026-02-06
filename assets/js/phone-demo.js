(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const TAB_ICONS = {
    home: "assets/brand/tab-icons/ic_tab_home.svg",
    pantry: "assets/brand/tab-icons/ic_tab_pantry.svg",
    cookbook: "assets/brand/tab-icons/ic_tab_cookbook.svg",
    plan: "assets/brand/tab-icons/ic_tab_plan.svg",
    shop: "assets/brand/tab-icons/ic_tab_shopping.svg",
  };

  // Inline SVGs so icons inherit `currentColor` inside the simulated app UI.
  // (Using <img> would not allow theme coloring.)
  const TAB_SVGS = {
    home:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M10.7 3.7a1.8 1.8 0 0 1 2.6 0l7 6.9a1.2 1.2 0 0 1-1.7 1.7l-.6-.6V20a1.6 1.6 0 0 1-1.6 1.6H7.6A1.6 1.6 0 0 1 6 20v-8.3l-.6.6a1.2 1.2 0 1 1-1.7-1.7l7-6.9zM9 20h6v-6.2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V20z"/></svg>',
    pantry:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M5.5 3.5h13a2 2 0 0 1 2 2V20a1.2 1.2 0 0 1-2.4 0v-1H5.9v1A1.2 1.2 0 0 1 3.5 20V5.5a2.3 2.3 0 0 1 2-2zm.4 2.4v3.1h12.2V5.9H5.9zm0 5.5v5.2h12.2v-5.2H5.9zm2 1.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1v2.8a1 1 0 0 1-1 1H8.9a1 1 0 0 1-1-1v-2.8zm6.1-1h1.6a1 1 0 0 1 1 1v1.2a1 1 0 0 1-1 1H14a1 1 0 0 1-1-1v-1.2a1 1 0 0 1 1-1z" clip-rule="evenodd"/></svg>',
    cookbook:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M6.3 3.2h11.2A2.6 2.6 0 0 1 20 5.8v12.4a2.6 2.6 0 0 1-2.5 2.6H7.3A3.3 3.3 0 0 0 4 17.5V5.5a2.3 2.3 0 0 1 2.3-2.3zm.1 2.4a.8.8 0 0 0-.8.8v10.8c.5-.3 1.1-.4 1.7-.4h10.2c.2 0 .3-.15.3-.33V5.9c0-.17-.14-.3-.3-.3H6.4z" clip-rule="evenodd"/><path fill="currentColor" d="M14.9 18.1v3.2l-1.9-1-1.9 1v-3.2h3.8z"/><path fill="currentColor" fill-rule="evenodd" d="M12 7.0c1.2-1 2.8-.6 3.1.8.6.04 1.2.36 1.4 1.0.3.95-.4 2.0-1.6 2.0H9.1c-1.2 0-1.9-1.05-1.6-2.0.2-.64.8-.96 1.4-1.0.3-1.4 1.9-1.8 3.1-.8z" clip-rule="evenodd"/></svg>',
    plan:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M7 2.8a1 1 0 0 1 1 1V5h8V3.8a1 1 0 1 1 2 0V5h.8A3.2 3.2 0 0 1 22 8.2v10.6A3.2 3.2 0 0 1 18.8 22H5.2A3.2 3.2 0 0 1 2 18.8V8.2A3.2 3.2 0 0 1 5.2 5H6V3.8a1 1 0 0 1 1-1zm-1.8 6.6v9.4c0 .44.36.8.8.8h13.6c.44 0 .8-.36.8-.8V9.4H5.2zm10.0 3.0a1.1 1.1 0 0 1 1.56 0 1.1 1.1 0 0 1 0 1.56l-4.2 4.2a1.1 1.1 0 0 1-1.56 0L8.8 15.8a1.1 1.1 0 1 1 1.56-1.56l1.42 1.42 3.44-3.44z" clip-rule="evenodd"/></svg>',
    shop:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M6.1 6.2H3.8a1.2 1.2 0 1 1 0-2.4H7c.56 0 1.05.39 1.16.94l.3 1.46H20a1.2 1.2 0 0 1 1.16 1.5l-1.35 5.0a3 3 0 0 1-2.9 2.24H10.2a3 3 0 0 1-2.94-2.34L6.1 6.2zm3.1 3.4.48 2.3c.06.28.3.48.58.48h6.6c.27 0 .5-.18.58-.44l.93-3.34H9.2z" clip-rule="evenodd"/><path fill="currentColor" d="M9.6 19.0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM17.4 19.0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"/><path fill="currentColor" d="M14 4.9a1 1 0 0 1 2 0v1.6h1.6a1 1 0 1 1 0 2H16v1.6a1 1 0 1 1-2 0V8.5h-1.6a1 1 0 1 1 0-2H14V4.9z"/></svg>',
  };

  const UI_SVGS = {
    menu:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M5 7.2a1.1 1.1 0 0 1 1.1-1.1h11.8a1.1 1.1 0 1 1 0 2.2H6.1A1.1 1.1 0 0 1 5 7.2zM5 12a1.1 1.1 0 0 1 1.1-1.1h11.8a1.1 1.1 0 1 1 0 2.2H6.1A1.1 1.1 0 0 1 5 12zM5 16.8a1.1 1.1 0 0 1 1.1-1.1h11.8a1.1 1.1 0 1 1 0 2.2H6.1A1.1 1.1 0 0 1 5 16.8z"/></svg>',
    search:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M10.6 4.1a6.5 6.5 0 1 0 0 13.0 6.5 6.5 0 0 0 0-13.0zm-8.7 6.5a8.7 8.7 0 1 1 15.6 5.5l3.0 3.0a1.2 1.2 0 0 1-1.7 1.7l-3.0-3.0A8.7 8.7 0 0 1 1.9 10.6z" clip-rule="evenodd"/></svg>',
    chevron_down:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M7.2 9.2a1.2 1.2 0 0 1 1.7 0L12 12.3l3.1-3.1a1.2 1.2 0 0 1 1.7 1.7l-4.0 4.0a1.2 1.2 0 0 1-1.7 0l-4.0-4.0a1.2 1.2 0 0 1 0-1.7z"/></svg>',
    chevron_left:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M14.8 6.2a1.2 1.2 0 0 1 0 1.7L10.7 12l4.1 4.1a1.2 1.2 0 1 1-1.7 1.7l-4.9-4.9a1.2 1.2 0 0 1 0-1.7l4.9-4.9a1.2 1.2 0 0 1 1.7 0z"/></svg>',
    chevron_right:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M9.2 6.2a1.2 1.2 0 0 1 1.7 0l4.9 4.9a1.2 1.2 0 0 1 0 1.7l-4.9 4.9a1.2 1.2 0 1 1-1.7-1.7l4.1-4.1-4.1-4.1a1.2 1.2 0 0 1 0-1.7z"/></svg>',
    plus:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 4.6a1.2 1.2 0 0 1 1.2 1.2v5h5a1.2 1.2 0 1 1 0 2.4h-5v5a1.2 1.2 0 1 1-2.4 0v-5h-5a1.2 1.2 0 1 1 0-2.4h5v-5A1.2 1.2 0 0 1 12 4.6z"/></svg>',
    close:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M7.3 7.3a1.2 1.2 0 0 1 1.7 0L12 10.3l3.0-3.0a1.2 1.2 0 1 1 1.7 1.7l-3.0 3.0 3.0 3.0a1.2 1.2 0 0 1-1.7 1.7l-3.0-3.0-3.0 3.0a1.2 1.2 0 1 1-1.7-1.7l3.0-3.0-3.0-3.0a1.2 1.2 0 0 1 0-1.7z"/></svg>',
    heart:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 21.2c-.3 0-.6-.1-.8-.3-3.6-3.0-6.7-5.8-8.3-8.5-1.6-2.6-1.1-5.9 1.2-7.7 2.0-1.6 4.9-1.2 6.6.7.5.5 1 .5 1.5 0 1.7-1.9 4.6-2.3 6.6-.7 2.3 1.8 2.8 5.1 1.2 7.7-1.6 2.7-4.7 5.5-8.3 8.5-.2.2-.5.3-.8.3z"/></svg>',
    sparkles:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 2.9c.5 0 .9.3 1.0.8l.7 2.6a3 3 0 0 0 2.1 2.1l2.6.7c.5.1.8.5.8 1.0s-.3.9-.8 1.0l-2.6.7a3 3 0 0 0-2.1 2.1l-.7 2.6c-.1.5-.5.8-1.0.8s-.9-.3-1.0-.8l-.7-2.6a3 3 0 0 0-2.1-2.1l-2.6-.7a1.0 1.0 0 0 1 0-2.0l2.6-.7a3 3 0 0 0 2.1-2.1l.7-2.6c.1-.5.5-.8 1.0-.8z"/><path fill="currentColor" d="M20.1 4.9c.4 0 .8.3.9.7l.2 1.0c.1.4.4.7.8.8l1.0.2c.4.1.7.5.7.9s-.3.8-.7.9l-1.0.2a1.2 1.2 0 0 0-.8.8l-.2 1.0c-.1.4-.5.7-.9.7s-.8-.3-.9-.7l-.2-1.0a1.2 1.2 0 0 0-.8-.8l-1.0-.2a.9.9 0 0 1 0-1.8l1.0-.2c.4-.1.7-.4.8-.8l.2-1.0c.1-.4.5-.7.9-.7z"/></svg>',
    swap:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M7.8 6.3a1.2 1.2 0 0 1 1.7 0l2.2 2.2a1.2 1.2 0 1 1-1.7 1.7l-.2-.2v7.3a1.2 1.2 0 0 1-2.4 0V10l-.2.2a1.2 1.2 0 1 1-1.7-1.7l2.3-2.2zM16.2 17.7a1.2 1.2 0 0 1-1.7 0l-2.2-2.2a1.2 1.2 0 0 1 1.7-1.7l.2.2V6.7a1.2 1.2 0 0 1 2.4 0V14l.2-.2a1.2 1.2 0 0 1 1.7 1.7l-2.3 2.2z"/></svg>',
    gear:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M13.9 2.9a1.2 1.2 0 0 0-1.8 0l-.9 1.1a1.2 1.2 0 0 1-1.2.4l-1.3-.4a1.2 1.2 0 0 0-1.5.9l-.3 1.4a1.2 1.2 0 0 1-.9.9l-1.4.3a1.2 1.2 0 0 0-.9 1.5l.4 1.3a1.2 1.2 0 0 1-.4 1.2l-1.1.9a1.2 1.2 0 0 0 0 1.8l1.1.9c.4.3.5.8.4 1.2l-.4 1.3a1.2 1.2 0 0 0 .9 1.5l1.4.3c.4.1.8.4.9.9l.3 1.4a1.2 1.2 0 0 0 1.5.9l1.3-.4c.4-.1.9 0 1.2.4l.9 1.1a1.2 1.2 0 0 0 1.8 0l.9-1.1c.3-.4.8-.5 1.2-.4l1.3.4a1.2 1.2 0 0 0 1.5-.9l.3-1.4c.1-.4.4-.8.9-.9l1.4-.3a1.2 1.2 0 0 0 .9-1.5l-.4-1.3a1.2 1.2 0 0 1 .4-1.2l1.1-.9a1.2 1.2 0 0 0 0-1.8l-1.1-.9a1.2 1.2 0 0 1-.4-1.2l.4-1.3a1.2 1.2 0 0 0-.9-1.5l-1.4-.3a1.2 1.2 0 0 1-.9-.9l-.3-1.4a1.2 1.2 0 0 0-1.5-.9l-1.3.4a1.2 1.2 0 0 1-1.2-.4l-.9-1.1zM12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8z" clip-rule="evenodd"/></svg>',
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

  const getScrollAnchors = (container) => {
    return $$('[data-scroll-key]', container);
  };

  const getTourSentinels = (tourRoot) => {
    if (!tourRoot) return [];
    return $$(".pp-tour-sentinel[data-pp-step]", tourRoot);
  };

  const getTourSteps = (tourRoot) => {
    if (!tourRoot) return [];
    return $$(".pp-tour-step[data-pp-step]", tourRoot);
  };

  const setNodeInert = (node, inert) => {
    if (!node) return;
    // inert is now supported in modern browsers; fall back to aria-hidden only.
    if ("inert" in node) node.inert = !!inert;
  };

  const isFormFieldTarget = (target) => {
    if (!target || typeof target.closest !== "function") return false;
    return !!target.closest("input, textarea, select, [contenteditable='true']");
  };

  const isInteractiveTarget = (target) => {
    if (!target || typeof target.closest !== "function") return false;
    return !!target.closest("a, button, input, textarea, select, [role='button'], [contenteditable='true']");
  };

  const normalizeWheelDeltaY = (event) => {
    let dy = Number(event && event.deltaY) || 0;
    if (!dy) return 0;
    if (event.deltaMode === 1) dy *= 16; // lines -> px-ish
    if (event.deltaMode === 2) dy *= window.innerHeight; // pages -> px
    return dy;
  };

  const activateTourStep = (tourRoot, stepId) => {
    const steps = getTourSteps(tourRoot);
    steps.forEach((node) => {
      const isActive = node.dataset.ppStep === stepId;
      node.classList.toggle("is-active", isActive);
      node.setAttribute("aria-hidden", String(!isActive));
      setNodeInert(node, !isActive);
    });

    if (tourRoot) {
      tourRoot.dataset.ppActiveStep = stepId || "";
    }
  };

  const bindTourSync = ({ tourRoot, api, prefersReducedMotion }) => {
    const sentinels = getTourSentinels(tourRoot);
    if (!sentinels.length) return null;
    if (!("IntersectionObserver" in window)) return null;

    // Track intersection ratios across all sentinels to avoid flicker when
    // the callback only delivers changed entries.
    const ratios = new Map(sentinels.map((n) => [n, 0]));
    let activeStep = null;

    const drive = (stepId) => {
      if (!stepId || stepId === activeStep) return;
      activeStep = stepId;
      activateTourStep(tourRoot, stepId);

      const sentinel = tourRoot.querySelector(
        `.pp-tour-sentinel[data-pp-step="${CSS.escape(stepId)}"]`,
      );
      if (!sentinel) return;

      const sceneId = sentinel.dataset.ppScene;
      const tab = sentinel.dataset.ppTab;

      if (sceneId) api.setScene(sceneId);
      else if (tab) api.setTab(tab);
    };

    // Ensure initial state is consistent with the first sentinel.
    drive(sentinels[0].dataset.ppStep);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestNode = null;
        let bestRatio = 0;
        ratios.forEach((ratio, node) => {
          if (ratio <= bestRatio) return;
          bestRatio = ratio;
          bestNode = node;
        });

        if (!bestNode) return;
        drive(bestNode.dataset.ppStep);
      },
      {
        threshold: [0.12, 0.3, 0.45, 0.6, 0.78],
        rootMargin: "-35% 0px -55% 0px",
      },
    );

    sentinels.forEach((node) => io.observe(node));

    const scrollToStep = (stepId) => {
      if (!stepId) return;
      const sentinel = tourRoot.querySelector(
        `.pp-tour-sentinel[data-pp-step="${CSS.escape(stepId)}"]`,
      );
      if (!sentinel) return;
      sentinel.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    };

    return { scrollToStep };
  };

  const bindTourLock = ({ tourRoot, api, prefersReducedMotion, afterSelector }) => {
    const sentinels = getTourSentinels(tourRoot);
    if (!sentinels.length) return null;
    if (prefersReducedMotion) return null;

    const tourSteps = sentinels
      .map((node) => ({
        stepId: node.dataset.ppStep,
        tab: node.dataset.ppTab || null,
        sceneId: node.dataset.ppScene || null,
      }))
      .filter((step) => !!step.stepId);

    if (!tourSteps.length) return null;

    const indexByStepId = new Map();
    tourSteps.forEach((step, idx) => {
      if (!indexByStepId.has(step.stepId)) indexByStepId.set(step.stepId, idx);
    });

    let activeIndex = clamp(indexByStepId.get("welcome") ?? 0, 0, tourSteps.length - 1);
    let locked = false;
    let wheelAccum = 0;
    let cooldownUntil = 0;
    let storedScrollY = 0;

    const restoreBody = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };

    const getAfterNode = () => {
      if (!afterSelector) return null;
      return document.querySelector(afterSelector);
    };

    const setStepIndex = (nextIndex) => {
      activeIndex = clamp(nextIndex, 0, tourSteps.length - 1);
      const step = tourSteps[activeIndex];
      if (!step) return;

      activateTourStep(tourRoot, step.stepId);

      if (step.sceneId) api.setScene(step.sceneId);
      else if (step.tab) api.setTab(step.tab);
    };

    const setStep = (stepId) => {
      if (!stepId) return;
      const idx = indexByStepId.get(stepId);
      if (typeof idx !== "number") return;
      setStepIndex(idx);
    };

    const lock = ({ initialStepId } = {}) => {
      if (locked) return;
      locked = true;

      storedScrollY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add("pp-tour-locked");

      // Freeze scroll position without layout shift.
      document.body.style.position = "fixed";
      document.body.style.top = `${-storedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

      if (initialStepId) setStep(initialStepId);
      else setStepIndex(activeIndex);
    };

    const unlock = ({ scrollAfter } = {}) => {
      if (!locked) return;
      locked = false;

      document.documentElement.classList.remove("pp-tour-locked");

      document.body.style.position = restoreBody.position || "";
      document.body.style.top = restoreBody.top || "";
      document.body.style.left = restoreBody.left || "";
      document.body.style.right = restoreBody.right || "";
      document.body.style.width = restoreBody.width || "";

      window.scrollTo(0, storedScrollY);

      if (scrollAfter) {
        const after = getAfterNode();
        if (after) {
          after.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      }
    };

    const advance = (dir) => {
      if (dir > 0 && activeIndex >= tourSteps.length - 1) {
        unlock({ scrollAfter: true });
        return;
      }
      if (dir < 0 && activeIndex <= 0) return;
      setStepIndex(activeIndex + dir);
    };

    const onWheel = (event) => {
      if (!locked) return;
      if (event.ctrlKey) return; // allow pinch-to-zoom
      if (isFormFieldTarget(event.target)) return;

      const dy = normalizeWheelDeltaY(event);

      // Allow the in-phone UI to scroll while the page is locked. Only when the
      // phone cannot scroll further do we treat the gesture as "advance step".
      const phoneScreen =
        event.target &&
        typeof event.target.closest === "function" &&
        event.target.closest(".pp-phone-screen");
      if (phoneScreen && dy) {
        const nearestScrollable = event.target.closest("[data-pp-scrollable='true']");
        const scrollable =
          nearestScrollable && phoneScreen.contains(nearestScrollable)
            ? nearestScrollable
            : phoneScreen.querySelector("[data-pp-scrollable='true']");

        if (scrollable) {
          const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight;
          const canScrollDown = scrollable.scrollTop < maxScrollTop - 1;
          const canScrollUp = scrollable.scrollTop > 0;
          const canScroll = dy > 0 ? canScrollDown : canScrollUp;
          if (canScroll) {
            wheelAccum = 0;
            return;
          }
        }
      }

      event.preventDefault();

      const now = Date.now();
      if (now < cooldownUntil) return;

      if (!dy) return;

      wheelAccum += dy;
      const thresholdPx = 90;
      if (Math.abs(wheelAccum) < thresholdPx) return;

      const dir = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0;
      cooldownUntil = now + 520;
      advance(dir);
    };

    const onKeyDown = (event) => {
      if (!locked) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (api && typeof api.isDetailOpen === "function" && api.isDetailOpen()) {
          if (typeof api.closeDetail === "function") api.closeDetail();
        }
        return;
      }

      if (isInteractiveTarget(event.target)) return;

      const key = event.key;
      const isSpace = key === " " || key === "Spacebar";

      if (key === "ArrowDown" || key === "PageDown" || isSpace) {
        event.preventDefault();
        advance(1);
        return;
      }

      if (key === "ArrowUp" || key === "PageUp") {
        event.preventDefault();
        advance(-1);
      }
    };

    // Wire explicit controls.
    $("[data-pp-tour-skip]", tourRoot)?.addEventListener("click", (event) => {
      event.preventDefault();
      unlock({ scrollAfter: true });
    });

    $("[data-pp-tour-continue]", tourRoot)?.addEventListener("click", (event) => {
      event.preventDefault();
      unlock({ scrollAfter: true });
    });

    $$("[data-pp-tour-jump]", tourRoot).forEach((node) => {
      node.addEventListener("click", (event) => {
        const stepId = node.dataset.ppTourJump;
        if (!stepId) return;
        event.preventDefault();
        if (!locked) lock({ initialStepId: stepId });
        else setStep(stepId);
      });
    });

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { capture: true });

    // Auto-lock only when the tour is actually at the top (don’t trap deep links).
    const maybeAutoLock = () => {
      const hash = String(window.location.hash || "");
      if (hash && hash !== "#guided-tour") return;

      const y = window.scrollY || window.pageYOffset || 0;
      if (y > 12) return;

      lock({ initialStepId: "welcome" });
    };

    maybeAutoLock();

    window.addEventListener("hashchange", () => {
      if (String(window.location.hash || "") !== "#guided-tour") return;
      window.setTimeout(() => {
        const y = window.scrollY || window.pageYOffset || 0;
        if (y > 12) return;
        lock({ initialStepId: "welcome" });
      }, 0);
    });

    return {
      isLocked: () => locked,
      lock,
      unlock,
      setStep,
      getStepId: () => tourSteps[activeIndex]?.stepId || "",
    };
  };

  const buildHotspot = (hotspot, onActivate) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pp-phone-hotspot";
    btn.setAttribute("aria-label", hotspot.label || "Preview");

    const x = clamp01((hotspot.x || 0) / 100);
    const y = clamp01((hotspot.y || 0) / 100);
    const w = clamp01((hotspot.w || 0) / 100);
    const h = clamp01((hotspot.h || 0) / 100);

    btn.style.left = `${x * 100}%`;
    btn.style.top = `${y * 100}%`;
    btn.style.width = `${w * 100}%`;
    btn.style.height = `${h * 100}%`;

    btn.addEventListener("click", () => onActivate(hotspot));
    return btn;
  };

  const createToast = (mountRoot) => {
    let toast = $(".pp-demo-toast", mountRoot.ownerDocument);
    if (toast) return toast;

    toast = document.createElement("div");
    toast.className = "pp-demo-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-hidden", "true");
    toast.innerHTML =
      "<strong>Preview only</strong><p>This is a UI demo. Actions do not change data.</p>";

    document.body.appendChild(toast);
    return toast;
  };

  const showToast = (toast) => {
    if (!toast) return;
    toast.setAttribute("aria-hidden", "false");

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.setAttribute("aria-hidden", "true");
    }, 2400);
  };

  const createTabs = (tabs, activeTab, onSelect) => {
    const wrap = document.createElement("div");
    wrap.className = "pp-demo-tabs";

    tabs.forEach((tab) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pp-demo-tab";
      const iconSrc = TAB_ICONS[tab];
      if (iconSrc) {
        const icon = document.createElement("img");
        icon.className = "pp-demo-tab-icon";
        icon.src = iconSrc;
        icon.alt = "";
        icon.loading = "lazy";
        icon.decoding = "async";
        btn.appendChild(icon);
      }

      const label = document.createElement("span");
      label.className = "pp-demo-tab-label";
      label.textContent = slugToLabel(tab);
      btn.appendChild(label);

      btn.dataset.tab = tab;
      btn.setAttribute("aria-selected", String(tab === activeTab));
      btn.addEventListener("click", () => onSelect(tab));
      wrap.appendChild(btn);
    });

    return wrap;
  };

  const createDemo = ({
    mount,
    data,
    enableSwipe,
    scrollToTab,
    initialSceneId,
    prefersReducedMotion,
  }) => {
    const toast = createToast(mount);
    const reduceMotion =
      typeof prefersReducedMotion === "boolean"
        ? prefersReducedMotion
        : window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const phone = document.createElement("div");
    phone.className = "pp-phone";

    const frame = document.createElement("div");
    frame.className = "pp-phone-frame";

    const screen = document.createElement("div");
    screen.className = "pp-phone-screen";

    const img = document.createElement("img");
    img.className = "pp-phone-scene";
    img.decoding = "async";
    img.loading = "eager";
    img.style.opacity = "1";
    if (!reduceMotion) {
      img.style.transition = "opacity var(--pp-demo-transition-ms) ease";
      img.addEventListener("load", () => {
        img.style.opacity = "1";
      });
    }

    const overlay = document.createElement("div");
    overlay.className = "pp-phone-overlay";

    const redaction = document.createElement("div");
    redaction.className = "pp-phone-redaction";
    redaction.dataset.preset = "light";

    const badge = document.createElement("img");
    badge.className = "pp-phone-preview-badge";
    badge.src = "assets/demo/preview-badge.svg";
    badge.alt = "";

    const hotspots = document.createElement("div");
    hotspots.className = "pp-phone-hotspots";

    screen.appendChild(img);
    screen.appendChild(overlay);
    screen.appendChild(redaction);
    screen.appendChild(badge);
    screen.appendChild(hotspots);
    frame.appendChild(screen);
    phone.appendChild(frame);

    const caption = document.createElement("div");
    caption.className = "pp-demo-caption surface";
    caption.innerHTML = "<h3></h3><p></p>";

    const captionTitle = $("h3", caption);
    const captionBody = $("p", caption);

    const tabs = data.tabs || [];
    let activeTab = tabs[0] || "home";
    let currentImageSrc = null;

    const sceneById = new Map((data.scenes || []).map((s) => [s.id, s]));
    const scenesByTab = new Map();

    (data.scenes || []).forEach((scene) => {
      const bucket = scenesByTab.get(scene.tab) || [];
      bucket.push(scene);
      scenesByTab.set(scene.tab, bucket);
    });

    const findDefaultScene = (tab) => {
      const scenes = scenesByTab.get(tab) || [];
      return scenes.find((s) => s.level === "overview") || scenes[0] || null;
    };

    let activeScene = null;
    if (initialSceneId && sceneById.has(initialSceneId)) {
      activeScene = sceneById.get(initialSceneId);
      activeTab = activeScene.tab || activeTab;
    } else {
      activeScene = findDefaultScene(activeTab);
    }

    const mountNode = document.createElement("div");
    mountNode.className = "pp-demo";
    mountNode.appendChild(phone);

    const playAnim = (className, durationMs) => {
      if (reduceMotion) return;
      if (!className) return;
      mountNode.classList.remove(className);
      // Force style recalc so repeated transitions can re-play.
      void mountNode.offsetWidth;
      mountNode.classList.add(className);
      window.clearTimeout(playAnim._t);
      playAnim._t = window.setTimeout(() => {
        mountNode.classList.remove(className);
      }, durationMs);
    };

    const tabsUi = createTabs(tabs, activeTab, (tab) => {
      const prevSceneId = activeScene && activeScene.id;
      const prevTab = activeTab;
      activeTab = tab;
      activeScene = findDefaultScene(tab);
      render({
        transitionClass:
          prevSceneId === "splash" && activeScene && activeScene.id !== "splash"
            ? "pp-demo--boot"
            : prevTab !== tab
              ? "pp-demo--tab-swap"
              : null,
        transitionMs:
          prevSceneId === "splash" && activeScene && activeScene.id !== "splash" ? 820 : 520,
      });

      if (typeof scrollToTab === "function") scrollToTab(tab);
    });

    const setSelectedTabUi = () => {
      $$(".pp-demo-tab", tabsUi).forEach((btn) => {
        btn.setAttribute("aria-selected", String(btn.dataset.tab === activeTab));
      });
    };

    const renderHotspots = () => {
      hotspots.innerHTML = "";
      const list = (activeScene && activeScene.hotspots) || [];
      list.forEach((spot) => {
        hotspots.appendChild(
          buildHotspot(spot, (clicked) => {
            if (clicked.previewOnly) showToast(toast);
            const next = sceneById.get(clicked.targetSceneId);
            if (next) {
              activeTab = next.tab;
              activeScene = next;
              render({
                transitionClass: "pp-demo--detail",
                transitionMs: 420,
              });
            }
          })
        );
      });
    };

    const render = ({ transitionClass, transitionMs } = {}) => {
      if (!activeScene) return;
      mountNode.dataset.ppScene = activeScene.id || "";
      mountNode.dataset.ppTab = activeTab || "";

      const nextSrc = activeScene.image;
      if (nextSrc && nextSrc !== currentImageSrc) {
        if (!reduceMotion) img.style.opacity = "0";
        img.src = nextSrc;
        currentImageSrc = nextSrc;
      }
      img.alt = activeScene.headline || "Perfect Pantry preview";
      redaction.dataset.preset = activeScene.redactionPreset || "light";
      tabsUi.classList.toggle("is-hidden", !!activeScene.hideTabs);
      badge.style.display = activeScene.hideTabs ? "none" : "";

      captionTitle.textContent = activeScene.headline || "";
      captionBody.textContent = activeScene.body || "";

      setSelectedTabUi();
      renderHotspots();

      playAnim(transitionClass, transitionMs || 520);
    };

    render();

    const setupSwipe = () => {
      if (!enableSwipe) return;
      if (!("PointerEvent" in window)) return;

      let startX = null;
      let startY = null;

      const isFromHotspot = (target) => {
        return (
          target &&
          typeof target.closest === "function" &&
          target.closest(".pp-phone-hotspot")
        );
      };

      const onDown = (event) => {
        if (isFromHotspot(event.target)) return;
        startX = event.clientX;
        startY = event.clientY;
      };

      const onUp = (event) => {
        if (startX == null || startY == null) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        startX = null;
        startY = null;

        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX < 44) return;
        if (absX < absY * 1.25) return;

        const dir = dx < 0 ? 1 : -1;
        const idx = Math.max(0, tabs.indexOf(activeTab));
        const nextTab = tabs[(idx + dir + tabs.length) % tabs.length];
        activeTab = nextTab;
        activeScene = findDefaultScene(nextTab);
        render({ transitionClass: "pp-demo--tab-swap", transitionMs: 520 });
      };

      screen.addEventListener("pointerdown", onDown);
      screen.addEventListener("pointerup", onUp);
      screen.addEventListener("pointercancel", () => {
        startX = null;
        startY = null;
      });
    };

    setupSwipe();

    const api = {
      setTab(tab) {
        if (!tab) return;
        const nextDefault = findDefaultScene(tab);
        if (!nextDefault) return;
        if (tab === activeTab && activeScene && activeScene.id === nextDefault.id) return;
        const prevSceneId = activeScene && activeScene.id;
        const prevTab = activeTab;
        activeTab = tab;
        activeScene = nextDefault;
        render({
          transitionClass:
            prevSceneId === "splash" && activeScene && activeScene.id !== "splash"
              ? "pp-demo--boot"
              : prevTab !== tab
                ? "pp-demo--tab-swap"
                : null,
          transitionMs:
            prevSceneId === "splash" && activeScene && activeScene.id !== "splash" ? 820 : 520,
        });
      },
      setScene(sceneId) {
        const next = sceneById.get(sceneId);
        if (!next) return;
        if (activeScene && next.id === activeScene.id) return;
        const prevSceneId = activeScene && activeScene.id;
        activeTab = next.tab;
        activeScene = next;
        render({
          transitionClass:
            prevSceneId === "splash" && next.id !== "splash"
              ? "pp-demo--boot"
              : "pp-demo--detail",
          transitionMs: prevSceneId === "splash" && next.id !== "splash" ? 820 : 420,
        });
      },
      isDetailOpen() {
        return !!(activeScene && activeScene.level === "detail");
      },
      closeDetail() {
        const nextDefault = findDefaultScene(activeTab);
        if (!nextDefault) return;
        if (activeScene && nextDefault.id === activeScene.id) return;
        activeScene = nextDefault;
        render({ transitionClass: "pp-demo--detail", transitionMs: 420 });
      },
    };

    mountNode.appendChild(tabsUi);
    mountNode.appendChild(caption);

    return { mountNode, api };
  };

  const createAppSimDemo = ({
    mount,
    sceneData,
    contentData,
    enableSwipe,
    scrollToTab,
    initialSceneId,
    prefersReducedMotion,
  }) => {
    const toast = createToast(mount);
    const reduceMotion =
      typeof prefersReducedMotion === "boolean"
        ? prefersReducedMotion
        : window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const data = sceneData || {};
    const content = contentData || {};

    const tabs = data.tabs || [];
    let activeTab = tabs[0] || "home";
    let activeScene = null;
    let lastUiTab = null;

    const sceneById = new Map((data.scenes || []).map((s) => [s.id, s]));
    const scenesByTab = new Map();

    (data.scenes || []).forEach((scene) => {
      const bucket = scenesByTab.get(scene.tab) || [];
      bucket.push(scene);
      scenesByTab.set(scene.tab, bucket);
    });

    const findSceneByLevel = (tab, level) => {
      const scenes = scenesByTab.get(tab) || [];
      return scenes.find((s) => s.level === level) || null;
    };

    const findDefaultScene = (tab) => {
      return findSceneByLevel(tab, "overview") || (scenesByTab.get(tab) || [])[0] || null;
    };

    const overviewSceneIdByTab = new Map();
    const detailSceneIdByTab = new Map();
    tabs.forEach((tab) => {
      const ov = findSceneByLevel(tab, "overview");
      const dt = findSceneByLevel(tab, "detail");
      if (ov && ov.id) overviewSceneIdByTab.set(tab, ov.id);
      if (dt && dt.id) detailSceneIdByTab.set(tab, dt.id);
    });

    if (initialSceneId && sceneById.has(initialSceneId)) {
      activeScene = sceneById.get(initialSceneId);
      activeTab = activeScene.tab || activeTab;
    } else {
      activeScene = findDefaultScene(activeTab);
    }

    const mountNode = document.createElement("div");
    mountNode.className = "pp-demo pp-demo--appsim";

    const playAnim = (className, durationMs) => {
      if (reduceMotion) return;
      if (!className) return;
      mountNode.classList.remove(className);
      void mountNode.offsetWidth;
      mountNode.classList.add(className);
      window.clearTimeout(playAnim._t);
      playAnim._t = window.setTimeout(() => {
        mountNode.classList.remove(className);
      }, durationMs);
    };

    const phone = document.createElement("div");
    phone.className = "pp-phone";

    const frame = document.createElement("div");
    frame.className = "pp-phone-frame";

    const screen = document.createElement("div");
    screen.className = "pp-phone-screen";

    const splashImg = document.createElement("img");
    splashImg.className = "pp-phone-scene";
    splashImg.decoding = "async";
    splashImg.loading = "eager";
    splashImg.alt = "Perfect Pantry preview";

    const overlay = document.createElement("div");
    overlay.className = "pp-phone-overlay";

    const badge = document.createElement("img");
    badge.className = "pp-phone-preview-badge";
    badge.src = "assets/demo/preview-badge.svg";
    badge.alt = "";
    badge.decoding = "async";
    badge.loading = "lazy";

    const app = document.createElement("div");
    app.className = "pp-app";
    app.setAttribute("aria-hidden", "true");
    app.dataset.ppBg = "home";
    app.dataset.ppTab = "";

    const stage = document.createElement("div");
    stage.className = "pp-app-stage";

    const bg = document.createElement("div");
    bg.className = "pp-app-bg";

    const objectsLayer = document.createElement("div");
    objectsLayer.className = "pp-app-objects";
    objectsLayer.setAttribute("aria-hidden", "true");

    const appContent = document.createElement("div");
    appContent.className = "pp-app-content";
    appContent.dataset.ppScrollable = "true";

    const fabsLayer = document.createElement("div");
    fabsLayer.className = "pp-app-fabs";
    fabsLayer.setAttribute("aria-hidden", "true");

    const appNav = document.createElement("nav");
    appNav.className = "pp-app-nav";
    appNav.setAttribute("aria-label", "App tabs");

    const buildNavIcon = (tab) => {
      const svg = svgElementFromString(TAB_SVGS[tab]);
      if (!svg) return null;
      svg.classList.add("pp-app-nav-icon");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      return svg;
    };

    tabs.forEach((tab) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pp-app-nav-btn";
      btn.dataset.tab = tab;
      btn.setAttribute("aria-selected", String(tab === activeTab));
      btn.setAttribute("aria-label", slugToLabel(tab));

      const icon = buildNavIcon(tab);
      if (icon) btn.appendChild(icon);

      const label = document.createElement("span");
      label.className = "pp-app-nav-label";
      label.textContent = slugToLabel(tab);
      btn.appendChild(label);

      const indicator = document.createElement("span");
      indicator.className = "pp-app-nav-indicator";
      btn.appendChild(indicator);

      btn.addEventListener("click", () => {
        api.setTab(tab);
      });

      appNav.appendChild(btn);
    });

    const modal = document.createElement("div");
    modal.className = "pp-app-modal";
    modal.setAttribute("aria-hidden", "true");

    const scrim = document.createElement("div");
    scrim.className = "pp-app-scrim";

    const sheet = document.createElement("div");
    sheet.className = "pp-app-sheet";
    sheet.dataset.ppScrollable = "true";

    modal.appendChild(scrim);
    modal.appendChild(sheet);

    stage.appendChild(bg);
    stage.appendChild(objectsLayer);
    stage.appendChild(appContent);
    stage.appendChild(fabsLayer);

    app.appendChild(stage);
    app.appendChild(appNav);

    screen.appendChild(splashImg);
    screen.appendChild(overlay);
    screen.appendChild(app);
    screen.appendChild(modal);
    screen.appendChild(badge);
    frame.appendChild(screen);
    phone.appendChild(frame);
    mountNode.appendChild(phone);

    const setSelectedNavUi = () => {
      $$(".pp-app-nav-btn", appNav).forEach((btn) => {
        btn.setAttribute("aria-selected", String(btn.dataset.tab === activeTab));
      });
    };

    const clear = (node) => {
      while (node.firstChild) node.removeChild(node.firstChild);
    };

    const el = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text != null) node.textContent = String(text);
      return node;
    };

    const iconEl = (name) => {
      const svg = svgElementFromString(UI_SVGS[name]);
      if (!svg) return null;
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      return svg;
    };

    const imgEl = ({ src, className, alt }) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = className || "";
      img.alt = alt || "";
      img.decoding = "async";
      img.loading = "eager";
      return img;
    };

    const buildPill = ({
      label,
      className,
      leftIcon,
      rightIcon,
      ariaLabel,
      onClick,
    }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = className ? `pp-app-pill ${className}` : "pp-app-pill";
      if (ariaLabel) btn.setAttribute("aria-label", ariaLabel);

      const left = leftIcon ? iconEl(leftIcon) : null;
      if (left) btn.appendChild(left);

      const span = document.createElement("span");
      span.textContent = label || "";
      btn.appendChild(span);

      const right = rightIcon ? iconEl(rightIcon) : null;
      if (right) btn.appendChild(right);

      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        return onClick ? onClick() : showToast(toast);
      });
      return btn;
    };

    const buildCircle = ({ icon, className, ariaLabel, onClick }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = className ? `pp-app-circle ${className}` : "pp-app-circle";
      if (ariaLabel) btn.setAttribute("aria-label", ariaLabel);
      const svg = iconEl(icon);
      if (svg) btn.appendChild(svg);
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        return onClick ? onClick() : showToast(toast);
      });
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

    const renderObjectsForTab = (tab) => {
      clear(objectsLayer);

      const add = (src, cls) => {
        const obj = imgEl({ src, className: `pp-obj ${cls}`, alt: "" });
        objectsLayer.appendChild(obj);
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

      const addFabSvg = ({ cls, icon, ariaLabel, onClick }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `pp-app-fab ${cls}`;
        btn.setAttribute("aria-label", ariaLabel || "Preview only");
        const svg = iconEl(icon);
        if (svg) btn.appendChild(svg);
        btn.addEventListener("click", () => (onClick ? onClick() : showToast(toast)));
        fabsLayer.appendChild(btn);
      };

      const addFabImg = ({ cls, src, ariaLabel, onClick }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `pp-app-fab ${cls}`;
        btn.setAttribute("aria-label", ariaLabel || "Preview only");
        const img = imgEl({ src, className: "", alt: "" });
        btn.appendChild(img);
        btn.addEventListener("click", () => (onClick ? onClick() : showToast(toast)));
        fabsLayer.appendChild(btn);
      };

      if (tab === "home") {
        addFabSvg({ cls: "pp-app-fab--gear", icon: "gear", ariaLabel: "Settings (preview)" });
        return;
      }

      if (tab === "cookbook") {
        addFabSvg({ cls: "pp-app-fab--plus", icon: "plus", ariaLabel: "Add recipe (preview)" });
        return;
      }

      if (tab === "pantry") {
        addFabImg({
          cls: "pp-app-fab--spice",
          src: "assets/objects/obj_tan_spice.png",
          ariaLabel: "Spices (preview)",
        });
        addFabSvg({ cls: "pp-app-fab--plus", icon: "plus", ariaLabel: "Add pantry item (preview)" });
      }
    };

    const buildListRow = ({ title, subtitle, trailing, onClick }) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "pp-app-list-row";

      const left = document.createElement("div");
      const h = el("p", "pp-app-list-row-title", title);
      const sub = el("p", "pp-app-list-row-sub", subtitle);
      left.appendChild(h);
      if (subtitle) left.appendChild(sub);

      row.appendChild(left);
      if (trailing) row.appendChild(trailing);

      row.addEventListener("click", () => onClick && onClick());
      return row;
    };

    const openDetailForTab = (tab) => {
      const detailId = detailSceneIdByTab.get(tab);
      if (!detailId) return;
      const next = sceneById.get(detailId);
      if (!next) return;
      showToast(toast);
      const prevSceneId = activeScene && activeScene.id;
      activeTab = tab;
      activeScene = next;
      render({
        transitionClass:
          prevSceneId === "splash" && next.id !== "splash"
            ? "pp-demo--boot"
            : "pp-demo--detail",
        transitionMs: prevSceneId === "splash" && next.id !== "splash" ? 820 : 420,
      });
    };

    const closeDetail = () => {
      const overviewId = overviewSceneIdByTab.get(activeTab);
      if (!overviewId) return;
      const next = sceneById.get(overviewId);
      if (!next) return;
      activeScene = next;
      render({ transitionClass: "pp-demo--detail", transitionMs: 420 });
    };

    scrim.addEventListener("click", () => closeDetail());

    const renderHome = () => {
      const home = content.home || {};
      const root = el("div", "pp-screen pp-screen-home");

      const weekCard = el("div", "pp-app-card");
      weekCard.appendChild(el("p", "pp-app-card-title", "Meals This Week"));
      weekCard.appendChild(el("p", "pp-app-card-sub", "Plan your life, Live your plan"));
      weekCard.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          "Feb 2–Feb 8  •  Today is Fri, Feb 6",
        ),
      );
      weekCard.appendChild(el("div", "pp-app-divider"));
      weekCard.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          `${home.plannedMeals || 1}/${home.targetMeals || 5} meals planned`,
        ),
      );
      weekCard.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          `${home.scheduledDays || 1}/7 scheduled for the week`,
        ),
      );
      weekCard.appendChild(el("p", "pp-app-card-sub", home.coverageLabel || "Pantry coverage: 0/10 on hand  •  10 to buy"));
      root.appendChild(weekCard);

      const dinnerCard = el("div", "pp-app-card");
      dinnerCard.appendChild(el("p", "pp-app-card-title", "What's For Dinner?"));
      dinnerCard.appendChild(
        el(
          "p",
          "pp-meal-title",
          (home.todayMeal && home.todayMeal.title) || "One-Pot Creamy Tuscan Pasta",
        ),
      );
      dinnerCard.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          (home.todayMeal && home.todayMeal.coverageLabel) || "Pantry coverage: 0/10 on hand  •  10 to buy",
        ),
      );
      dinnerCard.appendChild(el("div", "pp-app-divider"));
      const ctas = el("div", "pp-home-cta-row");
      ctas.appendChild(
        buildPill({
          label: "View Recipe",
          className: "pp-app-pill--title",
          onClick: () => openDetailForTab("cookbook"),
        }),
      );
      ctas.appendChild(
        buildPill({
          label: "Cook Now",
          className: "pp-app-pill--title",
          onClick: () => showToast(toast),
        }),
      );
      dinnerCard.appendChild(ctas);
      root.appendChild(dinnerCard);

      const actionsCard = el("div", "pp-app-card");
      actionsCard.appendChild(el("p", "pp-app-card-title", "Quick Actions"));
      const actions = el("div", "pp-home-actions");

      const mkAction = ({ icon, label, onClick }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pp-home-action";
        btn.addEventListener("click", () => (onClick ? onClick() : showToast(toast)));

        const iconWrap = el("div", "pp-home-action-icon");
        const svg = svgElementFromString(icon);
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
          icon: TAB_SVGS.cookbook,
          label: "Add New Recipe",
          onClick: () => showToast(toast),
        }),
      );
      actions.appendChild(
        mkAction({
          icon: TAB_SVGS.pantry,
          label: "Add Pantry Item",
          onClick: () => api.setTab("pantry"),
        }),
      );
      actions.appendChild(
        mkAction({
          icon: UI_SVGS.search,
          label: "Search Recipes",
          onClick: () => api.setTab("cookbook"),
        }),
      );

      actionsCard.appendChild(actions);
      root.appendChild(actionsCard);

      return root;
    };

    const renderPantry = () => {
      const pantry = content.pantry || {};
      const items = Array.isArray(pantry.items) ? pantry.items : [];
      const root = el("div", "pp-screen pp-screen-pantry");

      const count = Number(items.length || 0);
      const topRow = el("div", "pp-top-row");
      topRow.appendChild(
        buildPill({
          label: "List",
          className: "pp-app-pill--title",
          leftIcon: "menu",
          onClick: () => showToast(toast),
        }),
      );
      topRow.appendChild(
        buildPill({
          label: `All Items (${count || 5})`,
          className: "pp-app-pill--title",
          rightIcon: "chevron_down",
          onClick: () => showToast(toast),
        }),
      );
      topRow.appendChild(
        buildCircle({
          icon: "search",
          className: "pp-app-circle--muted",
          ariaLabel: "Search pantry (preview)",
        }),
      );
      root.appendChild(topRow);

      const chipWrap = el("div", "pp-chip-wrap");
      chipWrap.appendChild(el("span", "pp-app-chip", "Produce 3"));
      root.appendChild(chipWrap);

      const stage = el("div", "pp-pantry-stage");
      stage.appendChild(
        imgEl({
          src: "assets/ingredients/apple.png",
          className: "pp-pantry-item pp-pantry-item--apple",
          alt: "",
        }),
      );
      stage.appendChild(
        imgEl({
          src: "assets/ingredients/banana.png",
          className: "pp-pantry-item pp-pantry-item--banana",
          alt: "",
        }),
      );
      stage.appendChild(
        imgEl({
          src: "assets/ingredients/avocado.png",
          className: "pp-pantry-item pp-pantry-item--avocado",
          alt: "",
        }),
      );

      const label = ({ cls, title, sub }) => {
        const node = document.createElement("div");
        node.className = `pp-pantry-label ${cls}`;
        const strong = document.createElement("strong");
        strong.textContent = title;
        const span = document.createElement("span");
        span.textContent = sub;
        node.appendChild(strong);
        node.appendChild(span);
        return node;
      };

      stage.appendChild(label({ cls: "pp-pantry-label--apple", title: "Apple", sub: "Exp 1d" }));
      stage.appendChild(label({ cls: "pp-pantry-label--banana", title: "Banana", sub: "Exp 1d" }));
      stage.appendChild(label({ cls: "pp-pantry-label--avocado", title: "Avocado", sub: "Exp 1d" }));

      root.appendChild(stage);
      return root;
    };

    const renderCookbook = () => {
      const cookbook = content.cookbook || {};
      const recipes = Array.isArray(cookbook.recipes) ? cookbook.recipes : [];
      const root = el("div", "pp-screen pp-screen-cookbook");

      const hud = el("div", "pp-cookbook-hud");

      const row = el("div", "pp-cookbook-row");
      row.appendChild(
        buildPill({
          label: "Cookbook",
          className: "pp-app-pill--title",
          rightIcon: "chevron_down",
          onClick: () => showToast(toast),
        }),
      );
      row.appendChild(
        buildCircle({
          icon: "search",
          ariaLabel: "Search recipes (preview)",
          className: "pp-app-circle--muted",
        }),
      );
      hud.appendChild(row);

      const filterRow = el("div", "pp-cookbook-row pp-cookbook-row--filters");
      filterRow.appendChild(
        buildCircle({
          icon: "swap",
          ariaLabel: "Swap (preview)",
          className: "pp-app-circle--muted",
        }),
      );
      filterRow.appendChild(
        buildPill({
          label: "Main Dish",
          className: "pp-app-pill--title",
          rightIcon: "chevron_down",
          onClick: () => showToast(toast),
        }),
      );
      hud.appendChild(filterRow);

      const chips = el("div", "pp-cookbook-chips");
      ["All", "Burgers", "Casseroles", "Deep Fried", "Fish"].forEach((labelText, idx) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = idx === 0 ? "pp-cookbook-chip is-selected" : "pp-cookbook-chip";
        chip.textContent = labelText;
        chip.addEventListener("click", () => showToast(toast));
        chips.appendChild(chip);
      });
      hud.appendChild(chips);

      root.appendChild(hud);

      const grid = el("div", "pp-app-grid");
      recipes.slice(0, 6).forEach((r) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "pp-app-recipe-card";
        card.addEventListener("click", () => openDetailForTab("cookbook"));

        const thumb = el("div", "pp-app-recipe-thumb");
        const overlays = el("div", "pp-recipe-overlays");

        const mkOverlay = (iconName, ariaLabel) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pp-recipe-overlay-btn";
          btn.setAttribute("aria-label", ariaLabel);
          const svg = iconEl(iconName);
          if (svg) btn.appendChild(svg);
          btn.addEventListener("click", (event) => {
            event.stopPropagation();
            showToast(toast);
          });
          return btn;
        };

        overlays.appendChild(mkOverlay("heart", "Favorite (preview)"));
        overlays.appendChild(mkOverlay("plus", "Add (preview)"));
        thumb.appendChild(overlays);
        card.appendChild(thumb);

        card.appendChild(el("p", "pp-app-recipe-title", r.title || "Recipe"));
        card.appendChild(el("p", "pp-app-recipe-meta", r.meta || "35 min  •  4 servings"));
        grid.appendChild(card);
      });

      root.appendChild(grid);
      return root;
    };

    const renderPlan = () => {
      const plan = content.plan || {};
      const week = Array.isArray(plan.week) ? plan.week : [];
      const root = el("div", "pp-screen pp-screen-plan");

      const hud = el("div", "pp-plan-hud");
      const weekRow = el("div", "pp-plan-week-row");
      weekRow.appendChild(
        buildCircle({
          icon: "chevron_left",
          ariaLabel: "Previous week (preview)",
          className: "pp-app-circle--muted",
        }),
      );
      weekRow.appendChild(
        buildPill({
          label: "Week of 2/2",
          className: "pp-plan-week-pill pp-app-pill--title",
          rightIcon: "chevron_down",
          onClick: () => showToast(toast),
        }),
      );
      weekRow.appendChild(
        buildCircle({
          icon: "chevron_right",
          ariaLabel: "Next week (preview)",
          className: "pp-app-circle--muted",
        }),
      );
      hud.appendChild(weekRow);

      hud.appendChild(
        buildPill({
          label: "Auto-fill this week",
          className: "pp-app-pill--wide pp-app-pill--title",
          leftIcon: "sparkles",
          onClick: () => showToast(toast),
        }),
      );

      root.appendChild(hud);

      const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const dates = ["2/2", "2/3", "2/4", "2/5", "2/6", "2/7", "2/8"];

      week.slice(0, 7).forEach((slot, idx) => {
        const card = el("div", "pp-app-card pp-meal-card");
        card.addEventListener("click", () => openDetailForTab("plan"));

        card.appendChild(el("div", "pp-meal-thumb"));

        const meta = el("div", "pp-meal-meta");
        meta.appendChild(
          el("p", "pp-meal-title", `${dayNames[idx] || slot.day || "Day"}  •  ${dates[idx] || ""}`),
        );
        meta.appendChild(el("p", "pp-meal-sub", slot.meal || "Meal preview"));
        meta.appendChild(el("p", "pp-meal-sub", `${(idx % 3) + 1} of ${(idx % 10) + 7} from pantry`));
        card.appendChild(meta);

        const actions = el("div", "pp-meal-actions");
        actions.appendChild(
          buildPill({
            label: "Start Cooking",
            onClick: () => showToast(toast),
          }),
        );
        actions.appendChild(
          buildPill({
            label: "Replan Meal",
            onClick: () => showToast(toast),
          }),
        );
        card.appendChild(actions);
        root.appendChild(card);
      });

      return root;
    };

    const renderShop = () => {
      const shop = content.shop || {};
      const root = el("div", "pp-screen pp-screen-shop");

      const topRow = el("div", "pp-top-row");
      topRow.appendChild(
        buildPill({
          label: "List",
          className: "pp-app-pill--title",
          leftIcon: "menu",
          onClick: () => showToast(toast),
        }),
      );
      topRow.appendChild(
        buildPill({
          label: "Shopping",
          className: "pp-app-pill--title",
          onClick: () => showToast(toast),
        }),
      );
      topRow.appendChild(
        buildCircle({
          icon: "search",
          ariaLabel: "Search shopping (preview)",
          className: "pp-app-circle--muted",
        }),
      );
      root.appendChild(topRow);

      root.appendChild(
        buildPill({
          label: "Tomatillo Salsa Verde",
          className: "pp-app-pill--title pp-shop-recipe-pill",
          onClick: () => showToast(toast),
        }),
      );

      const stage = el("div", "pp-shop-stage");
      const itemsWrap = el("div", "pp-shop-items");

      itemsWrap.appendChild(
        imgEl({ src: "assets/objects/obj_garlic.png", className: "pp-shop-item pp-shop-item--garlic", alt: "" }),
      );
      itemsWrap.appendChild(
        imgEl({ src: "assets/ingredients/jalapeno.png", className: "pp-shop-item pp-shop-item--jalapeno", alt: "" }),
      );
      itemsWrap.appendChild(
        imgEl({ src: "assets/objects/obj_tan_spice.png", className: "pp-shop-item pp-shop-item--salt", alt: "" }),
      );
      itemsWrap.appendChild(
        imgEl({ src: "assets/ingredients/olive_oil.png", className: "pp-shop-item pp-shop-item--oliveoil", alt: "" }),
      );
      itemsWrap.appendChild(
        imgEl({ src: "assets/ingredients/white_onion.png", className: "pp-shop-item pp-shop-item--onion", alt: "" }),
      );

      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--garlic", "Garlic"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--jalapeno", "Jalapeno"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--salt", "Kosher Salt"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--oliveoil", "Olive oil"));
      itemsWrap.appendChild(el("div", "pp-shop-label pp-shop-label--onion", "White Onion"));

      stage.appendChild(itemsWrap);

      const bar = el("div", "pp-shop-bar");
      bar.appendChild(
        buildCircle({
          icon: "close",
          className: "pp-app-circle--danger",
          ariaLabel: "Cancel (preview)",
          onClick: () => showToast(toast),
        }),
      );
      bar.appendChild(
        buildPill({
          label: "Complete shopping",
          className: "pp-app-pill--wide",
          onClick: () => showToast(toast),
        }),
      );
      bar.appendChild(
        buildCircle({
          icon: "plus",
          ariaLabel: "Add item (preview)",
          onClick: () => showToast(toast),
        }),
      );
      stage.appendChild(bar);

      root.appendChild(stage);
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
          return el("div", "pp-app-section", "");
      }
    };

    const renderDetailSheet = (tab) => {
      clear(sheet);

      const header = el("div", "pp-app-sheet-header");
      const title = el(
        "p",
        "pp-app-sheet-title",
        (activeScene && activeScene.headline) || "Preview",
      );
      const closeBtn = el("button", "pp-app-sheet-close", "X");
      closeBtn.type = "button";
      closeBtn.setAttribute("aria-label", "Close preview");
      closeBtn.addEventListener("click", () => closeDetail());
      header.appendChild(title);
      header.appendChild(closeBtn);
      sheet.appendChild(header);

      sheet.appendChild(el("div", "pp-app-divider"));

      if (tab === "home") {
        const body = el("div", "pp-app-section");
        body.appendChild(el("p", "pp-app-card-sub", "Quick actions preview (non-functional)."));
        const pills = el("div", "pp-app-pill-row");
        (content.home && content.home.quickActions ? content.home.quickActions : [])
          .slice(0, 3)
          .forEach((action) => {
            const btn = el("button", "pp-app-pill", action.label || "Action");
            btn.type = "button";
            btn.addEventListener("click", () => showToast(toast));
            pills.appendChild(btn);
          });
        body.appendChild(pills);
        sheet.appendChild(body);
        return;
      }

      if (tab === "pantry") {
        const pantry = content.pantry || {};
        const item = (Array.isArray(pantry.items) ? pantry.items : [])[1] || {};
        const body = el("div", "pp-app-section");
        body.appendChild(el("p", "pp-app-card-kicker", "Item detail"));
        body.appendChild(el("p", "pp-app-card-title", item.name || "Pantry item"));
        body.appendChild(el("p", "pp-app-card-sub", "Some fields are intentionally hidden."));
        const meta = el("div", "pp-app-card");
        meta.appendChild(el("p", "pp-app-card-sub", `Quantity: ${item.qty || "—"}`));
        meta.appendChild(el("p", "pp-app-card-sub", `Expires: ${item.expires || "—"}`));
        meta.appendChild(el("div", "pp-app-divider"));
        meta.appendChild(el("p", "pp-app-card-sub", "Notes: •••"));
        meta.appendChild(el("p", "pp-app-card-sub", "Source: •••"));
        body.appendChild(meta);
        sheet.appendChild(body);
        return;
      }

      if (tab === "cookbook") {
        const cookbook = content.cookbook || {};
        const detail = cookbook.detail || {};
        const body = el("div", "pp-app-section");
        body.appendChild(el("p", "pp-app-card-kicker", "Recipe preview"));
        body.appendChild(el("p", "pp-app-card-title", detail.title || "Recipe"));
        body.appendChild(el("p", "pp-app-card-sub", detail.meta || ""));

        const ingCard = el("div", "pp-app-card");
        ingCard.appendChild(el("p", "pp-app-card-kicker", "Ingredients"));
        const ingList = el("div", "pp-redact-fade");
        (detail.ingredients || []).slice(0, 7).forEach((line) => {
          ingList.appendChild(el("p", "pp-app-card-sub", line));
        });
        ingCard.appendChild(ingList);
        body.appendChild(ingCard);

        const stepCard = el("div", "pp-app-card");
        stepCard.appendChild(el("p", "pp-app-card-kicker", "Steps"));
        const steps = el("div", "pp-redact-fade");
        (detail.steps || []).slice(0, 6).forEach((line, idx) => {
          steps.appendChild(el("p", "pp-app-card-sub", `${idx + 1}. ${line}`));
        });
        stepCard.appendChild(steps);
        body.appendChild(stepCard);

        const ctas = el("div", "pp-app-pill-row");
        const addToPlan = el("button", "pp-app-pill pp-app-pill--primary", "Add to plan");
        addToPlan.type = "button";
        addToPlan.addEventListener("click", () => showToast(toast));
        const shopGap = el("button", "pp-app-pill", "Build shop gap");
        shopGap.type = "button";
        shopGap.addEventListener("click", () => api.setTab("shop"));
        ctas.appendChild(addToPlan);
        ctas.appendChild(shopGap);
        body.appendChild(ctas);

        sheet.appendChild(body);
        return;
      }

      if (tab === "plan") {
        const plan = content.plan || {};
        const detail = plan.detail || {};
        const body = el("div", "pp-app-section");
        body.appendChild(el("p", "pp-app-card-kicker", "Plan slot"));
        body.appendChild(el("p", "pp-app-card-title", `${detail.day || "Day"} • ${detail.slot || "Dinner"}`));
        body.appendChild(el("p", "pp-app-card-sub", detail.body || ""));
        const pillRow = el("div", "pp-app-pill-row");
        const pick = el("button", "pp-app-pill pp-app-pill--primary", "Pick recipe");
        pick.type = "button";
        pick.addEventListener("click", () => showToast(toast));
        const view = el("button", "pp-app-pill", "Open cookbook");
        view.type = "button";
        view.addEventListener("click", () => api.setTab("cookbook"));
        pillRow.appendChild(pick);
        pillRow.appendChild(view);
        body.appendChild(pillRow);
        sheet.appendChild(body);
        return;
      }

      if (tab === "shop") {
        const shop = content.shop || {};
        const detail = shop.detail || {};
        const body = el("div", "pp-app-section");
        body.appendChild(el("p", "pp-app-card-kicker", "Shopping"));
        body.appendChild(el("p", "pp-app-card-title", detail.headline || "Bulk picker"));
        body.appendChild(el("p", "pp-app-card-sub", detail.body || ""));

        const list = el("div", "pp-app-list");
        (detail.options || []).slice(0, 3).forEach((opt) => {
          list.appendChild(
            buildListRow({
              title: opt.label || "Option",
              subtitle: opt.detail || "",
              trailing: el("span", "pp-app-chip", "Preview"),
              onClick: () => showToast(toast),
            }),
          );
        });
        body.appendChild(list);

        const pillRow = el("div", "pp-app-pill-row");
        const add = el("button", "pp-app-pill pp-app-pill--primary", "Add to cart");
        add.type = "button";
        add.addEventListener("click", () => showToast(toast));
        const done = el("button", "pp-app-pill", "Done");
        done.type = "button";
        done.addEventListener("click", () => closeDetail());
        pillRow.appendChild(add);
        pillRow.appendChild(done);
        body.appendChild(pillRow);

        sheet.appendChild(body);
        return;
      }

      sheet.appendChild(el("p", "pp-app-card-sub", "Preview only."));
    };

    const render = ({ transitionClass, transitionMs } = {}) => {
      if (!activeScene) return;
      mountNode.dataset.ppScene = activeScene.id || "";
      mountNode.dataset.ppTab = activeTab || "";

      const isSplash = activeScene.id === "splash";

      if (isSplash) {
        splashImg.style.display = "block";
        splashImg.src = activeScene.image || splashImg.src || "";
        app.setAttribute("aria-hidden", "true");
        modal.setAttribute("aria-hidden", "true");
        modal.classList.remove("is-open");
        badge.style.display = "none";
        playAnim(transitionClass, transitionMs || 520);
        return;
      }

      splashImg.style.display = "none";
      badge.style.display = "";
      app.setAttribute("aria-hidden", "false");

      app.dataset.ppTab = activeTab || "";
      app.dataset.ppBg = bgKeyForTab(activeTab);

      renderObjectsForTab(activeTab);
      renderFabsForTab(activeTab);

      const fixedLayout = activeTab === "pantry" || activeTab === "shop";
      appContent.classList.toggle("pp-app-content--fixed", fixedLayout);
      if (activeTab !== lastUiTab) {
        appContent.scrollTop = 0;
        lastUiTab = activeTab;
      }

      clear(appContent);
      appContent.appendChild(renderOverviewForTab(activeTab));

      const isDetail = activeScene.level === "detail";
      if (isDetail) {
        renderDetailSheet(activeTab);
        modal.setAttribute("aria-hidden", "false");
        modal.classList.add("is-open");
      } else {
        modal.setAttribute("aria-hidden", "true");
        modal.classList.remove("is-open");
      }

      setSelectedNavUi();
      playAnim(transitionClass, transitionMs || 520);
    };

    render();

    const setupSwipe = () => {
      if (!enableSwipe) return;
      if (!("PointerEvent" in window)) return;

      let startX = null;
      let startY = null;

      const ignoreFromInteractive = (target) => {
        return (
          target &&
          typeof target.closest === "function" &&
          target.closest("button, a, input, textarea, select, [role='button']")
        );
      };

      const onDown = (event) => {
        if (ignoreFromInteractive(event.target)) return;
        startX = event.clientX;
        startY = event.clientY;
      };

      const onUp = (event) => {
        if (startX == null || startY == null) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        startX = null;
        startY = null;

        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX < 44) return;
        if (absX < absY * 1.25) return;

        const dir = dx < 0 ? 1 : -1;
        const idx = Math.max(0, tabs.indexOf(activeTab));
        const nextTab = tabs[(idx + dir + tabs.length) % tabs.length];
        api.setTab(nextTab);
      };

      screen.addEventListener("pointerdown", onDown);
      screen.addEventListener("pointerup", onUp);
      screen.addEventListener("pointercancel", () => {
        startX = null;
        startY = null;
      });
    };

    setupSwipe();

    const api = {
      setTab(tab) {
        if (!tab) return;
        const nextDefault = findDefaultScene(tab);
        if (!nextDefault) return;
        if (tab === activeTab && activeScene && activeScene.id === nextDefault.id) return;

        const prevSceneId = activeScene && activeScene.id;
        const prevTab = activeTab;
        activeTab = tab;
        activeScene = nextDefault;
        render({
          transitionClass:
            prevSceneId === "splash" && activeScene && activeScene.id !== "splash"
              ? "pp-demo--boot"
              : prevTab !== tab
                ? "pp-demo--tab-swap"
                : null,
          transitionMs:
            prevSceneId === "splash" && activeScene && activeScene.id !== "splash" ? 820 : 520,
        });

        if (typeof scrollToTab === "function") scrollToTab(tab);
      },
      setScene(sceneId) {
        const next = sceneById.get(sceneId);
        if (!next) return;
        if (activeScene && next.id === activeScene.id) return;
        const prevSceneId = activeScene && activeScene.id;
        activeTab = next.tab || activeTab;
        activeScene = next;
        render({
          transitionClass:
            prevSceneId === "splash" && next.id !== "splash"
              ? "pp-demo--boot"
              : "pp-demo--detail",
          transitionMs: prevSceneId === "splash" && next.id !== "splash" ? 820 : 420,
        });
      },
      isDetailOpen() {
        return !!(activeScene && activeScene.level === "detail");
      },
      closeDetail() {
        closeDetail();
      },
    };

    return { mountNode, api };
  };

  const init = async ({
    sceneDataPath,
    contentDataPath,
    mountSelector,
    mobileMode,
    tourSelector,
    initialSceneId,
  }) => {
    const mount = document.querySelector(mountSelector);
    if (!mount) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let data;
    let contentData = null;
    try {
      const res = await fetch(sceneDataPath, { cache: "no-cache" });
      data = await res.json();
    } catch (e) {
      console.error("PPDemo init failed", e);
      return;
    }

    const demoContentPath = contentDataPath || "assets/data/demo_content.v1.json";
    try {
      const res = await fetch(demoContentPath, { cache: "no-cache" });
      contentData = await res.json();
    } catch (e) {
      // Content is optional; fall back to empty model.
      console.warn("PPDemo demo_content load failed", e);
      contentData = { version: "0" };
    }

    const tourRoot = tourSelector ? document.querySelector(tourSelector) : null;
    const desktopWidth =
      window.matchMedia && !window.matchMedia("(max-width: 960px)").matches;
    const finePointer =
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const desktopTourCandidate =
      !!tourRoot && mobileMode !== "carousel" && desktopWidth && finePointer && !prefersReducedMotion;

    const tourMode = desktopTourCandidate
      ? String(tourRoot.dataset.ppTourMode || "scroll")
      : "none";

    const lockTourEnabled = desktopTourCandidate && tourMode === "lock";
    const scrollTourEnabled = desktopTourCandidate && tourMode !== "lock";

    // In lock mode, the controller is created after the demo mounts, so use a forward ref.
    let lockController = null;

    const scrollToTab = lockTourEnabled
      ? (tab) => {
          if (lockController) lockController.setStep(tab);
        }
      : scrollTourEnabled
        ? (tab) => {
            // Tour uses step ids that match tab slugs.
            const stepId = tab;
            activateTourStep(tourRoot, stepId);
            const sentinel = tourRoot.querySelector(
              `.pp-tour-sentinel[data-pp-step="${CSS.escape(stepId)}"]`,
            );
            if (!sentinel) return;
            sentinel.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "start",
            });
          }
        : null;

    const shouldStartInSplash = (() => {
      if (!lockTourEnabled) return false;
      if (!tourRoot) return false;
      const hash = String(window.location.hash || "");
      if (hash && hash !== "#guided-tour") return false;
      const y = window.scrollY || window.pageYOffset || 0;
      return y <= 12;
    })();

    const { mountNode, api } = createAppSimDemo({
      mount,
      sceneData: data,
      contentData,
      enableSwipe: mobileMode === "carousel",
      scrollToTab,
      initialSceneId: shouldStartInSplash ? initialSceneId : null,
      prefersReducedMotion,
    });

    if (mobileMode === "carousel") {
      mount.classList.add("pp-demo-carousel");
    }

    mount.innerHTML = "";
    mount.appendChild(mountNode);

    // Tour bindings (desktop). When disabled, keep the demo interactive-only.
    if (lockTourEnabled) {
      lockController = bindTourLock({
        tourRoot,
        api,
        prefersReducedMotion,
        afterSelector: "#tour-after",
      });
      return;
    }

    if (scrollTourEnabled) {
      bindTourSync({ tourRoot, api, prefersReducedMotion });
      return;
    }

    // Legacy scroll-driven syncing (for older pages/sections using data-scroll-key).
    const anchors = getScrollAnchors(document);
    if (!anchors.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const key = visible.target.getAttribute("data-scroll-key");
        if (key) api.setTab(key);
      },
      {
        threshold: [0.15, 0.3, 0.45, 0.6],
        rootMargin: "-10% 0px -55% 0px",
      },
    );

    anchors.forEach((node) => io.observe(node));
  };

  window.PPDemo = {
    init,
  };
})();
