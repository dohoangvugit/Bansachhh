const Book = require('../models/bookModel')

const genreMap = {
    menucomic: 'Truyện Tranh',
    menusachvn: 'Sách Việt Nam',
    menusachnn: 'Sách Nước Ngoài',
    sachgiaokhoa: 'Sách Giáo Khoa',
    truyenkinhdi: 'Truyện Kinh Dị'
}

const getMenu = async (req, res) => {

    try {

        const comics = await Book.getComics()
        const vietnamBooks = await Book.getVietnamBooks()
        const foreignBooks = await Book.getForeignBooks()
        const textbooks = await Book.getTextbooks()
        const horrorBooks = await Book.getHorrorBooks()

        res.render('/menu', {
            comics,
            vietnamBooks,
            foreignBooks,
            textbooks,
            horrorBooks
        })

    } catch (error) {

        console.log(error);

        res.status(500).send('Lỗi server')
    }
}

module.exports = getMenu

