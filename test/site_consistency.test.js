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

function normalizeText(value) {
  return value.replace(/\s+/g, " ");
}

function assertIncludes(haystack, needle, label = needle) {
  assert.ok(haystack.includes(needle), `Expected content to include ${label}`);
}

function assertNotIncludes(haystack, needle, label = needle) {
  assert.ok(!haystack.includes(needle), `Expected content not to include ${label}`);
}

function extractAnchors(html) {
  return Array.from(html.matchAll(/<a\b[\s\S]*?<\/a>/g), (match) => match[0]);
}

test("marketing surfaces avoid stale launch and unsupported claim copy", () => {
  const marketingCopy = [
    readSiteFile("index.html"),
    readSiteFile("support.html"),
    readSiteFile("assets/js/phone-demo.js"),
  ].join("\n");

  [
    "Cook tonight with what you already have",
    "Active subscription required after trial",
    "Shopping gap",
    "coming soon",
    "intended to be visible",
    "free app",
    "never waste",
    "guaranteed",
    "automatic pantry import",
    "loyalty-card import",
    "nutrition analysis",
    "allergy safety",
    "HIPAA",
    "SOC 2",
    "bank-level",
    "military-grade",
    "end-to-end encrypted",
    "we never share",
    "100% private",
  ].forEach((phrase) => assertNotIncludes(marketingCopy, phrase));
});

test("pricing and subscription copy stays aligned across homepage surfaces", () => {
  const html = normalizeText(readSiteFile("index.html"));
  const phoneDemo = normalizeText(readSiteFile("assets/js/phone-demo.js"));
  const ldJsonMatch = readSiteFile("index.html").match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(ldJsonMatch, "homepage should include JSON-LD");
  const structuredData = JSON.parse(ldJsonMatch[1]);

  const requiredPricingCopy = [
    "7-day free trial. Then $4.99/month or $49.99/year in the U.S. Pricing may vary by store or region. Cancel anytime through Apple or Google.",
    "Start free for 7 days. Then $4.99/month or $49.99/year in the U.S. Pricing may vary by store or region. Cancel anytime through Apple or Google.",
    "New users get a 7-day free trial. After that, Pantry &amp; Plate requires a paid subscription: $4.99/month or $49.99/year in the U.S. Pricing may vary by store or region.",
    "Subscriptions are managed through Apple or Google. You can manage or cancel your subscription in your App Store or Google Play account settings.",
    "Start free for 7 days, then continue with a paid subscription: $4.99/month or $49.99/year in the U.S. Pricing may vary by store or region. Cancel anytime through Apple or Google.",
  ];

  for (const copy of requiredPricingCopy) {
    assertIncludes(html, copy);
  }

  assertIncludes(
    phoneDemo,
    "Start free for 7 days. Then $4.99/month or $49.99/year in the U.S. Pricing may vary by store or region. Cancel anytime through Apple or Google.",
  );
  assert.deepEqual(
    structuredData.offers.map((offer) => [offer.price, offer.priceCurrency]),
    [
      ["4.99", "USD"],
      ["49.99", "USD"],
    ],
  );
  assertNotIncludes(html, "free forever");
});

test("connected-shopping copy consistently says live where supported and optional", () => {
  const index = normalizeText(readSiteFile("index.html"));
  const privacy = normalizeText(readSiteFile("privacy.html"));
  const support = normalizeText(readSiteFile("support.html"));
  const phoneDemo = normalizeText(readSiteFile("assets/js/phone-demo.js"));

  [
    index,
    privacy,
    support,
    phoneDemo,
  ].forEach((copy) => assertIncludes(copy, "live where supported"));

  assertIncludes(index, "Connected grocery checkout is not required to use Pantry &amp; Plate.");
  assertIncludes(index, "checkout is optional. You can always use the list manually.");
  assertIncludes(
    index,
    "Connected grocery availability may vary by platform, region, retailer availability, account eligibility, inventory, and app version.",
  );
  assertIncludes(
    privacy,
    "Connected-shopping flows are user-initiated and optional. You can still use Pantry &amp; Plate for pantry tracking, recipes, meal planning, and shopping lists without launching a retailer flow.",
  );
  assertIncludes(privacy, 'id="connected-shopping"');
  assertIncludes(readSiteFile("index.html"), 'href="privacy.html#connected-shopping"');
  assertIncludes(
    phoneDemo,
    "availability may vary by platform, region, retailer availability, account eligibility, inventory, and app version.",
  );
});

test("all static store CTAs keep tracking attributes and accessible labels", () => {
  for (const file of ["index.html", "support.html"]) {
    const html = readSiteFile(file);
    const storeAnchors = extractAnchors(html).filter(
      (anchor) => anchor.includes(appStoreUrl) || anchor.includes(googlePlayUrl),
    );

    assert.ok(storeAnchors.length > 0, `${file} should expose store CTAs`);

    for (const anchor of storeAnchors) {
      const store = anchor.includes(appStoreUrl) ? "app-store" : "google-play";
      const expectedLabel =
        store === "app-store"
          ? 'aria-label="Download Pantry & Plate on the App Store"'
          : 'aria-label="Get Pantry & Plate on Google Play"';

      assertIncludes(anchor, 'data-cta="store-link"', `${file} ${store} tracking`);
      assertIncludes(anchor, `data-store="${store}"`, `${file} ${store} data-store`);
      assert.match(anchor, /data-placement="[^"]+"/, `${file} ${store} placement`);
      assertIncludes(anchor, expectedLabel, `${file} ${store} accessible label`);
      if (anchor.includes('target="_blank"')) {
        assertIncludes(anchor, 'rel="noopener noreferrer"', `${file} ${store} target rel`);
      }
    }
  }

  const mainJs = readSiteFile("assets/js/main.js");
  assertIncludes(mainJs, "pantryplate:store_cta_click");
  assertIncludes(mainJs, 'a[data-cta="store-link"]');
});

test("deletion and sitemap routing stay on support.html without a standalone deletion page", () => {
  const publicFiles = [
    "index.html",
    "privacy.html",
    "terms.html",
    "support.html",
    "dmca.html",
    "sitemap.xml",
    "robots.txt",
  ];

  assertIncludes(readSiteFile("support.html"), 'id="delete-account"');
  assertIncludes(readSiteFile("privacy.html"), 'href="support.html#delete-account"');
  assert.ok(!fs.existsSync(path.join(siteRoot, "delete-account.html")));

  for (const file of publicFiles) {
    assertNotIncludes(readSiteFile(file), "delete-account.html", file);
  }

  const sitemapLocs = Array.from(
    readSiteFile("sitemap.xml").matchAll(/<loc>([\s\S]*?)<\/loc>/g),
    (match) => match[1],
  );
  assert.deepEqual(sitemapLocs, [
    "https://pantryandplate.app/",
    "https://pantryandplate.app/privacy.html",
    "https://pantryandplate.app/terms.html",
    "https://pantryandplate.app/support.html",
    "https://pantryandplate.app/dmca.html",
  ]);
});
