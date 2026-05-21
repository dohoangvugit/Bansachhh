const cart = []

const cartController = {

    addToCart: (req, res) => {

        const {
            id,
            title,
            price,
            image_url,
            quantity
        } = req.body

        const existingBook = cart.find(
            item => item.id == id
        )

        if (existingBook) {
            existingBook.quantity += Number(quantity)
        } else {
            cart.push({
                id,
                title,
                price: Number(price.replace(/\./g, '')),
                image_url,
                quantity: Number(quantity || 1)
            })
        }
        console.log(cart)
        return res.redirect('/cart')
    },

    index: (req, res) => {
        let totalPrice = 0

        cart.forEach(item => {

            const price = Number(item.price) || 0
            const quantity = Number(item.quantity) || 0

            totalPrice += price * quantity
        })

        return res.render('cart', {
            cart,
            totalPrice
        })
    },

    remove: (req, res) => {

        const id = req.params.id

        const index = cart.findIndex(
            item => item.id == id
        )

        if (index !== -1) {
            cart.splice(index, 1)
        }

        return res.redirect('/cart')
    }
    
}

module.exports = cartController