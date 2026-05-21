const express = require('express')
const router = express.Router()

const checkoutController = require('../controllers/checkoutController')

router.get('/', checkoutController.getCheckOutPage)
router.post('/', checkoutController.postCheckOut)

module.exports = router