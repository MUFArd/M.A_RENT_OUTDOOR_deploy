// Header & footer dibuat dari satu sumber supaya semua halaman selalu konsisten.
// Setiap <body> wajib punya data-root ("./" untuk index, "../../" untuk src/page) dan data-page.
const root = document.body.dataset.root || "./";
const page = document.body.dataset.page || "home";
const T = window.TOKO || { wa: "6289606981787", tampil: "0896 0698 1787", ig: "m.a_outdoor_rent" }; // dari data-produk.js
const WA = "https://wa.me/" + T.wa;

// ---- Google Maps: klik peta -> membuka Google Maps di tab baru ----
const MAP_Q = T.lokasi || T.alamat || "M.A Outdoor Rent, Parung Panjang, Bogor";   // yang dicari di Google Maps = toko
const MAP_URL = T.mapsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(MAP_Q);
const MAP_EMBED = T.mapsEmbed || "https://www.google.com/maps?q=" + encodeURIComponent(MAP_Q) + "&output=embed";
// Peta kecil yang tampil dengan <iframe>. pointer-events-none membuat klik "menembus" iframe
// dan jatuh ke link <a> di atasnya, sehingga seluruh peta berfungsi sebagai tombol.
const peta = (tinggi = "h-40") => `
  <a href="${MAP_URL}" target="_blank" rel="noopener" aria-label="Buka lokasi di Google Maps"
     class="group relative block ${tinggi} rounded-xl overflow-hidden border border-green-900/20">
    <iframe src="${MAP_EMBED}" class="w-full h-full pointer-events-none" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Lokasi M.A Outdoor Rent"></iframe>
    <span class="absolute inset-0 flex items-end justify-end p-2 group-hover:bg-black/20 transition">
      <span class="text-xs bg-white text-green-900 font-semibold px-3 py-1.5 rounded-full shadow"><i class="fa-solid fa-location-arrow mr-1"></i>Buka di Google Maps</span>
    </span>
  </a>`;

const links = [
  ["home", "Home", root + "index.html"],
  ["tentang", "Tentang Kami", root + "src/page/tentang_kami.html"],
  ["paket", "Paket", root + "src/page/paket.html"],
  ["produk", "Produk", root + "src/page/produk.html"],
  ["galeri", "Galeri", root + "src/page/galeri.html"],
  ["testimoni", "Testimoni", root + "src/page/testimoni.html"],
  ["kontak", "Kontak", root + "src/page/kontak.html"],
];

const navItems = links.map(([id, label, href]) => `
  <li><a href="${href}" class="block py-2 md:py-1 font-semibold text-sm border-b-2 transition
    ${id === page ? "text-green-900 border-green-800" : "text-green-800 border-transparent hover:text-green-500"}">${label}</a></li>`).join("");

// Halaman polos (mis. pesan.html) sengaja tidak punya #site-header / #site-footer.
// setHTML melewati elemen yang tidak ada, jadi file ini tetap aman dipakai di sana.
const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

setHTML("site-header", `
<header class="fixed top-0 z-30 w-full h-16 bg-amber-50/95 backdrop-blur border-b border-green-900/10 flex items-center justify-between px-4 md:px-20">
  <a href="${root}index.html"><img src="${root}assets/img/SEWAALATOUTDOORBERKUALITAS.png" class="w-12 h-12 rounded-full" alt="Logo M.A Outdoor Rent"></a>
  <nav>
    <ul id="navMenu" class="fixed md:static top-0 right-0 h-screen md:h-auto w-64 md:w-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-7
      bg-amber-50 md:bg-transparent shadow-lg md:shadow-none px-6 md:px-0 pt-20 md:pt-0 z-40 translate-x-full md:translate-x-0 transition-transform duration-300">
      ${navItems}
    </ul>
  </nav>
  <div class="flex items-center gap-3">
    <a href="${WA}" class="bg-green-800 text-amber-50 flex items-center gap-2 text-sm px-3 py-2 rounded-full hover:bg-green-900 transition">
      <i class="fa-brands fa-whatsapp text-xl"></i><span class="hidden lg:block">Chat Sekarang</span>
    </a>
    <button id="menuToggle" class="md:hidden relative z-50 text-green-900 text-xl w-8" aria-label="Buka menu"><i id="menuIcon" class="fa-solid fa-bars"></i></button>
  </div>
</header>`);

