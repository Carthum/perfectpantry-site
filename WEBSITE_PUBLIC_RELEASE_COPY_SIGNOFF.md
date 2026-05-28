# Pantry & Plate Website Public Release Copy Signoff

## Summary

Final recommendation: **SUPERSEDED BY WEBSITE_DEPLOYMENT_LIVE_SIGNOFF.md**.

The source checkout for `pantryandplate.app` is `/Users/benadgie/Desktop/meal_planner/.tmp/perfectpantry-site`. Its `CNAME` is `pantryandplate.app`; the sibling `/Users/benadgie/Desktop/perfectpantry-site` checkout still points at `perfectpantryapp.com` and was not edited.

The public release copy mismatch was fixed locally. The root page no longer says Pantry & Plate is being prepared for beta/public release, the support form no longer offers a beta access request category, and the interactive demo no longer renders "Beta sample". A later correction restored the terms to describe Pantry & Plate as a subscription-based service.

## Files Changed

- `index.html`
- `support.html`
- `terms.html`
- `assets/js/phone-demo.js`
- `WEBSITE_PUBLIC_RELEASE_COPY_SIGNOFF.md`

## Launch-Blocking Copy Removed

Removed from `index.html`:

- `Pre-launch actions`
- `release questions`
- `Is Pantry & Plate™ available yet?`
- `Pantry & Plate™ is being prepared for beta and public release. For current availability or support questions, email support@pantryandplate.app.`
- `We will add official download links when the app is ready for public release.`

Replaced with:

- `Primary actions`
- `availability questions`
- `How can I find current availability?`
- `Pantry & Plate™ helps households manage their pantry, plan meals, and build grocery lists. For current availability or support questions, email support@pantryandplate.app.`
- `Official App Store and Google Play links will be posted here when the public listings are live.`

Removed from `support.html`:

- `Beta access request`

Replaced with:

- `Availability question`

Removed from `assets/js/phone-demo.js`:

- Public demo copy: `Beta sample`
- Internal beta-named support CTA variable/comment.

Replaced with:

- `Demo sample`
- Support-contact naming for the same mailto CTA behavior.

## Terms Subscription Posture

Product intent was clarified after the first website copy pass: Pantry & Plate should still be described as subscription-based. The prior conditional/future-only terms posture was incorrect and has been corrected.

The corrected terms now state:

- The Service includes subscriptions.
- Users agree to the terms by starting a free trial, purchasing a subscription, or using the Service.
- The Service may include subscription management.
- `Pantry & Plate is offered as a subscription-based service. Full access to the Service requires an active subscription unless Pantry & Plate provides trial, promotional, reviewer, administrative, or other temporary access.`
- Trial availability, duration, pricing, renewal terms, and eligibility may vary.
- Current subscription options may include monthly and annual subscriptions.
- Pricing, billing period, renewal terms, and trial details are shown in the app and applicable app-store purchase flow before purchase.
- App Store / Google Play billing, renewal, cancellation, refund, and restore-purchase terms apply where subscriptions are purchased through those stores.
- RevenueCat/subscription infrastructure language is restored for subscriber access validation.

Correction rationale:

- Root/support/demo beta cleanup remains intact.
- The terms no longer say subscriptions are disabled, future-only, or hypothetical.
- Legal-sensitive terms edits require human/legal review before deployment.
- The app release must separately verify subscription implementation, store products, purchase/restore behavior, RevenueCat/Billing state, and store disclosures.

## Store Links Status

No real App Store or Google Play URLs were provided, and none were invented.

Root FAQ now says official App Store and Google Play links will be posted when the public listings are live. This is neutral availability copy and does not claim the app is already listed.

## Privacy / Support / Account Deletion Links

Preserved:

- Privacy policy links to `privacy.html`.
- Terms links to `terms.html`.
- Support links to `support.html`.
- DMCA links to `dmca.html`.
- Support email `support@pantryandplate.app`.
- Account deletion instructions on `support.html`.
- Privacy account deletion section link target `privacy.html#account-deletion`.

