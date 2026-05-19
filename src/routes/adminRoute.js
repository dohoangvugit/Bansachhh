const express = require('express')
const router = express.Router()
const userManagerController = require('../controllers/admin/userManagerController')

router.get('/', userManagerController.getAllUsers)
router.get('/delete/:id', userManagerController.deleteUser)
router.post('/update/:id', userManagerController.updateUser)

router.get('/edit/:id', userManagerController.getEditUser)

module.exports = router