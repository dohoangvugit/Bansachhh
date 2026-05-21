const authRoute = require('./authRoute')
const adminRoute = require('./adminRoute')
const bookRoute = require('./bookRoute')
const homeRoute = require('./homeRoute')
const cartRoute = require('./carRoute')
const menuRoute = require('./menuRoute')
const checkoutRoute = require('./checkoutRoute')

function route (app){
    
    app.use('/admin', adminRoute)
    app.use('/auth', authRoute)
    app.use('/cart', cartRoute)
    app.use('/menu', menuRoute)
    app.use('/', checkoutRoute)
    app.use('/', homeRoute)
    app.use('/', bookRoute)
}

module.exports = route