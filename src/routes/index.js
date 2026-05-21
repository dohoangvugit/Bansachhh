const authRoute = require('./authRoute')
const adminRoute = require('./adminRoute')
const bookRoute = require('./bookRoute')
const homeRoute = require('./homeRoute')
function route (app){
    
    app.use('/admin', adminRoute)
    app.use('/auth', authRoute)
    app.use('/', homeRoute)
    app.use('/', bookRoute)
}

module.exports = route