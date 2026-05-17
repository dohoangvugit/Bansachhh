const authModel = require('../models/authModel')

const authController = {

    authPage: (req, res) => {
        const mode = req.query.mode || 'login'

        res.render('auth', {
            isLogin: mode === 'login'
        })
    },

    login: async (req, res) => {
        try{
            const { email, password } = req.body

            console.log("LOGIN:", email, password)

            const user = await authModel.login(email, password)

            if (!user) {
                return res.status(401).json({ message: "login failed" })
            }

            return res.status(200).json({ message: "login success", user })

        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    register: async (req, res) => {
        try{
            const { email, password, fullname, phone } = req.body

            console.log("REGISTER:", email, password, fullname, phone)

            const userId = await authModel.register(fullname, password, email, phone)

            return res.status(201).json({ message: "register success", userId })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    }
}

module.exports = authController
