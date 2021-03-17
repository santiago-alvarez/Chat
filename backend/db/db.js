const {Pool} = require('pg');
require('dotenv').config();
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    multipleStatements: true
});

pool.on('remove', client =>{
    console.log('Disconnect');
});

console.log(`succesfull conection with database ${pool.options.database}`);
module.exports = pool;