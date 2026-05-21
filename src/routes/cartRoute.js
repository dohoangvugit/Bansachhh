const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cartController')

router.get('/', cartController.index)
router.post('/add', cartController.addToCart)
router.get('/remove/:id', cartController.remove)

module.exports = router