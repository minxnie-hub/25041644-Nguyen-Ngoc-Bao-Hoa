import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".page.home-page")) return;
  gsap.registerPlugin(ScrollTrigger);
  let trigger = null;

  const init = () => {
    if (trigger) { trigger.kill(); trigger = null; }
    const titles = document.querySelectorAll(".featured-title-wrapper");
    const titleTrack = document.querySelector(".featured-titles");
    const imageStage = document.querySelector(".featured-images");
    const indicatorContainer = document.querySelector(".featured-work-indicator");
    if (!titles.length || !titleTrack || !imageStage || !indicatorContainer) return;

    titleTrack.style.width = `${titles.length * 100}vw`;
    indicatorContainer.innerHTML = "";
    titles.forEach((_, index) => {
      const number = document.createElement("p");
      number.className = "mn";
      number.textContent = String(index + 1).padStart(2, "0");
      indicatorContainer.appendChild(number);
      for (let i = 0; i < 6; i += 1) {
        const line = document.createElement("div");
        line.className = "indicator";
        indicatorContainer.appendChild(line);
      }
    });

    if (window.innerWidth <= 1000) {
      gsap.set(titleTrack, { x: 0 });
      imageStage.innerHTML = "";
      return;
    }

    const small = [
      { y: 100, x: 1000 }, { y: 1500, x: 100 }, { y: 1250, x: 1950 }, { y: 1500, x: 850 },
      { y: 200, x: 2100 }, { y: 250, x: 600 }, { y: 1100, x: 1650 }, { y: 1000, x: 800 },
      { y: 900, x: 2200 }, { y: 150, x: 1600 },
    ];
    const large = [
      { y: 800, x: 5000 }, { y: 2000, x: 3000 }, { y: 240, x: 4450 }, { y: 1200, x: 3450 },
      { y: 500, x: 2200 }, { y: 750, x: 1100 }, { y: 1850, x: 3350 }, { y: 2200, x: 1300 },
      { y: 3000, x: 1950 }, { y: 500, x: 4500 },
    ];
    const positions = window.innerWidth >= 1600 ? large : small;
    imageStage.innerHTML = "";
    for (let i = 1; i <= 10; i += 1) {
      const card = document.createElement("div");
      card.className = `featured-img-card featured-img-card-${i}`;
      const img = document.createElement("img");
      img.src = `${import.meta.env.BASE_URL}images/work-items/work-item-${i}.jpg`;
      img.alt = `Ảnh tư liệu portfolio ${i}`;
      card.appendChild(img);
      gsap.set(card, { x: positions[i - 1].x, y: positions[i - 1].y, z: -1500, scale: 0 });
      imageStage.appendChild(card);
    }
    const cards = document.querySelectorAll(".featured-img-card");
    const moveDistance = window.innerWidth * (titles.length - 1);
    trigger = ScrollTrigger.create({
      trigger: ".featured-work",
      start: "top top",
      end: `+=${window.innerHeight * titles.length}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(titleTrack, { x: -moveDistance * self.progress });
        cards.forEach((card, index) => {
          const individual = Math.max(0, Math.min(1, (self.progress - index * .055) * 2));
          gsap.set(card, { z: -1500 + 3000 * individual, scale: Math.min(1, individual * 10) });
        });
        const indicators = document.querySelectorAll(".indicator");
        indicators.forEach((line, index) => {
          line.style.opacity = self.progress > index / indicators.length ? "1" : ".2";
        });
      },
    });
  };
  init();
  window.addEventListener("resize", init);
});
