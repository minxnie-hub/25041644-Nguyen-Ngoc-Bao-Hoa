import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".page.home-page")) return;
  gsap.registerPlugin(ScrollTrigger);
  const heroImg = document.querySelector(".hero-img img");
  const holder = document.querySelector(".hero-img-holder");
  if (!heroImg || !holder) return;

  const totalImages = 10;
  let currentImageIndex = 7;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    window.setInterval(() => {
      currentImageIndex = currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
      heroImg.src = `${import.meta.env.BASE_URL}images/work-items/work-item-${currentImageIndex}.jpg`;
    }, 1250);
  }

  if (reduceMotion) {
    gsap.set(".hero-img", { yPercent: 0, scale: 1, rotation: 0 });
    return;
  }

  gsap.fromTo(
    ".hero-img",
    { yPercent: -18, scale: 0.86, rotation: -4 },
    {
      yPercent: 0,
      scale: 1,
      rotation: 0,
      ease: "none",
      scrollTrigger: {
        trigger: holder,
        start: "top 92%",
        end: "top 28%",
        scrub: 0.8,
      },
    }
  );
});
