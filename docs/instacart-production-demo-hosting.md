# Instacart Production Review Demo Hosting

## Page
- Final page path: `/instacart-production-demo.html`
- Expected public URL: `https://pantryandplate.app/instacart-production-demo.html`
- Status: unlisted review page
- Search indexing: page includes `<meta name="robots" content="noindex, nofollow">`
- Main navigation: not linked from the main site navigation
- Sitemap: intentionally omitted from `sitemap.xml` because this is an unlisted noindex review page

## Video
- Video handling: embedded local MP4
- Final video path: `/assets/demo/instacart-production-review-demo.mp4`
- Video file size: 14,378,069 bytes, about 13.7 MiB
- Original was below the 25 MB threshold, so no compression was needed

## Instacart Review Details
- CTA shown in app: `Shop on Instacart`
- Integration type: Instacart shopping list page
- Endpoint: `POST /idp/v1/products/products_link`
- Generated Instacart landing page URL:
  `https://customers.dev.instacart.tools/store/shopping_lists/13896774`
- Landing page behavior: opens externally from the app
- Webview behavior: not embedded in a webview
- Checkout/order/payment: demo stops before checkout; no order or payment is placed

## Email Snippet

Hello Instacart team,

Here is the unlisted Pantry and Plate production-key review demo page:

https://pantryandplate.app/instacart-production-demo.html

The generated Instacart shopping list landing page shown in the demo is:

https://customers.dev.instacart.tools/store/shopping_lists/13896774

The app CTA is `Shop on Instacart`. The generated landing page opens externally from the app and is not embedded in a webview. The demo stops before checkout; no order or payment was placed.
