document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle-btn");
  const overlay = document.querySelector(".nav-overlay");
  if (!button || !overlay) return;

  const setOpen = (open) => {
    button.classList.toggle("menu-open", open);
    overlay.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  };

  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => setOpen(!overlay.classList.contains("is-open")));
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      button.click();
    }
  });

  overlay.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
});
