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
  const links = overlay.querySelectorAll("a[href]");

  let isOpen = false;
  let timeline = null;

  const setScrollLock = (locked) => {
    document.documentElement.classList.toggle("menu-scroll-locked", locked);
    document.body.classList.toggle("menu-scroll-locked", locked);
  };

  gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
  gsap.set(revealItems, { opacity: 0, y: 28 });
  gsap.set(openLabel, { yPercent: 0 });
  gsap.set(closeLabel, { yPercent: 125 });

  const openMenu = () => new Promise((resolve) => {
    if (isOpen) return resolve();
    isOpen = true;
    button.classList.add("menu-open");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Đóng menu");
    setScrollLock(true);

    timeline?.kill();
    timeline = gsap.timeline({ onComplete: resolve });
    timeline
      .set(overlay, { pointerEvents: "auto" })
      .to(overlay, { autoAlpha: 1, duration: 0.32, ease: "power2.out" }, 0)
      .to(openLabel, { yPercent: -125, duration: 0.26, ease: "power2.out" }, 0)
      .to(closeLabel, { yPercent: 0, duration: 0.26, ease: "power2.out" }, 0)
      .to(revealItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.045,
        ease: "power3.out",
      }, 0.06);
  });

  const closeMenu = () => new Promise((resolve) => {
    if (!isOpen) {
      setScrollLock(false);
      return resolve();
    }

    isOpen = false;
    button.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Mở menu");

    timeline?.kill();
    timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(revealItems, { opacity: 0, y: 28 });
        setScrollLock(false);
        resolve();
      },
    });
    timeline
      .to(revealItems, {
        opacity: 0,
        y: -14,
        duration: 0.18,
        stagger: 0.014,
        ease: "power2.in",
      }, 0)
      .to(overlay, { autoAlpha: 0, duration: 0.25, ease: "power2.inOut" }, 0.03)
      .to(openLabel, { yPercent: 0, duration: 0.23, ease: "power2.out" }, 0)
      .to(closeLabel, { yPercent: 125, duration: 0.23, ease: "power2.out" }, 0);
  });

  const scrollToTarget = (hash, updateHistory = true) => {
    const target = hash === "#top" ? document.documentElement : document.querySelector(hash);
    if (!target) return false;

    const offset = hash === "#top" ? 0 : -78;
    requestAnimationFrame(() => {
      if (window.__portfolioLenis) {
        window.__portfolioLenis.scrollTo(target, {
          offset,
          duration: 1.05,
          force: true,
        });
      } else if (hash === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
      if (updateHistory) history.replaceState(null, "", hash);
    });
    return true;
  };

  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  links.forEach((link) => {
    link.addEventListener("click", async (event) => {
      const rawHref = link.getAttribute("href");
      if (!rawHref) return;

      const targetUrl = new URL(rawHref, window.location.href);
      const currentUrl = new URL(window.location.href);
      const normalize = (path) => path.replace(/\/index\.html$/i, "/").replace(/\/$/, "") || "/";
      const sameDocument =
        targetUrl.origin === currentUrl.origin &&
        normalize(targetUrl.pathname) === normalize(currentUrl.pathname);

      if (sameDocument && targetUrl.hash) {
        event.preventDefault();
        event.stopPropagation();
        await closeMenu();
        scrollToTarget(targetUrl.hash);
        return;
      }

      if (sameDocument && !targetUrl.hash) {
        event.preventDefault();
        event.stopPropagation();
        await closeMenu();
        scrollToTarget("#top");
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      await closeMenu();
      if (window.__pageTransition?.cover) await window.__pageTransition.cover();
      window.location.href = targetUrl.href;
    });
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeMenu();
  });

  // When arriving from a project/contact page with a hash, move to the intended section.
  if (window.location.hash) {
    window.setTimeout(() => scrollToTarget(window.location.hash, false), 550);
  }

  window.__portfolioMenu = {
    open: openMenu,
    close: closeMenu,
    isOpen: () => isOpen,
  };
});
