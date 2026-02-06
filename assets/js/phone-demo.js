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

  const createDemo = ({ mount, data, enableSwipe }) => {
    const toast = createToast(mount);
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const phone = document.createElement("div");
    phone.className = "pp-phone";

    const frame = document.createElement("div");
    frame.className = "pp-phone-frame";

    const screen = document.createElement("div");
    screen.className = "pp-phone-screen";

    const img = document.createElement("img");
    img.decoding = "async";
    img.loading = "lazy";
    img.style.opacity = "1";
    if (!prefersReducedMotion) {
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

    let activeScene = findDefaultScene(activeTab);

    const syncNarrative = () => {
      const nodes = $$("[data-scroll-key]", document);
      nodes.forEach((node) => {
        node.classList.toggle(
          "is-active",
          node.getAttribute("data-scroll-key") === activeTab,
        );
      });
    };

    const tabsUi = createTabs(tabs, activeTab, (tab) => {
      activeTab = tab;
      activeScene = findDefaultScene(tab);
      render();

      // Sync scroll narrative on left when user taps tabs.
      const target = document.querySelector(`[data-scroll-key="${tab}"]`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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
              render();
            }
          })
        );
      });
    };

    const render = () => {
      if (!activeScene) return;
      const nextSrc = activeScene.image;
      if (nextSrc) {
        if (!prefersReducedMotion) img.style.opacity = "0";
        img.src = nextSrc;
      }
      img.alt = activeScene.headline || "Perfect Pantry preview";
      redaction.dataset.preset = activeScene.redactionPreset || "light";

      captionTitle.textContent = activeScene.headline || "";
      captionBody.textContent = activeScene.body || "";

      setSelectedTabUi();
      syncNarrative();
      renderHotspots();
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
        render();
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
        activeTab = tab;
        activeScene = findDefaultScene(tab);
        render();
      },
      setScene(sceneId) {
        const next = sceneById.get(sceneId);
        if (!next) return;
        activeTab = next.tab;
        activeScene = next;
        render();
      },
    };

    const mountNode = document.createElement("div");
    mountNode.className = "pp-demo";
    mountNode.appendChild(phone);
    mountNode.appendChild(tabsUi);
    mountNode.appendChild(caption);

    return { mountNode, api };
  };

  const init = async ({ sceneDataPath, mountSelector, mobileMode }) => {
    const mount = document.querySelector(mountSelector);
    if (!mount) return;

    let data;
    try {
      const res = await fetch(sceneDataPath, { cache: "no-cache" });
      data = await res.json();
    } catch (e) {
      console.error("PPDemo init failed", e);
      return;
    }

    const { mountNode, api } = createDemo({
      mount,
      data,
      enableSwipe: mobileMode === "carousel",
    });

    if (mobileMode === "carousel") {
      mount.classList.add("pp-demo-carousel");
    }

    mount.innerHTML = "";
    mount.appendChild(mountNode);

    // Scroll-driven syncing (desktop/tablet).
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
