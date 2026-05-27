const orderModel = require('../../models/orderModel')

const orderManagerController = {

    getAllOrders: async (req, res) => {
        try {

            const orders = await orderModel.getAllOrders()

            return res.render('admin/ordermanager', {
                layout: 'admin',
                orders,
            })

        } catch (error) {

            console.error('Get all orders error:', error)
            return res.status(500).send('Lỗi server')
        }
    },

    getOrderById: async (req, res) => {

        try {

            const orderId = req.params.id

            const order = await orderModel.getOrderById(orderId)

            const orderDetails = await orderModel.getOrderItems(orderId)

            return res.render('admin/orderdetail', {
                layout: 'admin',
                order,
                orderDetails
            })

        } catch (error) {

            console.error('Get order detail error:', error)
            return res.status(500).send('Lỗi server')
        }
    },

    delete: async (req, res) => {

        try {

            const orderId = req.params.id

            await orderModel.delete(orderId)

            return res.redirect('/admin/ordermanager')

        } catch (error) {

            console.error('Delete order error:', error)
            return res.status(500).send('Lỗi server')
        }
    },
}

module.exports = orderManagerController