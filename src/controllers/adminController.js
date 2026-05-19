const adminModel = require('../models/adminModel')

const adminController = {

    getAllUsers: async (req, res) => {
        try {

            const users = await adminModel.allUsers()
            
            return res.render('admin/accmanager', {
                layout: 'admin',
                users
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params
            await adminModel.deleteUser(id)
            return res.redirect('/admin')
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    updateUser: async (req, res) => {
        try {            
            const { id } = req.params
            const { fullname, email, phone, password, role } = req.body
            
            const data = {
                fullname,
                email,
                phone,
                password,
                role
            }

            await adminModel.updateUser(id, data)
            return res.redirect('/admin')
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },
    
    getEditUser: async (req, res) => {
        try {
            const { id } = req.params
            const users = await adminModel.allUsers()
            const user = users.find(u => u.id === parseInt(id))            
            return res.render('admin/edituser', {
                layout: 'admin',
                user
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    }
}

module.exports = adminController
