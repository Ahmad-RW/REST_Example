const { getAbsoluteURL } = require("./getAbsoluteURL")

const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const db = require('./dbConfig')
const roomsRouter = require('./Routers/roomsRouter')
const infoRouter = require('./Routers/infoRouter')
const routes = require('./routes')
const xml = require('jsontoxml')
const bodyParser = require('body-parser')
const bookingsRouter = require("./Routers/bookingsRouter")

app.use(bodyParser.json());// post request body parser

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});

app.all('*', function (req, res, next) {
    console.log(req.get("Accept"))
    console.log("API entry point")
    next();
})

app.use("/rooms", roomsRouter);
app.use("/bookings", bookingsRouter)
app.use("/info", infoRouter)

app.get("/", function (req, res, next) {
    var response = {
        self: {
            href: getAbsoluteURL(req),
        },
        rooms: {
            href: `${getAbsoluteURL(req)}rooms${routes.getRooms}`
        },
        info: {
            href: `${getAbsoluteURL(req)}info/`
        }
    }

    res.status(200)
    res.locals.response = response
    next()
})

app.all('*', function (req, res, next) {
    console.log("API exit point")

    //handles exception that occured internally in the server. customize internal error message based on env.
    if (res.statusCode >= 400) {
        console.log(res.locals)
        res.send(res.locals.response)
        return
    }
    let response = res.locals.response
   
    if (response !== undefined && response !== null) {
        console.log("in")
        for (let [key, value] of Object.entries(response)) {

            if (key === "href") {
                const rel = response[key].rel
                // response[key] = {
                //     href : value,
                //     method : req.method,
                //     rel : [`${rel}`]
                // }
                // response[key].setHref(value.href)
                // response[key].setRel([value.rel])
                // response[key].setMethod(req.method)

            }
            if (key === "self") {
                console.log("unwrapping self link")
                response = {
                    href: response[key].href,
                    rel: response[key].rel,
                    method: req.method,
                    ...response
                }
                delete response.self
            }
            // if(key === "value" && typeof Array.isArray(value)){
            //     value.forEach(element => {
            //         for(let [key, value] of Object.entries(element)){
            //             if(key === "href"){
            //                 const rel = element[key].rel
            //                 element[key] = {
            //                     href : value,
            //                     method : req.method,
            //                     rel : [`${rel}`]
            //                 }
            //                 // element[key].setHref(value.href)
            //                 // element[key].setRel([rel])
            //                 // element[key].setMethod(req.method)
            //             }
            //         }
            //     });
            //}

            

        }
    }


    if (req.get("Accept") === "application/xml") {
        res.set("Content-Type", "application/xml")
        response = xml(JSON.stringify(response))
    }


    res.send(response)



})




app.listen(port, function () {
    console.log(`listening on port ${port}`)
})




