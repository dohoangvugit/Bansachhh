const cartModel = require('../models/cartModel')
const authModel = require('../models/authModel')
const orderModel = require('../models/orderModel')

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

            let cart = await cartModel.getCartByUserId(userId)

            if (!cart) {
                return res.redirect('/cart')
            }

            const totalPrice = await cartModel.getTotalPrice(cart.id)

            return res.render('checkout', {
                user,
                totalPrice
            })

        } catch (error) {
            console.error('Checkout GET error:', error)
            return res.status(500).send('Lỗi server')
        }
    },

    postCheckOut: async (req, res) => {
        try {
            const userId = req.cookies.userId
            const { address } = req.body

            if (!userId) {
                return res.redirect('/auth?mode=login')
            }

            if (!address) {
                return res.status(400).send('Thiếu địa chỉ')
            }

            const cart = await cartModel.getCartByUserId(userId)

            if (!cart) {
                return res.redirect('/cart')
            }

            const items = await cartModel.getCartItems(cart.id)

            const totalPrice = await cartModel.getTotalPrice(cart.id)

            if (items.length === 0) {
                return res.redirect('/cart')
            }

            const order = await orderModel.createOrder(
                userId,
                totalPrice,
                address
            )

            if (!order) {
                return res.status(500).send('Không tạo được order')
            }

            for (let item of items) {
                await cartModel.removeItem(item.id)
            }

            return res.redirect('/?order=success')

        } catch (error) {
            console.error('Checkout POST error:', error)
            return res.status(500).send('Lỗi server')
        }
    }
}

module.exports = checkoutController