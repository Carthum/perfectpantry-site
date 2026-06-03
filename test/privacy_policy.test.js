const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");

function readSiteFile(relativePath) {
  return fs.readFileSync(path.join(siteRoot, relativePath), "utf8");
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ");
}

function assertIncludes(haystack, needle, label = needle) {
  assert.ok(haystack.includes(needle), `Expected page to include ${label}`);
}

function assertNotIncludes(haystack, needle, label = needle) {
  assert.ok(!haystack.includes(needle), `Expected page not to include ${label}`);
}

test("privacy policy includes a Google Play-aligned data safety summary", () => {
  const privacy = readSiteFile("privacy.html");
  const normalized = normalizeText(privacy);

  assertIncludes(privacy, 'id="data-safety-summary"');
  assertIncludes(privacy, "Data Safety Summary");
  [
    "Account and profile.",
    "Household food data.",
    "Photos, receipts, screenshots, and uploads.",
    "AI-assisted features.",
    "Feedback and support messages.",
    "Subscriptions and purchase status.",
    "App interactions, crash logs, and diagnostics.",
    "Approximate location.",
    "Connected shopping.",
    "Deletion and choices.",
  ].forEach((category) => assertIncludes(privacy, category));

  assertIncludes(normalized, "AI-assisted recipe extraction, receipt parsing, and generation run only when you choose those features.");
  assertIncludes(normalized, "Pantry &amp; Plate receives your message, optional email, and the app context shown before you submit");
  assertIncludes(normalized, "subscription status and purchase-history information through app-store and subscription service providers");
  assertIncludes(normalized, "app interactions, crash logs, diagnostics, device/app details, operating-system details, app version, build number, identifiers, and notification tokens");
  assertIncludes(normalized, "Pantry &amp; Plate does not collect precise GPS location unless a feature clearly asks for it.");
  assertIncludes(privacy, 'href="support.html#delete-account"');
});

test("privacy policy supports trust, AI, subscription, diagnostics, and connected-shopping claims", () => {
  const privacy = readSiteFile("privacy.html");
  const normalized = normalizeText(privacy);

  assertIncludes(privacy, 'id="connected-shopping"');
  assertIncludes(normalized, "Private household recipes are visible only to you and invited household members unless you explicitly choose to share or publish them.");
  assertIncludes(normalized, "Camera and photo access are user-started.");
  assertIncludes(normalized, "AI-generated or extracted content may be incomplete or inaccurate.");
  assertIncludes(normalized, "When you submit feedback or a support request, we may receive the message you enter, optional email address, selected category, app version, platform, current area of the app, device/app context shown before submission, and related diagnostic details.");
  assertIncludes(normalized, "RevenueCat, Apple, and Google app-store purchase systems for subscription status, trial status, purchase history, entitlement history");
  assertIncludes(normalized, "Pantry &amp; Plate does not directly receive your full payment-card number from Apple or Google.");
  assertIncludes(normalized, "Firebase Analytics, Crashlytics, and Messaging data used for app interactions, feature usage, crash logs, diagnostics");
  assertIncludes(normalized, "Instacart and Kroger connected-shopping flows are live where supported.");
  assertIncludes(normalized, "Connected-shopping flows are user-initiated and optional.");
  assertIncludes(normalized, "Availability may vary by platform, region, retailer availability, account eligibility, inventory, and app version.");
  assertIncludes(normalized, "Connected-shopping features do not guarantee that checkout will succeed");
  assertIncludes(normalized, "partner compensation where applicable.");
  assertIncludes(normalized, "Pantry &amp; Plate is not a medical or allergy-safety service.");
});

test("privacy policy avoids stale or unsupported privacy claims", () => {
  const privacy = readSiteFile("privacy.html");

  [
    "intended to be visible",
    "shared files",
    "HIPAA compliant",
    "SOC 2",
    "end-to-end encrypted",
    "bank-level security",
    "military-grade security",
    "never share data",
    "grocery delivery guaranteed",
    "checkout guaranteed",
    "allergy safety",
    "nutrition advice",
    "medical advice",
  ].forEach((phrase) => assertNotIncludes(privacy, phrase));

  assert.ok(!fs.existsSync(path.join(siteRoot, "delete-account.html")));
});
