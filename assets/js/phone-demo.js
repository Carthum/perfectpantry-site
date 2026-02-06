(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const clamp01 = (n) => Math.max(0, Math.min(1, n));

  const TAB_ICONS = {
    home: "assets/brand/tab-icons/ic_tab_home.svg",
    pantry: "assets/brand/tab-icons/ic_tab_pantry.svg",
    cookbook: "assets/brand/tab-icons/ic_tab_cookbook.svg",
    plan: "assets/brand/tab-icons/ic_tab_plan.svg",
    shop: "assets/brand/tab-icons/ic_tab_shopping.svg",
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
      if (nextSrc) {
        if (!reduceMotion) img.style.opacity = "0";
        img.src = nextSrc;
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
      },
      setScene(sceneId) {
        const next = sceneById.get(sceneId);
        if (!next) return;
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

  const init = async ({ sceneDataPath, mountSelector, mobileMode, tourSelector, initialSceneId }) => {
    const mount = document.querySelector(mountSelector);
    if (!mount) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let data;
    try {
      const res = await fetch(sceneDataPath, { cache: "no-cache" });
      data = await res.json();
    } catch (e) {
      console.error("PPDemo init failed", e);
      return;
    }

    const tourRoot = tourSelector ? document.querySelector(tourSelector) : null;
    const stickyTourEnabled =
      !!tourRoot &&
      mobileMode !== "carousel" &&
      !window.matchMedia("(max-width: 960px)").matches;

    const scrollToTab = stickyTourEnabled
      ? (tab) => {
          // Index tour uses step ids that match tab slugs.
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

    const { mountNode, api } = createDemo({
      mount,
      data,
      enableSwipe: mobileMode === "carousel",
      scrollToTab,
      initialSceneId: stickyTourEnabled ? initialSceneId : null,
      prefersReducedMotion,
    });

    if (mobileMode === "carousel") {
      mount.classList.add("pp-demo-carousel");
    }

    mount.innerHTML = "";
    mount.appendChild(mountNode);

    // Tour binding (desktop scrolly). When disabled, keep the demo interactive-only.
    if (stickyTourEnabled) {
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
