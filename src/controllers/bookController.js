const bookModel = require('../models/bookModel')

const bookController = {
    detail: async (req, res) => {
        try {
            const book = await bookModel.getById(req.params.id)
            if (!book) {
                return res.status(404).json({ message: 'Book not found' })
            }
            return res.render('details', { book })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
module.exports = bookController