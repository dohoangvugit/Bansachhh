const express = require('express')
const router = express.Router()

const checkoutController = require('../controllers/checkoutController')

router.get('/checkout', checkoutController.getCheckOutPage)
router.post('/checkout', checkoutController.postCheckOut)

module.exports = router