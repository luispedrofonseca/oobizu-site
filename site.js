// OoBiZu site behaviour: scroll reveals and reduced-motion handling.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Respect reduced motion: hold looping decorative videos on their poster frame
  if (reduce) {
    document.querySelectorAll("video[data-decorative]").forEach(function (v) {
      v.removeAttribute("autoplay");
      v.pause();
    });
  }

  // Fade sections in once they reach the viewport. Anything already scrolled
  // past (a fast fling, a jump to an anchor) is revealed too, so nothing stays hidden.
  var pending = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce) {
    pending.forEach(function (el) {
      el.classList.add("in");
    });
    return;
  }

  var ticking = false;
  function check() {
    ticking = false;
    var limit = window.innerHeight * 0.92;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add("in");
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(check);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  check();
})();
