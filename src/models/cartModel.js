const supabase = require('../config/db')

const cartModel = {
    getCartByUserId: async (userId) => {
        const { data, error } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Lỗi get cart:', error)
            return null
        }

        return data
    },

    createCart: async (userId) => {
        const { data, error } = await supabase
            .from('carts')
            .insert([{ user_id: userId }])
            .select()
            .single()

        if (error) {
            console.error('Lỗi tạo cart:', error)
            return null
        }

        return data
    },

    getCartItems: async (cartId) => {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                book_id,
                quantity,
                price,
                books (
                    title,
                    image_url
                )
            `)
            .eq('cart_id', cartId)

        if (error) {
            console.error('Lỗi get cart items:', error)
            return []
        }

        return data || []
    },

    addItem: async (cartId, book) => {

        const { book_id, price, quantity } = book

        const { data: existing, error: findError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', cartId)
            .eq('book_id', book_id)
            .maybeSingle()

        if (findError) {
            console.error('Find item error:', findError)
        }

        if (existing) {
            const { data, error } = await supabase
                .from('cart_items')
                .update({
                    quantity: existing.quantity + quantity
                })
                .eq('id', existing.id)
                .select()

            if (error) {
                console.error('Update cart item error:', error)
                return null
            }

            return data?.[0] || null
        }

        const { data, error } = await supabase
            .from('cart_items')
            .insert([{
                cart_id: cartId,
                book_id,
                price,
                quantity
            }])
            .select()

        if (error) {
            console.error('Add cart item error:', error)
            return null
        }

        return data?.[0] || null
    },

    removeItem: async (itemId) => {
        const { data, error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)
            .select()

        if (error) {
            console.error('Remove item error:', error)
            return null
        }

        return data
    },

    getTotalPrice: async (cartId) => {

        const { data, error } = await supabase
            .from('cart_items')
            .select('price, quantity')
            .eq('cart_id', cartId)

        if (error) {
            console.error('Total price error:', error)
            return 0
        }

        const safeData = data || []

        const total = safeData.reduce((sum, item) => {
            return sum + Number(item.price) * Number(item.quantity)
        }, 0)

        return total
    }
}

module.exports = cartModel