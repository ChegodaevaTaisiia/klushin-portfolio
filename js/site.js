/* Фёдор Клушин — портфолио. Прогрессивное улучшение. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- live clock, Europe/Moscow ---- */
  var clock = document.getElementById("clock");
  if (clock) {
    var tick = function () {
      try {
        var t = new Intl.DateTimeFormat("ru-RU", {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          timeZone: "Europe/Moscow", hour12: false
        }).format(new Date());
        clock.textContent = "СПб " + t;
      } catch (e) {
        clock.textContent = "";
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- reveal + wordmark ---- */
  if (!reduce) {
    document.body.classList.add("js-anim");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var lines = document.querySelectorAll(".wordmark .line > span");
        lines.forEach(function (el, i) {
          el.style.transition = "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) " + (0.08 + i * 0.11) + "s";
          el.style.transform = "translateY(0)";
        });
      });
    });

    var pending = [].slice.call(document.querySelectorAll(".reveal"));
    var reveal = function (el) {
      el.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.opacity = "1";
      el.style.transform = "none";
    };
    var sweep = function () {
      var h = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < h * 0.92 && r.bottom > 0) { reveal(el); return false; }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener("scroll", sweep);
        window.removeEventListener("resize", sweep);
      }
    };
    sweep();
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) sweep();
    });
    /* ultimate safety net — never leave content hidden */
    setTimeout(function () { pending.forEach(reveal); pending = []; }, 1500);
  }

  /* ---- cursor-follow preview (home work list) ---- */
  var preview = document.getElementById("preview");
  var rows = document.querySelectorAll("[data-preview] .row");
  if (preview && rows.length && fine) {
    var figures = preview.querySelectorAll(".preview__fig");
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty, sc = 0.92, active = false, raf = null;

    var loop = function () {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      sc += ((active ? 1 : 0.92) - sc) * 0.16;
      preview.style.transform =
        "translate(" + cx + "px," + cy + "px) translate(-50%,-50%) scale(" + sc.toFixed(3) + ") rotate(-3deg)";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) loop();
    });

    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        var idx = row.getAttribute("data-thumb");
        figures.forEach(function (f) {
          f.classList.toggle("is-active", f.getAttribute("data-thumb") === idx);
        });
        active = true;
        preview.classList.add("is-on");
      });
      row.addEventListener("mouseleave", function () {
        active = false;
        preview.classList.remove("is-on");
      });
    });
  }

  /* ---- lightbox (case pages) ---- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = document.getElementById("lightbox-img");
    var open = function (src) {
      lbImg.src = src;
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    var close = function () {
      lb.classList.remove("is-open");
      lbImg.src = "";
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-full]").forEach(function (b) {
      b.addEventListener("click", function () { open(b.getAttribute("data-full")); });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }
})();
