import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle-btn");
  const overlay = document.querySelector(".nav-overlay");
  if (!button || !overlay) return;

  const openLabel = button.querySelector(".open-label");
  const closeLabel = button.querySelector(".close-label");
  const revealItems = overlay.querySelectorAll(".nav-item, .nav-footer-item-header, .nav-footer-item-copy");
  const links = overlay.querySelectorAll("a[href]");
  let open = false;
  let lockedY = 0;
  let timeline = null;

  gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
  gsap.set(revealItems, { opacity: 0, y: 28 });
  gsap.set(closeLabel, { yPercent: 110 });

  const lockScroll = () => {
    lockedY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedY}px`;
    document.body.style.width = "100%";
  };

  const unlockScroll = (restore = true) => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    if (restore) window.scrollTo(0, lockedY);
  };

  const openMenu = () => {
    if (open) return Promise.resolve();
    open = true;
    button.classList.add("menu-open");
    button.setAttribute("aria-expanded", "true");
    lockScroll();
    timeline?.kill();
    timeline = gsap.timeline();
    timeline
      .set(overlay, { pointerEvents: "auto" })
      .to(overlay, { autoAlpha: 1, duration: .32, ease: "power2.out" }, 0)
      .to(openLabel, { yPercent: -110, duration: .28, ease: "power2.out" }, 0)
      .to(closeLabel, { yPercent: 0, duration: .28, ease: "power2.out" }, 0)
      .to(revealItems, { opacity: 1, y: 0, duration: .58, stagger: .055, ease: "power3.out" }, .08);
    return new Promise(resolve => timeline.eventCallback("onComplete", resolve));
  };

  const closeMenu = ({ restore = true } = {}) => {
    if (!open) return Promise.resolve();
    open = false;
    button.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
    timeline?.kill();
    timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: "none" });
        gsap.set(revealItems, { opacity: 0, y: 28 });
        unlockScroll(restore);
      },
    });
    timeline
      .to(revealItems, { opacity: 0, y: -18, duration: .22, stagger: .02, ease: "power2.in" }, 0)
      .to(overlay, { autoAlpha: 0, duration: .28, ease: "power2.inOut" }, .06)
      .to(openLabel, { yPercent: 0, duration: .25 }, 0)
      .to(closeLabel, { yPercent: 110, duration: .25 }, 0);
    return new Promise(resolve => timeline.eventCallback("onComplete", resolve));
  };

  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => open ? closeMenu() : openMenu());

  links.forEach(link => {
    link.addEventListener("click", async event => {
      if (event.defaultPrevented) return;
      const raw = link.getAttribute("href");
      if (!raw) return;
      const targetUrl = new URL(raw, window.location.href);
      const sameDocument = targetUrl.origin === location.origin && targetUrl.pathname === location.pathname;
      if (sameDocument && targetUrl.hash) {
        event.preventDefault();
        const target = document.querySelector(targetUrl.hash);
        await closeMenu({ restore: false });
        const top = target ? target.getBoundingClientRect().top + window.scrollY - 78 : 0;
        if (window.__portfolioLenis && target) {
          window.__portfolioLenis.scrollTo(top, { duration: 1.05 });
        } else {
          window.scrollTo({ top, behavior: "smooth" });
        }
        history.replaceState(null, "", targetUrl.hash);
      }
    });
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && open) closeMenu();
  });

  window.__portfolioMenu = { open: openMenu, close: closeMenu, isOpen: () => open };
});
