const currentPage = window.location.pathname.split("/").pop() || "index.html";
const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");

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

const linksHtml = menuItems
  .map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`)
  .join("");

console.log(linksHtml);
mainNav.innerHTML = linksHtml;

navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});
