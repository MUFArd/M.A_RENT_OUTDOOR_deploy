/* =====================================================================
   FORM KONTAK  —  halaman kontak.html

   Tugasnya:
   1. Menampilkan "Pesanan kamu" (barang dari keranjang) di dalam form.
   2. Mengecek isian form.
   3. Menyusun semua isian + pesanan menjadi satu teks, lalu membuka
      WhatsApp penjual dengan teks itu sudah terisi.
   Catatan: pembeli tetap menekan tombol kirim sendiri di WhatsApp.
   ===================================================================== */
(() => {
    "use strict";
    const K = window.Keranjang;                                // dari keranjang.js
    const WA = (window.TOKO || {}).wa || "6289606981787";      // nomor penjual dari data-produk.js
    const $ = id => document.getElementById(id);

    /* ---------- 1. RINGKASAN PESANAN DI DALAM FORM ---------- */
    function renderRingkasan() {
        const wadah = $("ringkasan");
        const items = K.daftar();
        // label kolom pesan berubah: wajib jika keranjang kosong, opsional jika ada pesanan
        $("lblPesan").textContent = items.length ? "Catatan tambahan (opsional)" : "Pesan *";

        if (!items.length) {
            wadah.innerHTML = `<p class="text-sm text-green-100">Belum ada barang dipilih.
        <a class="underline" href="paket.html">Pilih paket</a> atau <a class="underline" href="produk.html">pilih produk</a>,
        atau langsung tulis pesan di bawah.</p>`;
            return;
        }
        wadah.innerHTML = `<div class="bg-green-950/60 rounded-xl p-3">
      <p class="font-bold mb-2"><i class="fa-solid fa-basket-shopping mr-2"></i>Pesanan kamu</p>
      <ul class="text-sm space-y-1.5">
        ${items.map(i => `<li class="flex justify-between gap-2">
          <span>${i.qty}× ${i.nama}</span>
          <span class="flex items-center gap-2 whitespace-nowrap">${K.rp(i.qty * i.harga)}
            <button type="button" data-hapus="${i.id}" aria-label="Hapus ${i.nama}" class="text-red-300 hover:text-red-200">✕</button></span>
        </li>`).join("")}
      </ul>
      <div class="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-sm">
        <label for="hari">Lama sewa (hari)</label>
        <input id="hari" type="number" min="1" max="30" value="${K.hari()}" class="field text-center" style="width:5rem;padding:.35rem">
      </div>
      <p class="flex justify-between font-bold mt-2"><span>Estimasi total</span><span>${K.rp(K.total())}</span></p>
      <button type="button" id="kosongkan" class="text-xs underline text-green-200 mt-2">Kosongkan pesanan</button>
    </div>`;
    }

    // Klik ✕ / "Kosongkan" / ubah lama sewa
    $("ringkasan").addEventListener("click", e => {
        if (e.target.dataset.hapus) K.hapus(e.target.dataset.hapus);
        if (e.target.id === "kosongkan") K.kosongkan();
    });
    $("ringkasan").addEventListener("change", e => { if (e.target.id === "hari") K.setHari(e.target.value); });
    document.addEventListener("keranjang:ubah", renderRingkasan);   // tampil ulang tiap keranjang berubah
    renderRingkasan();

    // Tombol "tanya paket" di halaman lain mengirim ?pesan=... -> otomatis mengisi kolom pesan
    const awal = new URLSearchParams(location.search).get("pesan");
    if (awal) $("pesan").value = awal;

    /* ---------- 2 & 3. CEK FORM LALU KIRIM KE WHATSAPP ---------- */
    $("waForm").addEventListener("submit", e => {
        e.preventDefault();
        const nama = $("nama").value.trim(), hp = $("hp").value.trim();
        const email = $("email").value.trim(), pesan = $("pesan").value.trim();
        const adaPesanan = K.daftar().length > 0;
        const error = msg => { $("err").textContent = msg; $("err").classList.remove("hidden"); };

        if (!nama || !hp) return error("Nama dan nomor HP wajib diisi.");
        if (!adaPesanan && !pesan) return error("Tulis pesan atau pilih barang terlebih dulu.");
        if (!/^[0-9+\-\s]{9,16}$/.test(hp)) return error("Nomor HP tidak valid. Contoh: 081234567890.");
        if (email && !/^\S+@\S+\.\S+$/.test(email)) return error("Format email belum benar.");
        $("err").classList.add("hidden");

        // Susun isi chat. Bagian yang kosong dilewati.
        const bagian = [
            `Halo M.A Outdoor Rent, saya ${nama}.`,
            `No. HP: ${hp}` + (email ? `\nEmail: ${email}` : "") + `\nJenis: ${$("jenis").value}`,
            adaPesanan ? K.teks() : "",
            pesan ? `${adaPesanan ? "Catatan" : "Pesan"}:\n${pesan}` : "",
        ].filter(Boolean);

        window.open(`https://wa.me/${WA}?text=${encodeURIComponent(bagian.join("\n\n"))}`, "_blank");
    });
})();