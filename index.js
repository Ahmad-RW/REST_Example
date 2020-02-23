const { getAbsoluteURL } = require("./getAbsoluteURL")

const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const db = require('./dbConfig')
const roomsRouter = require('./Routers/roomsRouter')
const infoRouter = require('./Routers/infoRouter')
const routes = require('./routes')


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    
});

app.all('*', function(req, res, next){
    console.log("API entry point")
    next();
})

app.use(routes.rooms, roomsRouter);
app.use("/info", infoRouter)

app.get("/", function(req, res, next){
    var response  = {
        href : getAbsoluteURL(req),
        rooms : {
            href : `${getAbsoluteURL(req)}rooms${routes.getRooms}`
        },
        info : {
            href : `${getAbsoluteURL(req)}info/`
        }
    }

    res.status(200).send(response)
})

app.all('*', function(req, res, next){
    console.log("API exit point")

    //handles exception that occured internally in the server. customize internal error message based on env.
    if(res.statusCode >=500){
        console.log(res.locals)
        res.send(res.locals)
    }
    
})




app.listen(port, function(){
    console.log(`listening on port ${port}`)
})




