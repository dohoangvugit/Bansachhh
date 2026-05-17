const mysql = require('../config/mysql')

const authModel = {

    login: async (email, password) => {
        try{
            const sql = 'SELECT * FROM users WHERE email = ? AND password = ?'
            const [rows] = await mysql.execute(sql, [email, password])
            console.log('Kết quả đăng nhập:', rows)
            return rows[0]
        } catch (error) {
            console.error('lỗi đăng nhập:', error)
            throw error
        }
    },

    logout: async (userId) => {
        return true
    },

    register: async (fullname, password, email, phone) => {
        try {
            const sql = 'INSERT INTO users (fullname, password, email, phone) VALUES (?, ?, ?, ?)'
            const [result] = await mysql.execute(sql, [fullname, password, email, phone])
            console.log('Kết quả đăng ký:', result)
            return result.insertId
        } catch (error) {
            console.error('lỗi đăng ký:', error)
            throw error
        }
    }
}

module.exports = authModel

// authModel.login('testuser', 'password123')
//     .then(user => {
//         if (user) {
//             console.log('Đăng nhập thành công:', user)
//         } else {
//             console.log('Đăng nhập thất bại')
//         }
//     })
//     .catch(err => {
//         console.error('lỗi đăng nhập:', err)
//     })

// authModel.register(
//     'testuser',
//     'password123',
//     'testuser@example.com',
//     '1234567890'
// )
// .then(userId => {
//     console.log('User ID:', userId)
// })
// .catch(err => {
//     console.error(err)
// })