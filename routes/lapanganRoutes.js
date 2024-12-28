const express = require('express');
const router = express.Router();
const lapanganController = require('../controllers/lapanganController');

// GET untuk mendapatkan semua data pemesanan lapangan
router.get('/lapangan', lapanganController.getAllLapangan);

// POST untuk menambah data lapangan
router.post('/lapangan', lapanganController.addLapangan);

module.exports = router;
