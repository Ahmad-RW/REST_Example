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
const Form = require("./Models/Form")

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
        // self: {
        //     href: getAbsoluteURL(req),
        // },
        href: req.protocol + '://' + req.get('host') + req.originalUrl,
        rooms: {
            href: `${req.protocol + '://' + req.get('host') + req.originalUrl}rooms/`
        },
        info: {
            href: `${req.protocol + '://' + req.get('host') + req.originalUrl}info/`
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

        
        const isCollection = Reflect.has(response, "rel") ? response.rel[0] === "collection" : false
        if (isCollection) {
            response.value.forEach(function (value, i) {
                const hasForm = Reflect.has(value, "$form")
                if (hasForm) {
                    rewriteForm(value, req)
                }
            })
        }

        const hasForm = Reflect.has(response, "$form")
        if (hasForm) {
            rewriteForm(response, req)
        }
    }


    if (req.get("Accept") === "application/xml") {
        res.set("Content-Type", "application/xml")
        response = xml(JSON.stringify(response))
    }


    res.send(response)



})


function rewriteForm(resource, req) {
    const hasForm = Reflect.has(resource, "$form")
    if (hasForm) {
        console.log(resource.$form)
        const defined = Reflect.set(resource, resource.$form.name, {
            rel: resource.$form.rel,
            href: `${req.protocol}://${req.hostname}:5000`.concat(resource.$form.href),
            method: resource.$form.method,
            value: resource.$form.value
        })
        console.log(defined)
        Reflect.deleteProperty(resource, "$form")
    }
}



app.listen(port, function () {
    console.log(`listening on port ${port}`)
})




