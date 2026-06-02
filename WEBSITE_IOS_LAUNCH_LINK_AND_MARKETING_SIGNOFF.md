# Pantry & Plate Website iOS Launch Link and Marketing Signoff

## Executive Summary

Pantry & Plate's public website has been updated for the iOS App Store launch. The live App Store URL is now present in the homepage navigation, hero, availability section, demo CTA, FAQ, final CTA, footer, support page, launch configuration, and phone-demo download dialog.

Google Play remains a safe placeholder because no verified public Google Play URL was provided for this pass.

Marketing launch copy, social copy, an asset checklist, and an asset inventory were created in the website repo. No large media files were copied into the website repo.

## Final Recommendation

WEBSITE LAUNCH LINK PASS

MARKETING MATERIALS PASS

## App Store Link Added

Live App Store URL:

https://apps.apple.com/us/app/pantry-plate/id6761082174

Updated placements:

- Homepage primary navigation CTA.
- Homepage hero CTA.
- Homepage launch availability section.
- Homepage launch demo CTA.
- Homepage FAQ.
- Homepage final CTA.
- Homepage footer.
- Support page launch/support callout.
- `assets/js/launch-config.js` checked-in fallback config.
- `assets/js/phone-demo.js` in-demo download dialog.
- README launch configuration documentation.

## Google Play Link Status

Google Play public URL was not provided and was not invented.

Current site behavior:

- Google Play CTA defaults to disabled in `assets/js/launch-config.js`.
- Visible copy says "Google Play link coming soon."
- No fake Google Play URL is linked from the active homepage or support page.

## Website Files Changed

Implementation commit:

- `README.md`
- `assets/css/styles.css`
- `assets/js/launch-config.js`
- `assets/js/phone-demo.js`
- `index.html`
- `support.html`
- `test/homepage_launch.test.js`
- `MARKETING_LAUNCH_COPY.md`
- `MARKETING_SOCIAL_POSTS.md`
- `MARKETING_ASSET_CHECKLIST.md`
- `MARKETING_ASSET_INVENTORY.md`

Signoff file:

- `WEBSITE_IOS_LAUNCH_LINK_AND_MARKETING_SIGNOFF.md`

## Marketing Materials Created

- `MARKETING_LAUNCH_COPY.md`
- `MARKETING_SOCIAL_POSTS.md`
- `MARKETING_ASSET_CHECKLIST.md`
- `MARKETING_ASSET_INVENTORY.md`

The copy uses the approved positioning:

"Pantry & Plate helps you plan meals from what's already in your kitchen, organize the recipes you actually cook, and build smarter grocery lists around what's missing."

No marketing copy claims guaranteed savings, medical or allergy guarantees, calorie or weight-loss planning, iPad support, cashback, rewards, coupons, discounts, or free-forever access.

## Asset Inventory

Media folders inspected:

- `/Users/benadgie/Desktop/meal_planner_release_evidence_archive/app_store_media_clean/`
- `/Users/benadgie/Desktop/meal_planner/marketing-assets/screen-captures/final/`
- `/Users/benadgie/Desktop/meal_planner/marketing-assets/screen-recordings/final/`
- `/Users/benadgie/Desktop/meal_planner/marketing-assets/final-capture-manifest.md`

Classification summary:

- SAFE FOR PUBLIC USE: 5 clean App Store PNG stills in `app_store_media_clean`.
- USE WITH OWNER APPROVAL: 6 final PNG capture candidates and 6 final MOV recordings.
- INTERNAL ONLY: final capture manifest, because it contains historical unsafe-marker references.
- RECAPTURE REQUIRED: none specifically identified in the inspected final folders during this pass.
- DO NOT USE: any older/non-final media, any video not fully re-reviewed, and any asset showing prohibited debug, parser, credential, placeholder, redaction, or unsupported-claim artifacts.

## Subscription / Trial Copy

Website launch copy now says:

- Start your 7-day free trial.
- Active subscription required after trial.

Existing Terms language was preserved and continues to describe:

