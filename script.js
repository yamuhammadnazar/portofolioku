// ==========================================================================
// SIDEBAR TOGGLE
// ==========================================================================
const body = document.body;
const toggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const navLinks = document.querySelectorAll("[data-nav]");

function openSidebar() {
  body.classList.add("sidebar-open");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Tutup navigasi");
  sidebar.setAttribute("aria-hidden", "false");
}

function closeSidebar() {
  body.classList.remove("sidebar-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Buka navigasi");
  sidebar.setAttribute("aria-hidden", "true");
}

toggle.addEventListener("click", () => {
  body.classList.contains("sidebar-open") ? closeSidebar() : openSidebar();
});

overlay.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

// ==========================================================================
// SCROLL-SPY — menyorot menu sesuai section aktif
// ==========================================================================
const sections = document.querySelectorAll("main section[id]");
const linkMap = {};
navLinks.forEach((l) => {
  linkMap[l.getAttribute("href").slice(1)] = l;
});

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const link = linkMap[entry.target.id];
        if (link) link.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
);

sections.forEach((s) => spyObserver.observe(s));

// ==========================================================================
// PROGRESS BAR — indikator kemajuan membaca
// ==========================================================================
const progressBar = document.getElementById("progressBar");

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = percent + "%";
}

window.addEventListener("scroll", updateProgressBar, { passive: true });
window.addEventListener("resize", updateProgressBar);
updateProgressBar();
