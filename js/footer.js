document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".page.contact-page") || document.querySelector(".page.project-page")) return;
  const footer = document.querySelector("footer");
  const container = footer?.querySelector(".explosion-container");
  if (!footer || !container || matchMedia("(prefers-reduced-motion: reduce)").matches || innerWidth <= 1000) return;

  const images = [1,2,3,4,5,6].map(n => `${import.meta.env.BASE_URL}images/work-items/work-item-${n}.jpg`);
  let played = false;
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting) || played) return;
    played = true;
    container.innerHTML = "";
    images.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.className = "explosion-particle-img";
      img.style.left = `${38 + index * 5}%`;
      img.animate([
        { transform: "translate(-50%, 130px) rotate(0deg)", opacity: 0 },
        { opacity: 1, offset: .18 },
        { transform: `translate(calc(-50% + ${(index - 2.5) * 80}px), ${-170 - (index % 2) * 80}px) rotate(${(index - 2.5) * 18}deg)`, opacity: 1, offset: .66 },
        { transform: `translate(calc(-50% + ${(index - 2.5) * 105}px), 80px) rotate(${(index - 2.5) * 30}deg)`, opacity: 0 },
      ], { duration: 2100 + index * 60, easing: "cubic-bezier(.2,.7,.25,1)", fill: "forwards" });
      container.appendChild(img);
    });
    setTimeout(() => { container.innerHTML = ""; }, 2800);
    observer.disconnect();
  }, { threshold: .2 });
  observer.observe(footer);
});
