const supabase = require('../config/db')

const authModel = {

    login: async (emailUser, password) => {
        try {

            const email = emailUser.trim().toLowerCase()

            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .single()

            if (error || !user) {
                console.log('Sai tài khoản hoặc mật khẩu')
                return null
            }

            console.log('Đăng nhập thành công:', user)

            return user

        } catch (error) {
            console.error('Lỗi đăng nhập:', error)
            throw error
        }
    },

    logout: async (userId) => {
        return true
    },

    register: async (fullname, password, email, phone) => {
        try {

            const emailLower = email.trim().toLowerCase()

            const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', emailLower)
                .single()

            if (existingUser) {
                console.log('Email đã tồn tại')
                return null
            }

            const { data: user, error } = await supabase
                .from('users')
                .insert([
                    {
                        fullname,
                        password,
                        email: emailLower,
                        phone
                    }
                ])
                .select()

            if (error) {
                console.error('Lỗi đăng ký:', error)
                return null
            }

            console.log('Đăng ký thành công:', user)

            return user

        } catch (error) {
            console.error('Lỗi đăng ký:', error)
            throw error
        }
    },

    getUserById: async (userId) => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Lỗi lấy user:', error)
                return null
            }

            return user

        } catch (error) {
            console.error('Lỗi lấy user:', error)
            throw error
        }
    }
}

module.exports = authModel


// authModel.register(
//     'hoangvu',
//     'password123',
//     'vuker12345@gmail.com',
//     '1234567890'
// )

// authModel.login(
//     'vuker12345@gmail.com',
//     'password123'
// )