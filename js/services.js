import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".page.home-page")) return;
  gsap.registerPlugin(ScrollTrigger);
  const cards = gsap.utils.toArray(".service-card");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { gsap.set(cards, { opacity: 1, clearProps: "transform" }); return; }

  cards.forEach((card, index) => {
    const inner = card.querySelector(".service-card-inner");
    const image = card.querySelector(".service-card-img img");
    gsap.fromTo(inner,
      { opacity: 0, y: 72, scale: .965, rotation: index % 2 ? .65 : -.65 },
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: .82, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 84%", once: true } }
    );
    if (image && innerWidth > 1000) {
      gsap.fromTo(image, { scale: 1.08, yPercent: -3 }, {
        scale: 1, yPercent: 3, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: .8 },
      });
    }
  });
});
