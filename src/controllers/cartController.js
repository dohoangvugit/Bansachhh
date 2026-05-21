const cartModel = require('../models/cartModel')
const authModel = require('../models/authModel')

const cartController = {
    index: async (req, res) => {
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
                cart = await cartModel.createCart(userId)
            }

            const items = await cartModel.getCartItems(cart.id)

            const totalPrice = await cartModel.getTotalPrice(cart.id)

            return res.render('cart', {
                cart: items,
                totalPrice
            })

        } catch (error) {
            console.error('Cart index error:', error)
            return res.status(500).send('Lỗi server')
        }
    },

    addToCart: async (req, res) => {
        try {
            const userId = req.cookies.userId

            if (!userId) {
                return res.redirect('/auth?mode=login')
            }

            const { id, price, quantity } = req.body

            let cart = await cartModel.getCartByUserId(userId)

            if (!cart) {
                cart = await cartModel.createCart(userId)
            }

            await cartModel.addItem(cart.id, {
                book_id: id,
                price: Number(String(price).replace(/[^\d]/g, '')),
                quantity: Number(quantity || 1),
                image_url: req.body.image_url
            })

            return res.redirect('/cart')

        } catch (error) {
            console.error('Add cart error:', error)
            return res.status(500).send('Lỗi server')
        }
    },

    remove: async (req, res) => {
        try {
            const itemId = req.params.id

            await cartModel.removeItem(itemId)

            return res.redirect('/cart')

        } catch (error) {
            console.error('Remove cart error:', error)
            return res.status(500).send('Lỗi server')
        }
    }
}

module.exports = cartController