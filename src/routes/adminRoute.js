const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')

const userManagerController = require('../controllers/admin/userManagerController')
const bookManagerController = require('../controllers/admin/bookManagerController')
const orderManagerController = require('../controllers/admin/orderManagerController')

// API quản lý tài khoản
router.get('/', userManagerController.getAllUsers)
router.get('/delete/:id', userManagerController.deleteUser)
router.post('/update/:id', userManagerController.updateUser)

router.get('/edit/:id', userManagerController.getEditUser)

// API quản lý sách
router.get('/bookmanager', bookManagerController.getAllBooks)
router.post('/add', upload.single('image'), bookManagerController.addBook)
router.get('/book/edit/:id', bookManagerController.getEditBook)

router.post('/book/edit/:id', upload.single('image'), bookManagerController.editBook)

router.get('/book/delete/:id', bookManagerController.deleteBook)
router.get('/add', bookManagerController.getAddBook)

// API quản lý đơn hàng
router.get('/ordermanager', orderManagerController.getAllOrders)
router.get('/order/detail/:id', orderManagerController.getOrderById)
router.get('/order/delete/:id', orderManagerController.delete)

module.exports = router