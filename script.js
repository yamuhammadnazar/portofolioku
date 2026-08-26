/* ==========================================================================
   SIDEBAR TOGGLE
   ========================================================================== */

const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-tab");
const sidebarOverlay = document.querySelector(".overlay");

function openSidebar() {
  sidebar?.classList.add("open");
  sidebarOverlay?.classList.add("active");
  document.body.classList.add("sidebar-open");
}

function closeSidebar() {
  sidebar?.classList.remove("open");
  sidebarOverlay?.classList.remove("active");
  document.body.classList.remove("sidebar-open");
}

sidebarToggle?.addEventListener("click", () => {
  if (sidebar?.classList.contains("open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarOverlay?.addEventListener("click", closeSidebar);

/* ==========================================================================
   CLOSE SIDEBAR WHEN NAVIGATION LINK IS CLICKED
   ========================================================================== */

document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", () => {
    closeSidebar();
  });
});

/* ==========================================================================
   SCROLL SPY
   Menandai menu sidebar sesuai section yang sedang dilihat.
   ========================================================================== */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');

const observerOptions = {
  root: null,
  rootMargin: "-20% 0px -65% 0px",
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const currentId = entry.target.getAttribute("id");

    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");

      link.classList.toggle("active", linkTarget === `#${currentId}`);
    });
  });
}, observerOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* ==========================================================================
   PROGRESS BAR
   ========================================================================== */

const progressBar = document.querySelector(".progress-bar");

function updateProgressBar() {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (documentHeight <= 0) {
    progressBar.style.width = "0%";
    return;
  }

  const progress = (scrollTop / documentHeight) * 100;

  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener("scroll", updateProgressBar, {
  passive: true,
});

window.addEventListener("resize", updateProgressBar);

updateProgressBar();

/* ==========================================================================
   ESCAPE KEY
   Menutup sidebar ketika tombol Escape ditekan.
   ========================================================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
  }
});

// =========================================================
// DOWNLOAD CV
// =========================================================

document
  .getElementById("downloadCV")
  ?.addEventListener("click", function (event) {
    event.preventDefault();

    const cvUrl = "cv/CV-Ya-Muhammad-Nazar.pdf";

    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = "CV-Ya-Muhammad-Nazar.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
