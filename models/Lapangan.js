// Model Collection dari database di MongoDb
const mongoose = require('mongoose');
const PemesananSchema = new mongoose.Schema({
    namapengguna: { type: String, required: true },
    email: { type: String, required: true },
    tanggal: { type: String, required: true },
    waktu: { type: String, required: true },
    jumlahJam: { type: Number, required: true },
    tipeLapangan: { type: String, required: true },
    catatan: { type: String },
    harga: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Pemesanan', PemesananSchema);