setHTML("site-footer", `
<footer id="kontak" class="bg-green-950 text-white px-4 md:px-20 py-10">
  <div class="grid md:grid-cols-4 gap-8 mb-8">
    <div class="flex items-start gap-3">
      <img src="${root}assets/img/SEWAALATOUTDOORBERKUALITAS.png" class="w-14 rounded-full" alt="">
      <div><p class="font-bold text-sm">M.A OUTDOOR RENT</p><p class="text-sm text-green-200/80">Rental alat outdoor untuk menemani setiap petualanganmu.</p></div>
    </div>
    <div><h5 class="font-bold mb-3">Kontak Kami</h5>
      <ul class="space-y-2 text-sm text-green-200/80">
        <li><i class="fa-solid fa-phone w-5"></i>${T.tampil}</li>
        <li><i class="fa-brands fa-instagram w-5"></i>@${T.ig}</li>
        <li><a href="${MAP_URL}" target="_blank" rel="noopener" class="hover:text-white"><i class="fa-solid fa-location-dot w-5"></i>${T.alamat || MAP_Q}</a></li>
      </ul></div>
    <div><h5 class="font-bold mb-3">Ikuti Kami</h5>
      <div class="flex gap-4 text-xl"><a href="https://instagram.com/${T.ig}" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a><a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a><a href="${WA}" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a></div></div>
    <div><h5 class="font-bold mb-3">Lokasi Kami</h5>${peta("h-32")}</div>
  </div>
  <div class="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-white/10 text-xs text-green-200/70">
    <p>&copy; 2025 M.A Outdoor Rent. All rights reserved.</p>
    <p class="font-brush-joney text-lg text-green-200">Good People, Great Adventure</p>
    <div class="flex gap-4"><a href="#">Syarat &amp; Ketentuan</a><a href="#">Kebijakan Privasi</a></div>
  </div>
</footer>`);

// Tempat peta di halaman (mis. <div data-peta="h-72"></div>) diisi di sini, sesudah footer dibuat
document.querySelectorAll("[data-peta]").forEach(el => { el.innerHTML = peta(el.dataset.peta); });

if (document.getElementById("navMenu")) {   // menu hanya ada di halaman yang punya header
  const menu = document.getElementById("navMenu"), icon = document.getElementById("menuIcon");
  document.getElementById("menuToggle").addEventListener("click", () => {
    const open = menu.classList.toggle("translate-x-full") === false;
    icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });
  menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.add("translate-x-full"); icon.className = "fa-solid fa-bars"; } });
}

