const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/auth', authController.authPage)

router.post('/auth/login', authController.login)
router.post('/auth/register', authController.register)

router.get('/client', (req, res) => {
    res.render('client', { layout: 'main' })
})

router.get('/admin', (req, res) => {
    res.render('admin/accmanager', { layout: 'admin'})
})

module.exports = router