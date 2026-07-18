document.addEventListener("DOMContentLoaded", () => {
  const image = document.querySelector(".hero-img");
  if (!image) return;
  image.animate(
    [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 520, easing: "ease-out", fill: "both" }
  );
});
