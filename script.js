const works = [
  { src: "assets/art/building.png", altKey: "work_building" },
  { src: "assets/art/children.png", altKey: "work_children" },
  { src: "assets/art/work-03.png", altKey: "work_n" },
  { src: "assets/art/work-04.png", altKey: "work_n" },
  { src: "assets/art/work-05.png", altKey: "work_n" },
  { src: "assets/art/work-06.png", altKey: "work_n" },
  { src: "assets/art/work-07.png", altKey: "work_n" },
  { src: "assets/art/work-08.png", altKey: "work_n" },
  { src: "assets/art/work-09.png", altKey: "work_n" },
  { src: "assets/art/work-10.png", altKey: "work_n" },
  { src: "assets/art/work-11.png", altKey: "work_n" },
];

const i18n = {
  ru: {
    brand: "Гарягды",
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
    work_building: "Здание",
    work_children: "С детьми",
    work_n: "Работа",
    title: "Гарягды — художник",
  },
  en: {
    brand: "Garyagdy",
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
    work_building: "Building",
    work_children: "With children",
    work_n: "Work",
    title: "Garyagdy — artist",
  },
  az: {
    brand: "Qaryağdı",
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
    work_building: "Bina",
    work_children: "Uşaqlarla",
    work_n: "İş",
    title: "Qaryağdı — rəssam",
  },
};

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

let lang = localStorage.getItem("garyagdy-lang") || "ru";
if (!i18n[lang]) lang = "ru";

function altFor(work, index) {
  const t = i18n[lang];
  if (work.altKey === "work_n") return `${t.work_n} ${index + 1}`;
  return t[work.altKey] || t.work_n;
}

function applyLang(next) {
  lang = next;
  localStorage.setItem("garyagdy-lang", lang);
  document.documentElement.lang = lang;
  document.title = i18n[lang].title;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key] != null) el.textContent = i18n[lang][key];
  });

  const heroImg = document.getElementById("heroImg");
  if (heroImg) heroImg.alt = altFor(works[0], 0);

  document.querySelectorAll("#gallery img").forEach((img, i) => {
    img.alt = altFor(works[i], i);
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

/* Build gallery */
const gallery = document.getElementById("gallery");
works.forEach((work, index) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "gallery-item";
  btn.dataset.index = String(index);
  btn.style.animationDelay = `${0.04 + index * 0.05}s`;
  const img = document.createElement("img");
  img.src = work.src;
  img.loading = "lazy";
  img.alt = "";
  btn.appendChild(img);
  btn.addEventListener("click", () => openLightbox(index));
  gallery.appendChild(btn);
});

document.querySelector(".hero-frame")?.addEventListener("click", () => openLightbox(0));

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

/* Active nav */
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
    a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`);
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
  lightboxImg.alt = altFor(work, currentIndex);
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
