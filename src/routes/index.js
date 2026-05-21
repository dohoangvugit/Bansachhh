const authRoute = require('./authRoute')
const adminRoute = require('./adminRoute')
const bookRoute = require('./bookRoute')
const homeRoute = require('./homeRoute')
const cartRoute = require('./carRoute')
function route (app){
    
    app.use('/admin', adminRoute)
    app.use('/auth', authRoute)
    app.use('/cart', cartRoute)
    app.use('/', homeRoute)
    app.use('/', bookRoute)
}

module.exports = route