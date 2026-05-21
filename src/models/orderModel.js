const supabase = require('../config/db')

const orderModel = {

    createOrder: async (userId, totalPrice, address) => {

        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: userId,
                    total_price: totalPrice,
                    address
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Lỗi tạo order:', error)
            return null
        }

        return data
    },

    addOrderItem: async (orderId, bookId, quantity, price) => {

        const { data, error } = await supabase
            .from('order_items')
            .insert([
                {
                    order_id: orderId,
                    book_id: bookId,
                    quantity,
                    price
                }
            ])

        if (error) {
            console.error('Lỗi thêm order item:', error)
            return null
        }

        return data
    }
}

module.exports = orderModel