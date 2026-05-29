const supabase = require('../config/db')
const orderModel = require('../models/orderModel')

const usersData = [
  { fullname: 'Nguyễn Văn A', email: 'user1@example.com', password: 'Password1!', phone: '0900000001' },
  { fullname: 'Lê Thị B', email: 'user2@example.com', password: 'Password2!', phone: '0900000002' },
  { fullname: 'Trần Văn C', email: 'user3@example.com', password: 'Password3!', phone: '0900000003' },
  { fullname: 'Phạm Thị D', email: 'user4@example.com', password: 'Password4!', phone: '0900000004' },
  { fullname: 'Hoàng Văn E', email: 'user5@example.com', password: 'Password5!', phone: '0900000005' },
  { fullname: 'Đặng Thị F', email: 'user6@example.com', password: 'Password6!', phone: '0900000006' },
  { fullname: 'Ngô Văn G', email: 'user7@example.com', password: 'Password7!', phone: '0900000007' },
  { fullname: 'Bùi Thị H', email: 'user8@example.com', password: 'Password8!', phone: '0900000008' },
  { fullname: 'Vũ Văn I', email: 'user9@example.com', password: 'Password9!', phone: '0900000009' },
  { fullname: 'Phan Thị J', email: 'user10@example.com', password: 'Password10!', phone: '0900000010' },
  { fullname: 'Đỗ Văn K', email: 'user11@example.com', password: 'Password11!', phone: '0900000011' },
  { fullname: 'Nguyễn Thị L', email: 'user12@example.com', password: 'Password12!', phone: '0900000012' },
  { fullname: 'Trần Văn M', email: 'user13@example.com', password: 'Password13!', phone: '0900000013' },
  { fullname: 'Lê Thị N', email: 'user14@example.com', password: 'Password14!', phone: '0900000014' },
  { fullname: 'Phạm Văn O', email: 'user15@example.com', password: 'Password15!', phone: '0900000015' }
]

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

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const findOrCreateUser = async (user) => {
  const email = user.email.trim().toLowerCase()
  const { data: existingUser, error: existingError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (existingError) {
    console.error('Lỗi kiểm tra user tồn tại:', existingError)
    throw existingError
  }

  if (existingUser) {
    return existingUser
  }

  const { data: inserted, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        fullname: user.fullname,
        password: user.password,
        email,
        phone: user.phone
      }
    ])
    .select()
    .maybeSingle()

  if (insertError) {
    console.error('Lỗi tạo user:', insertError)
    throw insertError
  }

  return inserted
}

const createOrderForUser = async (userId, items, address) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const order = await orderModel.createOrder(userId, totalPrice, address)

  if (!order) {
    throw new Error(`Không tạo được order cho user ${userId}`)
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    book_id: item.book_id,
    price: item.price,
    quantity: item.quantity
  }))

  const { error: orderItemError } = await supabase.from('order_items').insert(orderItems)
  if (orderItemError) {
    console.error('Lỗi tạo order_items:', orderItemError)
    throw orderItemError
  }

  return order
}

const seed = async () => {
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('id,price')

  if (booksError) {
    console.error('Lỗi lấy sách:', booksError)
    process.exit(1)
  }

  if (!books || books.length < 1) {
    console.error('Không có sách nào trong bảng books để tạo order.')
    process.exit(1)
  }

  console.log(`Tìm thấy ${books.length} sách trong cơ sở dữ liệu.`)

  for (let idx = 0; idx < usersData.length; idx += 1) {
    const user = usersData[idx]
    const savedUser = await findOrCreateUser(user)
    console.log(`User ${idx + 1}:`, savedUser.email, 'id=', savedUser.id)

    const orderCount = 1
    for (let orderIndex = 0; orderIndex < orderCount; orderIndex += 1) {
      const itemsCount = getRandomInt(3, 7)
      const items = []

      for (let i = 0; i < itemsCount; i += 1) {
        const book = books[getRandomInt(0, books.length - 1)]
        const quantity = getRandomInt(1, 3)

        items.push({
          book_id: book.id,
          price: Number(book.price),
          quantity
        })
      }

      const address = addresses[idx % addresses.length]
      const order = await createOrderForUser(savedUser.id, items, address)
      console.log(`  - Tạo order #${order.id} với ${itemsCount} mục cho ${savedUser.email}`)
      await sleep(100)
    }
  }

  console.log('Hoàn tất tạo 15 tài khoản và đơn hàng tương ứng.')
}

seed().catch((error) => {
  console.error('Seed thất bại:', error)
  process.exit(1)
})
