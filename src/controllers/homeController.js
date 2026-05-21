const bookModel = require('../models/bookModel')

const getRandomItems = (arr, limit = 5) => {
    return [...arr]
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
}

const homeController = {
    index: async (req, res) => {
        try {
            const allBooks = await bookModel.getAll()

            const comicsAll = allBooks.filter(b => b.genre === 'Truyện Tranh')
            const vietnamAll = allBooks.filter(b => b.genre === 'Sách Việt Nam')
            const foreignAll = allBooks.filter(b => b.genre === 'Sách Nước Ngoài')
            const textbooksAll = allBooks.filter(b => b.genre === 'Sách Giáo Khoa')
            const horrorAll = allBooks.filter(b => b.genre === 'Truyện Kinh Dị')

            const comics = getRandomItems(comicsAll, 5)
            const vietnamBooks = getRandomItems(vietnamAll, 5)
            const foreignBooks = getRandomItems(foreignAll, 5)
            const textbooks = getRandomItems(textbooksAll, 5)
            const horrorBooks = getRandomItems(horrorAll, 5)           

            return res.render('home', {
                comics,
                vietnamBooks,
                foreignBooks,
                textbooks,
                horrorBooks
            })
        } catch (err) {
            console.error(err)
            return res.status(500).send('Server error')
        }
    }
}


module.exports = homeController
