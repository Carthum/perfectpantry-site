const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");
const siteUrl = "https://pantryandplate.app";
const appStoreUrl = "https://apps.apple.com/us/app/pantry-plate/id6761082174";
const googlePlayUrl = "https://play.google.com/store/apps/details?id=app.pantryandplate";

function readSiteFile(relativePath) {
  return fs.readFileSync(path.join(siteRoot, relativePath), "utf8");
}

function assertIncludes(haystack, needle, label = needle) {
  assert.ok(haystack.includes(needle), `Expected content to include ${label}`);
}

function tagCount(html, pattern) {
  return (html.match(pattern) || []).length;
}

function publicAssetExists(url) {
  if (!url.startsWith(`${siteUrl}/`)) return false;
  const relativePath = url.slice(siteUrl.length + 1);
  return fs.existsSync(path.join(siteRoot, relativePath));
}

test("homepage has canonical, social metadata, and valid SoftwareApplication JSON-LD", () => {
  const html = readSiteFile("index.html");

  assert.equal(tagCount(html, /<title>/g), 1);
  assert.equal(tagCount(html, /<meta\s+name="description"/g), 1);
  assert.equal(tagCount(html, /<link\s+rel="canonical"/g), 1);
  assertIncludes(html, '<link rel="canonical" href="https://pantryandplate.app/" />');
  assertIncludes(
    html,
    "<title>Pantry &amp; Plate™ | Pantry Tracker, Meal Planner &amp; Smart Grocery List</title>",
  );
  assertIncludes(
    html,
    'content="Plan meals from what you already have. Pantry & Plate connects your pantry, saved recipes, weekly meal plan, and shopping list for iPhone and Android."',
  );
  assertIncludes(html, '<meta property="og:type" content="website" />');
  assertIncludes(
    html,
    '<meta property="og:site_name" content="Pantry &amp; Plate" />',
  );
  assertIncludes(html, '<meta property="og:url" content="https://pantryandplate.app/" />');
  assertIncludes(
    html,
    '<meta property="og:image" content="https://pantryandplate.app/assets/media/og-cover.svg" />',
  );
  assertIncludes(html, 'property="og:image:alt"');
  assertIncludes(html, '<meta name="twitter:card" content="summary_large_image" />');
  assertIncludes(html, '<meta name="twitter:image" content="https://pantryandplate.app/assets/media/og-cover.svg" />');
  assert.ok(
    publicAssetExists("https://pantryandplate.app/assets/media/og-cover.svg"),
    "homepage social image should resolve to a tracked asset",
  );

  const ldJsonMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(ldJsonMatch, "homepage should include SoftwareApplication JSON-LD");
  const structuredData = JSON.parse(ldJsonMatch[1]);

  assert.equal(structuredData["@context"], "https://schema.org");
  assert.equal(structuredData["@type"], "SoftwareApplication");
  assert.equal(structuredData.name, "Pantry & Plate");
  assert.equal(structuredData.alternateName, "Pantry and Plate");
  assert.equal(structuredData.applicationCategory, "FoodApplication");
  assert.equal(structuredData.operatingSystem, "iOS, Android");
  assert.equal(structuredData.url, "https://pantryandplate.app/");
  assert.deepEqual(structuredData.sameAs, [appStoreUrl, googlePlayUrl]);
  assert.equal(structuredData.publisher.name, "Pantry and Plate LLC");
  assert.deepEqual(
    structuredData.offers.map((offer) => ({
      type: offer["@type"],
      price: offer.price,
      currency: offer.priceCurrency,
    })),
    [
      { type: "Offer", price: "4.99", currency: "USD" },
      { type: "Offer", price: "49.99", currency: "USD" },
    ],
  );

  const serialized = JSON.stringify(structuredData);
  for (const forbidden of [
    "aggregateRating",
    "review",
    "ratingValue",
    "reviewCount",
    "installCount",
  ]) {
    assert.ok(!serialized.includes(forbidden), `JSON-LD should omit ${forbidden}`);
  }
});

test("public pages expose expected titles, descriptions, and canonicals", () => {
  const pages = [
    {
      file: "privacy.html",
      title: "Privacy Policy | Pantry &amp; Plate™",
      description:
        "Read how Pantry & Plate handles account data, recipes, pantry items, meal plans, shopping lists, photos, diagnostics, subscriptions, support messages, and connected-shopping data.",
      canonical: "https://pantryandplate.app/privacy.html",
    },
    {
      file: "terms.html",
      title: "Terms of Service | Pantry &amp; Plate™",
      description:
        "Read the Pantry & Plate terms for app access, subscriptions, household features, user content, connected shopping, and acceptable use.",
      canonical: "https://pantryandplate.app/terms.html",
    },
    {
      file: "support.html",
      title: "Support | Pantry &amp; Plate™",
      description:
        "Get help with Pantry & Plate account access, billing, subscriptions, bugs, privacy requests, product feedback, and account or data deletion.",
      canonical: "https://pantryandplate.app/support.html",
    },
    {
      file: "dmca.html",
      title: "DMCA Policy | Pantry &amp; Plate™",
      description: "Read Pantry & Plate’s DMCA policy and copyright takedown process.",
      canonical: "https://pantryandplate.app/dmca.html",
    },
  ];

  for (const page of pages) {
    const html = readSiteFile(page.file);
    assert.equal(tagCount(html, /<title>/g), 1, `${page.file} title count`);
    assert.equal(
      tagCount(html, /<meta\s+name="description"/g),
      1,
      `${page.file} description count`,
    );
    assert.equal(
      tagCount(html, /<link\s+rel="canonical"/g),
      1,
      `${page.file} canonical count`,
    );
    assertIncludes(html, `<title>${page.title}</title>`);
    assertIncludes(html, `content="${page.description}"`);
    assertIncludes(html, `<link rel="canonical" href="${page.canonical}" />`);
  }
});

test("sitemap and robots cover existing public pages without delete-account page", () => {
  const sitemap = readSiteFile("sitemap.xml");
  const robots = readSiteFile("robots.txt");
  const expectedUrls = [
    "https://pantryandplate.app/",
    "https://pantryandplate.app/privacy.html",
    "https://pantryandplate.app/terms.html",
    "https://pantryandplate.app/support.html",
    "https://pantryandplate.app/dmca.html",
  ];

  assertIncludes(sitemap, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const url of expectedUrls) {
    assertIncludes(sitemap, `<loc>${url}</loc>`);
    const localPath =
      url === "https://pantryandplate.app/"
        ? "index.html"
        : url.replace("https://pantryandplate.app/", "");
    assert.ok(fs.existsSync(path.join(siteRoot, localPath)), `${url} should map to a file`);
  }

  assert.ok(!sitemap.includes("delete-account.html"));
  assert.ok(!fs.existsSync(path.join(siteRoot, "delete-account.html")));
  assertIncludes(robots, "User-agent: *");
  assertIncludes(robots, "Allow: /");
  assertIncludes(robots, "Sitemap: https://pantryandplate.app/sitemap.xml");
  assert.ok(!robots.includes("Disallow: /privacy.html"));
  assert.ok(!robots.includes("Disallow: /terms.html"));
  assert.ok(!robots.includes("Disallow: /support.html"));
  assert.ok(!robots.includes("Disallow: /dmca.html"));
});
