// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const totalScroll =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const currentScroll = window.scrollY;
  const scrollProgress = document.getElementById("scrollProgress");
  if (scrollProgress) {
    const progress = (currentScroll / totalScroll) * 100;
    scrollProgress.style.width = progress + "%";
  }
});

// Tab Switching untuk Organisasi
function switchOrgTab(tab) {
  const btnKuliah = document.getElementById("btnKuliah");
  const btnSma = document.getElementById("btnSma");
  const orgKuliah = document.getElementById("orgKuliah");
  const orgSma = document.getElementById("orgSma");

  if (tab === "kuliah") {
    btnKuliah.className =
      "px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all bg-teal-500 text-slate-950 shadow-md";
    btnSma.className =
      "px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all bg-slate-900 text-slate-400 border border-slate-800 hover:text-white";
    orgKuliah.classList.remove("hidden");
    orgSma.classList.add("hidden");
  } else {
    btnSma.className =
      "px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all bg-teal-500 text-slate-950 shadow-md";
    btnKuliah.className =
      "px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all bg-slate-900 text-slate-400 border border-slate-800 hover:text-white";
    orgSma.classList.remove("hidden");
    orgKuliah.classList.add("hidden");
  }
}
