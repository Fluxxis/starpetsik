(function () {
  "use strict";

  function getConfig() {
    return window.STARPETS_REDIRECT_CONFIG || {};
  }

  function getUrl(key) {
    var config = getConfig();
    var links = config.links || {};
    return links[key] || config.siteUrl || "";
  }

  function cleanText(element) {
    return (element && element.textContent ? element.textContent : "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasText(element, text) {
    return cleanText(element).toLowerCase().indexOf(text.toLowerCase()) !== -1;
  }

  function closestClickableByText(startElement, text) {
    var element = startElement;

    while (element && element !== document.documentElement) {
      if (
        element.matches &&
        element.matches('a, button, [role="button"], ._container_1u1e7_1, ._item__trigger_1n03o_21, ._container_z7k0u_1') &&
        hasText(element, text)
      ) {
        return element;
      }

      element = element.parentElement;
    }

    return null;
  }

  function getMatchedKey(target) {
    if (!target || !target.closest) return null;

    if (target.closest('button[title="Смена языка"], button[title="Выбор языка"]')) return "language";

    var cart = target.closest('._container_18ufu_1[role="button"]');
    if (cart && hasText(cart, "К покупке")) return "cart";

    if (target.closest('._container_z7k0u_1') || closestClickableByText(target, "Live-Chat") || closestClickableByText(target, "Live chat")) return "liveChat";

    if (closestClickableByText(target, "Имба тут")) return "imba";
    if (closestClickableByText(target, "Предметы")) return "items";
    if (closestClickableByText(target, "Продажа")) return "sell";
    if (closestClickableByText(target, "Профиль")) return "profile";

    return null;
  }

  function openConfiguredLink(key, event) {
    var url = getUrl(key);
    var config = getConfig();

    if (!url || url === "#") return;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    }

    if (config.openInNewTab) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = url;
  }

  function applyHrefToLinks() {
    var pairs = [
      ["Предметы", "items"],
      ["Продажа", "sell"],
      ["Профиль", "profile"],
      ["Live-Chat", "liveChat"],
      ["Имба тут", "imba"]
    ];

    pairs.forEach(function (pair) {
      var text = pair[0];
      var key = pair[1];
      var url = getUrl(key);
      if (!url || url === "#") return;

      document.querySelectorAll("a, button, [role='button']").forEach(function (element) {
        if (!hasText(element, text)) return;

        element.style.cursor = "pointer";
        if (element.tagName && element.tagName.toLowerCase() === "a") {
          element.setAttribute("href", url);
          element.setAttribute("data-config-link", key);
        }
      });
    });
  }

  document.addEventListener(
    "click",
    function (event) {
      var key = getMatchedKey(event.target);
      if (!key) return;
      openConfiguredLink(key, event);
    },
    true
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHrefToLinks);
  } else {
    applyHrefToLinks();
  }
})();
