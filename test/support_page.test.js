const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");

function readSiteFile(relativePath) {
  return fs.readFileSync(path.join(siteRoot, relativePath), "utf8");
}

function assertIncludes(haystack, needle, label = needle) {
  assert.ok(haystack.includes(needle), `Expected support page to include ${label}`);
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ");
}

test("support page is support-first and keeps account deletion on the same page", () => {
  const html = readSiteFile("support.html");
  const main = html.slice(html.indexOf("<main"));
  const deletionIndex = main.indexOf('id="delete-account"');

  assertIncludes(html, "<h1>Support for Pantry &amp; Plate™</h1>");
  assertIncludes(
    normalizeText(html),
    "Need help with Pantry &amp; Plate? Contact us for account access, billing questions, subscription issues, bug reports, privacy requests, product feedback, or problems with pantry, recipes, meal planning, shopping lists, connected grocery flows, or household sync.",
  );
  assert.ok(deletionIndex > -1, "support.html should preserve id=\"delete-account\"");
  assert.ok(
    main.indexOf("What we can help with") < deletionIndex,
    "help topics should appear before account deletion",
  );
  assert.ok(
    main.indexOf("Billing and cancellation") < deletionIndex,
    "billing help should appear before account deletion",
  );
  assert.ok(
    main.indexOf('id="support-contact"') < deletionIndex,
    "support contact should appear before account deletion",
  );
  assert.ok(!fs.existsSync(path.join(siteRoot, "delete-account.html")));
});

test("support page covers help categories, billing, and deletion details", () => {
  const html = readSiteFile("support.html");
  const normalized = normalizeText(html);
  const requiredCopy = [
    "Contact support",
    "What we can help with",
    "Account access",
    "Billing and subscriptions",
    "Bugs and app issues",
    "Connected grocery flows",
    "Privacy and data requests",
    "Pantry &amp; Plate subscriptions are managed through Apple or Google.",
    "Deleting your Pantry &amp; Plate account may not automatically cancel an active app-store subscription.",
    "Account and data deletion",
    "Delete your account in the app",
    "Delete your account by email",
    "Delete some data without deleting your account",
    "What is deleted or anonymized",
    "What may be retained",
    "Pantry &amp; Plate may retain a minimal anonymized deletion audit record for up to 30 days.",
  ];

  for (const copy of requiredCopy) {
    assertIncludes(normalized, copy);
  }
});

test("support form keeps email-draft flow and expanded request categories", () => {
  const html = readSiteFile("support.html");
  const mainJs = readSiteFile("assets/js/main.js");
  const categories = [
    "Account access",
    "Billing or subscription",
    "Bug report",
    "Product feedback",
    "Privacy request",
    "Account/data deletion",
    "Connected grocery flow",
    "Other",
  ];

  assertIncludes(html, '<form id="supportForm" aria-label="Support form">');
  assertIncludes(
    normalizeText(html),
    "This form opens your email app with a prefilled support draft.",
  );
  assertIncludes(
    normalizeText(html),
    "If you include an email address, we may use it to follow up about your request.",
  );

  for (const category of categories) {
    assertIncludes(html, `<option value="${category}">${category}</option>`, category);
  }

  assertIncludes(mainJs, "window.location.href = buildMailto(subject, lines);");
  assertIncludes(mainJs, "Platform/device:");
  assertIncludes(mainJs, "Urgency:");
});
