const WA_NUMBER = "6287873951239";

const $ = id => document.getElementById(id);
const pre = new URLSearchParams(location.search).get("pesan");
if (pre) $("pesan").value = pre;

$("waForm").addEventListener("submit", e => {
    e.preventDefault();
    const nama = $("nama").value.trim(), hp = $("hp").value.trim(), email = $("email").value.trim(), pesan = $("pesan").value.trim();
    const err = msg => { $("err").textContent = msg; $("err").classList.remove("hidden"); };
    if (!nama || !hp || !pesan) return err("Nama, nomor HP, dan pesan wajib diisi.");
    if (!/^[0-9+\-\s]{9,16}$/.test(hp)) return err("Nomor HP tidak valid. Contoh: 081234567890.");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return err("Format email belum benar.");
    $("err").classList.add("hidden");

    const text = `Halo M.A Outdoor Rent, saya ${nama}.\n` +
        `No. HP: ${hp}\n` + (email ? `Email: ${email}\n` : "") +
        `Jenis: ${$("jenis").value}\n\nPesan:\n${pesan}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
});