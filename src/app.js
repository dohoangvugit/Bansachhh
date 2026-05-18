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
            formatPrice: (v) => v.toLocaleString(),
            multiply: (a,b) => a*b,
        },
    }),
)
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

route(app)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)

})
