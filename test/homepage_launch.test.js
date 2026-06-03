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

function extractAnchors(html) {
  return Array.from(html.matchAll(/<a\b[\s\S]*?<\/a>/g), (match) => match[0]);
}

function assertTrackedStoreCta(anchor, store, placement, href) {
  const label =
    store === "app-store"
      ? 'aria-label="Download Pantry & Plate on the App Store"'
      : 'aria-label="Get Pantry & Plate on Google Play"';

  assertIncludes(anchor, `href="${href}"`);
  assertIncludes(anchor, 'data-cta="store-link"');
  assertIncludes(anchor, `data-store="${store}"`);
  assertIncludes(anchor, `data-placement="${placement}"`);
  assertIncludes(anchor, label);
}

function assertTrackedStorePlacement(html, placement) {
  const anchors = extractAnchors(html);
  const appStoreAnchor = anchors.find(
    (anchor) =>
      anchor.includes(`data-placement="${placement}"`) &&
      anchor.includes('data-store="app-store"'),
  );
  const googlePlayAnchor = anchors.find(
    (anchor) =>
      anchor.includes(`data-placement="${placement}"`) &&
      anchor.includes('data-store="google-play"'),
  );

  assert.ok(appStoreAnchor, `Expected App Store CTA for ${placement}`);
  assert.ok(googlePlayAnchor, `Expected Google Play CTA for ${placement}`);
  assertTrackedStoreCta(appStoreAnchor, "app-store", placement, appStoreUrl);
  assertTrackedStoreCta(googlePlayAnchor, "google-play", placement, googlePlayUrl);
}

