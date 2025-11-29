const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'sinem',
    host: 'localhost',
    database: 'humanresources',
    password: 'YOUR_PASSWORD', // Postgres şifreni buraya yaz
    port: 5432,
});

app.get('/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employees');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
