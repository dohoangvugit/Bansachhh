const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/auth', authController.authPage)

router.post('/auth/login', authController.login)
router.post('/auth/register', authController.register)

module.exports = router