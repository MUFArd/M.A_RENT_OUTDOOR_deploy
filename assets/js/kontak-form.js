/* =====================================================================
   FORM KONTAK (kontak.html)  —  Nama, Pesan, Catatan + kotak "Pesanan kamu"

   Tugasnya:
   1. Menampilkan kotak "Pesanan kamu" (barang yang dipilih di halaman
      Paket/Produk) di dalam form: jumlah, harga, hapus, lama sewa, total.
   2. Mengecek isian form.
   3. Menyusun isian + pesanan menjadi satu teks, lalu membuka WhatsApp
      penjual dengan teks itu sudah terisi (pembeli menekan kirim sendiri).
   ===================================================================== */
(() => {
  "use strict";
  const K = window.Keranjang;                    // keranjang dari keranjang.js
  const $ = id => document.getElementById(id);

  /* ---------- 1. KOTAK "PESANAN KAMU" ---------- */
  function renderRingkasan() {
    const items = K.daftar();
    // Kolom Pesan wajib kalau keranjang kosong; opsional kalau sudah ada barang
    $("lblPesan").textContent = items.length ? "Pesan tambahan (opsional)" : "Pesan *";

    if (!items.length) {
      $("ringkasan").innerHTML = `<p class="text-sm text-green-100">Belum ada barang dipilih.
        <a class="underline" href="paket.html">Lihat paket</a> atau <a class="underline" href="produk.html">lihat produk</a>,
        atau langsung tulis pesan di bawah.</p>`;
      return;
    }
    $("ringkasan").innerHTML = `<div class="bg-green-950/60 rounded-xl p-3">
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

  // Klik ✕ / "Kosongkan" / ubah lama sewa (satu pendengar untuk seluruh kotak)
  $("ringkasan").addEventListener("click", e => {
    if (e.target.dataset.hapus) K.hapus(e.target.dataset.hapus);
    if (e.target.id === "kosongkan") K.kosongkan();
  });
  $("ringkasan").addEventListener("change", e => { if (e.target.id === "hari") K.setHari(e.target.value); });
  document.addEventListener("keranjang:ubah", renderRingkasan);   // tampil ulang tiap keranjang berubah
  renderRingkasan();

  // Tombol "tanya ..." di halaman lain bisa mengirim ?pesan=... -> mengisi kolom pesan
  const awal = new URLSearchParams(location.search).get("pesan");
  if (awal) $("pesan").value = awal;

  /* ---------- 2 & 3. CEK FORM LALU KIRIM KE WHATSAPP ---------- */
  $("waForm").addEventListener("submit", e => {
    e.preventDefault();                          // cegah halaman reload
    const nama = $("nama").value.trim(), pesan = $("pesan").value.trim(), catatan = $("catatan").value.trim();
    const error = msg => { $("err").textContent = msg; $("err").classList.remove("hidden"); };

    if (!nama) return error("Nama wajib diisi.");
    if (!K.daftar().length && !pesan) return error("Tulis pesan atau pilih barang terlebih dulu.");
    $("err").classList.add("hidden");

    // Daftar barang dari keranjang ikut otomatis (pesanan = teks() adalah bawaan linkWA)
    window.open(K.linkWA({ nama, pesan, catatan }), "_blank");
  });
})();