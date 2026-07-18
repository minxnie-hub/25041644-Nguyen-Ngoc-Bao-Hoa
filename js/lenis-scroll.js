import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(max-width: 899px)").matches) {
    window.__portfolioLenis = null;
    return;
  }

  const lenis = new Lenis({
    lerp: .11,
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: .92,
    touchMultiplier: 1,
  });
  window.__portfolioLenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  const tick = time => lenis.raf(time * 1000);
  gsap.ticker.add(tick);

  window.addEventListener("pagehide", () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  }, { once: true });
});
