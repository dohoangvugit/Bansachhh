const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'book_store',
})

async function query(sql, params) {
    const [rows] = await pool.execute(sql, params)
    return rows
}

async function execute(sql, params) {
    return pool.execute(sql, params)
}

(async () => {
    try {
        await pool.execute('SELECT 1');
        console.log('Kết nối thành công')
    } catch (error) {
        console.error('Kết nối thất bại', error.message)
    }
})()

module.exports = { query, execute, pool }
