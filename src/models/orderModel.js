const supabase = require('../config/db')

const orderModel = {
    createOrder: async (userId, totalPrice, address) => {
        const { data, error } = await supabase
            .from('orders')
            .insert([{ user_id: userId, total_price: totalPrice, address }])
            .select()
            .single()
        if (error) { console.error('Lỗi tạo order:', error); return null; }
        return data
    },

    addOrderItem: async (orderId, bookId, quantity, price) => {
        const { data, error } = await supabase
            .from('order_items')
            .insert([{ order_id: orderId, book_id: bookId, quantity, price }])
        if (error) { console.error('Lỗi thêm order item:', error); return null; }
        return data
    },

    getAllOrders: async () => {
        try {
            const { data: orders, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (orderError) throw orderError;
            if (!orders || orders.length === 0) return [];

            const userIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))];

            const { data: users, error: userError } = await supabase
                .from('users')
                .select('id, fullname')
                .in('id', userIds);

            if (userError) {
                console.error('Lỗi lấy thông tin users:', userError);
            }

            const formattedOrders = orders.map(order => {
                const matchedUser = users ? users.find(u => u.id === order.user_id) : null;
                return {
                    ...order,
                    users: matchedUser ? { fullname: matchedUser.fullname } : null
                };
            });

            return formattedOrders;

        } catch (error) {
            console.error('Lỗi lấy danh sách order:', error);
            return [];
        }
    },

    getOrderById: async (orderId) => {
        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (orderError) throw orderError;

            let userData = null;
            if (order.user_id) {
                const { data: user } = await supabase
                    .from('users')
                    .select('fullname, email, phone')
                    .eq('id', order.user_id)
                    .single();
                userData = user;
            }

            const { data: items } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            let formattedItems = [];
            if (items && items.length > 0) {
                const bookIds = items.map(i => i.book_id);
                const { data: books } = await supabase
                    .from('books')
                    .select('id, title, image_url')
                    .in('id', bookIds);

                formattedItems = items.map(item => {
                    const matchedBook = books ? books.find(b => b.id === item.book_id) : null;
                    return {
                        ...item,
                        books: matchedBook ? { title: matchedBook.title, image_url: matchedBook.image_url } : null
                    };
                });
            }

            return {
                ...order,
                users: userData,
                order_items: formattedItems
            };

        } catch (error) {
            console.error('Lỗi lấy chi tiết order:', error);
            return null;
        }
    },

    delete: async (orderId) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;
            if (!data) return null;

            return data;

        } catch (error) {
            console.error('Lỗi xóa đơn hàng:', error);
            return null;
        }
    }
};

module.exports = orderModel;