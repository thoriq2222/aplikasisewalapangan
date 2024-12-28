const Lapangan = require('../models/Lapangan');
const mongoose = require('mongoose');

// Mendapatkan semua pemesanan lapangan
exports.getAllLapangan = async (req, res) => {
    try {
        const lapangan = await Lapangan.find();
        res.status(200).json({ success: true, data: lapangan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data lapangan.', error: error.message });
    }
};

// Mendapatkan pemesanan lapangan berdasarkan ID
exports.getLapanganById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID tidak valid.' });
    }

    try {
        const lapangan = await Lapangan.findById(id);
        if (!lapangan) {
            return res.status(404).json({ success: false, message: 'Lapangan tidak ditemukan.' });
        }
        res.status(200).json({ success: true, data: lapangan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mendapatkan data lapangan.', error: error.message });
    }
};

//Menambahkan pemesanan
exports.addLapangan = async (req, res) => {
    console.log(req.body); // Debugging: Log data yang diterima dari request

    const { namapengguna, email, tanggal, waktu, jumlahJam, tipeLapangan, catatan, harga } = req.body;

    if (!namapengguna || !email || !tanggal || !waktu || !jumlahJam || !tipeLapangan || catatan === undefined || harga === undefined) {
        return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    const newLapangan = new Lapangan({
        namapengguna,
        email,
        tanggal,
        waktu,
        jumlahJam,
        tipeLapangan,
        catatan,
        harga,
    });

    try {
        const savedLapangan = await newLapangan.save();
        res.status(201).json({ success: true, data: savedLapangan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambahkan lapangan.', error: error.message });
    }
};
