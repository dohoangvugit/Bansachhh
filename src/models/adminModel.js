const supabase = require('../config/db')

const adminModel = {

    allUsers: async () => {
        try {
            const { data: users, error } = await supabase
                .from('users')
                .select('*')

            if (error) {
                console.error('Lỗi lấy danh sách tài khoản:', error)
                return null
            }

            return users

        } catch (error) {
            console.error('Lỗi lấy danh sách tài khoản:', error)
            throw error
        }
    },

    deleteUser: async (id) => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Lỗi xóa tài khoản:', error)
                return null
            }

            return user

        } catch (error) {
            console.error('Lỗi xóa tài khoản:', error)
            throw error
        }
    },

    updateUser: async (id, data) => {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .update(data)
                .eq('id', id)

            if (error) {
                console.error('Lỗi cập nhật tài khoản:', error)
                return null
            }

            return user

        } catch (error) {
            console.error('Lỗi cập nhật tài khoản:', error)
            throw error
        }
    },
}

module.exports = adminModel

// adminModel.allUsers().then(users => {
//     console.log(users)
// })