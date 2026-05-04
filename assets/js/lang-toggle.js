// Language Toggle: Arabic / English
// Stores preference in localStorage

(function () {
  "use strict";

  var LANG_KEY = "preferred-lang";

  function setLanguage(lang) {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem(LANG_KEY, lang);
    var btn = document.getElementById("lang-label");
    if (btn) {
      btn.textContent = lang === "ar" ? "EN" : "عربي";
    }
    // Update html dir attribute
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }

  function toggleLanguage() {
    var current = document.documentElement.getAttribute("lang") || "en";
    setLanguage(current === "ar" ? "en" : "ar");
  }

  // Expose globally
  window.toggleLanguage = toggleLanguage;

  // Apply saved preference on load
  document.addEventListener("DOMContentLoaded", function () {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved && saved !== "en") {
      setLanguage(saved);
    }
    // Sync button label
    var current = document.documentElement.getAttribute("lang") || "en";
    var btn = document.getElementById("lang-label");
    if (btn) {
      btn.textContent = current === "ar" ? "EN" : "عربي";
    }
  });
})();