Static local link verification checked all local `href` and `src` targets in HTML files and found no missing local targets.

## Searches Run

The exact beta/public-release-pending search includes this signoff file, so it reports historical removed-copy evidence in this document. A follow-up active-page search excluding this signoff file found no active launch-facing matches.

- `rg -n "beta|public release|coming soon|request beta|early access|waitlist|when the app is ready|available yet" . -S --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**'`
  - Result: PASS WITH TRIAGE. Matches are confined to this signoff document's historical removed-copy evidence.
- `rg -ni "beta|public release|coming soon|request beta|early access|waitlist|when the app is ready|available yet" . --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**'`
  - Result: PASS WITH TRIAGE. Matches are confined to this signoff document's historical removed-copy evidence.
- `rg -ni "beta|public release|coming soon|request beta|early access|waitlist|when the app is ready|available yet" . --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**' --glob '!WEBSITE_PUBLIC_RELEASE_COPY_SIGNOFF.md'`
  - Result: PASS. No active page/script matches.
- `rg -ni "subscriptions are disabled|future-only|hypothetical|future paid|if paid features are introduced|if paid subscriptions" terms.html -S`
  - Result: PASS. No matches in `terms.html`.
- `rg -ni "subscription|full access|active subscription|free trial|renewal|restore purchase|Billing|RevenueCat" . --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**'`
  - Result after correction: PASS WITH TRIAGE. Subscription references are expected and describe the current subscription-based service posture, plus privacy disclosures for subscription data/processors if enabled.

## Build / Verification Commands

| Command | Result | Notes |
| --- | --- | --- |
| `git status --short` | PASS | Correct website repo was clean before edits; after edits only intended files are modified. |
| `find . -maxdepth 2 \( -name package.json -o -name Makefile -o -name '*.config.*' -o -name '.github' \) -print` | PASS | No package manager/build config found; this is a static HTML/CSS/JS site. |
| `rg -ni "beta\|public release\|coming soon\|request beta\|early access\|waitlist\|when the app is ready\|available yet" . --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**'` | PASS WITH TRIAGE | Exact required search reports only historical removed-copy evidence in this signoff file. |
| `rg -ni "beta\|public release\|coming soon\|request beta\|early access\|waitlist\|when the app is ready\|available yet" . --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**' --glob '!WEBSITE_PUBLIC_RELEASE_COPY_SIGNOFF.md'` | PASS | No active page/script matches. |
| `rg -ni "subscription\|full access\|active subscription\|free trial\|renewal\|restore purchase\|Billing\|RevenueCat" . --glob '!node_modules/**' --glob '!dist/**' --glob '!build/**'` | PASS WITH TRIAGE | Subscription references are expected and describe the subscription-based service posture; privacy references remain conditional for if-enabled purchase data/processors. |
| `rg -ni "subscriptions are disabled\|future-only\|hypothetical\|future paid\|if paid features are introduced\|if paid subscriptions" terms.html -S` | PASS | No future-only/disabled subscription posture remains in `terms.html`. |
| `git diff --check` | PASS | No whitespace errors. |
| `node --test` | PASS | 3/3 DMCA/link policy tests passed. |
| `node --check assets/js/main.js && node --check assets/js/phone-demo.js` | PASS | JavaScript syntax checks passed. |
| `python3 - <<'PY' ... PY` static local link check | PASS | Checked 132 local `href`/`src` references; all targets exist. |

## Deployment Status

Deployment was completed after this local-copy signoff. See `WEBSITE_DEPLOYMENT_LIVE_SIGNOFF.md` for the authoritative live verification result.

The deployment pass rechecked the live root, privacy, terms, support/account deletion, AASA, and assetlinks URLs.

## Remaining Blockers

- Separately verify app subscription implementation, store products, purchase/restore behavior, RevenueCat/Billing state, and store disclosures.
- Add real App Store / Google Play links only after the public listings are live.
- This website copy pass does not resolve the app release's separate hosted/provider/store/signed-artifact/release-smoke evidence gates.
