# PKHosting landing page template: NOTES

Build files only. This folder holds index.html, styles.css, and app.js.
Do not deploy from this folder; deployment is handled separately.

## 0. Pages in this set (added 11 November 2026)

- index.html: shared hosting landing page. Hero, domain search, why host,
  and a real 3-plan shared hosting price table (Personal, Business,
  Professional) with first-year and renewal prices, checked live on
  pkhosting.com on 11 November 2026.
- domains.html: domain registration landing page. Domain search form,
  domain price table (.com, .pk, .com.pk, .org.pk, .net.pk) with first
  term and renewal, and the three steps from a name to a live website.
  Prices checked live on pkhosting.com on 11 November 2026.
- improve.html: how pkhosting.com could be better. Four findings checked
  live on 11 November 2026, each with the exact fix, plus what the site
  already does well. Nothing on pkhosting.com itself was changed.
- All three pages share styles.css and app.js. The top navigation links
  the pages together. The domain form on domains.html uses the same
  form ids as index.html, so app.js works on both pages unchanged.
  improve.html has no domain form; app.js handles a missing form by
  doing nothing for it, and the outbound link tagging still works.

## 1. Domain search URL used, and how it was verified

Used: https://pkhosting.com/domains/

Verified live on 30 October 2026 by reading the page text:

- The page loads with the title "Domain Registration & Name Ideas, .com, .pk & More | PK Hosting".
- Its search section reads "Find your domain. Build something great." and
  "Search checks up to four extensions. Your exact extension comes first.
  No account required."
- The "See hosting plans" links point to https://pkhosting.com/pricing/,
  which was also read live and loads as "Web Hosting Pricing in Pakistan".

Why the entered domain name is NOT passed in the URL:

- The pkhosting.com domain search is an in-page JavaScript studio. The
  fetched page text exposes no form action and no search query parameter.
- The "Start Domain Order" link on that page goes to
  https://www.pkhosting.com/checkout/?product=1, which is a checkout page
  with a "Domain to register" field, not a search page, and it shows no
  domain query parameter either.
- A web search found no documented pkhosting.com search parameter.

So no search URL pattern was invented. The domain search button takes
the visitor to the real domain search page above, with UTMs appended
(see section 2), and the page states this plainly under the search box:
the visitor completes the search on pkhosting.com and types the name in
the search box there. The entered name is also saved in the browser
(see section 2) so it is prefilled if the visitor returns.

How to upgrade this later: only use a search parameter if pkhosting.com
itself documents one, or if you observe the parameter in the site's own
search URL after running a search there. If that happens, change one
place: the domain form handler in app.js (the DOMAINS_URL constant and
the navigation line). Never guess a parameter.

## 2. UTM capture and append (app.js), exactly how it works

Tracked keys, nothing else: utm_source, utm_medium, utm_campaign,
utm_term, utm_content.

On page load, app.js:

1. Reads those five keys from the page URL. Empty values are ignored.
2. Reads any previously stored set from localStorage key "pkhosting_utm".
3. Merges them: URL values overwrite the same stored key, other stored
   keys survive. If the URL carries any UTM value, the merged set is
   saved back to localStorage. If the URL carries none, the stored set
   is reused as is. If neither exists, no parameters are added anywhere.
4. Rewrites every link marked with data-outbound, but only when the
   link hostname is pkhosting.com (or a subdomain of it). Tagging uses
   URLSearchParams.set, so any query parameters already on the link are
   kept and UTM values are added or replaced, never duplicated.
5. Builds the domain search button destination from the DOMAINS_URL
   constant with the same tagging, then navigates there on submit.

Links that carry UTMs on this page:

- Header brand link to pkhosting.com
- Hero "Check domain availability" to pkhosting.com/domains/
- Hero "See hosting plans" to pkhosting.com/pricing/
- Plans teaser "See hosting plans" to pkhosting.com/pricing/
- Footer pkhosting.com link
- Domain search button destination to pkhosting.com/domains/

Links that never get UTMs: tel: and mailto: links, and any link without
the data-outbound attribute.

Separate from UTMs: the last entered domain name is stored under
localStorage key "pkhosting_last_domain" and prefilled into the search
box on a later visit. It is never added to any outbound URL.

