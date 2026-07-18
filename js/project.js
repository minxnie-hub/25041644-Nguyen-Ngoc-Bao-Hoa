document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".lightbox");
  const large = box?.querySelector("img");
  const close = box?.querySelector("button");
  const open = (src, alt) => {
    if (!box || !large) return;
    large.src = src; large.alt = alt || "Ảnh minh chứng phóng to";
    box.classList.add("open"); document.body.style.overflow = "hidden";
  };
  const hide = () => { if (!box) return; box.classList.remove("open"); document.body.style.overflow = ""; };
  document.querySelectorAll(".project-figure img").forEach((img) => img.addEventListener("click", () => open(img.src, img.alt)));
  close?.addEventListener("click", hide);
  box?.addEventListener("click", (event) => { if (event.target === box) hide(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") hide(); });
});
