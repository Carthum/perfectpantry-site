(() => {
  const DEFAULTS = Object.freeze({
    GOOGLE_PLAY_URL: "https://play.google.com/store/apps/details?id=app.pantryandplate",
    APP_STORE_URL: "https://apps.apple.com/us/app/pantry-plate/id6761082174",
    SUPPORT_EMAIL: "support@pantryandplate.app",
    SITE_URL: "https://pantryandplate.app",
    ENABLE_GOOGLE_PLAY_CTA: true,
    ENABLE_APP_STORE_CTA: true,
  });

  const runtime =
    window.__PP_PUBLIC_CONFIG__ && typeof window.__PP_PUBLIC_CONFIG__ === "object"
      ? window.__PP_PUBLIC_CONFIG__
      : {};

  const readString = (...keys) => {
    for (const key of keys) {
      const value = runtime[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  };

  const readBool = (fallback, ...keys) => {
    for (const key of keys) {
      const value = runtime[key];
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["1", "true", "yes", "on"].includes(normalized)) return true;
        if (["0", "false", "no", "off"].includes(normalized)) return false;
      }
    }
    return fallback;
  };

  const isRealHttpUrl = (value) => {
    if (!value || /[<>\s]/.test(value)) return false;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && !url.hostname.includes("example.");
    } catch (_) {
      return false;
    }
  };

  const supportEmail = readString("SUPPORT_EMAIL", "NEXT_PUBLIC_SUPPORT_EMAIL") || DEFAULTS.SUPPORT_EMAIL;
  const configuredGooglePlayUrl = readString("GOOGLE_PLAY_URL", "NEXT_PUBLIC_GOOGLE_PLAY_URL");
  const googlePlayUrl = isRealHttpUrl(configuredGooglePlayUrl)
    ? configuredGooglePlayUrl
    : DEFAULTS.GOOGLE_PLAY_URL;
  const configuredAppStoreUrl = readString("APP_STORE_URL", "NEXT_PUBLIC_APP_STORE_URL");
  const appStoreUrl = isRealHttpUrl(configuredAppStoreUrl)
    ? configuredAppStoreUrl
    : DEFAULTS.APP_STORE_URL;

  const config = Object.freeze({
    GOOGLE_PLAY_URL: googlePlayUrl,
    APP_STORE_URL: appStoreUrl,
    SUPPORT_EMAIL: supportEmail,
    SITE_URL: readString("SITE_URL", "NEXT_PUBLIC_SITE_URL") || DEFAULTS.SITE_URL,
    ENABLE_GOOGLE_PLAY_CTA: readBool(
      DEFAULTS.ENABLE_GOOGLE_PLAY_CTA,
      "ENABLE_GOOGLE_PLAY_CTA",
      "NEXT_PUBLIC_ENABLE_GOOGLE_PLAY_CTA",
    ),
    ENABLE_APP_STORE_CTA:
      readBool(
        DEFAULTS.ENABLE_APP_STORE_CTA,
        "ENABLE_APP_STORE_CTA",
        "NEXT_PUBLIC_ENABLE_APP_STORE_CTA",
      ) && !!appStoreUrl,
  });

  const launchUrls = Object.freeze({
    "google-play": config.GOOGLE_PLAY_URL,
    "app-store": config.APP_STORE_URL,
  });

  const isEnabled = (kind) => {
    if (kind === "google-play") return config.ENABLE_GOOGLE_PLAY_CTA;
    if (kind === "app-store") return config.ENABLE_APP_STORE_CTA;
    return true;
  };

  const applyLaunchLinks = () => {
    document.querySelectorAll("[data-launch-url]").forEach((node) => {
      const kind = node.getAttribute("data-launch-url");
      const url = launchUrls[kind];
      const enabled = isEnabled(kind);

      if (!url || !enabled) {
        node.hidden = true;
        node.setAttribute("aria-hidden", "true");
        node.removeAttribute("href");
        return;
      }

      node.hidden = false;
      node.removeAttribute("aria-hidden");
      node.setAttribute("href", url);
    });
  };

  window.PPLaunchConfig = config;
  window.PPApplyLaunchLinks = applyLaunchLinks;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLaunchLinks, { once: true });
  } else {
    applyLaunchLinks();
  }
})();
