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
   SCROLL REVEAL
   Fade + slide-up saat elemen (section-label, kartu, dsb.) masuk viewport.
   Progressive enhancement: kalau JS gagal load, class "no-js" pada <html>
   tetap ada (lihat index.html) sehingga semua konten tetap terlihat normal.
   ========================================================================== */

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12,
  },
);

// Mendaftarkan satu elemen ke observer, aman dipanggil berkali-kali
// (termasuk untuk elemen yang baru ditambahkan setelah fetch async).
function observeReveal(el) {
  if (!el || el.dataset.revealObserved) return;
  el.dataset.revealObserved = "true";
  revealObserver.observe(el);
}

// Elemen di dalam ".reveal-group" otomatis diberi class "reveal" + jeda
// bertahap (stagger) sesuai urutan anak elemennya, supaya kartu-kartu
// dalam satu grid muncul satu-satu, bukan serentak.
function initReveal(root = document) {
  root.querySelectorAll(".reveal-group").forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
      observeReveal(child);
    });
  });

  root.querySelectorAll(".reveal").forEach((el) => observeReveal(el));
}

initReveal();

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

/* ==========================================================================
   CONTACT FORM AJAX SUBMISSION (Formspree)
   ========================================================================== */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Mencegah reload halaman

    // Ubah teks tombol menjadi loading
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Mengirim...";
    submitBtn.disabled = true;

    // Reset status sebelumnya
    formStatus.className = "form-status";
    formStatus.innerText = "";
    formStatus.style.display = "none";

    const data = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formStatus.innerText =
          "Pesan berhasil terkirim! Terima kasih telah menghubungi saya.";
        formStatus.classList.add("success");
        formStatus.style.display = "block";
        contactForm.reset(); // Kosongkan form
      } else {
        formStatus.innerText = "Oops! Terjadi kesalahan. Silakan coba lagi.";
        formStatus.classList.add("error");
        formStatus.style.display = "block";
      }
    } catch (error) {
      formStatus.innerText = "Koneksi terputus. Gagal mengirim pesan.";
      formStatus.classList.add("error");
      formStatus.style.display = "block";
    } finally {
      // Kembalikan tombol ke kondisi semula
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   GITHUB API FETCH (Live Repositories)
   ========================================================================== */
const githubGrid = document.getElementById("githubGrid");
const githubUsername = "yamuhammadnazar"; // Username GitHub Anda

// Fungsi untuk memberi warna berbeda pada bahasa pemrograman
function getLanguageColor(lang) {
  const colors = {
    JavaScript: "#f1e05a",
    PHP: "#4F5D95",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Blade: "#f7523f",
  };
  return colors[lang] || "var(--gold)";
}

async function fetchGitHubRepos() {
  if (!githubGrid) return;

  try {
    // Mengambil repo yang paling terakhir diupdate (Maksimal 4 repo)
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=4`,
    );

    if (!response.ok) throw new Error("Gagal mengambil data dari GitHub");

    const repos = await response.json();
    githubGrid.innerHTML = ""; // Bersihkan loading state

    repos.forEach((repo, index) => {
      // Lewati jika repo tersebut adalah fork (opsional)
      if (repo.fork) return;

      const langColor = getLanguageColor(repo.language);
      const languageHTML = repo.language
        ? `<div class="github-meta-item">
             <span class="lang-dot" style="background-color: ${langColor}"></span>
             <span>${repo.language}</span>
           </div>`
        : "";

      const cardHTML = `
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="card github-card reveal" style="transition-delay:${Math.min(index * 90, 360)}ms">
          <div class="github-card-top">
            <h4 class="github-title">${repo.name}</h4>
            <!-- Ikon GitHub -->
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </div>
          <p class="github-desc">${repo.description || "Tidak ada deskripsi tersedia."}</p>
          <div class="github-meta">
            ${languageHTML}
            <div class="github-meta-item" title="Stars">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>
              <span>${repo.stargazers_count}</span>
            </div>
            <div class="github-meta-item" title="Forks">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
              <span>${repo.forks_count}</span>
            </div>
          </div>
        </a>
      `;
      githubGrid.innerHTML += cardHTML;
    });

    // Kartu GitHub dimasukkan setelah observer utama berjalan (fetch async),
    // jadi perlu didaftarkan ulang ke revealObserver di sini.
    initReveal(githubGrid);
  } catch (error) {
    console.error(error);
    githubGrid.innerHTML = `
      <div class="github-error">
        <p>Gagal memuat repositori GitHub saat ini.</p>
        <a href="https://github.com/${githubUsername}" class="btn btn-ghost" target="_blank" style="margin-top:12px;">Cek Langsung ke GitHub</a>
      </div>
    `;
  }
}

// Eksekusi fungsi fetch saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", fetchGitHubRepos);