- Subscription-based service.
- Trial eligibility and possible 7-day free trial.
- Monthly and annual subscription options.
- Automatic renewal unless canceled.
- Store/payment-provider billing and cancellation.
- Account deletion does not automatically cancel store subscriptions.

## Legal / Support Links

The following public paths were verified reachable live:

- `https://pantryandplate.app/`
- `https://pantryandplate.app/support.html`
- `https://pantryandplate.app/privacy.html`
- `https://pantryandplate.app/terms.html`
- `https://pantryandplate.app/support.html#delete-account`
- `https://pantryandplate.app/privacy.html#account-deletion`
- `https://pantryandplate.app/.well-known/apple-app-site-association`
- `https://pantryandplate.app/.well-known/assetlinks.json`

Privacy, Terms, Support, account deletion, DMCA, AASA, and assetlinks links remain intact.

## Validation Commands

| Command | Result | Notes |
| --- | --- | --- |
| `pwd` | PASS | Confirmed website repo at `/Users/benadgie/Desktop/meal_planner/.tmp/perfectpantry-site`. |
| `git rev-parse HEAD` | PASS | Baseline before implementation was `9afc64887d526244e11c3962eb952466cb1bcece`. |
| `git branch --show-current` | PASS | Current branch: `codex/restore-auth-callback`. |
| `git status --short` | PASS | Baseline working tree was clean before edits. |
| `git diff --check` | PASS | No whitespace errors. |
| `node --test` | PASS | 7 tests passed. |
| `node --check assets/js/main.js && node --check assets/js/phone-demo.js && node --check assets/js/launch-config.js` | PASS | JavaScript syntax clean. |
| `rg -n -i "beta\|public release pending\|coming soon beta\|request beta\|early access\|waitlist\|when the app is ready" index.html support.html terms.html privacy.html assets \|\| true` | PASS | No active stale launch-copy matches. |
| `rg -n "https://apps.apple.com/us/app/pantry-plate/id6761082174" .` | PASS | App Store URL appears in intended site, config, README, tests, and marketing docs. |
| Local browser smoke check at `http://127.0.0.1:8123/` | PASS | Found App Store copy, trial copy, Google Play placeholder, 8 App Store links, 0 fake Google Play links, and no old waitlist/App Store review copy. |
| Legal/support endpoint file check | PASS | Privacy, Terms, Support, AASA, and assetlinks files exist locally. |
| Live endpoint curl check | PASS | Root, Support, Privacy, Terms, account-deletion anchors, AASA, and assetlinks returned HTTP 200. |
| Live root/support content check | PASS | App Store link present, Google Play placeholder present, no stale waitlist/beta copy, no fake Google Play URL. |

## Live Verification

Live verification completed after pushing implementation commit `5db3c1b`.

Results:

- Root page returned HTTP 200.
- Support page returned HTTP 200.
- Privacy page returned HTTP 200.
- Terms page returned HTTP 200.
- Account deletion anchors returned HTTP 200.
- AASA returned HTTP 200.
- assetlinks returned HTTP 200.
- Live root contains the App Store URL.
- Live support page contains the App Store URL.
- Live root and support page contain "Google Play link coming soon."
- Live root and support page do not contain stale waitlist or App Store-review-pending copy.
- Live root and support page do not link the unverified Google Play URL.

## Remaining Marketing / Website Blockers

- Google Play public URL is still unavailable; keep Google Play as coming soon until a verified public URL exists.
- Final MOV files should not be used publicly until each has a full playback review.
- Final PNG capture candidates outside `app_store_media_clean` should receive owner approval before placement.

## Commit / Push

Implementation commit:

- SHA: `5db3c1b`
- Message: `Add App Store launch link and marketing copy`
- Pushed: yes, to `origin/main`

This signoff file was prepared after live verification and should be included in the follow-up signoff commit.

## Go / No-Go Impact

Website App Store launch link: GO.

Marketing materials: GO.

Google Play launch link: NO-GO until a verified public Google Play URL is available.

Reminder: the public DMCA page should match the final Copyright Office registration after certification and payment.
