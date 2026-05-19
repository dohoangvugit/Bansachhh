const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/', adminController.getAllUsers)
router.get('/delete/:id', adminController.deleteUser) 
router.post('/update/:id', adminController.updateUser)

router.get('/edit/:id', adminController.getEditUser)
module.exports = router 