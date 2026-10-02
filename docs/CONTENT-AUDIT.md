# Content and destination audit

Checked on 2026-09-21 using repository inspection and public HTTP requests with a browser user agent. HTTP success establishes a reachable public page, not successful enrollment, payment, fulfillment, clinical deployment, or an independently verified product claim.

## Sources retained

- `landing/src/content.ts`: the existing physician-to-builder personal narrative, existing Google Calendar scheduling URL, and established ecosystem destinations.
- `landing/public/assets/img/prof_pic.jpg`: existing 360 x 400 portrait, visually inspected and retained.
- `landing/public/the_leverage_point.html`: existing English strategic working document. It describes proposed collaboration; it is not evidence of an established ThinkInSystems partnership.
- `/home/fadil369/brainsait/ai/Republic of cells/Arabic_Literary_Edition/00_Al-Muqaddimah.md`: actual Arabic introduction used for the literary excerpt. The English article is explicitly identified as a translation of that excerpt.
- `/home/fadil369/brainsait/web/fadil369.github.io/public/assets/images/books/republic-of-cells.webp`: existing book artwork available for reuse.

## Selected destinations

| Destination | Observed result | Scope of the displayed claim |
| --- | --- | --- |
| https://brainsait.org/ | 200; BrainSAIT healthcare website | Public website and founder's mission |
| https://registry.brainsait.org/oid | 200; BrainSAIT Identity Fabric / OID registry | Public registry |
| https://verify.brainsait.org/ | 200; provider search interface | Public verification page; no provider records changed |
| https://github.com/Fadil369/brainsait-linc-docs | 200; public LINC repository and documentation | Public documentation, not validated clinical operation |
| https://store.brainsait.de/products/solutions-ready-basma-voice | 200; Basma Voice product title and description | Public product page; purchasing and provisioning not exercised |
| https://academy.brainsait.org/ | 200; Academy learning catalog | Public catalog; course enrollment and certification not exercised |
| https://store.brainsait.de/products/republic-of-cells | 200; correct Republic of Cells product page | Listed in the library; fulfillment not exercised |
| https://learn.brainsait.de/ | 200; BrainSAIT Learn catalog | Public library destination |
| https://elfadil.com/the_leverage_point | 200; distinct existing strategy document | Existing route preserved |
| https://elfadil.com/echo-danah | 200 but HTML exactly matches homepage | SPA fallback, not evidence of a published Echo Danah project |

The existing appointment schedule is exported unchanged from `BOOKING_URL` in `landing/src/workspace/content.ts`, with `BOOKING_AVAILABLE = false`. Despite an HTTP 200 response, a Chromium browser rendered "Appointment not found" and "The appointment schedule is currently unavailable." The alternative short URL `https://calendar.app.google/Ve9KSKmaVA6ehDP48` resolves to the same unavailable schedule. Do not expose either as a working booking action. `info@brainsait.org` is displayed publicly in the BrainSAIT website footer; use an explicitly labeled email-draft handoff. Mailbox delivery has not been tested and no email was sent.

## Additional public writing

- https://brainsait369.blogspot.com/2026/08/sbs.html: Arabic article, "The healthcare claim journey: from submission to settlement in SBS," dated 2026-08-23 in the public Blogger feed.
- https://brainsait369.blogspot.com/2025/12/the-bridge.html: English article "The Bridge," dated 2025-12-31 in the public feed, with an HTTP 200 article page.
- The new personal-notes article adapts the existing website narrative. It is not presented as a separately dated publication.

## Deliberately limited claims

- Old experience dates, educational credentials, certifications, 50k downloads, three-continent reach, testimonials, deployed-hospital claims, and outcome metrics were not carried into the new shared content because the inspected material did not establish them.
- "Between One Beat and Another" has existing cover assets, but the guessed product handle returned 404 and no publication destination was established. It is not advertised as available for purchase.
- "ClinicalLinc" was not promoted as a verified standalone product. The established LINC documentation is linked under its actual name.
- `masterlinc.de`, `clinical.brainsait.org`, and `sbs.brainsait.org` failed during public checks. A separate MASTERLINC operations dashboard exists at `masterlinc.brainsait.de`, but it is not substituted for a public ClinicalLinc destination.
- `basma.brainsait.org` returns API JSON. The actual Basma product page is used for visitors.
- The legacy Leverage Point page has a client-side Gemini call with an empty API key. The new content does not present it as a functioning AI assistant. Preserve the article while ensuring any legacy assistant button explains its unavailable state or is removed.

## Editing

Edit `landing/src/workspace/content.ts` for bilingual profile text, project entries, reading excerpts, and FAQs. Keep each Arabic/English pair equivalent. Check a destination's title and actual content before adding it, and describe the observed status precisely. Article reading time should be calculated from the selected language's real paragraph text. A new biography date, award, product maturity label, or medical outcome needs source evidence before publication.
