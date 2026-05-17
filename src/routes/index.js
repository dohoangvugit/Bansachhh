const authRoute = require('./authRoute')

function route (app){
    app.use('/', authRoute)
}

module.exports = route