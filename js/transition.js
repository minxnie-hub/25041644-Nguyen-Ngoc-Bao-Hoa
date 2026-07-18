import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const overlays = document.querySelectorAll(".transition-overlay");
  if (!overlays.length) return;

  gsap.set(overlays, { scaleY: 1, transformOrigin: "top" });
  gsap.to(overlays, { scaleY: 0, duration: 0.55, stagger: -0.08, ease: "power2.inOut" });

  const coverPage = () => new Promise((resolve) => {
    gsap.set(overlays, { scaleY: 0, transformOrigin: "bottom" });
    gsap.to(overlays, { scaleY: 1, duration: 0.55, stagger: 0.08, ease: "power2.inOut", onComplete: resolve });
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || link.target === "_blank") return;
      if (/^(https?:|mailto:|tel:)/i.test(href)) return;

      const target = new URL(href, window.location.href);
      const sameDocument = target.pathname === window.location.pathname;
      if (sameDocument && target.hash) {
        event.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        const menuButton = document.querySelector(".menu-toggle-btn.menu-open");
        if (menuButton) menuButton.click();
        return;
      }
      if (sameDocument && !target.hash) return;

      event.preventDefault();
      coverPage().then(() => { window.location.href = target.href; });
    });
  });
});
