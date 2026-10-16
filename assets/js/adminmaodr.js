
const API_ADMIN_GALERI =
    'https://script.google.com/macros/s/AKfycbz6lCyzzyOyHrEv9v6prYj8ZVurVvk3RhvCvD1RuvZ-wMZNflgbavvoUevwMr7usETEWA/exec';

const $admin = (id) => document.getElementById(id);

const inputGambar = $admin('input-gambar');
const previewGrid = $admin('preview-grid');
const pilihanFile = $admin('pilihan-file');
const formUpload = $admin('form-upload');
const btnUpload = $admin('btn-upload');
const uploadStatus = $admin('upload-status');
const adminGaleriGrid = $admin('admin-galeri-grid');
const adminGaleriStatus = $admin('admin-galeri-status');

let fileTerpilih = [];
let previewUrls = [];

function bersihkanPreview() {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    previewUrls = [];
}

function tampilkanPilihanFile() {
    bersihkanPreview();
    previewGrid.replaceChildren();

    fileTerpilih = Array.from(inputGambar.files || []).filter((file) =>
        file.type.startsWith('image/')
    );

    if (fileTerpilih.length === 0) {
        pilihanFile.textContent = 'Belum ada gambar dipilih.';
        return;
    }

    pilihanFile.textContent = `${fileTerpilih.length} gambar dipilih.`;

    fileTerpilih.forEach((file) => {
        const url = URL.createObjectURL(file);
        previewUrls.push(url);

        const kartu = document.createElement('div');
        kartu.className = 'overflow-hidden rounded-xl border border-green-900/10 bg-white';

        const gambar = document.createElement('img');
        gambar.src = url;
        gambar.alt = file.name;
        gambar.className = 'aspect-square w-full object-cover';

        const nama = document.createElement('p');
        nama.className = 'truncate p-2 text-xs text-green-950';
        nama.textContent = file.name;
        nama.title = file.name;

        kartu.append(gambar, nama);
        previewGrid.appendChild(kartu);
    });
}

inputGambar.addEventListener('change', tampilkanPilihanFile);

