
// ...existing code...
const express = require('express');
const cors = require('cors');
const app = express();

// GELEN İSTEKLERİ LOGLA (başta ekle)
app.use((req, res, next) => {
    console.log('>>> Incoming request:', req.method, req.url);
    console.log('Headers:', req.headers);
    next();
});

// Geliştirme için basit CORS - tüm originlere izin
app.use(cors()); // veya app.use(cors({ origin: 'http://localhost:5175', credentials: true }));
app.use(express.json());

// ...existing code...
// örnek route
app.get('/employees', (req, res) => {
    // ...veritabanı kodu...
    res.json([{ id: 1, name: 'Ali', position: 'Dev', department: 'IT', status: 'Active', email: 'a@x.com' }]);
});

// ...existing code...
app.listen(5000, () => console.log('Server listening on 5000'));