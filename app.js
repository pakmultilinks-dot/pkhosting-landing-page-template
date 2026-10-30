/* PKHosting landing page template: UTM capture and outbound link tagging.
 *
 * What it does:
 * 1. On load, reads utm_source, utm_medium, utm_campaign, utm_term and
 *    utm_content from the page URL and stores them in localStorage.
 * 2. Appends the stored UTM values to every outbound pkhosting.com link
 *    on the page (hero CTAs, plans CTA, footer link, domain search link).
 * 3. Handles the domain search form: the entered name is NOT added to the
 *    pkhosting.com URL, because pkhosting.com publishes no search URL
 *    parameter for it (see NOTES.md). The button takes the visitor to
 *    the real domain search page, with UTMs appended, and shows a note
 *    telling them to type the name in the search box there.
 *
 * If no UTM parameters are present anywhere, links work normally and
 * no parameters are added. localStorage failures are ignored so the
 * page and its links keep working. */

(function () {
  "use strict";

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var UTM_STORAGE_KEY = "pkhosting_utm";
  var LAST_DOMAIN_KEY = "pkhosting_last_domain";
  var DOMAINS_URL = "https://pkhosting.com/domains/";

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* Storage unavailable (for example private mode). Links still work. */
    }
  }

  function readStoredUtms() {
    var raw = safeGet(UTM_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (e) {
      /* Corrupt stored value: ignore it rather than breaking the page. */
    }
    return {};
  }

  /* Read UTM values from the current page URL. Only non-empty values count. */
  function readUrlUtms() {
    var found = {};
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return found;
    }
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value !== null && value !== "") {
        found[key] = value;
      }
    });
    return found;
  }

  /* Merge URL UTMs over stored UTMs, so a new campaign overwrites the
     same key while older keys survive. Returns the merged set. */
  function getUtms() {
    var stored = readStoredUtms();
    var fromUrl = readUrlUtms();
    var merged = {};
    var hasNew = false;
    UTM_KEYS.forEach(function (key) {
      if (stored[key]) {
        merged[key] = stored[key];
      }
    });
    UTM_KEYS.forEach(function (key) {
      if (fromUrl[key]) {
        merged[key] = fromUrl[key];
        hasNew = true;
      }
    });
    if (hasNew) {
      safeSet(UTM_STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  }

  /* Return the URL with stored UTM values appended. Only pkhosting.com
     links are tagged. Existing query parameters on the link are kept. */
  function withUtms(href, utms) {
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (e) {
      return href;
    }
    var host = url.hostname.toLowerCase();
    if (host !== "pkhosting.com" && host.slice(-14) !== ".pkhosting.com") {
      return href;
    }
    UTM_KEYS.forEach(function (key) {
      if (utms[key]) {
        url.searchParams.set(key, utms[key]);
      }
    });
    return url.toString();
  }

  function init() {
    var utms = getUtms();

    /* Tag every outbound pkhosting.com link marked with data-outbound. */
    var links = document.querySelectorAll("a[data-outbound]");
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href) {
        link.setAttribute("href", withUtms(href, utms));
      }
    });

    /* Domain search form. */
    var form = document.getElementById("domain-form");
    var input = document.getElementById("domain-input");
    var error = document.getElementById("domain-error");
    var note = document.getElementById("domain-note");
    if (!form || !input) {
      return;
    }

    /* Prefill the last entered name, so a returning visitor does not
       have to retype it. */
    var lastDomain = safeGet(LAST_DOMAIN_KEY);
    if (lastDomain && !input.value) {
      input.value = lastDomain;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = input.value.trim().toLowerCase();
      if (!name) {
        if (error) {
          error.hidden = false;
        }
        input.focus();
        return;
      }
      if (error) {
        error.hidden = true;
      }
      safeSet(LAST_DOMAIN_KEY, name);
      /* The name is deliberately NOT added to the pkhosting.com URL:
         pkhosting.com publishes no search parameter for it. The note
         tells the visitor exactly what to do on the next page. */
      if (note) {
        note.textContent = 'Opening the pkhosting.com domain search. Type "' + name + '" in the search box there.';
      }
      window.location.href = withUtms(DOMAINS_URL, utms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
