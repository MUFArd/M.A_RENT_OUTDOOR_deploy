
const API = 'https://script.google.com/macros/s/AKfycbz6lCyzzyOyHrEv9v6prYj8ZVurVvk3RhvCvD1RuvZ-wMZNflgbavvoUevwMr7usETEWA/exec';

const CACHE_MENIT = 5;

function esc(teks) {
    return String(teks ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[c]);
}

async function ambilGaleri() {
    const key = 'cache_galeri';

    try {
        const simpan = JSON.parse(sessionStorage.getItem(key));

        if (
            simpan &&
            Date.now() - simpan.waktu < CACHE_MENIT * 60 * 1000
        ) {
            return simpan.data;
        }
    } catch (e) {
        // Lanjut tanpa cache jika sessionStorage tidak tersedia.
    }

    const response = await fetch(API);
    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(data?.message || 'Data galeri tidak valid.');
    }

    try {
        sessionStorage.setItem(key, JSON.stringify({
            waktu: Date.now(),
            data
        }));
    } catch (e) {
        // Cache opsional.
    }

    return data;
}
