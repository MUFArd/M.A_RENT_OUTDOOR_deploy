/* =====================================================================
   HALAMAN PESAN (pesan.html)  —  Paket + Produk dalam satu halaman

   Katalog (kartu paket, daftar produk, tombol + / −) digambar oleh
   keranjang.js. File ini mengurus: tab Paket/Produk, kolom pencarian,
   dan panel "Pesanan Kamu" (daftar barang, total, tombol kirim ke WhatsApp).
   ===================================================================== */
(() => {
    "use strict";
    const K = window.Keranjang;                         // keranjang dari keranjang.js
    const $ = id => document.getElementById(id);

    // Tombol + / − di panel hijau gelap dibuat putih supaya terlihat jelas
    const css = document.createElement("style");
    css.textContent = ".panel-ctl button{background:#fff;color:#14532d}.panel-ctl button:hover{background:#dcfce7}";
    document.head.appendChild(css);

    /* ---------- TAB PAKET / PRODUK ---------- */
    const AKTIF = ["bg-green-800", "text-white"], NONAKTIF = ["bg-white/70", "text-green-800"];
    let tabAktif = "paket";

    function tampilTab(nama) {
        tabAktif = nama;
        $("paket").classList.toggle("hidden", nama !== "paket");          // sembunyikan tab yang tidak dipilih
        $("produk").classList.toggle("hidden", nama !== "produk");
        document.querySelectorAll("[data-tab]").forEach(b => {            // ganti warna tombol tab
            const on = b.dataset.tab === nama;
            b.classList.remove(...AKTIF, ...NONAKTIF);
            b.classList.add(...(on ? AKTIF : NONAKTIF));
        });
        saring($("cari").value);
    }
    document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => tampilTab(b.dataset.tab)));

    /* ---------- PENCARIAN ---------- */
    // Menyembunyikan baris/kartu yang namanya tidak mengandung kata yang diketik
    function saring(kata) {
        const q = kata.trim().toLowerCase();
        document.querySelectorAll("#katalog li[data-nama]").forEach(li =>
            li.style.display = li.dataset.nama.toLowerCase().includes(q) ? "" : "none");
        document.querySelectorAll("#katalog > .card").forEach(kartu =>    // kartu kategori yang kosong ikut disembunyikan
            kartu.style.display = [...kartu.querySelectorAll("li")].some(li => li.style.display !== "none") ? "" : "none");
        document.querySelectorAll("#katalog-paket > article").forEach(a =>
            a.style.display = (a.dataset.nama + " " + a.textContent).toLowerCase().includes(q) ? "" : "none");

        const wadah = tabAktif === "paket" ? "#katalog-paket > *" : "#katalog > *";
        $("hasilKosong").classList.toggle("hidden", [...document.querySelectorAll(wadah)].some(el => el.style.display !== "none"));
    }
    $("cari").addEventListener("input", e => saring(e.target.value));

    /* ---------- PANEL "PESANAN KAMU" ---------- */
    // Menggambar ulang daftar barang + total. Kolom nama/catatan tidak ikut digambar ulang
    // supaya yang sedang diketik tidak hilang.
    function renderPanel() {
        const items = K.daftar();
        $("daftarPesan").innerHTML = items.length
            ? items.map(i => `<li data-id="${i.id}" data-nama="${i.nama}" data-harga="${i.harga}" class="flex items-center justify-between gap-2">
          <div class="min-w-0"><p class="truncate">${i.nama}</p><p class="text-xs text-green-200">${K.rp(i.qty * i.harga)}</p></div>
          <div data-kontrol class="panel-ctl">${K.kontrol(i.id)}</div></li>`).join("")
            : `<li class="text-green-100">Belum ada barang. Pilih paket atau produk di sebelah kiri.</li>`;
        $("totalPesan").textContent = K.rp(K.total());
        if (document.activeElement !== $("hari")) $("hari").value = K.hari();
    }
    document.addEventListener("keranjang:ubah", renderPanel);   // diumumkan keranjang.js tiap ada perubahan
    renderPanel();

    $("hari").addEventListener("change", e => K.setHari(e.target.value));
    $("kosongkan").addEventListener("click", () => K.kosongkan());

    /* ---------- KIRIM KE WHATSAPP ---------- */
    $("kirim").addEventListener("click", () => {
        const nama = $("nama").value.trim(), catatan = $("catatan").value.trim();
        const error = msg => { $("err").textContent = msg; $("err").classList.remove("hidden"); };
        if (!K.daftar().length) return error("Pilih minimal satu paket atau produk dulu.");
        if (!nama) return error("Nama wajib diisi.");
        $("err").classList.add("hidden");
        window.open(K.linkWA({ nama, catatan }), "_blank");       // isi chat dirakit oleh Keranjang.linkWA
    });

    /* ---------- MEMBACA ALAMAT HALAMAN ---------- */
    // pesan.html#produk -> buka tab Produk | pesan.html#kat-tenda -> tab Produk lalu geser ke kategori Tenda
    const hash = location.hash;
    tampilTab(hash === "#produk" || hash.startsWith("#kat-") ? "produk" : "paket");
    if (hash.startsWith("#kat-")) setTimeout(() => { const el = document.querySelector(hash); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 300);
})();