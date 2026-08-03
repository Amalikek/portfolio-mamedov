const works = [
  { src: "assets/art/work-01.png", altKey: "work_1_alt" },
  { src: "assets/art/work-02.png", altKey: "work_2_alt" },
];

const i18n = {
  ru: {
    brand: "Гарягды",
    hero_role: "художник",
    nav_works: "Работы",
    nav_about: "О художнике",
    nav_contact: "Контакты",
    works_title: "Работы",
    about_title: "О художнике",
    about_text: "Живопись.",
    contact_title: "Контакты",
    contact_lead: "Связаться",
    socials_label: "Соцсети",
    socials_soon: "скоро",
    work_1_alt: "Работа 1",
    work_2_alt: "Работа 2",
    title: "Гарягды — художник",
  },
  en: {
    brand: "Garyagdy",
    hero_role: "artist",
    nav_works: "Works",
    nav_about: "About",
    nav_contact: "Contact",
    works_title: "Works",
    about_title: "About",
    about_text: "Painting.",
    contact_title: "Contact",
    contact_lead: "Get in touch",
    socials_label: "Social",
    socials_soon: "coming soon",
    work_1_alt: "Work 1",
    work_2_alt: "Work 2",
    title: "Garyagdy — artist",
  },
  az: {
    brand: "Qaryağdı",
    hero_role: "rəssam",
    nav_works: "İşlər",
    nav_about: "Haqqında",
    nav_contact: "Əlaqə",
    works_title: "İşlər",
    about_title: "Haqqında",
    about_text: "Rəssamlıq.",
    contact_title: "Əlaqə",
    contact_lead: "Əlaqə saxlayın",
    socials_label: "Sosial şəbəkələr",
    socials_soon: "tezliklə",
    work_1_alt: "İş 1",
    work_2_alt: "İş 2",
    title: "Qaryağdı — rəssam",
  },
};

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Language */
let lang = localStorage.getItem("garyagdy-lang") || "ru";
if (!i18n[lang]) lang = "ru";

function applyLang(next) {
  lang = next;
  localStorage.setItem("garyagdy-lang", lang);
  document.documentElement.lang = lang;
  document.title = i18n[lang].title;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key] != null) el.textContent = i18n[lang][key];
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    if (i18n[lang][key] != null) el.setAttribute("alt", i18n[lang][key]);
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

applyLang(lang);

/* Mobile menu */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

/* Header scroll */
const header = document.querySelector(".site-header");
window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  },
  { passive: true }
);

/* Active nav on scroll */
const sections = ["works", "about", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function updateActiveNav() {
  const y = window.scrollY + 120;
  let current = "";
  sections.forEach((sec) => {
    if (sec.offsetTop <= y) current = sec.id;
  });
  document.querySelectorAll(".nav a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    a.classList.toggle("is-active", href === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

/* Lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = (index + works.length) % works.length;
  const work = works[currentIndex];
  lightboxImg.src = work.src;
  lightboxImg.alt = i18n[lang][work.altKey] || "";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lightboxImg.src = "";
}

function showNext(delta) {
  openLightbox(currentIndex + delta);
}

document.querySelectorAll("[data-index]").forEach((el) => {
  el.addEventListener("click", () => {
    openLightbox(Number(el.dataset.index));
  });
});

document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev")?.addEventListener("click", () => showNext(-1));
document.getElementById("lightboxNext")?.addEventListener("click", () => showNext(1));

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showNext(-1);
  if (e.key === "ArrowRight") showNext(1);
});

/* Touch swipe in lightbox */
let touchX = null;
lightbox?.addEventListener(
  "touchstart",
  (e) => {
    touchX = e.changedTouches[0].screenX;
  },
  { passive: true }
);
lightbox?.addEventListener(
  "touchend",
  (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].screenX - touchX;
    if (Math.abs(dx) > 50) showNext(dx < 0 ? 1 : -1);
    touchX = null;
  },
  { passive: true }
);
