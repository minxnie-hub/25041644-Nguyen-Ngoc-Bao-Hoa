import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".page.home-page")) return;
  gsap.registerPlugin(ScrollTrigger);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 1001px)", () => {
    gsap.from(".about-hero-header h1", {
      opacity: 0, y: 44, stagger: .1, duration: .72, ease: "power3.out",
      scrollTrigger: { trigger: ".about-hero", start: "top 72%", once: true },
    });
    gsap.from(".about-hero-bio", {
      opacity: 0, y: 30, duration: .7, ease: "power2.out",
      scrollTrigger: { trigger: ".about-hero", start: "top 64%", once: true },
    });
    gsap.fromTo(".about-hero-portrait",
      { opacity: 0, y: 55, rotation: 7, scale: .94 },
      { opacity: 1, y: 0, rotation: 2, scale: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".about-hero", start: "top 72%", once: true } }
    );
    gsap.to(".about-hero-portrait", {
      y: -18, rotation: -2, ease: "none",
      scrollTrigger: { trigger: ".about-hero", start: "top 20%", end: "bottom 20%", scrub: .8 },
    });

    const tagMoves = [
      ["#tag-1", -52, -8], ["#tag-2", -32, 7], ["#tag-3", -58, 8], ["#tag-4", -38, -7], ["#tag-5", -45, 5],
    ];
    tagMoves.forEach(([selector, y, rotation]) => {
      if (!document.querySelector(selector)) return;
      gsap.to(selector, {
        y, rotation, ease: "none",
        scrollTrigger: { trigger: ".about-copy", start: "top 85%", end: "bottom 20%", scrub: .9 },
      });
    });
  });

  gsap.from(".about-copy-content", {
    opacity: 0, y: 48, scale: .97, duration: .75, ease: "power3.out",
    scrollTrigger: { trigger: ".about-copy", start: "top 78%", once: true },
  });

  gsap.from(".stats-item-1, .stats-item-2, .stats-item-3", {
    opacity: 0, y: 54, scale: .96, stagger: .11, duration: .72, ease: "power3.out",
    scrollTrigger: { trigger: ".stats", start: "top 78%", once: true },
  });

  gsap.from(".project-archive-header > *", {
    opacity: 0, y: 34, stagger: .1, duration: .65, ease: "power2.out",
    scrollTrigger: { trigger: ".project-archive", start: "top 78%", once: true },
  });
  gsap.from(".home-project-card", {
    opacity: 0, y: 54, rotation: index => index % 2 ? .8 : -.8, stagger: .08, duration: .68, ease: "power3.out",
    scrollTrigger: { trigger: ".project-card-grid", start: "top 82%", once: true },
  });

  gsap.from(".services-header-content > *", {
    opacity: 0, y: 34, stagger: .09, duration: .65, ease: "power2.out",
    scrollTrigger: { trigger: ".services-header", start: "top 72%", once: true },
  });

  gsap.from(".summary-card", {
    opacity: 0, y: 40, stagger: .12, duration: .68, ease: "power2.out",
    scrollTrigger: { trigger: ".summary-section", start: "top 75%", once: true },
  });
});
