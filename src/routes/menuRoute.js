const express = require('express')
const router = express.Router()

const bookController = require('../controllers/bookController')

router.get('/:genre', bookController.getMenuByGenre)

module.exports = router