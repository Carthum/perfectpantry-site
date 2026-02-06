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
        unlock({ scrollAfter: false });
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
    window.addEventListener("keydown", onKeyDown);

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

    const appBar = document.createElement("header");
    appBar.className = "pp-app-bar";

    const appBarText = document.createElement("div");
    const appBarTitle = document.createElement("h3");
    appBarTitle.className = "pp-app-bar-title";
    appBarTitle.textContent = "Perfect Pantry";
    const appBarSubtitle = document.createElement("p");
    appBarSubtitle.className = "pp-app-bar-subtitle";
    appBarSubtitle.textContent = "Preview only";
    appBarText.appendChild(appBarTitle);
    appBarText.appendChild(appBarSubtitle);

    const appBarActions = document.createElement("div");
    appBarActions.className = "pp-app-bar-actions";
    // Keep an empty action slot to match the app's right-side affordance.
    const ghostAction = document.createElement("button");
    ghostAction.type = "button";
    ghostAction.className = "pp-app-icon-btn";
    ghostAction.setAttribute("aria-label", "Preview only");
    ghostAction.textContent = "+";
    ghostAction.addEventListener("click", () => showToast(toast));
    appBarActions.appendChild(ghostAction);

    appBar.appendChild(appBarText);
    appBar.appendChild(appBarActions);

    const appContent = document.createElement("div");
    appContent.className = "pp-app-content";
    appContent.dataset.ppScrollable = "true";

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

    app.appendChild(appBar);
    app.appendChild(appContent);
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
      const section = el("div", "pp-app-section");

      const weekCard = el("div", "pp-app-card");
      weekCard.appendChild(el("p", "pp-app-card-title", "Meals This Week"));
      weekCard.appendChild(el("p", "pp-app-card-sub", "Plan your life, live your plan"));
      weekCard.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          `${home.weekRangeLabel || "This week"}  •  ${home.todayLabel || "Today"}`,
        ),
      );
      weekCard.appendChild(el("div", "pp-app-divider"));
      const weekRow = el("div", "pp-app-card-row");
      weekRow.appendChild(
        el(
          "span",
          "",
          `${home.plannedMeals || 0}/${home.targetMeals || 0} meals planned`,
        ),
      );
      weekRow.appendChild(
        el("span", "", `${home.scheduledDays || 0}/7 scheduled`),
      );
      weekCard.appendChild(weekRow);
      weekCard.appendChild(el("p", "pp-app-card-sub", home.coverageLabel || ""));
      section.appendChild(weekCard);

      if (home.todayMeal) {
        const todayCard = el("div", "pp-app-card");
        todayCard.appendChild(el("p", "pp-app-card-kicker", "Cook today's meal"));
        todayCard.appendChild(el("p", "pp-app-card-title", home.todayMeal.title || "Today's meal"));
        todayCard.appendChild(el("p", "pp-app-card-sub", home.todayMeal.coverageLabel || ""));
        const pillRow = el("div", "pp-app-pill-row");
        const cookBtn = el("button", "pp-app-pill pp-app-pill--primary", "Cook now");
        cookBtn.type = "button";
        cookBtn.addEventListener("click", () => {
          showToast(toast);
        });
        const viewBtn = el("button", "pp-app-pill", "View recipe");
        viewBtn.type = "button";
        viewBtn.addEventListener("click", () => openDetailForTab("cookbook"));
        pillRow.appendChild(cookBtn);
        pillRow.appendChild(viewBtn);
        todayCard.appendChild(el("div", "pp-app-divider"));
        todayCard.appendChild(pillRow);
        section.appendChild(todayCard);
      }

      const actionsCard = el("div", "pp-app-card");
      actionsCard.appendChild(el("p", "pp-app-card-kicker", "Quick actions"));
      actionsCard.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          "Try a few flows (preview only).",
        ),
      );
      const pills = el("div", "pp-app-pill-row");
      (home.quickActions || []).slice(0, 3).forEach((action) => {
        const btn = el("button", "pp-app-pill", action.label || "Action");
        btn.type = "button";
        btn.addEventListener("click", () => openDetailForTab("home"));
        pills.appendChild(btn);
      });
      actionsCard.appendChild(el("div", "pp-app-divider"));
      actionsCard.appendChild(pills);
      section.appendChild(actionsCard);

      if (home.useItUp) {
        const up = home.useItUp;
        const useCard = el("div", "pp-app-card");
        useCard.appendChild(el("p", "pp-app-card-kicker", up.headline || "Use it up"));
        useCard.appendChild(el("p", "pp-app-card-title", up.line1 || "Expiring soon"));
        useCard.appendChild(el("p", "pp-app-card-sub", up.line2 || ""));
        const btn = el("button", "pp-app-pill pp-app-pill--primary", "Open Pantry");
        btn.type = "button";
        btn.addEventListener("click", () => api.setTab("pantry"));
        useCard.appendChild(el("div", "pp-app-divider"));
        useCard.appendChild(btn);
        section.appendChild(useCard);
      }

      return section;
    };

    const renderPantry = () => {
      const pantry = content.pantry || {};
      const items = Array.isArray(pantry.items) ? pantry.items : [];

      const section = el("div", "pp-app-section");
      const head = el("div", "pp-app-card");
      head.appendChild(el("p", "pp-app-card-kicker", "Your Pantry"));
      head.appendChild(el("p", "pp-app-card-title", "List and shelf-style views"));
      head.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          "Tap an item to preview details (redacted).",
        ),
      );
      section.appendChild(head);

      const list = el("div", "pp-app-list");
      items.slice(0, 8).forEach((it) => {
        const trailing = el("span", "pp-app-chip", it.qty || "Qty");
        const sub = it.expires && it.expires !== "—" ? `Expires: ${it.expires}` : "No expiration";
        list.appendChild(
          buildListRow({
            title: it.name || "Pantry item",
            subtitle: sub,
            trailing,
            onClick: () => openDetailForTab("pantry"),
          }),
        );
      });
      section.appendChild(list);
      return section;
    };

    const renderCookbook = () => {
      const cookbook = content.cookbook || {};
      const recipes = Array.isArray(cookbook.recipes) ? cookbook.recipes : [];
      const section = el("div", "pp-app-section");

      const head = el("div", "pp-app-card");
      head.appendChild(el("p", "pp-app-card-kicker", "Cookbook"));
      head.appendChild(el("p", "pp-app-card-title", "Your household cookbook"));
      head.appendChild(
        el("p", "pp-app-card-sub", "Tap a card to preview the detail layout."),
      );
      section.appendChild(head);

      const grid = el("div", "pp-app-grid");
      recipes.slice(0, 6).forEach((r) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "pp-app-recipe-card";
        card.addEventListener("click", () => openDetailForTab("cookbook"));
        card.appendChild(el("div", "pp-app-recipe-thumb"));
        card.appendChild(el("p", "pp-app-recipe-title", r.title || "Recipe"));
        card.appendChild(el("p", "pp-app-recipe-meta", r.meta || ""));
        grid.appendChild(card);
      });
      section.appendChild(grid);
      return section;
    };

    const renderPlan = () => {
      const plan = content.plan || {};
      const week = Array.isArray(plan.week) ? plan.week : [];
      const section = el("div", "pp-app-section");

      const head = el("div", "pp-app-card");
      head.appendChild(el("p", "pp-app-card-kicker", "Plan"));
      head.appendChild(el("p", "pp-app-card-title", "Weekly planning board"));
      head.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          "Tap a slot to preview the workflow (details redacted).",
        ),
      );
      section.appendChild(head);

      const list = el("div", "pp-app-list");
      week.slice(0, 7).forEach((slot) => {
        const meal = slot.meal && slot.meal !== "—" ? slot.meal : "Empty slot";
        list.appendChild(
          buildListRow({
            title: `${slot.day || "Day"}  •  Dinner`,
            subtitle: meal,
            trailing: el("span", "pp-app-chip", meal === "Empty slot" ? "Add" : "View"),
            onClick: () => openDetailForTab("plan"),
          }),
        );
      });
      section.appendChild(list);
      return section;
    };

    const renderShop = () => {
      const shop = content.shop || {};
      const groups = Array.isArray(shop.groups) ? shop.groups : [];
      const section = el("div", "pp-app-section");

      const head = el("div", "pp-app-card");
      head.appendChild(el("p", "pp-app-card-kicker", "Shop"));
      head.appendChild(el("p", "pp-app-card-title", "Shop the gap"));
      head.appendChild(
        el(
          "p",
          "pp-app-card-sub",
          "Tap an item to preview bulk picker and detail.",
        ),
      );
      section.appendChild(head);

      groups.slice(0, 3).forEach((g) => {
        const groupCard = el("div", "pp-app-card");
        groupCard.appendChild(el("p", "pp-app-card-kicker", g.name || "Group"));
        const list = el("div", "pp-app-list");
        (g.items || []).slice(0, 3).forEach((it) => {
          const chip = el("span", "pp-app-chip", it.checked ? "Have" : "Need");
          list.appendChild(
            buildListRow({
              title: it.name || "Item",
              subtitle: it.qty ? `Qty: ${it.qty}` : "",
              trailing: chip,
              onClick: () => openDetailForTab("shop"),
            }),
          );
        });
        groupCard.appendChild(el("div", "pp-app-divider"));
        groupCard.appendChild(list);
        section.appendChild(groupCard);
      });

      return section;
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

      appBarTitle.textContent = slugToLabel(activeTab);
      appBarSubtitle.textContent = "Preview only";

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
