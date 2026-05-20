const bookModel = require('../../models/bookModel')

const bookManagerController = {

    getAllBooks: async (req, res) => {
        try {
            const books = await bookModel.getAll()
            return res.render('admin/bookmanager', {
                layout: 'admin',
                books
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    addBook: async (req, res) => {
        try {
            const book = await bookModel.create(req.body, req.file)
            return res.redirect('/admin/bookmanager')
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    editBook: async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const book = await bookModel.update(id, req.body, req.file)
            return res.redirect('/admin/bookmanager')
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    deleteBook: async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const book = await bookModel.delete(id)
            return res.redirect('/admin/bookmanager')
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    getEditBook: async (req, res) => {
        try {
            const book = await bookModel.getById(parseInt(req.params.id))
            return res.render('admin/editbook', {
                layout: 'admin',
                book
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    },

    getAddBook: async (req, res) => {
       return res.render('admin/addbook', { layout: 'admin' })
   },
}

module.exports = bookManagerController