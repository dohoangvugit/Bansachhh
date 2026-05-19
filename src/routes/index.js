const authRoute = require('./authRoute')
const adminRoute = require('./adminRoute')
function route (app){
    
    app.use('/admin', adminRoute)
    app.use('/', authRoute)
}

module.exports = route