Safety: if localStorage is unavailable (for example private mode) or
the stored value is corrupt, app.js ignores storage and the page and
its links keep working with no UTMs added.

## 4. Prices shown on the pages (checked 11 November 2026)

Shared hosting, from pkhosting.com/pricing/ and the homepage, both read
live on 11 November 2026. Black Friday first-year prices, renewals shown
beside them:

- Personal: Rs 4,490/yr first year, renews Rs 6,990/yr. 1 website,
  5 GB SSD, 5 emails, daily backups 1-day retention.
- Business: Rs 11,990/yr first year, renews Rs 19,990/yr. 5 websites,
  25 GB SSD, 25 emails, daily backups 3-day retention, Priority Setup.
- Professional: Rs 23,990/yr first year, renews Rs 39,990/yr.
  10 websites, 50 GB SSD, 50 emails, daily backups 5-day retention,
  Priority Support.
- All three include free SSL, free migration, WordPress setup help and a
  free .com with a 3-year term. Monthly billing from Rs 699/month for
  Personal (monthly billing rate is set from the renewal price).
- Add-ons and taxes are extra. The live pricing page governs; re-check
  prices before any new print or campaign run.

Domains, from pkhosting.com/domains/ and the homepage, read live on
11 November 2026:

- .com: Rs 3,299/yr first year, renews Rs 3,762/yr, 1-year term.
- .pk, .com.pk, .org.pk, .net.pk: Rs 3,899 first term, renews Rs 5,460,
  2-year minimum term.
- 910 extensions listed, including 16 local .pk extensions. Search
  checks up to 20 extensions, exact extension first, no account
  required. A search does not reserve a name. Premium names need a
  separate quote.

## 5. Improvement findings on improve.html (checked 11 November 2026)

- pkhosting.com/clientarea.php returns 404. Fix: 301 redirect it to
  /login/. The homepage itself does not link to it.
- The featured blog article is "508 Resource Limit Is Reached: How to
  Fix It in cPanel", written for cPanel menus. PK Hosting runs the
  Hestia panel (panel.pkhosting.com), not cPanel. Fix: rewrite it for
  the Hestia dashboard.
- No Trustpilot profile for pkhosting.com appeared in search on
  11 November 2026 (competitors Pakish, Cheaphosting.pk, Hoster.pk and
  WebHoster.pk all have one). Fix: create and claim a profile and
  invite real customers to review.
- No Google Business Profile for PK Hosting appeared in search on
  11 November 2026. Fix: create one for the Lahore office, 231-B Main
  Boulevard, Phase 8 DHA, Lahore, phone (042) 35692952.
- Also verified the same day: the homepage has zero dead "#" links;
  social links are real (Facebook, X, LinkedIn, YouTube); the homepage
  is honest about affiliated network sites and backup limits; the
  knowledgebase has 30 guides; the blog has 29 articles; PK Hosting is
  listed on GoodFirms.

## 6. Reuse for other outreach traffic

- Copy index.html, styles.css, and app.js together. app.js needs no
  edits for a new campaign.
- Share the page URL with UTM parameters, for example (values shown
  are examples only):
  https://your-template-host/page/?utm_source=facebook&utm_medium=post&utm_campaign=lahore-shops-nov
- Use one utm_campaign value per campaign, and utm_source plus
  utm_medium to say where the traffic came from.
- To change a link destination, edit the href in index.html only. Keep
  data-outbound on any pkhosting.com link you want tagged, and remove
  it from any link you do not want tagged. To add a new outbound
  pkhosting.com link, add data-outbound to it; no JavaScript change
  is needed.
- UTMs persist in the visitor's browser through localStorage, so a
  later visit without UTMs still carries the first campaign. To test a
  new campaign cleanly, use a fresh browser profile or clear
  localStorage for the page first.
- Facts policy for this template: only verified facts appear on the
  page (shared hosting from Rs 699/month, free SSL, free migration,
  WordPress setup help, support (042) 35692952, support@pkhosting.com,
  Monday to Friday 9am to 6pm PKT). Do not add other prices,
  testimonials, or statistics without verifying them on pkhosting.com
  first.
