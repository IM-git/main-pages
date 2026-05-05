const currentPage = window.location.pathname.split("/").pop() || "index.html";

const menuItems = [
  { href: "index.html", label: "Главная" },
  { href: "about.html", label: "О нас" },
  { href: "contacts.html", label: "Контакты" },
  { href: "docs.html", label: "Документы" }
];

const mainNav = document.getElementById("main-nav");
if (!mainNav) {
  throw new Error("Main navigation element not found");
}

mainNav.innerHTML = menuItems
  .map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`)
  .join("");

const navLinks = mainNav.querySelectorAll<HTMLAnchorElement>(".nav-link");
navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});


const noteDisplay = document.getElementById("main-note-text");
const noteInput = document.getElementById("note-input") as HTMLTextAreaElement | null;
const addBtn = document.getElementById("add-btn");

if (noteDisplay && noteInput && addBtn) {
  addBtn.addEventListener("click", () => {
    const piece = noteInput.value.trim();
    if (!piece) {
      return;
    }
    noteDisplay.textContent += (noteDisplay.textContent?.length ? " " : "") + piece;
    noteInput.value = "";
  });
}