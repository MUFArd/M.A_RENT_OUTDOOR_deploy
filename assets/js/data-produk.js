    /* =====================================================================
    DATA TOKO  —  file ini satu-satunya tempat untuk mengubah:
    nomor WhatsApp, Instagram, daftar paket, dan daftar barang + harga.
    Halaman lain tinggal membaca data dari sini (tidak perlu edit HTML).
    ===================================================================== */

    // ---- Info toko ------------------------------------------------------
    window.TOKO = {
        wa: "6289606981787",          // nomor WA format internasional: 62 + nomor tanpa 0 di depan, tanpa spasi/+
        tampil: "0896 0698 1787",     // versi yang ditampilkan ke pengunjung
        ig: "m.a_outdoor_rent",       // username Instagram (tanpa @)
        alamat: "Parung Panjang, Bogor",              // teks alamat yang tampil di footer
        lokasi: "M.A Outdoor Rent, Parung Panjang, Bogor",   // kata kunci Google Maps: NAMA TOKO + daerah, supaya peta menunjuk tokonya
        // Opsional: isi agar peta menunjuk titik yang PERSIS. Buka Google Maps -> cari tokomu -> Bagikan:
        //   mapsUrl   = "Salin link"  (contoh https://maps.app.goo.gl/xxxx)
        //   mapsEmbed = "Sematkan peta" -> salin isi src="..." dari kode iframe-nya
        // Dikosongkan = otomatis mencari "lokasi" di atas. Paling akurat: isi mapsUrl & mapsEmbed dari halaman toko di Google Maps.
        mapsUrl: "",
        mapsEmbed: "",
    };

    // ---- Paket ----------------------------------------------------------
    // Dari pricelist Paket Bundling. Harga dalam rupiah (50K = 50000). id harus unik.
    // "isi" hanya tampilan daftar isi paket. Boleh menambah "tagline": "..." bila ingin ada kalimat singkat di bawah nama paket.
    window.PAKET = [
        {
            id: "paket-santai", nama: "Santai", harga: 50000,
            gambar: "../../assets/img/paket/g1.jpeg",
            isi: ["Kursi Lipat 2 pcs", "Meja Lipat 1 pcs", "Tripod 1 pcs"]
        },
        {
            id: "paket-bbq", nama: "BBQ", harga: 50000,
            gambar: "../../assets/img/paket/g2.jpeg",       
            isi: ["Kompor Grill 1 pcs", "Grill Pan 1 pcs", "Gas 1 pcs", "Capitan 1 pcs"]
        },
        {
            id: "paket-tracking", nama: "Tracking", harga: 80000,
            gambar: "../../assets/img/paket/g3.jpeg",
            isi: ["Carrier 60L 1 pcs", "Sepatu 1 pcs", "Tracking Pole 1 pcs", "Headlamp 1 pcs"]
        },
        {
            id: "paket-berdua", nama: "Berdua", harga: 120000,
            gambar: "../../assets/img/paket/g4.jpeg",
            isi: ["Tenda Kap 2-3 1 pcs", "SB 2 pcs", "Matras 2 pcs", "Lampu Tenda 1 pcs", "Flysheet 1 pcs", "Kompor 1 pcs", "Cooking Set 1 pcs", "Gas 1 pcs"]
        },
        {
            id: "paket-ngopi", nama: "Ngopi", harga: 100000,
            gambar: "../../assets/img/paket/g5.jpeg",
            isi: ["Kursi Lipat 4 pcs", "Meja Lipat 1 pcs", "Cooking Set 1 pcs", "Kompor"]
        },
        {
            id: "paket-ngadem", nama: "Ngadem", harga: 35000,
            gambar: "../../assets/img/paket/g6.jpeg",
            isi: ["Flysheet 1 pcs", "Tiang Flysheet 1 pcs", "Tali Flysheet 1 pcs", "Pasak 8 pcs"]
        },
        {
            id: "paket-tektok", nama: "Tektok", harga: 65000,
            gambar: "../../assets/img/paket/g7.jpeg",
            isi: ["Hydropack 1 pcs", "Tracking Pole 1 pcs", "Sepatu 1 pcs"]
        },
        {
            id: "paket-rame-rame", nama: "Rame-rame", harga: 165000,
            gambar: "../../assets/img/paket/g8.jpeg",
            isi: ["Tenda Kap 4-5 1 pcs", "SB 4 pcs", "Matras 4 pcs", "Lampu Tenda 1 pcs", "Flysheet 1 pcs", "Kompor 1 pcs", "Cooking Set 1 pcs", "Gas 1 pcs"]
        },
        {
            id: "paket-mantai", nama: "Mantai", harga: 40000,
            gambar: "../../assets/img/paket/g9.jpeg",
            isi: ["Lensa Apexel", "Tripod Mixio"]
        },
        {
            id: "paket-piknik", nama: "Piknik", harga: 50000,
            isi: ["Keranjang", "Tikar Piknik", "Tripod", "Vas Bunga"]
        },
    ];

    // ---- Produk (dari pricelist) ---------------------------------------
    // Format tiap barang: ["Nama barang", harga per hari]
    window.KATEGORI = [
        {
            nama: "Tenda", ikon: "fa-campground", barang: [
                ["Tenda Kap 2-3", 35000], ["Tenda Kap 4-5", 50000], ["Tenda Kap 6-7", 75000]]
        },
        {
            nama: "Carrier", ikon: "fa-suitcase-rolling", barang: [
                ["Carrier 45L", 25000], ["Carrier 55L", 30000], ["Carrier 65L", 35000], ["Carrier 80L", 40000],
                ["Daypack", 15000], ["Hydropack", 20000]]
        },
        {
            nama: "Perlengkapan Masak", ikon: "fa-utensils", barang: [
                ["Kompor", 15000], ["Kompor BBQ", 20000], ["Jerigen Air", 5000], ["Wadah Telur", 5000],
                ["Grillpan", 5000], ["Nesting", 15000], ["Hicook", 15000], ["3 Set Piring Gelas", 10000]]
        },
        {
            nama: "Alat Outdoor", ikon: "fa-mountain", barang: [
                ["Flysheet 2x3", 10000], ["Flysheet 3x6", 20000], ["Tiang Flysheet", 10000], ["Sleeping Bag", 10000],
                ["Matras Spons", 5000], ["Matras Foil", 10000], ["Matras Piknik", 10000], ["Hamock", 10000],
                ["Kursi", 15000], ["Meja", 20000], ["Bantal Tiup", 5000], ["Tripod", 15000], ["Lensa Apexel", 25000]]
        },
        {
            nama: "Sepatu Tracking", ikon: "fa-shoe-prints", barang: [
                ["Sepatu Size 38-39", 25000], ["Sepatu Size 40", 30000], ["Sepatu Size 41", 30000],
                ["Sepatu Size 42", 30000], ["Sepatu Size 43", 30000]]
        },
        {
            nama: "Penerangan", ikon: "fa-lightbulb", barang: [
                ["Lampu Tenda", 10000], ["Senter", 10000], ["Headlamp", 10000], ["Lentera", 15000]]
        },
        {
            nama: "Perlengkapan Lainnya", ikon: "fa-toolbox", barang: [
                ["Gorpcore", 35000], ["Sarung Tangan", 10000], ["Topi Rimba", 10000], ["Trecking Pool", 15000],
                ["Power Bank", 20000], ["Jas Hujan Ponco", 15000], ["Jaket", 20000]]
        },
        {
            nama: "Raincover", ikon: "fa-umbrella", barang: [
                ["Raincover 45", 5000], ["Raincover 55", 7000], ["Raincover 60", 10000], ["Raincover 80", 15000]]
        },
    ];