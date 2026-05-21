const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const path = require('path')
const route = require('./routes/index')


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views/layouts'),
        partialsDir: path.join(__dirname, 'views/partials'),
        defaultLayout: 'main',

        helpers: {
            json: (x) => JSON.stringify(x),
            eq: (a, b) => a === b,
            formatPrice: (v) => {
                return Number(v || 0).toLocaleString('vi-VN')
            },
            multiply: (a, b) => {
                return Number(a || 0) * Number(b || 0)
            },
            totalPrice: (price, quantity) => {
                return Number(price || 0) * Number(quantity || 0)
            }

        }
    }),
)
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))

route(app)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)

})
