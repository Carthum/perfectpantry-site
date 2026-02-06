(function () {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const readCssPxVar = (name, fallback) => {
    const raw = String(
      getComputedStyle(document.documentElement).getPropertyValue(name) || "",
    ).trim();
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const prefersReducedMotion = () => {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  // Single source of truth for demo steps.
  // Later: add `hotspots` per step without changing the scroll engine.
  const STEPS = [
    {
      id: "welcome",
      bg: "home",
      screenshot: "assets/brand/pp-splash-ios-source.png",
      alt: "Perfect Pantry loading screen",
    },
    {
      id: "home",
      bg: "home",
      screenshot: "assets/demo/demo-home-overview.png",
      alt: "Perfect Pantry Home tab preview",
    },
    {
      id: "pantry",
      bg: "pantry",
      screenshot: "assets/demo/demo-pantry-list.png",
      alt: "Perfect Pantry Pantry tab preview",
    },
    {
      id: "cookbook",
      bg: "cookbook",
      screenshot: "assets/demo/demo-cookbook-grid.png",
      alt: "Perfect Pantry Cookbook tab preview",
    },
    {
      id: "plan",
      bg: "home",
      screenshot: "assets/demo/demo-plan-week.png",
      alt: "Perfect Pantry Plan tab preview",
    },
    {
      id: "shop",
      bg: "shopping",
      screenshot: "assets/demo/demo-shop-list.png",
      alt: "Perfect Pantry Shop tab preview",
    },
  ];

  const preloadImages = (paths) => {
    const uniq = Array.from(new Set(paths.filter(Boolean)));
    uniq.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    });
  };

  const getStepNodesById = (stage) => {
    const map = new Map();
    stage
      .querySelectorAll(".pp-tour-step[data-pp-step]")
      .forEach((node) => {
        map.set(String(node.dataset.ppStep || ""), node);
      });
    return map;
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

  const createPhone = ({ mount, initialSrc, initialAlt }) => {
    const wrap = document.createElement("div");
    wrap.className = "pp-demo pp-demo--shots";

    const phone = document.createElement("div");
    phone.className = "pp-phone";

    const frame = document.createElement("div");
    frame.className = "pp-phone-frame";

    const screen = document.createElement("div");
    screen.className = "pp-phone-screen";

    const img = document.createElement("img");
    img.className = "pp-phone-scene pp-phone-shot";
    img.alt = initialAlt || "Perfect Pantry app preview";
    img.decoding = "async";
    img.loading = "eager";
    img.src = initialSrc || "";

    screen.appendChild(img);
    frame.appendChild(screen);
    phone.appendChild(frame);
    wrap.appendChild(phone);

    mount.replaceChildren(wrap);
    return img;
  };

  const createScrollStageController = ({
    stage,
    mount,
    steps,
    stepNodesById,
  }) => {
    let activeStep = -1;
    let stageTop = 0;
    let stageHeight = 0;
    let viewportHeight = 1;
    let rafId = 0;

    // Keep CSS in sync with the step model (stage height is derived from this).
    stage.style.setProperty("--pp-step-count", String(steps.length));

    const measure = () => {
      const navHeight = readCssPxVar("--nav-height", 0);
      // Sticky stage is sized as `100vh - nav-height`.
      viewportHeight = Math.max(1, window.innerHeight - navHeight);

      const rect = stage.getBoundingClientRect();
      stageTop = rect.top + (window.scrollY || window.pageYOffset || 0);
      stageHeight = stage.offsetHeight || rect.height || 0;
    };

    const progressToStepIndex = (progress01) => {
      if (steps.length <= 1) return 0;
      // Map progress to equal step segments, so each step consumes the same
      // scroll distance and the mapping remains stable in both directions.
      return clamp(
        Math.floor(progress01 * (steps.length - 1) + 1e-6),
        0,
        steps.length - 1,
      );
    };

    const computeProgress = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const range = Math.max(1, stageHeight - viewportHeight);
      return clamp((y - stageTop) / range, 0, 1);
    };

    const renderStep = (nextIndex) => {
      const step = steps[nextIndex];
      if (!step) return;

      setActiveCopyStep(stepNodesById, step.id);

      if (step.bg) {
        document.body.dataset.bg = step.bg;
      }

      // Swap screenshot (preloaded).
      const nextSrc = step.screenshot || "";
      const nextAlt = step.alt || "Perfect Pantry app preview";
      if (mount.getAttribute("src") !== nextSrc) mount.src = nextSrc;
      if (mount.getAttribute("alt") !== nextAlt) mount.alt = nextAlt;
    };

    const tick = () => {
      rafId = 0;
      const progress = computeProgress();
      const next = progressToStepIndex(progress);
      if (next === activeStep) return;
      activeStep = next;
      renderStep(activeStep);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    const onScroll = () => {
      schedule();
    };

    measure();
    schedule();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize, { once: true });

    // In case fonts/images above the stage shift layout after load.
    window.setTimeout(() => {
      measure();
      schedule();
    }, 250);

    return {
      refresh() {
        measure();
        schedule();
      },
      destroy() {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
      },
    };
  };

  const init = ({ mountSelector, stageSelector } = {}) => {
    const stage = document.querySelector(stageSelector || "#guided-tour");
    const mount = document.querySelector(mountSelector || "#ppDemoMount");
    if (!stage || !mount) return;

    const reduceMotion = prefersReducedMotion();
    const stageMode =
      !reduceMotion &&
      window.matchMedia &&
      window.matchMedia(
        "(min-width: 961px) and (hover: hover) and (pointer: fine)",
      ).matches;

    preloadImages(STEPS.map((s) => s.screenshot));

    const stepNodesById = getStepNodesById(stage);

    // Ensure step IDs in the DOM match the step model.
    STEPS.forEach((step) => {
      if (!stepNodesById.has(step.id)) {
        console.warn("Missing step node for", step.id);
      }
    });

    const computeInitialStepIndex = () => {
      if (!stageMode || STEPS.length <= 1) return 0;

      const navHeight = readCssPxVar("--nav-height", 0);
      const viewportHeight = Math.max(1, window.innerHeight - navHeight);

      const rect = stage.getBoundingClientRect();
      const stageTop = rect.top + (window.scrollY || window.pageYOffset || 0);
      const stageHeight = stage.offsetHeight || rect.height || 0;
      const range = Math.max(1, stageHeight - viewportHeight);
      const progress = clamp(
        ((window.scrollY || window.pageYOffset || 0) - stageTop) / range,
        0,
        1,
      );

      return clamp(
        Math.floor(progress * (STEPS.length - 1) + 1e-6),
        0,
        STEPS.length - 1,
      );
    };

    const initialIndex = computeInitialStepIndex();
    const initialStep = STEPS[initialIndex] || STEPS[0];
    const phoneImg = createPhone({
      mount,
      initialSrc: initialStep && initialStep.screenshot,
      initialAlt: initialStep && initialStep.alt,
    });

    if (initialStep) {
      if (stageMode) {
        // Desktop stage mode: we overlay copy, so non-active steps must not
        // steal focus/tab order.
        stepNodesById.forEach((node) => setNodeInert(node, true));
        setActiveCopyStep(stepNodesById, initialStep.id);
      } else {
        // Non-stage mode (mobile/tablet/reduced motion): show all copy.
        stepNodesById.forEach((node) => setNodeInert(node, false));
        // Keep the first step styled as "active" if the desktop CSS is in play.
        stepNodesById.forEach((node, stepId) => {
          node.classList.toggle("is-active", stepId === initialStep.id);
        });
      }
      if (initialStep.bg) document.body.dataset.bg = initialStep.bg;
    }

    if (reduceMotion) {
      stage.classList.add("pp-reduce-motion");
    }

    if (!stageMode) return;

    createScrollStageController({
      stage,
      mount: phoneImg,
      steps: STEPS,
      stepNodesById,
    });
  };

  window.PPDemo = { init };
})();
