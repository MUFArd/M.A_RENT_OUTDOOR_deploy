// Header & footer dibuat dari satu sumber supaya semua halaman selalu konsisten.
// Setiap <body> wajib punya data-root ("./" untuk index, "../../" untuk src/page) dan data-page.
const root = document.body.dataset.root || "./";
const page = document.body.dataset.page || "home";
const WA = "https://wa.me/6281234567890";

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

document.getElementById("site-header").innerHTML = `
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
</header>`;

document.getElementById("site-footer").innerHTML = `
<footer id="kontak" class="bg-green-950 text-white px-4 md:px-20 py-10">
  <div class="grid md:grid-cols-4 gap-8 mb-8">
    <div class="flex items-start gap-3">
      <img src="${root}assets/img/SEWAALATOUTDOORBERKUALITAS.png" class="w-14 rounded-full" alt="">
      <div><p class="font-bold text-sm">M.A OUTDOOR RENT</p><p class="text-sm text-green-200/80">Rental alat outdoor untuk menemani setiap petualanganmu.</p></div>
    </div>
    <div><h5 class="font-bold mb-3">Kontak Kami</h5>
      <ul class="space-y-2 text-sm text-green-200/80">
        <li><i class="fa-solid fa-phone w-5"></i>+62 812-3456-7890</li>
        <li><i class="fa-brands fa-instagram w-5"></i>@ma.outdoorent</li>
        <li><i class="fa-solid fa-location-dot w-5"></i>Parung Panjang, Bogor</li>
      </ul></div>
    <div><h5 class="font-bold mb-3">Ikuti Kami</h5>
      <div class="flex gap-4 text-xl"><a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a><a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a><a href="${WA}" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a></div></div>
    <p class="font-brush-joney text-2xl text-green-200 md:text-right md:self-end -rotate-3">Good People, Great Adventure</p>
  </div>
  <div class="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-white/10 text-xs text-green-200/70">
    <p>&copy; 2025 M.A Outdoor Rent. All rights reserved.</p>
    <div class="flex gap-4"><a href="#">Syarat &amp; Ketentuan</a><a href="#">Kebijakan Privasi</a></div>
  </div>
</footer>`;

const menu = document.getElementById("navMenu"), icon = document.getElementById("menuIcon");
document.getElementById("menuToggle").addEventListener("click", () => {
    const open = menu.classList.toggle("translate-x-full") === false;
    icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
});
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.add("translate-x-full"); icon.className = "fa-solid fa-bars"; } });

/* ================= ANIMASI & INTERAKSI ================= */
(() => {
    const css = document.createElement("style");
    css.textContent = `
    html { scroll-behavior: smooth; }
    .rv { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); transition-delay: var(--d, 0ms); }
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
        header.classList.toggle("scrolled", scrollY > 8);
        toTop.classList.toggle("show", scrollY > 500);
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // Fade-up saat elemen masuk layar
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const targets = [];
    document.querySelectorAll("main > section").forEach(sec => {
        [...sec.children].forEach(el => {
            if (el.classList.contains("absolute")) return;                      // lapisan gelap di atas foto
            const stagger = /\b(grid|relative)\b/.test(el.className);           // kelompok kartu / isi hero
            if (stagger && el.children.length > 1) [...el.children].forEach((c, i) => targets.push([c, i * 90]));
            else targets.push([el, 0]);
        });
    });

    const io = new IntersectionObserver(entries => entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target; io.unobserve(el);
        el.classList.add("in");
        // setelah selesai, lepas class animasi supaya efek hover tidak ikut tertunda
        setTimeout(() => el.classList.remove("rv", "in"), 900 + (parseInt(el.style.getPropertyValue("--d")) || 0));
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(([el, d]) => { el.classList.add("rv"); el.style.setProperty("--d", d + "ms"); io.observe(el); });
})();