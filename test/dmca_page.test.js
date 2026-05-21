const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");

function readSiteFile(relativePath) {
  return fs.readFileSync(path.join(siteRoot, relativePath), "utf8");
}

function assertIncludes(haystack, needle, label = needle) {
  assert.ok(haystack.includes(needle), `Expected page to include ${label}`);
}

function assertIncludesText(haystack, needle, label = needle) {
  const normalizedHaystack = haystack.replace(/\s+/g, " ");
  const normalizedNeedle = needle.replace(/\s+/g, " ");
  assertIncludes(normalizedHaystack, normalizedNeedle, label);
}

test("DMCA page renders required legal content", () => {
  const html = readSiteFile("dmca.html");
  const legalConfig = JSON.parse(readSiteFile("assets/data/legal_contact.v1.json"));

  assertIncludes(html, "<!doctype html>");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assertIncludes(html, "<h1>Copyright / DMCA Notice</h1>");
  assertIncludes(html, "Pantry and Plate LLC");
  assertIncludes(html, legalConfig.dmcaAgent.name);
  assertIncludes(html, legalConfig.dmcaAgent.email);
  assertIncludes(html, `href="mailto:${legalConfig.dmcaAgent.email}"`);
  assertIncludes(html, legalConfig.dmcaAgent.phone);
  assertIncludes(html, legalConfig.dmcaRegistrationNumber);
  assertIncludes(html, "DMCA Designated Agent Registration Number: <strong>DMCA-1073129</strong>");

  for (const alternateName of legalConfig.dmcaAlternateNames) {
    assertIncludes(html, alternateName.replace("&", "&amp;"), alternateName);
  }
});

test("DMCA page includes takedown, counter-notice, repeat infringer, and imported recipe copy", () => {
  const html = readSiteFile("dmca.html");

  const takedownRequirements = [
    "A physical or electronic signature of the copyright owner or a person authorized to act on the copyright owner’s behalf.",
    "Identification of the copyrighted work claimed to have been infringed.",
    "Identification of the material claimed to be infringing and information reasonably sufficient for Pantry and Plate to locate the material, such as the Pantry and Plate recipe URL or page URL.",
    "Your contact information, including your name, mailing address, telephone number, and email address.",
    "A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized by the copyright owner, the copyright owner’s agent, or the law.",
    "A statement that the information in your notice is accurate and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.",
  ];

  for (const requirement of takedownRequirements) {
    assertIncludes(html, requirement);
  }

  assertIncludes(html, "Please send DMCA notices to");
  assertIncludes(html, "Counter-Notices");
  assertIncludes(html, "Repeat Infringer Policy");
  assertIncludesText(
    html,
    "Pantry and Plate may suspend or terminate accounts of users who repeatedly upload, publish, or share content that infringes copyright or other intellectual property rights."
  );
  assertIncludes(html, "Imported Recipes and Attribution");
  assertIncludes(html, "Imported recipes are private by default.");
  assertIncludesText(
    html,
    "Attribution is required for imported recipes but does not replace permission."
  );
});

test("site footer and support page link to the DMCA page", () => {
  const footerPages = ["index.html", "privacy.html", "terms.html", "support.html", "dmca.html"];

  for (const page of footerPages) {
    const html = readSiteFile(page);
    const footer = html.match(/<nav class="footer-links"[\s\S]*?<\/nav>/);
    assert.ok(footer, `${page} should include footer links`);
    assert.match(footer[0], /href="\/?dmca\.html"/, `${page} footer should link to DMCA`);
  }

  const support = readSiteFile("support.html");
  assertIncludes(support, "For copyright complaints, please see our");
  assertIncludes(support, '<a href="/dmca.html">DMCA page</a>');
});
