import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle-btn");
  const overlay = document.querySelector(".nav-overlay");
  if (!button || !overlay) return;

  const openLabel = button.querySelector(".open-label");
  const closeLabel = button.querySelector(".close-label");
  const revealItems = overlay.querySelectorAll(
    ".nav-item, .nav-footer-item-header, .nav-footer-item-copy"
  );

  let isOpen = false;
  let lockedY = 0;
  let activeTimeline = null;

  const canonicalPath = (pathname) => {
    const withoutIndex = pathname.replace(/\/index\.html$/i, "/");
    return withoutIndex.length > 1 ? withoutIndex.replace(/\/+$/, "") : withoutIndex;
  };

  gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
  gsap.set(revealItems, { opacity: 0, y: 30 });
  gsap.set(openLabel, { yPercent: 0 });
  gsap.set(closeLabel, { yPercent: 120 });

  const lockScroll = () => {
    lockedY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("menu-scroll-locked");
    document.body.style.top = `-${lockedY}px`;
  };

  const unlockScroll = (restore = true) => {
    document.body.classList.remove("menu-scroll-locked");
    document.body.style.top = "";
    if (restore) window.scrollTo(0, lockedY);
  };

  const openMenu = () => new Promise((resolve) => {
    if (isOpen) {
      resolve();
      return;
    }

    isOpen = true;
    button.classList.add("menu-open");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Đóng menu");
    lockScroll();

    activeTimeline?.kill();
    activeTimeline = gsap.timeline({
      onComplete: resolve,
    });

    activeTimeline
      .set(overlay, { pointerEvents: "auto" })
      .to(overlay, { autoAlpha: 1, duration: 0.34, ease: "power2.out" }, 0)
      .to(openLabel, { yPercent: -120, duration: 0.28, ease: "power2.out" }, 0)
      .to(closeLabel, { yPercent: 0, duration: 0.28, ease: "power2.out" }, 0)
      .to(
        revealItems,
        { opacity: 1, y: 0, duration: 0.58, stagger: 0.055, ease: "power3.out" },
        0.08
      );
  });

  const closeMenu = ({ restore = true } = {}) => new Promise((resolve) => {
    if (!isOpen) {
      resolve();
      return;
    }

    isOpen = false;
    button.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Mở menu");

    activeTimeline?.kill();
    activeTimeline = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(revealItems, { opacity: 0, y: 30 });
        unlockScroll(restore);
        resolve();
      },
    });

    activeTimeline
      .to(revealItems, { opacity: 0, y: -16, duration: 0.2, stagger: 0.018, ease: "power2.in" }, 0)
      .to(overlay, { autoAlpha: 0, duration: 0.28, ease: "power2.inOut" }, 0.04)
      .to(openLabel, { yPercent: 0, duration: 0.25, ease: "power2.out" }, 0)
      .to(closeLabel, { yPercent: 120, duration: 0.25, ease: "power2.out" }, 0);
  });

  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Handle menu links in capture phase so the global page-transition listener
  // cannot cancel or replace the intended navigation.
  overlay.addEventListener(
    "click",
    async (event) => {
      const link = event.target.closest("a[href]");
      if (!link) {
        if (event.target === overlay) closeMenu();
        return;
      }

      const rawHref = link.getAttribute("href");
      if (!rawHref) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const targetUrl = new URL(rawHref, window.location.href);
      const sameOrigin = targetUrl.origin === window.location.origin;
      const sameDocument =
        sameOrigin && canonicalPath(targetUrl.pathname) === canonicalPath(window.location.pathname);

      if (sameDocument && targetUrl.hash) {
        const target = document.querySelector(targetUrl.hash);
        await closeMenu({ restore: false });

        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 76;
          if (window.__portfolioLenis) {
            window.__portfolioLenis.scrollTo(top, { duration: 1.05, force: true });
          } else {
            window.scrollTo({ top, behavior: "smooth" });
          }
          history.replaceState(null, "", targetUrl.hash);
        } else {
          window.location.href = targetUrl.href;
        }
        return;
      }

      if (sameDocument && !targetUrl.hash) {
        await closeMenu({ restore: false });
        if (window.__portfolioLenis) {
          window.__portfolioLenis.scrollTo(0, { duration: 1, force: true });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        history.replaceState(null, "", targetUrl.pathname);
        return;
      }

      await closeMenu({ restore: false });
      if (window.__pageTransition?.cover) {
        await window.__pageTransition.cover();
      }
      window.location.assign(targetUrl.href);
    },
    true
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeMenu();
  });

  window.__portfolioMenu = {
    open: openMenu,
    close: closeMenu,
    isOpen: () => isOpen,
  };
});
