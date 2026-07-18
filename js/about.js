document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".about-hero, .about-copy, .stats-row");
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  elements.forEach((element) => observer.observe(element));
});
