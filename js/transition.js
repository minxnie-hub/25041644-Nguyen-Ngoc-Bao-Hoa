import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const overlays = document.querySelectorAll(".transition-overlay");
  if (!overlays.length) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    gsap.set(overlays, { scaleY: 0 });
    return;
  }

  gsap.set(overlays, { scaleY: 1, transformOrigin: "top" });
  gsap.to(overlays, { scaleY: 0, duration: .52, stagger: -.065, ease: "power3.inOut" });

  const cover = () => new Promise(resolve => {
    gsap.killTweensOf(overlays);
    gsap.set(overlays, { scaleY: 0, transformOrigin: "bottom" });
    gsap.to(overlays, { scaleY: 1, duration: .48, stagger: .06, ease: "power3.inOut", onComplete: resolve });
  });

  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", async event => {
      if (event.defaultPrevented) return;
      const raw = link.getAttribute("href");
      if (!raw || raw === "#" || link.target === "_blank" || /^(https?:|mailto:|tel:)/i.test(raw)) return;
      const target = new URL(raw, location.href);
      const sameDocument = target.origin === location.origin && target.pathname === location.pathname;
      if (sameDocument && target.hash) {
        event.preventDefault();
        const element = document.querySelector(target.hash);
        if (!element) return;
        if (window.__portfolioMenu?.isOpen()) await window.__portfolioMenu.close({ restore: false });
        const top = element.getBoundingClientRect().top + window.scrollY - 78;
        if (window.__portfolioLenis) window.__portfolioLenis.scrollTo(top, { duration: 1.05 });
        else window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", target.hash);
        return;
      }
      if (sameDocument && !target.hash) return;
      event.preventDefault();
      await cover();
      location.href = target.href;
    });
  });
});
