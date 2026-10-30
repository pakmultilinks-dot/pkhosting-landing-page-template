# PKHosting landing page template: NOTES

Build files only. This folder holds index.html, styles.css, and app.js.
Do not deploy from this folder; deployment is handled separately.

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

## 3. Reuse for other outreach traffic

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
