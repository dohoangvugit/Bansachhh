const bookModel = require('../models/bookModel')

const genreMap = {
    menucomic: 'Truyện Tranh',
    menusachvn: 'Sách Việt Nam',
    menusachnn: 'Sách Nước Ngoài',
    sachgiaokhoa: 'Sách Giáo Khoa',
    truyenkinhdi: 'Truyện Kinh Dị'
}

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
    },

    getMenuByGenre: async (req, res) => {

        try {
            const slug = req.params.genre
            const genre = genreMap[slug]

            if (!genre) {
                return res.status(404).send('Không tìm thấy thể loại')
            }

            const books = await bookModel.getMenuByGenre(genre)

            return res.render('menu', {
                books,
                genre
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}
module.exports = bookController