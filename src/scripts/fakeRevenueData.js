const supabase = require('../config/db')

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const addresses = [
    '123 Đường Trần Hưng Đạo, Quận 1, TP.HCM',
    '45 Nguyễn Huệ, Quận 1, TP.HCM',
    '78 Lê Lợi, Quận 1, TP.HCM',
    '9 Pasteur, Quận 3, TP.HCM',
    '102 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    '255 Trường Chinh, Quận Tân Bình, TP.HCM',
    '18 Hoàng Sa, Quận 1, TP.HCM',
    '22 Phan Đình Phùng, Quận Phú Nhuận, TP.HCM',
    '57 Lê Văn Sỹ, Quận 3, TP.HCM',
    '100 Bùi Viện, Quận 1, TP.HCM',
    '33 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    '11 Nguyễn Văn Trỗi, Quận Phú Nhuận, TP.HCM',
    '120 Võ Văn Tần, Quận 3, TP.HCM',
    '77 Lý Tự Trọng, Quận 1, TP.HCM',
    '68 Đề Thám, Quận 1, TP.HCM'
]

const seedRevenueData = async () => {
    const { data: users, error: usersError } = await supabase.from('users').select('id')
    if (usersError) {
        console.error('Lỗi lấy users:', usersError)
        process.exit(1)
    }

    const { data: books, error: booksError } = await supabase.from('books').select('id, price')
    if (booksError) {
        console.error('Lỗi lấy books:', booksError)
        process.exit(1)
    }

    if (!users || users.length === 0) {
        console.error('Không tìm thấy user nào trong database.')
        process.exit(1)
    }

    if (!books || books.length === 0) {
        console.error('Không tìm thấy sách nào trong database.')
        process.exit(1)
    }

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 12)

    const orderCount = 700
    console.log(`Tạo ${orderCount} đơn hàng fake trong 12 tháng qua...`)

    for (let i = 0; i < orderCount; i += 1) {
        const user = users[getRandomInt(0, users.length - 1)]
        const orderDate = randomDate(startDate, new Date())
        const itemCount = getRandomInt(1, 4)
        const orderItems = []
        let totalPrice = 0

        for (let j = 0; j < itemCount; j += 1) {
            const book = books[getRandomInt(0, books.length - 1)]
            const quantity = getRandomInt(1, 3)
            const price = Number(book.price) || getRandomInt(20000, 120000)
            totalPrice += price * quantity
            orderItems.push({
                book_id: book.id,
                quantity,
                price
            })
        }

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: user.id,
                    total_price: totalPrice,
                    address: addresses[getRandomInt(0, addresses.length - 1)],
                    created_at: orderDate.toISOString()
                }
            ])
            .select()
            .maybeSingle()

        if (orderError || !orderData) {
            console.error('Lỗi tạo order fake:', orderError)
            continue
        }

        const { error: itemError } = await supabase.from('order_items').insert(
            orderItems.map((item) => ({
                order_id: orderData.id,
                book_id: item.book_id,
                quantity: item.quantity,
                price: item.price
            }))
        )

        if (itemError) {
            console.error('Lỗi tạo order_items fake:', itemError)
        }

        if ((i + 1) % 50 === 0) {
            console.log(`Đã tạo ${i + 1} đơn hàng fake`)
        }
    }

    console.log('Hoàn tất tạo dữ liệu fake doanh thu.')
}

seedRevenueData().catch((error) => {
    console.error('Lỗi seed doanh thu:', error)
    process.exit(1)
})