// Kompres gambar menjadi JPEG agar ukuran upload lebih ringan
function kompresGambar(file, maksimal = 1280, kualitas = 0.8) {
    return new Promise((resolve, reject) => {
        const gambar = new Image();
        const url = URL.createObjectURL(file);

        gambar.onload = () => {
            try {
                const skala = Math.min(
                    1,
                    maksimal / Math.max(gambar.naturalWidth, gambar.naturalHeight)
                );

                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(gambar.naturalWidth * skala));
                canvas.height = Math.max(1, Math.round(gambar.naturalHeight * skala));

                const context = canvas.getContext('2d');

                if (!context) {
                    throw new Error('Browser tidak mendukung pemrosesan gambar.');
                }

                context.drawImage(gambar, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        URL.revokeObjectURL(url);

                        if (!blob) {
                            reject(new Error('Gagal memproses gambar.'));
                            return;
                        }

                        resolve(blob);
                    },
                    'image/jpeg',
                    kualitas
                );
            } catch (error) {
                URL.revokeObjectURL(url);
                reject(error);
            }
        };

        gambar.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Tidak dapat membaca gambar ${file.name}.`));
        };

        gambar.src = url;
    });
}

function blobKeBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const hasil = String(reader.result);
            resolve(hasil.split(',')[1]);
        };

        reader.onerror = () => reject(new Error('Gagal membaca data gambar.'));
        reader.readAsDataURL(blob);
    });
}

async function uploadSatuGambar(file) {
    const blob = await kompresGambar(file);
    const base64 = await blobKeBase64(blob);

    const namaAman =
        file.name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '_') || 'gambar';

    const nama = `${namaAman}.jpg`;

    const response = await fetch(API_ADMIN_GALERI, {
        method: 'POST',
        // Tidak menambahkan Content-Type agar tidak memicu preflight JSON.
        body: JSON.stringify({
            nama,
            mimeType: 'image/jpeg',
            base64,
        }),
    });

    if (!response.ok) {
        throw new Error(`Upload ${file.name} gagal.`);
    }

    const hasil = await response.json();

    if (hasil.status !== 'ok') {
        throw new Error(hasil.message || `Upload ${file.name} gagal.`);
    }
}

formUpload.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (fileTerpilih.length === 0) {
        uploadStatus.textContent = 'Pilih gambar terlebih dahulu.';
        return;
    }

    const daftarUpload = [...fileTerpilih];

    btnUpload.disabled = true;
    inputGambar.disabled = true;
    uploadStatus.className = 'whitespace-pre-line text-sm text-green-800';

    let berhasil = 0;
    const gagal = [];

    try {
        for (let i = 0; i < daftarUpload.length; i++) {
            const file = daftarUpload[i];

            uploadStatus.textContent =
                `Mengupload ${i + 1} dari ${daftarUpload.length}: ${file.name}`;

            try {
                await uploadSatuGambar(file);
                berhasil++;
            } catch (error) {
                console.error(error);
                gagal.push(`${file.name}: ${error.message}`);
            }
        }

        uploadStatus.textContent =
            `Selesai. Berhasil: ${berhasil}. Gagal: ${gagal.length}.` +
            (gagal.length ? '\n' + gagal.join('\n') : '');

        if (gagal.length) {
            uploadStatus.className = 'whitespace-pre-line text-sm text-red-700';
        }

        inputGambar.value = '';
        fileTerpilih = [];
        previewGrid.replaceChildren();
        bersihkanPreview();
        pilihanFile.textContent = 'Belum ada gambar dipilih.';

        await muatGaleriAdmin();
    } finally {
        btnUpload.disabled = false;
        inputGambar.disabled = false;
    }
});

async function muatGaleriAdmin() {
    adminGaleriGrid.replaceChildren();
    adminGaleriStatus.classList.remove('hidden');
    adminGaleriStatus.textContent = 'Memuat galeri...';

    try {
        const response = await fetch(API_ADMIN_GALERI);

        if (!response.ok) {
            throw new Error('Gagal mengambil data galeri.');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(data.message || 'Format data galeri tidak valid.');
        }

        const gambarAktif = data
            .filter((item) => {
                return (
                    item.deleted === false ||
                    String(item.deleted).trim().toLowerCase() === 'false'
                );
            })
            .filter((item) => item.url && item.file_id);

        // Gambar terbaru ditampilkan lebih dahulu
        gambarAktif.reverse();

        if (gambarAktif.length === 0) {
            adminGaleriStatus.textContent = 'Belum ada gambar di galeri.';
            return;
        }

        const fragment = document.createDocumentFragment();

        gambarAktif.forEach((item) => {
            const kartu = document.createElement('article');

            kartu.className =
                'group overflow-hidden rounded-xl border border-green-900/10 bg-white shadow-sm';

            const wadahGambar = document.createElement('div');
            wadahGambar.className =
                'aspect-square overflow-hidden bg-green-900/10';

            const gambar = document.createElement('img');
            gambar.src = item.url;
            gambar.alt = item.nama_file || 'Gambar galeri';
            gambar.loading = 'lazy';
            gambar.decoding = 'async';
            gambar.className =
                'h-full w-full object-cover transition duration-300 group-hover:scale-105';

            gambar.onerror = () => {
                kartu.remove();

                if (adminGaleriGrid.children.length === 0) {
                    adminGaleriStatus.classList.remove('hidden');
                    adminGaleriStatus.textContent = 'Gambar tidak dapat dimuat.';
                }
            };

            wadahGambar.appendChild(gambar);

            const isi = document.createElement('div');
            isi.className = 'space-y-3 p-3';

            const nama = document.createElement('p');
            nama.className = 'truncate text-sm font-medium text-green-950';
            nama.textContent = item.nama_file || 'Tanpa nama';
            nama.title = item.nama_file || '';

            const tombolHapus = document.createElement('button');
            tombolHapus.type = 'button';
            tombolHapus.className =
                'w-full rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50';

            tombolHapus.innerHTML =
                '<i class="fa-solid fa-trash-can mr-2"></i>Hapus';

            tombolHapus.addEventListener('click', async () => {
                const konfirmasi = confirm(
                    `Hapus gambar "${item.nama_file}" dari galeri?`
                );

                if (!konfirmasi) return;

                tombolHapus.disabled = true;
                tombolHapus.textContent = 'Menghapus...';

                try {
                    const response = await fetch(API_ADMIN_GALERI, {
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'delete',
                            file_id: item.file_id,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Permintaan penghapusan gagal.');
                    }

                    const hasil = await response.json();

                    if (hasil.status !== 'ok') {
                        throw new Error(hasil.message || 'Gagal menghapus gambar.');
                    }

                    // Muat ulang dari server supaya status mengikuti spreadsheet.
                    await muatGaleriAdmin();
                } catch (error) {
                    console.error(error);
                    alert(`Gagal menghapus gambar: ${error.message}`);

                    tombolHapus.disabled = false;
                    tombolHapus.innerHTML =
                        '<i class="fa-solid fa-trash-can mr-2"></i>Hapus';
                }
            });

            isi.append(nama, tombolHapus);
            kartu.append(wadahGambar, isi);
            fragment.appendChild(kartu);
        });

        adminGaleriGrid.appendChild(fragment);

        if (adminGaleriGrid.children.length === 0) {
            adminGaleriStatus.textContent = 'Gambar belum tersedia.';
            return;
        }

        adminGaleriStatus.classList.add('hidden');
    } catch (error) {
        console.error('Gagal memuat galeri admin:', error);
        adminGaleriStatus.textContent =
            'Galeri gagal dimuat. Periksa koneksi dan Apps Script.';
    }
}

$admin('btn-refresh').addEventListener('click', muatGaleriAdmin);

muatGaleriAdmin();
