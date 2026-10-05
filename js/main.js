document.addEventListener("DOMContentLoaded", function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;


  /* ---------- Photo placeholders ----------
     <img src="assets/volunteers.jpg" data-ph="Volunteers working in the field">
     If the file doesn't exist yet, a labeled placeholder is drawn instead.
     Drop a photo with that exact file name into assets/ and it shows up automatically. */
  var esc = function (t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var placeholderSVG = function (img) {
    var w = Math.round(img.clientWidth) || 800;
    var h = Math.round(img.clientHeight) || 600;
    var file = (img.getAttribute("src") || "").split("/").pop();
    var label = img.getAttribute("data-ph");
    var right = img.getAttribute("data-ph-align") === "right" && w / h > 1.2;
    var cx = right ? w * 0.74 : w / 2;
    var cy = right ? h * 0.42 : h / 2;
    var fs = Math.max(13, Math.min(22, w / 26));
    var pad = Math.max(10, Math.min(w, h) * 0.04);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '">' +
      '<defs><pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">' +
      '<rect width="28" height="28" fill="#E6F0DA"/><rect width="14" height="28" fill="#DCEBC8"/></pattern></defs>' +
      '<rect width="100%" height="100%" fill="url(#p)"/>' +
      '<rect x="' + pad + '" y="' + pad + '" width="' + (w - pad * 2) + '" height="' + (h - pad * 2) + '" rx="14" fill="none" stroke="#2F5D3A" stroke-width="2.5" stroke-dasharray="10 8" opacity=".55"/>' +
      '<g transform="translate(' + cx + "," + (cy - fs * 2.6) + ')" fill="none" stroke="#2F5D3A" stroke-width="2.4" stroke-linejoin="round">' +
      '<path d="M-22 -8h9l5-7h16l5 7h9v26h-44z"/><circle cx="0" cy="5" r="8"/></g>' +
      '<text x="' + cx + '" y="' + (cy + fs * 0.2) + '" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="' + fs * 1.15 + '" fill="#1F4029">Photo coming soon</text>' +
      '<text x="' + cx + '" y="' + (cy + fs * 1.6) + '" text-anchor="middle" font-family="sans-serif" font-size="' + fs * 0.8 + '" fill="#2F5D3A">' + esc(label) + '</text>' +
      '<text x="' + cx + '" y="' + (cy + fs * 2.9) + '" text-anchor="middle" font-family="monospace" font-size="' + fs * 0.7 + '" fill="#B03F1C">assets/' + esc(file) + "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };
  var showPlaceholder = function (img) {
    if (img.classList.contains("is-placeholder")) return;
    img.classList.add("is-placeholder");
    img.src = placeholderSVG(img);
  };
  document.querySelectorAll("img[data-ph]").forEach(function (img) {
    img.addEventListener("error", function () { showPlaceholder(img); });
    if (img.complete && img.naturalWidth === 0) showPlaceholder(img);
  });
  // small round photos (e.g. the director) just fall back to initials
  document.querySelectorAll("img[data-ph-avatar]").forEach(function (img) {
    var fail = function () { img.parentNode.classList.add("no-photo"); img.remove(); };
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.setAttribute("aria-expanded", "false");
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------- Header shadow, progress bar, back-to-top ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.createElement("div");
  progress.className = "progress";
  document.body.appendChild(progress);

  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = "&uarr;";
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  document.body.appendChild(toTop);

  var onScroll = function () {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("scrolled", y > 20);
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    toTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealSelectors = [
    ".section-head", ".card", ".stat", ".event-card", ".blog-post", ".g-item",
    ".split > *", ".timeline li", ".faq details", ".person-card", ".next-up",
    ".photo-band", ".form-card", ".map-frame", "video.scroll-video", ".cta-band .wrap > *"
  ].join(",");
  var revealEls = document.querySelectorAll(revealSelectors);
  revealEls.forEach(function (el) {
    el.classList.add("reveal");
    // stagger siblings in the same grid
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.matches(revealSelectors);
    });
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--delay", Math.min(i, 6) * 0.08 + "s");
  });
  if (hasIO && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up numbers: <span data-count="2003"> ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var runCount = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    // years count up from a nearby value instead of from zero
    var start = target > 1000 ? target - 40 : 0;
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var t0 = null;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1400, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (hasIO) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObs.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  /* ---------- Helpers for dates ---------- */
  var DAY_MS = 86400000;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var daysUntil = function (date) {
    var a = new Date(); a.setHours(0, 0, 0, 0);
    var b = new Date(date); b.setHours(0, 0, 0, 0);
    return Math.round((b - a) / DAY_MS);
  };
  var relLabel = function (n) {
    if (n === 0) return "Today!";
    if (n === 1) return "Tomorrow";
    return "In " + n + " days";
  };

  /* ---------- Next weekly Get Dirty session (Thursdays 4–6 PM) ---------- */
  document.querySelectorAll("[data-next-weekly]").forEach(function (box) {
    var weekday = parseInt(box.getAttribute("data-next-weekly"), 10); // 0=Sun … 4=Thu
    var endHour = parseInt(box.getAttribute("data-end-hour") || "18", 10);
    var now = new Date();
    var next = new Date(now);
    next.setHours(0, 0, 0, 0);
    var diff = (weekday - now.getDay() + 7) % 7;
    if (diff === 0 && now.getHours() >= endHour) diff = 7;
    next.setDate(next.getDate() + diff);
    var whenEl = box.querySelector(".when");
    var cdEl = box.querySelector(".countdown");
    if (whenEl) whenEl.textContent = DAYS[next.getDay()] + ", " + MONTHS[next.getMonth()] + " " + next.getDate();
    if (cdEl) cdEl.textContent = relLabel(diff);
  });

  /* ---------- Event cards: flag past / next ---------- */
  var events = Array.prototype.slice.call(document.querySelectorAll(".event-card[data-date]"));
  var nextFound = false;
  events
    .sort(function (a, b) { return new Date(a.dataset.date) - new Date(b.dataset.date); })
    .forEach(function (card) {
      var n = daysUntil(card.dataset.date + "T12:00:00");
      var flag = document.createElement("span");
      flag.className = "event-flag";
      if (n < 0) {
        card.classList.add("is-past");
        flag.textContent = "Past";
      } else if (!nextFound) {
        nextFound = true;
        card.classList.add("is-next");
        flag.textContent = "Up next · " + relLabel(n);
      } else {
        flag.textContent = relLabel(n);
      }
      card.appendChild(flag);
    });

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      document.querySelectorAll(".gallery .g-item").forEach(function (item) {
        var show = f === "all" || item.getAttribute("data-type") === f;
        item.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---------- Lightbox for gallery tiles ---------- */
  var items = document.querySelectorAll(".g-item");
  if (items.length && window.HTMLDialogElement) {
    var lb = document.createElement("dialog");
    lb.className = "lightbox";
    lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML =
      '<div class="lb-stage"></div>' +
      '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="lb-btn lb-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);
    var stage = lb.querySelector(".lb-stage");
    var current = 0;
    var visibleItems = function () {
      return Array.prototype.filter.call(items, function (i) { return !i.classList.contains("hidden"); });
    };

    var show = function (idx) {
      var list = visibleItems();
      if (!list.length) return;
      current = (idx + list.length) % list.length;
      var item = list[current];
      var src = item.getAttribute("data-src");
      var cap = item.getAttribute("data-caption") || "";
      stage.innerHTML = "";
      var media;
      if (item.getAttribute("data-type") === "video") {
        media = document.createElement("video");
        media.src = src;
        media.controls = true;
        media.autoplay = true;
        media.playsInline = true;
      } else {
        media = document.createElement("img");
        media.src = src;
        media.alt = cap;
      }
      stage.appendChild(media);
      if (cap) {
        var p = document.createElement("p");
        p.className = "lb-cap";
        p.textContent = cap;
        stage.appendChild(p);
      }
    };

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        show(visibleItems().indexOf(item));
        lb.showModal();
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    lb.addEventListener("close", function () { stage.innerHTML = ""; });

    // swipe on touch screens
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- Forms: friendly inline submit ---------- */
  document.querySelectorAll("form[data-ajax]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    var say = function (msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status show " + (ok ? "ok" : "err");
      status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        say("This form isn't connected yet. For now, please email soilstewards@uidaho.edu and we'll get back to you!", false);
        return;
      }
      var label = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (!res.ok) throw new Error();
        form.reset();
        say(form.getAttribute("data-success") || "Thanks! Your message is on its way.", true);
      }).catch(function () {
        say("Something went wrong sending that. Please try again, or email soilstewards@uidaho.edu.", false);
      }).then(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      });
    });
  });

  /* ---------- Copy-to-clipboard buttons ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = old; btn.classList.remove("copied"); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
    });
  });

  /* ---------- Scroll-triggered video playback ---------- */
  // Videos with class "scroll-video" play as they scroll into view and pause when they leave.
  var scrollVideos = document.querySelectorAll("video.scroll-video");
  if (scrollVideos.length && hasIO) {
    var videoObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(function () { /* autoplay blocked; user can hit play */ });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });
    scrollVideos.forEach(function (video) { videoObs.observe(video); });
  }

  /* ---------- Dropdown submenus (tap to expand on mobile) ---------- */
  document.querySelectorAll(".has-sub").forEach(function (li) {
    var btn = li.querySelector(".sub-toggle");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = li.classList.toggle("sub-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- Home slider ---------- */
  document.querySelectorAll(".slider").forEach(function (slider) {
    var slides = slider.querySelectorAll(".slide");
    if (slides.length < 2) return;
    var dotsWrap = slider.querySelector(".slider-dots");
    var index = 0;
    var timer = null;
    var dots = [];
    slides.forEach(function (s, i) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", function () { go(i); restart(); });
      if (dotsWrap) dotsWrap.appendChild(d);
      dots.push(d);
    });
    var go = function (i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) {
        s.classList.toggle("active", j === index);
        s.setAttribute("aria-hidden", j === index ? "false" : "true");
      });
      dots.forEach(function (d, j) { d.classList.toggle("active", j === index); });
    };
    var restart = function () {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { go(index + 1); }, 6500);
    };
    var prev = slider.querySelector(".slider-arrow.prev");
    var next = slider.querySelector(".slider-arrow.next");
    if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(index + 1); restart(); });
    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);
    slider.addEventListener("focusin", function () { clearInterval(timer); });
    var sx = null;
    slider.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      sx = null;
    });
    go(0);
    restart();
  });

  /* ---------- Featured video: hide title bar while playing ---------- */
  document.querySelectorAll(".feature-video").forEach(function (box) {
    var v = box.querySelector("video");
    if (!v) return;
    v.addEventListener("play", function () { box.classList.add("playing"); });
    v.addEventListener("pause", function () { box.classList.remove("playing"); });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
