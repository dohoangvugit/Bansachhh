const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')

const userManagerController = require('../controllers/admin/userManagerController')
const bookManagerController = require('../controllers/admin/bookManagerController')

// API quản lý tài khoản
router.get('/', userManagerController.getAllUsers)
router.get('/delete/:id', userManagerController.deleteUser)
router.post('/update/:id', userManagerController.updateUser)

router.get('/edit/:id', userManagerController.getEditUser)


router.get('/bookmanager', bookManagerController.getAllBooks)
router.post('/add', upload.single('image'), bookManagerController.addBook)
router.get('/book/edit/:id', bookManagerController.getEditBook)

router.post('/book/edit/:id', upload.single('image'), bookManagerController.editBook)

router.get('/book/delete/:id', bookManagerController.deleteBook)
router.get('/add', bookManagerController.getAddBook)

module.exports = router