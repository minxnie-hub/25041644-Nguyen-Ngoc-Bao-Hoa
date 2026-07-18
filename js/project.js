import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  const box = document.querySelector(".lightbox");
  const large = box?.querySelector("img");
  const close = box?.querySelector("button");
  const open = (src, alt) => {
    if (!box || !large) return;
    large.src = src;
    large.alt = alt || "Ảnh minh chứng phóng to";
    box.classList.add("open");
    window.__portfolioLenis?.stop();
    document.body.style.overflow = "hidden";
  };
  const hide = () => {
    if (!box) return;
    box.classList.remove("open");
    document.body.style.overflow = "";
    window.__portfolioLenis?.start();
  };
  document.querySelectorAll(".project-figure img").forEach(img => img.addEventListener("click", () => open(img.src, img.alt)));
  close?.addEventListener("click", hide);
  box?.addEventListener("click", event => { if (event.target === box) hide(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") hide(); });

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.from(".project-hero-copy > *", { opacity: 0, y: 34, duration: .7, stagger: .08, ease: "power3.out", delay: .25 });
    gsap.from(".project-hero-image", { opacity: 0, y: 42, rotation: 1.5, scale: .97, duration: .85, ease: "power3.out", delay: .32 });
    document.querySelectorAll(".project-section").forEach(section => {
      gsap.from(section, { opacity: 0, y: 42, duration: .68, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 86%", once: true } });
    });
  }
});
