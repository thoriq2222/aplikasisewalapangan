const express = require('express');
require('dotenv').config();  // Memuat variabel lingkungan dari file .env
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/database');
const lapanganRoutes = require('./routes/lapanganRoutes'); // Import rute lapangan
const Lapangan = require('./models/Lapangan'); // Pastikan sudah diimport
const nodemailer = require('nodemailer');
const app = express();
connectDB();


// Gunakan PORT dari .env atau fallback ke 4000 jika tidak ada
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Melayani file statis dari folder public

// Fungsi untuk menghubungkan ke database dan memulai server setelahnya
const startServer = async () => {
    try {
        await connectDB();  // Pastikan fungsi connectDB tersedia dan berjalan
        console.log('Terhubung ke MongoDB!');

        // Jalankan server setelah berhasil terhubung ke database
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Gagal terhubung ke MongoDB:', err);
        process.exit(1); // Keluar dari aplikasi jika koneksi gagal
    }
};


app.use(bodyParser.json()); // Untuk menangani JSON
app.use(bodyParser.urlencoded({ extended: true })); // Untuk menangani form-urlencoded


// Konfigurasi transporter Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Disini kita menggunakan layanan Gmail
  auth: {
    user: process.env.EMAIL_USER, // Masukkan email pengirim dari environment variable
    pass: process.env.EMAIL_PASS  // Masukkan password email pengirim dari environment variable
  }
});

// Fungsi untuk mengirim email
const sendConfirmationEmail = (data) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Email pengirim
    to: data.email, // Email penerima
    subject: 'Pemesanan Lapangan Sukses!',
    text: `
      Hi ${data.namapengguna},

      Terima kasih atas pemesanan lapangan Anda! Berikut adalah detail pemesanan lapangan di Padang Sport Center:

      - Nama Pengguna: ${data.namapengguna}
      - Tanggal: ${data.tanggal}
      - Waktu: ${data.waktu}
      - Jumlah Jam: ${data.jumlahJam}
      - Tipe Lapangan: ${data.tipeLapangan}
      - Catatan: ${data.catatan}
      - Harga: ${data.harga}

    Kami sarankan untuk datang 10 menit lebih awal dari jadwal yang anda pesan,Jika setelah 30 Menit dari jadwal anda belum ada di Padang Sport Center,maka pemesanan anda kami anggap tidak jadi dan uang anda hanya kami kembalikan 50% dari total harga pemesanan.
     
    Terima kasih telah memilih Padang Sport Center untuk Tempat Anda Olahraga.

      Salam,
      Padang Sport Center Team
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error while sending email:', error);
    }
    console.log('Email sent: ' + info.response);
  });
};

app.post('/lapangan', async (req, res) => {
    try {
      const { namapengguna, tanggal, waktu, jumlahJam, tipeLapangan, catatan, harga, email } = req.body;
  
      // Validasi input
      if (!namapengguna || !tanggal || !waktu || !jumlahJam || !tipeLapangan || !catatan || !harga || !email) {
        return res.status(400).json({ error: 'Semua field harus diisi.' });
      }
  
      // Simpan pemesanan ke database MongoDB tanpa pengecekan ketersediaan
      const lapangan = new Lapangan({
        namapengguna,
        tanggal,
        waktu,
        jumlahJam,
        tipeLapangan,
        catatan,
        harga,
        email
      });
  
      await lapangan.save(); // Menyimpan ke MongoDB
  
      // Kirim email konfirmasi setelah pemesanan berhasil disimpan
      sendConfirmationEmail({ namapengguna, tanggal, waktu, jumlahJam, tipeLapangan, catatan, harga, email });
  
      console.log('Pemesanan berhasil disimpan:', {
        namapengguna, tanggal, waktu, jumlahJam, tipeLapangan, catatan, harga, email
      });
  
      // Redirect ke halaman konfirmasi
      res.redirect('/konfirmasi');
    } catch (err) {
      console.error('Gagal menyimpan pemesanan:', err);
      res.status(500).send('Terjadi kesalahan saat memproses pemesanan.');
    }
  });
  




// Rute utama untuk mengakses data lapangan
app.use('/api', lapanganRoutes);

// Default route untuk melayani index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk melayani sewalapangan.html
app.get('/sewalapangan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sewalapangan.html'));
});


// Route untuk melayani konfirmasi.html
app.get('/akun', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'akun.html'));
});

// Mulai server setelah terhubung ke database
startServer();
