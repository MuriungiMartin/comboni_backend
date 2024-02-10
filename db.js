const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sudo1212@Root',
    database: 'comboni',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });

module.exports = pool;
