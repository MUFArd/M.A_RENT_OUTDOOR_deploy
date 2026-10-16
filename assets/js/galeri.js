
const API_GALERI =
    'https://script.google.com/macros/s/AKfycbz6lCyzzyOyHrEv9v6prYj8ZVurVvk3RhvCvD1RuvZ-wMZNflgbavvoUevwMr7usETEWA/exec';

const galeriGrid = document.getElementById('galeri-grid');
const galeriStatus = document.getElementById('galeri-status');

async function muatGaleri() {
    galeriGrid.replaceChildren();
    galeriStatus.classList.remove('hidden');
    galeriStatus.textContent = 'Memuat galeri...';

    try {
        const response = await fetch(API_GALERI);

        if (!response.ok) {
            throw new Error('Gagal mengambil data galeri.');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(data.message || 'Format data tidak valid.');
        }

        const gambarAktif = data
            .filter((item) => {
                return (
                    item.deleted === false ||
                    String(item.deleted).trim().toLowerCase() === 'false'
                );
            })
            .filter((item) => item.url);

        // Gambar terbaru ditampilkan lebih dahulu
        gambarAktif.reverse();

        if (gambarAktif.length === 0) {
            galeriStatus.textContent = 'Belum ada gambar di galeri.';
            return;
        }

        const fragment = document.createDocumentFragment();

        gambarAktif.forEach((item) => {
            const wadah = document.createElement('div');

            wadah.className =
                'group aspect-square overflow-hidden rounded-xl bg-green-900/10';

            const gambar = document.createElement('img');

            gambar.src = item.url;
            gambar.alt = item.nama_file || 'Galeri M.A Outdoor Rent';
            gambar.loading = 'lazy';
            gambar.decoding = 'async';

            gambar.className =
                'h-full w-full object-cover transition duration-300 group-hover:scale-105';

            gambar.onerror = () => wadah.remove();

            wadah.appendChild(gambar);
            fragment.appendChild(wadah);
        });

        galeriGrid.appendChild(fragment);

        if (galeriGrid.children.length === 0) {
            galeriStatus.textContent = 'Gambar belum tersedia.';
            return;
        }

        galeriStatus.classList.add('hidden');
    } catch (error) {
        console.error('Gagal memuat galeri:', error);
        galeriStatus.textContent =
            'Galeri gagal dimuat. Silakan muat ulang halaman.';
    }
}

muatGaleri();