test("homepage uses launch metadata and production store configuration", () => {
  const html = readSiteFile("index.html");
  const config = readSiteFile("assets/js/launch-config.js");

  assertIncludes(
    html,
    "<title>Pantry &amp; Plate™ | Pantry Tracker, Meal Planner &amp; Smart Grocery List</title>",
  );
  assertIncludes(
    html,
    'content="Plan meals from what you already have. Pantry & Plate connects your pantry, saved recipes, weekly meal plan, and shopping list for iPhone and Android."',
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
  assertIncludes(hero[0], "Pantry-aware meal planning");
  assertIncludes(hero[0], "Plan meals from");
  assertIncludes(hero[0], "your pantry.");
  assertIncludes(hero[0], "Buy only what’s missing.");
  assertIncludes(
    hero[0],
    "Pantry &amp; Plate™ connects your pantry, saved recipes, weekly meal plan, and shopping",
  );
  assertIncludes(hero[0], "7-day free trial.");
  assertIncludes(hero[0], "$4.99/month or $49.99/year in the U.S.");
  assertIncludes(hero[0], "Pricing may vary by");
  assertIncludes(hero[0], "store or region. Cancel anytime through Apple or Google.");
  assertIncludes(hero[0], '<a href="privacy.html">Privacy Policy</a>');
  assertIncludes(hero[0], '<a href="terms.html">Terms</a>');
  assertNotIncludes(hero[0], "Contact support", "support CTA in hero");

  assertIncludes(html, "Now available on the App Store.");
  assertIncludes(html, "Now available on Google Play.");
  assertIncludes(
    html,
    "Start free for 7 days. Then $4.99/month or $49.99/year in the U.S. Pricing may",
  );
  assertIncludes(html, "Pantry &amp; Plate is live on iPhone and Android.");
  [
    "nav",
    "hero",
    "launch-availability",
    "launch-demo",
    "final-cta",
    "footer",
  ].forEach((placement) => assertTrackedStorePlacement(html, placement));
});

test("store CTA tracking hooks are configured without replacing real links", () => {
  const main = readSiteFile("assets/js/main.js");
  const phoneDemo = readSiteFile("assets/js/phone-demo.js");

  assertIncludes(main, 'a[data-cta="store-link"]');
  assertIncludes(main, "pantryplate:store_cta_click");
  assertIncludes(main, "is-preferred-store");
  assertIncludes(main, "has-device-store-preference");
  assertIncludes(main, "MutationObserver");

  assertIncludes(phoneDemo, 'appStoreAccess.dataset.cta = "store-link"');
  assertIncludes(phoneDemo, 'appStoreAccess.dataset.store = "app-store"');
  assertIncludes(phoneDemo, 'appStoreAccess.dataset.placement = "download-dialog"');
  assertIncludes(phoneDemo, 'googlePlayAccess.dataset.cta = "store-link"');
  assertIncludes(phoneDemo, 'googlePlayAccess.dataset.store = "google-play"');
  assertIncludes(phoneDemo, 'googlePlayAccess.dataset.placement = "download-dialog"');

  assertIncludes(phoneDemo, 'id: "start-pantry"');
  assertIncludes(phoneDemo, "Chicken taco bowls");
  assertIncludes(phoneDemo, "5 pantry items covered");
  assertIncludes(phoneDemo, "4 items missing");
  assertIncludes(
    phoneDemo,
    "Instacart and Kroger connected-shopping flows are live where supported, but checkout is optional.",
  );
  assertIncludes(
    phoneDemo,
    "availability may vary by platform, region, retailer availability, account eligibility, inventory, and app version.",
  );
});

test("homepage demo, founder note, and FAQ reflect launch state", () => {
  const html = readSiteFile("index.html");
  const normalized = normalizeText(html);

  assert.equal((html.match(/<p class="eyebrow">How it works<\/p>/g) || []).length, 1);
  assert.ok(
    html.indexOf('id="how-it-works"') < html.indexOf('id="guided-tour"'),
    "How it works section should appear before app preview",
  );
  assertIncludes(html, "From pantry to weekly plan to shopping list.");
  assertIncludes(
    html,
    "Start with what is already in your kitchen, plan meals your household will actually",
  );
  assertIncludes(html, "Add what you have");
  assertIncludes(
    html,
    "Scan pantry items, add staples manually, or build your inventory as you shop.",
  );
  assertIncludes(html, "Save real household recipes");
  assertIncludes(
    html,
    "Keep the recipes you already cook, imported links, photos, and new ideas in one",
  );
  assertIncludes(html, "Plan the week");
  assertIncludes(
    html,
    "Drop dinners into your weekly plan and see pantry coverage before the grocery list is",
  );
  assertIncludes(html, "Shop the gap");
  assertIncludes(
    html,
    "Turn planned meals into a shopping list focused on what is missing, not what you",
  );
  assertIncludes(html, "No full kitchen inventory required.");
  assertIncludes(
    html,
    "setup should not block your first meal plan.",
  );
  assert.equal(
    (html.match(/<p class="eyebrow">Feature availability<\/p>/g) || []).length,
    1,
  );
  assert.ok(
    html.indexOf('id="how-it-works"') < html.indexOf('id="feature-availability"'),
    "Feature availability section should appear after How it works",
  );
  assert.ok(
    html.indexOf('id="feature-availability"') < html.indexOf('id="guided-tour"'),
    "Feature availability section should appear before app preview",
  );
  assertIncludes(html, "What’s live today");
  assertIncludes(
    normalized,
    "Pantry &amp; Plate is built around pantry tracking, saved recipes, weekly meal planning, and a smarter shopping list.",
  );
  assertIncludes(html, "Core planning tools");
  assertIncludes(html, "Pantry tracking");
  assertIncludes(html, "Saved recipes and recipe organization");
  assertIncludes(html, "Weekly meal planning");
  assertIncludes(html, "Smart shopping lists");
  assertIncludes(html, "Household sync");
  assertIncludes(html, "Live connected grocery flows");
  assertIncludes(html, "Instacart connected-shopping flow, where supported");
  assertIncludes(html, "Kroger connected-shopping flow, where supported");
  assertIncludes(
    normalized,
    "Retailer cart handoff or checkout support may depend on platform, region, retailer availability, account eligibility, inventory, and app version",
  );
  assertIncludes(html, "Works without checkout");
  assertIncludes(
    normalized,
    "Connected grocery checkout is not required to use Pantry &amp; Plate. You can still track pantry items, save recipes, plan meals, and build a focused shopping list even if a retailer flow is unavailable.",
  );
  assertIncludes(html, 'href="privacy.html#connected-shopping"');
  assertIncludes(html, "Pantry-aware before you shop");
  assertNotIncludes(html, "Pantry-aware before checkout");
  assert.ok(
    html.indexOf('id="feature-availability"') < html.indexOf('id="trust"'),
    "Trust section should appear after Feature availability",
  );
  assert.ok(
    html.indexOf('id="trust"') < html.indexOf('id="faq"'),
    "Trust section should appear before FAQ",
  );
  assert.equal((html.match(/<p class="eyebrow">Trust<\/p>/g) || []).length, 1);
  assertIncludes(html, "Privacy in 30 seconds");
  assertIncludes(
    normalized,
    "Pantry &amp; Plate is built around household food data: recipes, pantry items, meal plans, shopping lists, photos, connected-shopping choices, and feedback you choose to provide.",
  );
  assertIncludes(html, "Private recipes stay private");
  assertIncludes(
    normalized,
    "Private household recipes are visible only to you and invited household members unless you explicitly choose to share or publish them.",
  );
  assertIncludes(html, "AI runs when you choose it");
  assertIncludes(
    normalized,
    "Recipe extraction, receipt parsing, and generation use selected prompts, links, receipts, screenshots, or images only when you start those features.",
  );
  assertIncludes(html, "Camera and photos are user-started");
  assertIncludes(
    normalized,
    "Camera and photo access are used for actions such as barcode scanning, recipe capture, profile photos, receipt parsing, or selected uploads.",
  );
  assertIncludes(html, "Feedback includes shown context");
  assertIncludes(
    normalized,
    "If you send feedback, Pantry &amp; Plate receives your message, optional email, and the app context shown before you submit so we can review the issue and follow up if requested.",
  );
  assertIncludes(html, "Diagnostics help fix the app");
  assertIncludes(
    normalized,
    "App interactions, crash logs, diagnostics, device/app details, and subscription status may be used to operate, improve, secure, and support Pantry &amp; Plate.",
  );
  assertIncludes(html, "Connected shopping is user-initiated");
  assertIncludes(
    normalized,
    "Instacart and Kroger connected-shopping flows are live where supported. Retailer, cart, checkout, and attribution data is used when you launch those supported flows.",
  );
  assertIncludes(
    normalized,
    "Availability may vary by platform, region, retailer availability, account eligibility, inventory, and app version.",
  );
  assertIncludes(html, '<a href="privacy.html">Read the Privacy Policy</a>');
  assertIncludes(html, '<a href="support.html">Contact Support</a>');
  assertIncludes(html, '<a href="support.html#delete-account">Account and data deletion</a>');
  assertNotIncludes(html, "intended to be visible");
  assertNotIncludes(html, "Private household recipes are intended for you");

  assertIncludes(html, "See one dinner become a smarter shopping list.");
  assertIncludes(
    normalized,
    "Follow a simple weekly flow: check what is already in the pantry, add a meal to the plan, and turn only the missing ingredients into a focused list.",
  );
  assertIncludes(html, "Start with what you have");
  assertIncludes(
    normalized,
    "Pantry &amp; Plate checks staples already in your pantry, like rice, black beans, salsa, olive oil, and taco seasoning.",
  );
  assertIncludes(html, "Add dinner to the week");
  assertIncludes(
    normalized,
    "Drop chicken taco bowls into the weekly plan so the app can compare the recipe against your pantry.",
  );
  assertIncludes(html, "See pantry coverage");
  assertIncludes(html, "5 pantry items covered");
  assertIncludes(html, "4 items missing");
  assertIncludes(html, "Shop only the gap");
  assertIncludes(
    normalized,
    "Add the missing chicken, tortillas, cilantro, and limes to your shopping list.",
  );
  assertIncludes(html, "Use connected grocery where supported");
  assertIncludes(
    normalized,
    "Instacart and Kroger connected-shopping flows are live where supported, but checkout is optional. You can always use the list manually.",
  );
  assert.ok(
    html.indexOf('id="guided-tour"') < html.indexOf('id="tour-after"'),
    "App preview should appear before the downstream tour anchor",
  );

  assertIncludes(html, "Weekly planning demo");
  assertIncludes(html, "Turn the week into one focused grocery list.");
  assertIncludes(
    normalized,
    "Plan a few dinners, compare them against your pantry, and send only the missing ingredients to your list.",
  );
  assertIncludes(html, "Chicken taco bowls");
  assertIncludes(html, "Lemon pasta");
  assertIncludes(html, "Veggie fried rice");
  assertIncludes(html, "Missing ingredients");
  assertIncludes(
    html,
    "Chicken, tortillas, cilantro, limes, lemons, parmesan, eggs, scallions",
  );
  assertIncludes(html, "Pick the week’s meals");
  assertIncludes(html, "Check pantry coverage");
  assertIncludes(html, "8 items already covered");
  assertIncludes(html, "8 items missing");
  assertIncludes(html, "Build one list");
  assertIncludes(html, "Shop your way");
  assertIncludes(
    normalized,
    "Instacart and Kroger connected-shopping flows are live where supported, and checkout is optional. You can also shop manually from the list.",
  );
  assertIncludes(
    normalized,
    "Connected grocery availability may vary by platform, region, retailer availability, account eligibility, inventory, and app version.",
  );
  assertNotIncludes(html, "See the weekly flow in under a minute.");
  assertNotIncludes(html, "Plan three dinners");
  assertNotIncludes(html, "Shop the missing items");
  assertNotIncludes(html, "Shopping gap");
  assertIncludes(html, "Plan your next grocery list from what you already have.");
  assertIncludes(
    html,
    "continue with a paid subscription: $4.99/month or $49.99/year in the U.S. Pricing",
  );
  assertIncludes(html, "Built for the part of cooking most apps skip.");
  assertIncludes(
    normalized,
    "I built Pantry &amp; Plate™ because meal planning, pantry tracking, and grocery lists were always split across different tools.",
  );

  assert.equal((html.match(/id="faq"/g) || []).length, 1);
  assert.ok(
    html.indexOf('id="trust"') < html.indexOf('id="faq"'),
    "FAQ section should appear after Trust section",
  );
  assertIncludes(html, "Questions before you install?");
  assertIncludes(
    normalized,
    "Here are the practical details: setup, pricing, privacy, AI, household sharing, and connected grocery availability.",
  );
  assertIncludes(
    html,
    "Do I need to add my whole pantry before using Pantry &amp; Plate?",
  );
  assertIncludes(
    normalized,
    "No. Start with the staples and ingredients you buy most often. You can add items as you shop, scan, plan, and cook. Pantry &amp; Plate becomes more useful over time, but setup should not block your first weekly plan.",
  );
  assertIncludes(html, "How much does Pantry &amp; Plate cost?");
  assertIncludes(
    normalized,
    "New users get a 7-day free trial. After that, Pantry &amp; Plate requires a paid subscription: $4.99/month or $49.99/year in the U.S. Pricing may vary by store or region.",
  );
  assertIncludes(html, "Can I cancel anytime?");
  assertIncludes(
    normalized,
    "Yes. Subscriptions are managed through Apple or Google. You can manage or cancel your subscription in your App Store or Google Play account settings.",
  );
  assertIncludes(
    html,
    "Can my household share the same pantry, recipes, and shopping list?",
  );
  assertIncludes(
    normalized,
    "Pantry &amp; Plate is built for household planning. Invited household members can work from shared pantry, recipe, meal-planning, and shopping-list workflows.",
  );
  assertIncludes(html, "Are my private recipes public?");
  assertIncludes(html, "When does Pantry &amp; Plate use AI?");
  assertIncludes(
    normalized,
    "AI-assisted extraction, receipt parsing, or generation runs only when you choose those features, such as importing a recipe, parsing a receipt, or generating recipe ideas from selected inputs.",
  );
  assertIncludes(html, "What happens if a barcode is not recognized?");
  assertIncludes(
    normalized,
    "Barcode databases are not perfect. If an item is not recognized, you can still add or adjust the pantry item manually.",
  );
  assertIncludes(html, "Are Instacart and Kroger connected-shopping flows required?");
  assertIncludes(
    normalized,
    "No. Pantry tracking, saved recipes, meal planning, and smart shopping lists work without connected grocery checkout. Instacart and Kroger connected-shopping flows are live where supported, but availability may vary by platform, region, retailer availability, account eligibility, inventory, and app version.",
  );
  assertIncludes(html, "Where do I get help or request data deletion?");
  assertIncludes(html, '<a href="support.html">Support</a>');
  assertIncludes(html, '<a href="support.html#delete-account">Account and data deletion</a>');
  assertIncludes(html, appStoreUrl);
  assertIncludes(html, googlePlayUrl);
  assertNotIncludes(html, "Where can I download Pantry &amp; Plate?");
  assertNotIncludes(html, "Which platforms are available?");
  assertNotIncludes(html, "Can I send product feedback?");
  assertNotIncludes(html, "Are private recipes shared publicly?");
  assertNotIncludes(html, "Can Pantry &amp; Plate help reduce duplicate grocery purchases?");
  assertNotIncludes(html, "Will there be App Store or Google Play links?");
  assertNotIncludes(html, "iOS is awaiting App Store review.");
  assertNotIncludes(html, "Google Play link coming soon.");
  assertNotIncludes(
    html,
    "Official App Store and Google Play links will be posted here when the public listings are live.",
  );
});

test("privacy page exposes connected-shopping anchor for homepage availability copy", () => {
  const privacy = readSiteFile("privacy.html");

  assertIncludes(privacy, 'id="connected-shopping"');
  assertIncludes(privacy, "Connected Shopping, Affiliate Links, and Order Attribution");
  assertIncludes(privacy, "Instacart and Kroger connected-shopping flows are live where supported.");
  assertIncludes(privacy, "Connected-shopping flows are user-initiated and optional.");
});

test("support page exposes both live store links", () => {
  const support = readSiteFile("support.html");

  assertIncludes(support, "<h1>Support for Pantry &amp; Plate™</h1>");
  assertIncludes(support, appStoreUrl);
  assertIncludes(support, googlePlayUrl);
  assertTrackedStorePlacement(support, "support");
  assertNotIncludes(support, "Google Play link coming soon.");
});
