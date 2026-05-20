const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/', authController.authPage)

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/logout', authController.logout)

router.get('/admin', (req, res) => {
    res.render('admin/accmanager', { layout: 'admin'})
})

module.exports = router