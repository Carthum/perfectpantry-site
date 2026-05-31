const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");
const googlePlayUrl = "https://play.google.com/store/apps/details?id=app.pantryandplate";
const iosWaitlistMailto =
  "mailto:support@pantryandplate.app?subject=Join%20the%20Pantry%20%26%20Plate%20iOS%20waitlist";

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
  assertIncludes(html, googlePlayUrl);
  assertIncludes(config, `GOOGLE_PLAY_URL: "${googlePlayUrl}"`);
  assertIncludes(config, 'SUPPORT_EMAIL: "support@pantryandplate.app"');
  assertIncludes(config, "ENABLE_GOOGLE_PLAY_CTA: true");
  assertIncludes(config, "ENABLE_IOS_WAITLIST: true");
  assertIncludes(config, "ENABLE_APP_STORE_CTA: false");
  assertNotIncludes(html, "utm_source=na_Med", "old tracked Google Play URL");
  assertNotIncludes(config, "utm_source=na_Med", "old tracked Google Play URL");
});

test("homepage hero and availability CTAs point to Google Play and iOS waitlist", () => {
  const html = readSiteFile("index.html");
  const hero = html.match(/<section class="section hero[\s\S]*?<\/section>/);
  assert.ok(hero, "homepage should include hero section");

  assertIncludes(hero[0], "Get it on Google Play");
  assertIncludes(hero[0], 'aria-label="Get Pantry & Plate on Google Play"');
  assertIncludes(hero[0], googlePlayUrl);
  assertIncludes(hero[0], "Join the iOS waitlist");
  assertIncludes(hero[0], iosWaitlistMailto);
  assertNotIncludes(hero[0], "Contact support", "support CTA in hero");

  assertIncludes(html, "Now available on Google Play.");
  assertIncludes(html, "iOS is awaiting App Store review.");
  assertIncludes(html, "We’ll notify you when the iPhone version is live.");
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
  assertIncludes(html, "How do I join the iOS waitlist?");
  assertIncludes(html, "Can I send product feedback?");
  assertIncludes(html, "Pantry &amp; Plate™ is available on");
  assertIncludes(html, googlePlayUrl);
  assertIncludes(html, iosWaitlistMailto);
  assertNotIncludes(html, "Will there be App Store or Google Play links?");
  assertNotIncludes(
    html,
    "Official App Store and Google Play links will be posted here when the public listings are live.",
  );
});
