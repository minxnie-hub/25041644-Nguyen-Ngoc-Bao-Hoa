import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const overlays = document.querySelectorAll(".transition-overlay");
  if (!overlays.length) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canonicalPath = (pathname) => {
    const withoutIndex = pathname.replace(/\/index\.html$/i, "/");
    return withoutIndex.length > 1 ? withoutIndex.replace(/\/+$/, "") : withoutIndex;
  };

  if (reduced) {
    gsap.set(overlays, { scaleY: 0 });
  } else {
    gsap.set(overlays, { scaleY: 1, transformOrigin: "top" });
    gsap.to(overlays, {
      scaleY: 0,
      duration: 0.52,
      stagger: -0.065,
      ease: "power3.inOut",
    });
  }

  const cover = () => new Promise((resolve) => {
    if (reduced) {
      resolve();
      return;
    }
    gsap.killTweensOf(overlays);
    gsap.set(overlays, { scaleY: 0, transformOrigin: "bottom" });
    gsap.to(overlays, {
      scaleY: 1,
      duration: 0.48,
      stagger: 0.06,
      ease: "power3.inOut",
      onComplete: resolve,
    });
  });

  window.__pageTransition = { cover };

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      if (link.closest(".nav-overlay")) return;
      if (event.defaultPrevented) return;

      const raw = link.getAttribute("href");
      if (
        !raw ||
        raw === "#" ||
        link.target === "_blank" ||
        /^(https?:|mailto:|tel:)/i.test(raw)
      ) return;

      const target = new URL(raw, window.location.href);
      const sameOrigin = target.origin === window.location.origin;
      const sameDocument =
        sameOrigin && canonicalPath(target.pathname) === canonicalPath(window.location.pathname);

      if (sameDocument && target.hash) {
        event.preventDefault();
        const element = document.querySelector(target.hash);
        if (!element) return;

        if (window.__portfolioMenu?.isOpen()) {
          await window.__portfolioMenu.close({ restore: false });
        }

        const top = element.getBoundingClientRect().top + window.scrollY - 76;
        if (window.__portfolioLenis) {
          window.__portfolioLenis.scrollTo(top, { duration: 1.05, force: true });
        } else {
          window.scrollTo({ top, behavior: "smooth" });
        }
        history.replaceState(null, "", target.hash);
        return;
      }

      if (sameDocument && !target.hash) return;

      event.preventDefault();
      await cover();
      window.location.assign(target.href);
    });
  });
});
