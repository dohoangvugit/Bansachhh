const express = require('express')
const router = express.Router()

const bookController = require('../controllers/bookController')

router.get('/books/:id', bookController.detail)

module.exports = router