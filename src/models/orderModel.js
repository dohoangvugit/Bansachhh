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
            console.error(error)
            return null
        }

        return data
    },

    getAllOrders: async () => {

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                users (
                    fullname
                )
            `)
            .order('id', { ascending: false })

        if (error) {
            console.error(error)
            return []
        }

        return data
    },

    getOrderById: async (id) => {

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                users (
                    fullname
                )
            `)
            .eq('id', id)
            .single()

        if (error) {
            console.error(error)
            return null
        }

        return data
    },

    getOrderItems: async (orderId) => {

        const { data, error } = await supabase
            .from('order_items')
            .select(`
                *,
                books (
                    title
                )
            `)
            .eq('order_id', orderId)

        if (error) {
            console.error(error)
            return []
        }

        return data
    },

    delete: async (id) => {

        await supabase
            .from('order_items')
            .delete()
            .eq('order_id', id)

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(error)
        }
    }
}

module.exports = orderModel