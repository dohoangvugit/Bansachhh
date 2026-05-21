const orderModel = require('../models/orderModel')
const authModel = require('../models/authModel')

const checkoutController = {

    getCheckOutPage: async (req, res) => {
        try {

            const userId = req.cookies.userId

            if (!userId) {
                return res.redirect('/auth?mode=login')
            }

            const user = await authModel.getUserById(userId)

            if (!user) {
                return res.redirect('/auth?mode=login')
            }

            const totalPrice = Number(req.query.totalPrice) || 0

            return res.render('checkout', {
                user,
                totalPrice
            })

        } catch (error) {
            console.error(error)
            return res.status(500).send('Lỗi server')
        }
    },

    postCheckOut: async (req, res) => {
        try {

            const userId = req.cookies.userId

            if (!userId) {
                return res.redirect('/auth?mode=login')
            }

            const address = req.body.address
            const totalPrice = parseInt(req.query.totalPrice) || 0
            if (!address || !totalPrice) {
                return res.status(400).send('Thiếu dữ liệu')
            }

            const order = await orderModel.createOrder(
                userId,
                totalPrice,
                address
            )

            if (!order) {
                return res.status(500).send('Không tạo được order')
            }

            return res.redirect('/?order=success')

        } catch (error) {
            console.error(error)
            return res.status(500).send('Lỗi server')
        }
    }
}

module.exports = checkoutController