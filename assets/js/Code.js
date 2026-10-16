// Tempel di Google Sheet: Extensions > Apps Script
// Lalu Deploy > New deployment > Web app (Execute as: Me, Access: Anyone)
// Setiap kali kode diubah: Deploy > Manage deployments > edit > Version: New version

const FOLDER_ID = '1mbXcuJ8bGm-W4nuTDyUSuMamvMLmXOhQ';
const KATEGORI = ['DOKUMENTASI', 'GALERI', 'PAKET', 'PRODUK', 'TRIP'];

// Kategori "ganti": satu nama = satu gambar. Upload lagi dengan nama sama = gambar diganti.
// Kategori lain ("tambah"): setiap upload menambah baris baru.
const GANTI = ['PAKET', 'PRODUK', 'TRIP'];

const MIME_BOLEH = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BASE64 = 4 * 1024 * 1024; // ~3 MB file asli

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return json({ error: 'Data tidak valid' }); }

  if (!KATEGORI.includes(body.kategori)) return json({ error: 'Kategori tidak valid' });
  if (!MIME_BOLEH.includes(body.mime)) return json({ error: 'Tipe file tidak diizinkan' });
  if (!body.data || body.data.length > MAX_BASE64) return json({ error: 'File kosong atau terlalu besar' });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(body.kategori);
  if (!sheet) return json({ error: 'Tab "' + body.kategori + '" tidak ditemukan' });

  const modeGanti = GANTI.includes(body.kategori);
  const nama = String(body.nama || '').trim().slice(0, 100);
  if (modeGanti && !nama) return json({ error: 'Nama wajib dipilih' });

  // Kunci supaya dua upload bersamaan tidak saling menimpa
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(body.data), body.mime, body.filename
    );
    const file = getFolderKategori(body.kategori).createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const url = 'https://lh3.googleusercontent.com/d/' + file.getId();

    if (modeGanti) {
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim() === nama) {
          const lama = rows[i][1];
          sheet.getRange(i + 1, 2).setValue(url);
          hapusFileLama(lama);
          return json({ success: true, diganti: true, gambar: url });
        }
      }
    }

    sheet.appendRow([nama || String(body.filename || ''), url]);
    return json({ success: true, diganti: false, gambar: url });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const hasil = [];
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(sheet => {
    if (!KATEGORI.includes(sheet.getName())) return; // lewati tab lain
    const [header, ...rows] = sheet.getDataRange().getValues();
    rows.forEach(r => {
      const item = Object.fromEntries(r.map((v, i) => [header[i], v]));
      item.kategori = sheet.getName();
      hasil.push(item);
    });
  });
  return json(hasil);
}

function getFolderKategori(nama) {
  const induk = DriveApp.getFolderById(FOLDER_ID);
  const cari = induk.getFoldersByName(nama);
  return cari.hasNext() ? cari.next() : induk.createFolder(nama);
}

// Buang gambar lama ke tempat sampah Drive, hanya kalau filenya memang di dalam folder utama
function hapusFileLama(url) {
  try {
    const m = String(url).match(/\/d\/([\w-]+)/);
    if (!m) return;
    const file = DriveApp.getFileById(m[1]);
    const ortu = file.getParents();
    if (!ortu.hasNext()) return;
    const kakek = ortu.next().getParents();
    if (kakek.hasNext() && kakek.next().getId() === FOLDER_ID) file.setTrashed(true);
  } catch (err) { /* abaikan, gambar baru sudah tersimpan */ }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}