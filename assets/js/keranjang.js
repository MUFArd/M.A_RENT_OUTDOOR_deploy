/* =====================================================================
   KERANJANG  —  dipakai di halaman Paket, Produk, dan Kontak.

   Alur singkat:
   1. Halaman Paket/Produk menampilkan barang dari data-produk.js
      (JS mengisi <section id="katalog"> dan <section id="katalog-paket">).
   2. Pengunjung menekan "+ Tambah", lalu tombol + / − untuk jumlah.
   3. Pilihan disimpan di localStorage, jadi tidak hilang saat pindah halaman.
   4. Bar hijau di bawah layar menampilkan ringkasan + tombol "Pesan"
      yang membawa pengunjung ke halaman Kontak.
   5. Halaman Kontak (kontak-form.js) membaca keranjang yang sama lewat
      window.Keranjang di bagian paling bawah file ini.
   ===================================================================== */
(() => {
    "use strict";

    const KEY = "ma_keranjang_v2";                                   // nama penyimpanan di browser
    const rp = n => "Rp " + Number(n).toLocaleString("id-ID");       // 35000 -> "Rp 35.000"
    const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    /* ---------- 1. DATA KERANJANG ---------- */
    // state.items = { idBarang: { nama, harga, qty } }, state.hari = lama sewa
    let state = { items: {}, hari: 1 };
    try {
        const tersimpan = JSON.parse(localStorage.getItem(KEY));
        if (tersimpan && tersimpan.items) state = tersimpan;
    } catch (e) { /* localStorage diblokir: keranjang tetap jalan, hanya tidak tersimpan */ }

    const simpan = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } };

    const daftar = () => Object.entries(state.items).map(([id, it]) => ({ id, ...it }));
    const jumlahBarang = () => daftar().reduce((a, i) => a + i.qty, 0);
    const totalPerHari = () => daftar().reduce((a, i) => a + i.qty * i.harga, 0);
    const total = () => totalPerHari() * state.hari;

    // Tambah/kurangi jumlah. delta = +1 atau -1. Jumlah 0 berarti barang dihapus.
    function ubah(id, nama, harga, delta) {
        const item = state.items[id] || { nama, harga, qty: 0 };
        item.qty = Math.max(0, Math.min(99, item.qty + delta));
        if (item.qty === 0) delete state.items[id]; else state.items[id] = item;
        simpan(); perbarui();
    }
    function hapus(id) { delete state.items[id]; simpan(); perbarui(); }
    function kosongkan() { state.items = {}; simpan(); perbarui(); }
    function setHari(n) { state.hari = Math.max(1, Math.min(30, parseInt(n) || 1)); simpan(); perbarui(); }

    // Teks pesanan yang akan masuk ke chat WhatsApp
    function teks() {
        if (!daftar().length) return "";
        const baris = daftar().map(i => `- ${i.qty}x ${i.nama} (${rp(i.harga)}/hari)`);
        return ["Pesanan:", ...baris, `Lama sewa: ${state.hari} hari`, `Estimasi total: ${rp(total())}`].join("\n");
    }

    /* ---------- 2. TAMPILAN TOMBOL TAMBAH / STEPPER ---------- */
    const BTN = "w-8 h-8 rounded-full bg-green-800 text-white font-bold hover:bg-green-900 active:scale-90 transition";

    // Jumlah 0 -> tombol "+ Tambah". Jumlah > 0 -> [−] 2 [+]
    function kontrol(id) {
        const q = (state.items[id] || {}).qty || 0;
        if (!q) return `<button type="button" data-act="tambah" class="px-3 py-1.5 rounded-full border border-green-800 text-green-800 text-sm font-semibold hover:bg-green-800 hover:text-white transition">+ Tambah</button>`;
        return `<div class="flex items-center gap-2">
      <button type="button" data-act="kurang" aria-label="Kurangi" class="${BTN}">−</button>
      <b class="w-6 text-center">${q}</b>
      <button type="button" data-act="tambah" aria-label="Tambah" class="${BTN}">+</button></div>`;
    }

    // Satu klik pada tombol mana pun di halaman ditangani di sini (event delegation)
    document.addEventListener("click", e => {
        const tombol = e.target.closest("[data-act]");
        const baris = e.target.closest("[data-id]");
        if (!tombol || !baris) return;
        ubah(baris.dataset.id, baris.dataset.nama, +baris.dataset.harga, tombol.dataset.act === "tambah" ? 1 : -1);
    });

    /* ---------- 3. MENAMPILKAN KATALOG ---------- */
    function renderProduk(wadah) {
        wadah.innerHTML = (window.KATEGORI || []).map((k, n) => `
      <div class="card" data-anim="fade-up" data-delay="${(n % 3) * 100}">
        <h2 class="flex items-center gap-3 font-bold text-lg mb-3">
          <i class="fa-solid ${k.ikon} w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-green-800 text-white text-xl"></i>${k.nama}
        </h2>
        <ul class="divide-y divide-green-900/10">
          ${k.barang.map(([nama, harga]) => `
          <li data-id="${slug(k.nama + "-" + nama)}" data-nama="${nama}" data-harga="${harga}" class="flex items-center justify-between gap-3 py-2">
            <div><p class="text-sm font-medium">${nama}</p><p class="text-xs text-green-800">${rp(harga)}/hari</p></div>
            <div data-kontrol>${kontrol(slug(k.nama + "-" + nama))}</div>
          </li>`).join("")}
        </ul>
      </div>`).join("");
    }

    function renderPaket(wadah) {
        wadah.innerHTML = (window.PAKET || []).map((p, n) => `
      <article class="card flex flex-col gap-3" data-anim="fade-up" data-delay="${n * 100}" data-id="${p.id}" data-nama="Paket ${p.nama}" data-harga="${p.harga}">
        <span class="tag-label font-brush-joney">PAKET</span>
        <h2 class="font-brush-joney text-4xl -rotate-2">${p.nama}</h2>
        ${p.tagline ? `<p class="font-brush-joney text-lg">${p.tagline}</p>` : ""}
        <div class="ph h-32">Foto</div>
        <ul class="text-sm space-y-1">${p.isi.map(i => `<li class="flex items-center gap-2"><i class="fa-solid fa-check text-green-700"></i>${i}</li>`).join("")}</ul>
        <p class="bg-green-800 text-amber-50 rounded-md px-3 py-1.5 w-fit">${"Rp"} <b class="text-xl">${p.harga.toLocaleString("id-ID")}</b>/hari</p>
        <div data-kontrol class="mt-auto">${kontrol(p.id)}</div>
      </article>`).join("");
    }

    const wProduk = document.getElementById("katalog");
    const wPaket = document.getElementById("katalog-paket");
    if (wProduk) renderProduk(wProduk);
    if (wPaket) renderPaket(wPaket);

    /* ---------- 4. BAR "PESAN" DI BAWAH LAYAR ---------- */
    let bar = null;
    if (wProduk || wPaket) {
        bar = document.createElement("div");
        bar.id = "barPesan";
        bar.className = "fixed inset-x-0 bottom-0 z-40 bg-green-900 text-white shadow-2xl translate-y-full transition-transform duration-300";
        bar.innerHTML = `<div class="px-4 md:px-20 py-3 flex items-center justify-between gap-3">
        <div><p class="text-xs text-green-200">Barang dipilih</p>
        <p class="font-bold"><span id="barJumlah"></span> barang · <span id="barTotal"></span>/hari</p></div>
        <a href="kontak.html" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-500 font-semibold transition">
          <i class="fa-brands fa-whatsapp"></i>Pesan</a></div>`;
        document.body.appendChild(bar);
        const css = document.createElement("style");
        css.textContent = "body.has-bar #toTop { bottom: 88px !important; }";   // geser tombol "ke atas" agar tidak tertutup bar
        document.head.appendChild(css);
    }

    /* ---------- 5. SINKRON SEMUA TAMPILAN ---------- */
    // Dipanggil setiap keranjang berubah: segarkan tombol, bar, dan beri tahu halaman Kontak.
    function perbarui() {
        document.querySelectorAll("[data-id]").forEach(el => {
            const k = el.querySelector("[data-kontrol]");
            if (k) k.innerHTML = kontrol(el.dataset.id);
        });
        if (bar) {
            const ada = jumlahBarang() > 0;
            document.getElementById("barJumlah").textContent = jumlahBarang();
            document.getElementById("barTotal").textContent = rp(totalPerHari());
            bar.classList.toggle("translate-y-full", !ada);
            document.body.classList.toggle("has-bar", ada);
            const footer = document.getElementById("site-footer");
            if (footer) {                                                          // supaya footer tidak tertutup bar
                footer.style.paddingBottom = ada ? "80px" : "";
                footer.style.backgroundColor = ada ? "#052e16" : "";               // warna sama dengan footer (green-950)
            }
        }
        document.dispatchEvent(new CustomEvent("keranjang:ubah"));
    }
    perbarui();

    /* ---------- 6. DIBUKA UNTUK FILE LAIN (kontak-form.js) ---------- */
    window.Keranjang = {
        daftar, jumlahBarang, totalPerHari, total, hapus, kosongkan, setHari, teks, rp,
        hari: () => state.hari
    };
})();