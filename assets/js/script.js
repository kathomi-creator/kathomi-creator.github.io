/* ==========================================================================
   Stine Cakes & Pastries Academy — site behaviour
   Mobile menu, FAQ accordion, registration -> WhatsApp handoff,
   sticky-nav active highlighting, scroll reveal, back-to-top.
   ========================================================================== */
(function () {
  "use strict";

  // WhatsApp number in full international format (no +, no spaces).
  var WHATSAPP_NUMBER = "254715274526";

  /* ---------- Mobile menu ---------- */
  var menu = document.getElementById("menu");
  var burger = document.querySelector(".burger");

  function toggleMenu() {
    var open = menu.classList.toggle("show");
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function closeMenu() {
    menu.classList.remove("show");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", toggleMenu);
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  // Close menu on Escape for keyboard users
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- FAQ accordion (accessible) ---------- */
  document.querySelectorAll(".acc button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- Registration form -> WhatsApp ---------- */
  var form = document.getElementById("regform");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = {};
      new FormData(form).forEach(function (v, k) { d[k] = v; });
      var msg =
        "Hello Stine Cakes & Pastries Academy! I'd like to register:%0A" +
        "%0AName: " + encodeURIComponent(d.name || "") +
        "%0AEmail: " + encodeURIComponent(d.email || "") +
        "%0APhone: " + encodeURIComponent(d.phone || "") +
        "%0AClass: " + encodeURIComponent(d["class"] || "") +
        "%0APreferred start: " + encodeURIComponent(d.start || "") +
        "%0ASkill level: " + encodeURIComponent(d.level || "") +
        (d.message ? ("%0AMessage: " + encodeURIComponent(d.message)) : "");
      var link = document.getElementById("walink");
      link.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg;
      form.style.display = "none";
      document.getElementById("success").style.display = "block";
    });
  }

  /* ---------- Sticky-nav active highlighting ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.navlinks a[href^="#"]:not(.btn)')
  );
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = "#" + entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated statistics ---------- */
  var stats = document.querySelectorAll(".stat .num[data-count]");
  if ("IntersectionObserver" in window && stats.length) {
    var statObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1400, 1);
          el.textContent = Math.floor(p * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (s) { statObs.observe(s); });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
