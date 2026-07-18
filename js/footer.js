document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".page.contact-page") || document.querySelector(".page.project-page")) return;
  const footer = document.querySelector("footer");
  const container = document.querySelector(".explosion-container");
  if (!footer || !container) return;
  const imagePaths = Array.from({ length: 10 }, (_, i) => `${import.meta.env.BASE_URL}images/work-items/work-item-${i + 1}.jpg`);
  let exploded = false;
  const create = () => {
    container.innerHTML = "";
    imagePaths.forEach((path) => {
      const img = document.createElement("img");
      img.src = path;
      img.alt = "";
      img.className = "explosion-particle-img";
      img.style.width = "145px";
      container.appendChild(img);
    });
  };
  class Particle {
    constructor(element) { this.element = element; this.x = 0; this.y = 0; this.vx = (Math.random() - .5) * 20; this.vy = -15 - Math.random() * 10; this.r = 0; this.rv = (Math.random() - .5) * 10; }
    update() { this.vy += .25; this.vx *= .99; this.vy *= .99; this.rv *= .99; this.x += this.vx; this.y += this.vy; this.r += this.rv; this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.r}deg)`; }
  }
  const explode = () => {
    if (exploded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    exploded = true; create();
    const particles = [...document.querySelectorAll(".explosion-particle-img")].map((el) => new Particle(el));
    let id;
    const frame = () => { particles.forEach((p) => p.update()); id = requestAnimationFrame(frame); if (particles.every((p) => p.y > container.offsetHeight / 2)) cancelAnimationFrame(id); };
    frame();
  };
  const check = () => { const rect = footer.getBoundingClientRect(); if (rect.top > innerHeight + 120) exploded = false; if (!exploded && rect.top <= innerHeight + 250) explode(); };
  window.addEventListener("scroll", check, { passive: true });
  setTimeout(check, 500);
});