/* ================= ANIMASI & INTERAKSI ================= */
(() => {
  const css = document.createElement("style");
  css.textContent = `
    html { scroll-behavior: smooth; }
    .rv { opacity: 0; transform: var(--from, translateY(28px)); transition: opacity var(--t, .7s) ease, transform var(--t, .7s) cubic-bezier(.2,.7,.2,1); transition-delay: var(--d, 0ms); }
    .rv.in { opacity: 1; transform: none; }
    .card, .paket-card, .produk, .feature, .trip, .testi { transition: transform .3s ease, box-shadow .3s ease; }
    .card:hover, .paket-card:hover, .produk:hover, .feature:hover, .testi:hover { transform: translateY(-6px); box-shadow: 0 14px 28px -12px rgb(20 83 45 / .35); }
    .ph { overflow: hidden; transition: transform .4s ease, filter .4s ease; }
    .aspect-square.ph:hover { transform: scale(1.04); filter: brightness(1.05); }
    a.btn-primary:active, a.btn-outline:active, button:active { transform: scale(.96); }
    #site-header header { transition: box-shadow .3s ease, background-color .3s ease; }
    #site-header header.scrolled { box-shadow: 0 4px 18px -8px rgb(0 0 0 / .25); }
    #toTop { position: fixed; right: 16px; bottom: 16px; z-index: 30; width: 44px; height: 44px; border-radius: 9999px; background: #166534; color: #fff;
             opacity: 0; pointer-events: none; transform: translateY(12px); transition: opacity .3s, transform .3s, background-color .2s; }
    #toTop.show { opacity: 1; pointer-events: auto; transform: none; }
    #toTop:hover { background: #14532d; }
    /* Ikon di dalam lingkaran: Font Awesome memaksa display:inline-block (CSS tanpa layer) dan mengalahkan
       class Tailwind seperti "flex". Aturan di bawah ini memusatkan ikon tepat di tengah lingkaran. */
    .why > i.fa-solid, .feature > i.fa-solid, .paket-list i.fa-solid,
    i.fa-solid[class*="rounded-full"], i.fa-brands[class*="rounded-full"] { display: flex; align-items: center; justify-content: center; line-height: 1; }
    .trip-list i.fa-solid { display: inline-flex; align-items: center; justify-content: center; line-height: 1; vertical-align: middle; }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .rv { opacity: 1; transform: none; transition: none; }
      .card:hover, .paket-card:hover, .produk:hover, .feature:hover, .testi:hover { transform: none; }
    }`;
  document.head.appendChild(css);

  // Header: beri bayangan setelah halaman di-scroll + tombol kembali ke atas
  const header = document.querySelector("#site-header header");
  const toTop = document.createElement("button");
  toTop.id = "toTop"; toTop.setAttribute("aria-label", "Kembali ke atas");
  toTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  toTop.onclick = () => window.scrollTo({ top: 0 });
  document.body.appendChild(toTop);
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", scrollY > 8);
    toTop.classList.toggle("show", scrollY > 500);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ===== Animasi berbasis atribut =====
  // Pakai:  <div data-anim="fade-up" data-delay="200" data-duration="800">
  // Jenis:  fade, fade-up, fade-down, fade-left, fade-right, zoom-in
  // Grup:   <div data-stagger="100"> -> semua anaknya fade-up bergantian tiap 100ms
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const FROM = { "fade": "none", "fade-up": "translateY(28px)", "fade-down": "translateY(-28px)",
                 "fade-left": "translateX(28px)", "fade-right": "translateX(-28px)", "zoom-in": "scale(.9)" };

  document.querySelectorAll("[data-stagger]").forEach(group => {
    const gap = parseInt(group.dataset.stagger) || 100;
    [...group.children].forEach((c, i) => {
      if (!c.dataset.anim) c.dataset.anim = group.dataset.animChild || "fade-up";
      if (!c.dataset.delay) c.dataset.delay = i * gap;
    });
  });

  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; io.unobserve(el);
    el.classList.add("in");
    const total = (parseInt(el.dataset.delay) || 0) + (parseInt(el.dataset.duration) || 700) + 200;
    // setelah selesai, lepas class animasi supaya efek hover tidak tertunda
    setTimeout(() => { el.classList.remove("rv", "in"); ["--from", "--d", "--t"].forEach(v => el.style.removeProperty(v)); }, total);
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll("[data-anim]").forEach(el => {
    el.classList.add("rv");
    el.style.setProperty("--from", FROM[el.dataset.anim] || FROM["fade-up"]);
    el.style.setProperty("--d", (parseInt(el.dataset.delay) || 0) + "ms");
    el.style.setProperty("--t", (parseInt(el.dataset.duration) || 700) + "ms");
    io.observe(el);
  });
})();