import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".page.home-page")) return;
  gsap.registerPlugin(ScrollTrigger);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroImage = document.querySelector(".hero-img img");
  const heroCard = document.querySelector(".hero-img");
  const holder = document.querySelector(".hero-img-holder");

  if (reduced) {
    gsap.set([".hero-kicker", ".hero-stamp", ".hero-header h1", ".hero-footer"], { opacity: 1, clearProps: "transform" });
    gsap.set(heroCard, { opacity: 1, y: 0, scale: 1, rotation: 0 });
    return;
  }

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".hero-kicker", { opacity: 0, x: -26, duration: .7 }, .14)
    .from(".hero-stamp", { opacity: 0, scale: .72, rotation: -12, duration: .65 }, .2)
    .from(".hero-header-1 h1", { opacity: 0, yPercent: 80, rotation: 2, duration: .95 }, .16)
    .from(".hero-header-2 h1", { opacity: 0, yPercent: 80, rotation: -2, duration: .95 }, .27)
    .from(".hero-footer", { opacity: 0, y: 18, duration: .58 }, .62);

  if (heroCard && holder) {
    gsap.fromTo(heroCard,
      { y: -70, scale: .84, rotation: -6, opacity: .25 },
      {
        y: 0, scale: 1, rotation: 2, opacity: 1, ease: "none",
        scrollTrigger: { trigger: holder, start: "top 90%", end: "center 50%", scrub: .75 },
      }
    );
    gsap.to(heroCard, {
      y: 36, rotation: -2, ease: "none",
      scrollTrigger: { trigger: holder, start: "center 50%", end: "bottom 15%", scrub: .75 },
    });
  }

  if (heroImage) {
    const images = [7, 1, 3, 4, 5, 6].map(n => `${import.meta.env.BASE_URL}images/work-items/work-item-${n}.jpg`);
    let index = 0;
    let timer = null;
    const change = () => {
      if (document.hidden || !holder || holder.getBoundingClientRect().bottom < 0 || holder.getBoundingClientRect().top > innerHeight) return;
      gsap.to(heroImage, { opacity: .15, duration: .22, onComplete: () => {
        index = (index + 1) % images.length;
        heroImage.src = images[index];
        gsap.to(heroImage, { opacity: 1, duration: .35 });
      }});
    };
    timer = setInterval(change, 3800);
    window.addEventListener("pagehide", () => clearInterval(timer), { once: true });
  }
});
