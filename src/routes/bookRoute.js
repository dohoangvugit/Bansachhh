const express = require('express')
const router = express.Router()

const bookController = require('../controllers/bookController')

router.get('/', bookController.homePage)

router.get('/client', (req, res) => {
    res.render('client', { layout: 'main' })
})
module.exports = router