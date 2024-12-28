// Konfigurasi Database
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB terhubung!');
    } catch (err) {
        console.error('Gagal terhubung ke MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
