const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");
const appStoreUrl = "https://apps.apple.com/us/app/pantry-plate/id6761082174";
const googlePlayUrl = "https://play.google.com/store/apps/details?id=app.pantryandplate";

function readSiteFile(relativePath) {
  return fs.readFileSync(path.join(siteRoot, relativePath), "utf8");
}

function assertIncludes(haystack, needle, label = needle) {
  assert.ok(haystack.includes(needle), `Expected page to include ${label}`);
}

function assertNotIncludes(haystack, needle, label = needle) {
  assert.ok(!haystack.includes(needle), `Expected page not to include ${label}`);
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ");
}

test("homepage uses launch metadata and production store configuration", () => {
  const html = readSiteFile("index.html");
  const config = readSiteFile("assets/js/launch-config.js");

  assertIncludes(
    html,
    "<title>Pantry &amp; Plate™ | Meal Planning From What You Already Have</title>",
  );
  assertIncludes(
    html,
    'content="Plan meals from your pantry, save household recipes, and shop only for missing ingredients with Pantry & Plate."',
  );
  assertIncludes(html, appStoreUrl);
  assertIncludes(html, googlePlayUrl);
  assertIncludes(config, `APP_STORE_URL: "${appStoreUrl}"`);
  assertIncludes(config, `GOOGLE_PLAY_URL: "${googlePlayUrl}"`);
  assertIncludes(config, 'SUPPORT_EMAIL: "support@pantryandplate.app"');
  assertIncludes(config, "ENABLE_GOOGLE_PLAY_CTA: true");
  assertIncludes(config, "ENABLE_APP_STORE_CTA: true");
  assertNotIncludes(html, "utm_source=na_Med", "old tracked Google Play URL");
  assertNotIncludes(config, "utm_source=na_Med", "old tracked Google Play URL");
});

test("homepage hero and availability CTAs point to both app stores", () => {
  const html = readSiteFile("index.html");
  const hero = html.match(/<section class="section hero[\s\S]*?<\/section>/);
  assert.ok(hero, "homepage should include hero section");

  assertIncludes(hero[0], "Download on the App Store");
  assertIncludes(hero[0], 'aria-label="Download Pantry & Plate on the App Store"');
  assertIncludes(hero[0], appStoreUrl);
  assertIncludes(hero[0], "Get it on Google Play");
  assertIncludes(hero[0], 'aria-label="Get Pantry & Plate on Google Play"');
  assertIncludes(hero[0], googlePlayUrl);
  assertIncludes(hero[0], "Start your 7-day free trial.");
  assertIncludes(hero[0], "Active subscription required after trial.");
  assertNotIncludes(hero[0], "Contact support", "support CTA in hero");

  assertIncludes(html, "Now available on the App Store and Google Play.");
  assertIncludes(html, "Now available on Google Play.");
  assertIncludes(html, "Start your 7-day free trial and plan meals from what you already have.");
  assertIncludes(html, "Pantry &amp; Plate is live on iPhone and Android.");
});

test("homepage demo, founder note, and FAQ reflect launch state", () => {
  const html = readSiteFile("index.html");
  const normalized = normalizeText(html);

  assertIncludes(html, "See the weekly flow in under a minute.");
  assertIncludes(html, "Plan three dinners");
  assertIncludes(html, "Check pantry coverage");
  assertIncludes(html, "Shop the missing items");
  assertIncludes(html, "Built for the part of cooking most apps skip.");
  assertIncludes(
    normalized,
    "I built Pantry &amp; Plate™ because meal planning, pantry tracking, and grocery lists were always split across different tools.",
  );

  assertIncludes(html, "Where can I download Pantry &amp; Plate?");
  assertIncludes(html, "Which platforms are available?");
  assertIncludes(html, "Can I send product feedback?");
  assertIncludes(html, "Pantry &amp; Plate™ is now available on the");
  assertIncludes(html, appStoreUrl);
  assertIncludes(html, googlePlayUrl);
  assertNotIncludes(html, "Will there be App Store or Google Play links?");
  assertNotIncludes(html, "iOS is awaiting App Store review.");
  assertNotIncludes(html, "Google Play link coming soon.");
  assertNotIncludes(
    html,
    "Official App Store and Google Play links will be posted here when the public listings are live.",
  );
});

test("support page exposes both live store links", () => {
  const support = readSiteFile("support.html");

  assertIncludes(support, "Pantry &amp; Plate is now available on the App Store and Google Play.");
  assertIncludes(support, appStoreUrl);
  assertIncludes(support, googlePlayUrl);
  assertNotIncludes(support, "Google Play link coming soon.");
});
