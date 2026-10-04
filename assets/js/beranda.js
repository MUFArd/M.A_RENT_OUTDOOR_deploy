/* =====================================================================
   BERANDA (index.html)  —  menampilkan produk di halaman depan

   Mengisi dua tempat kosong di index.html dari data-produk.js:
   - #kategori-beranda : kotak kategori (Tenda, Carrier, dst.)
   - #favorit-beranda  : barang yang paling sering disewa
   Kotak kategori membuka halaman Produk (langsung ke kategorinya). Kartu favorit punya tombol "Tanya" ke WhatsApp toko.
   ===================================================================== */
(() => {
    "use strict";
    const DATA = window.KATEGORI || [];
    const rp = n => "Rp " + n.toLocaleString("id-ID");
    const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");   // sama dengan di keranjang.js
    const PRODUK = "src/page/produk.html";
    const WA = (window.TOKO || {}).wa || "6289606981787";   // nomor toko dari data-produk.js

    /* ---- Kotak kategori: ikon besar, jumlah item, harga mulai dari ---- */
    const kat = document.getElementById("kategori-beranda");
    if (kat) kat.innerHTML = DATA.map(k => {
        const termurah = Math.min(...k.barang.map(b => b[1]));            // harga paling kecil di kategori itu
        return `<a href="${PRODUK}#kat-${slug(k.nama)}" class="card group flex flex-col items-center text-center gap-2 py-6">
      <span class="w-16 h-16 flex items-center justify-center rounded-full bg-green-800 text-white text-3xl group-hover:scale-110 transition">
        <i class="fa-solid ${k.ikon}"></i></span>
      <b>${k.nama}</b>
      <span class="text-xs text-green-800">${k.barang.length} item · mulai ${rp(termurah)}</span></a>`;
    }).join("");

    /* ---- Barang favorit: ubah daftar nama di bawah sesuai selera ---- */
    const FAVORIT = ["Tenda Kap 4-5", "Carrier 55L", "Sleeping Bag", "Kompor", "Nesting", "Headlamp", "Matras Spons", "Flysheet 3x6"];
    const fav = document.getElementById("favorit-beranda");
    if (fav) fav.innerHTML = FAVORIT.map(nama => {
        for (const k of DATA) {                                           // cari barang itu di semua kategori
            const b = k.barang.find(x => x[0] === nama);
            if (b) return `<div class="card flex flex-col gap-3">
        <div class="h-28 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-400 text-4xl"><i class="fa-solid ${k.ikon}"></i></div>
        <div><h4 class="font-bold">${nama}</h4><p class="text-sm text-green-800">${rp(b[1])}<small>/hari</small></p></div>
        <a href="https://wa.me/${WA}?text=${encodeURIComponent("Halo M.A Outdoor Rent, saya mau tanya " + nama)}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-800 text-white text-sm font-semibold hover:bg-green-900 transition"><i class="fa-brands fa-whatsapp"></i>Tanya</a></div>`;
        }
        return "";                                                        // nama tidak ditemukan -> dilewati
    }).join("");
})();