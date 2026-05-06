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
  const linkPage: string | null = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});


const noteDisplay = document.getElementById("main-note-text");
const noteInput = document.querySelector<HTMLTextAreaElement>("#note-input");
const addBtn = document.getElementById("add-btn");
const resetBtn = document.getElementById("reset-btn");

const NOTE_STORAGE_KEY = "main_note_text";

const THEME_STORAGE_KEY = "site_theme";
const DARK_THEME_CLASS = "dark-theme";

const formatDateTime = (date: Date): string => {
  const pad = (n: number): string => String(n).padStart(2, "0");

  const hours: string = pad(date.getHours());
  const minutes: string = pad(date.getMinutes());
  const seconds: string = pad(date.getSeconds());

  const day: string = pad(date.getDate());
  const month: string = pad(date.getMonth() + 1);
  const year: string = pad(date.getFullYear() % 100);

  return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
};


if (noteDisplay && noteInput && addBtn && resetBtn) {

  const savedNote: string | null = localStorage.getItem(NOTE_STORAGE_KEY);
  if (savedNote) {
    noteDisplay.textContent = savedNote;
  }

  addBtn.addEventListener("click", () => {
    const piece: string = noteInput.value.trim();

    if (!piece) {
      return;
    }

    const stamp: string = formatDateTime(new Date());
    const line: string = `${stamp} ${piece}`;

    noteDisplay.textContent += (noteDisplay.textContent?.length ? "\n" : "") + line;
    localStorage.setItem(NOTE_STORAGE_KEY, noteDisplay.textContent || "");

    noteInput.value = "";
  });

  
  resetBtn.addEventListener("click", () => {
    noteDisplay.textContent = "Добро пожаловать на сайт.";
    localStorage.removeItem(NOTE_STORAGE_KEY);
    noteInput.value = "";
  });

}


const themeToggleBtn = document.getElementById("theme-toggle-btn");

const updateThemeButtonText = () => {
  if (!themeToggleBtn) return;
  const isDark = document.body.classList.contains(DARK_THEME_CLASS);
  themeToggleBtn.textContent = isDark ? "Светлая тема" : "Темная тема";
};

const saveTheme = localStorage.getItem(THEME_STORAGE_KEY);

if (saveTheme === "dark") {
  document.body.classList.add(DARK_THEME_CLASS);
};

updateThemeButtonText();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isDarkNow = document.body.classList.toggle(DARK_THEME_CLASS);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkNow ? "dark" : "light");
    updateThemeButtonText();
  })
}