import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".page.home-page")) return;
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = gsap.utils.toArray(".service-card");
  if (reduceMotion) {
    gsap.set(cards, { opacity: 1, y: 0 });
    return;
  }

  cards.forEach((card) => {
    gsap.fromTo(card, { opacity: 0, y: 42 }, {
      opacity: 1,
      y: 0,
      duration: .75,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        once: true,
      },
    });
  });
});
