const express = require('express')
const roomsRouter = express()

const Room = require('../Resources/Room')
const roomService = require('../Services/roomService')
const confiService  = require('../Services/configService')
const {getAbsoluteURL} = require('../getAbsoluteURL')
const Collection = require('../Resources/Collection')
const PaginationOptions = require('../Models/PaginationOptions')
const RoomOpenings = require('../Models/RoomOpenings')
const moment = require('moment')
const PagedCollection = require('../Models/PagedCollection')
const configServices = require('../Services/configService')
const bookingService = require('../Services/bookingService')
const { STATES } = require('mongoose')
const Form = require('../Forms/Form')
// GET rooms/{roomId}



roomsRouter.get('/',function(req, res, next){
    console.log("Get rooms")
    
    const offset = parseInt(req.query.offset) || 0
    const limit  = parseInt(req.query.limit) || 5
    const sortQuery = req.query.sortQuery
    const filterQuery = req.query.filterQuery 
    console.log(filterQuery)
    let result = roomService.getAllRooms()
    const roomsArray = []
    result.forEach(value =>{
        const bookingForm = new Form(["create-form"], 
        `${req.protocol}://${req.hostname}:5000/rooms/${value.number}/bookings`,
        "POST",
        [{
            name : "startAt",
            label : "Booking start time",
            required : true,
            type : "datetime"
        },
        {
            name : "endAt",
            label : "Booking end time",
            required : true,
            type : "datetime"
        }])
        const room = new Room(value.number, value.size, value.floor, value.executive, `${req.protocol}://${req.hostname}:5000/rooms/room/${value.number}`, bookingForm)
       
        roomsArray.push(room)
    })


    let response;
    try {
     response = new PagedCollection(offset, roomsArray.length , limit, roomsArray, `${req.protocol}://${req.hostname}:5000/rooms/`, "collection", sortQuery, filterQuery, ["roomId", "size"]).applyPagination().getResponse()
        
    } catch (error) {
        console.log(error)
        res.status(error.code)
        res.locals = error.msg
        next()
        return
    }
    res.status(200)
    //internally save the response and then send it at the last middleware(check index.js)
    response = {
        ...response,
        "openings" : {
            href : `${req.protocol}://${req.hostname}:5000/rooms/`,
            rel : ["collection"]
        }
    }
    res.locals.response = response
    next()
    

})



//(\d+) regex to match number.
roomsRouter.get('/room/:roomId', function(req, res, next){
    console.log("in get room")
    var roomId = req.params.roomId
    


    let result = roomService.getRoom(roomId)
    if(result === null){
        res.status(404).send()
        return
    }
    const bookingForm = new Form(["create-form"], 
    `${req.protocol}://${req.hostname}:5000/rooms/${result.number}/bookings`,
    "POST",
    [{
        name : "startAt",
        label : "Booking start time",
        required : true,
        type : "datetime"
    },
    {
        name : "endAt",
        label : "Booking end time",
        required : true,
        type : "datetime"
    }])
    const roomResource = new Room(result.number, result.size, result.floor, result.executive, getAbsoluteURL(req), bookingForm)

    console.log(typeof roomResource)
    res.status(200)
    res.locals.response = roomResource
    next()
   
})

roomsRouter.get('/openings', function(req, res, next){
    console.log("in get openings")

   
    const offset = parseInt(req.query.offset) || 0
    const limit  = parseInt(req.query.limit) || 5
    const sortQuery = req.query.sortQuery
    const rate = configServices.getConfigUsingKey("RATE")

    const rooms = roomService.getAllRooms().sort(function(firstElem, secondElem){
        if(firstElem.$loki < secondElem.$loki) return -1
        
        if(firstElem.$loki > secondElem.$loki) return 1

        return 0
    });

    const openings = []
    rooms.forEach(function(value){
        if(value.available) openings.push(new RoomOpenings({href : `${req.protocol}://${req.hostname}:5000/rooms/room/${value.number}`}, moment(), moment().add(2, 'days'), rate.value  )) 
    })
    
    let response
    try {
        response = new PagedCollection(offset, openings.length , limit, openings, `${req.protocol}://${req.hostname}:5000/rooms/openings`, "collection", sortQuery, null,  ["rate"]  ).applyPagination().getResponse()


    } catch (error) {
       console.log(error)
       res.locals = error
       res.status(500)
       next()
       return 
    }

    res.status(200)
    //internally save the response and then send it at the last middleware(check index.js)
    res.locals.response = response

     next()

})


//POST rooms/roomId/bookings
roomsRouter.post('/:roomId/bookings', function(req, res, next){
    console.log("in bookings")
    const roomId = req.params.roomId

    if(req.body.startAt === undefined ){
        res.status(400)
        res.locals.response = {msg : "startAt field is missing"}
        next()
        return
    }
    
    if(req.body.endAt === undefined ){
        res.status(400)
        res.locals.response = {msg : "endAt field is missing"}
        next()
        return
    }

    const room = roomService.getRoom(roomId)
    const minStay = configServices.getConfigUsingKey("MIN_STAY")
    const startAt = moment(req.body.startAt, 'DD-MM-YYYY')
    const endAt   = moment(req.body.endAt, 'DD-MM-YYYY')

    if(!startAt.isValid() || !endAt.isValid()){
        res.status(400)
        res.locals = {msg : "Invalid date format"}
        next()
        return
    }

    if(room === null) {
        res.status(404)
        res.locals.response = {msg : "Room does not exist"}
        next()
        return
    }

    const tooShort = moment.duration(endAt.diff(startAt)).asMilliseconds() < minStay.value
    console.log(tooShort)

    if(tooShort){
        res.status(400)
        res.locals.response = {msg : "Duration of Stay is less than minimum stay period "}
        next()
        return
    }
    console.log(startAt)
    if(roomService.getConfilctedSlots(startAt, endAt, roomId)){
        res.status(400)
        res.locals.response = { msg : "Room Already booked"}
        next()
        return
    }

    const userId = new Date().getTime()
    const booking = bookingService.createBooking(startAt, endAt, roomId, userId)

    if(booking === null){
        res.status(400)
        res.locals.response = { msg : "Invalid Operation"}
        next()
        return
    }

    res.status(201)
    const location = `${req.protocol}://${req.hostname}:5000/bookings/${booking.$loki}`
    res.setHeader("Location", location)

    next()
})  


















module.exports = roomsRouter;