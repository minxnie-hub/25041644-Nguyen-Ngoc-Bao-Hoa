import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".page.home-page")) return;
  gsap.registerPlugin(ScrollTrigger);
  const heroImg = document.querySelector(".hero-img img");
  if (!heroImg) return;

  const totalImages = 10;
  let currentImageIndex = 7;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    window.setInterval(() => {
      currentImageIndex = currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
      heroImg.src = `${import.meta.env.BASE_URL}images/work-items/work-item-${currentImageIndex}.jpg`;
    }, 850);
  }

  let trigger;
  const init = () => {
    if (trigger) trigger.kill();
    trigger = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(".hero-img", { y: `${-110 + 110 * p}%`, scale: .25 + .75 * p, rotation: -15 + 15 * p });
      },
    });
  };
  init();
  window.addEventListener("resize", init);
});
