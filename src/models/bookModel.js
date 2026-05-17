const mysql = require('../config/mysql')

const bookModel = {
    create: async (book) => {
        const sql = 'INSERT INTO books SET ?'
        const [result] = await mysql.execute(sql, [book])
        return result.insertId
    }
}

module.exports = bookModel
