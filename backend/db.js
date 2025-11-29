const { Pool } = require("pg");

const pool = new Pool({
    user: "sinem",
    host: "localhost",
    database: "humanresources",
    password: "141204",   // senin pg şifren
    port: 5432
});

module.exports = pool;
