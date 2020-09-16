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
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
const userRouter = require('./Routers/userRouter')
const crypto = require('crypto')

app.use(bodyParser.json());// post request body parser

const buf = crypto.randomBytes(250)
const secret = buf.toString('utf8')
process.env.secret = secret



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});



app.use(express.static(path.join(__dirname, 'client/build')));

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms - :body", { stream: accessLogStream }))



app.all('*', function (req, res, next) {
    console.log(req.get("Accept"))
    console.log("API entry point")
    next();
})

app.use("/rooms", roomsRouter);
app.use("/bookings", bookingsRouter)
app.use("/info", infoRouter)
app.use("/users", userRouter)
app.get("/", function (req, res, next) {
    var response = {
        href: req.protocol + '://' + req.get('host') + req.originalUrl,
        rooms: {
            href: `${req.protocol + '://' + req.get('host') + req.originalUrl}rooms/`
        },
        info: {
            href: `${req.protocol + '://' + req.get('host') + req.originalUrl}info/`
        },
	    users : {
		    href :  `${req.protocol + '://' + req.get('host') + req.originalUrl}users/`
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
        res.send(res.locals.response)
        return
    }
    let response = res.locals.response
    if (response !== undefined && response !== null) {
	//rrewriting links for response.
        rewriteLinkIfAny(response)

	const isCollection = Reflect.has(response, "rel") ? response.rel[0] === "collection" : false
	console.log("response is ", response)
	  //rewriting forms and links for collections
        if (isCollection) {
            response.value.forEach(function (value, i) {
                const hasForm = Reflect.has(value, "$form")
                console.log(hasForm)
                if (hasForm) {
			console.log("rewriting form for values in collection")
                    rewriteForm(value, req)
                }

                //rewrite link for value
                rewriteLinkIfAny(value)
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
        console.log("rewriting form")
        const defined = Reflect.set(resource, resource.$form.name, {
            rel: [resource.$form.link.rel],
            href: resource.$form.link.href,
            method: resource.$form.link.method,
            value: resource.$form.value
        })
        Reflect.deleteProperty(resource, "$form")
    }
}


function rewriteLinkIfAny(obj){
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
    //if it is link, rewrite it
		if(element.constructor.name === "Link"){
		const dontSetPropertyKey = element.name === undefined
		if(dontSetPropertyKey){
		    Reflect.set(obj, "href", element.href)
		    if(element.rel !== null && element.rel !== undefined){
			Reflect.set(obj, "rel", [element.rel])
		    }
		}
                else{
			Reflect.set(obj, element.name, {href : element.href, rel : [element.rel], method : element.method})
                }
                Reflect.deleteProperty(obj, key)
            }
        }
    }
}





app.listen(port, function () {
    console.log(`listening on port ${port}`)
})

