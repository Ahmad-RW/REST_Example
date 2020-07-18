const express = require('express')
const bookingsRouter = express()

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
const Booking = require('../Models/Booking')
const bookingService = require('../Services/bookingService')

// GET /bookings/:bookingId
bookingsRouter.get("/:bookingId", function(req, res, next){
    console.log("in get booking")
    const bookingId = req.params.bookingId
    if(bookingId === undefined){
        res.status(400)
        res.locals.response = {msg : "bookingId field is missing"}
        next()
        return
    }

    const booking = roomService.getBooking(bookingId)
    console.log(booking)
    if(booking === null) {
        res.status(404)
        res.locals.response = {msg : "not found"}
        next()
        return
    }

    const href = `${req.protocol}://${req.hostname}:5000/bookings/${bookingId}`
    const roomHref = `${req.protocol}://${req.hostname}:5000/rooms/room/${booking.roomId}`
    res.status(200)

    res.locals.response = new Booking(booking.startAt, booking.endAt, booking.cost, booking.roomId, booking.userId, href, {href : roomHref } )
    next()
})


// DELETE /bookings/:bookingId
bookingsRouter.delete("/:bookingId", function(req, res, next){
    console.log("in delete booking")
    const bookingId = req.params.bookingId
    console.log(`in delete booking endpoint with bookingId : ${bookingId}`)
    if(bookingId === undefined){
        res.status(400)
        res.locals.response = {msg : "bookingId field is missing"}
        next()
        return
    }

    
    if(!bookingService.bookingExists(bookingId)){
        res.status(404)
        res.locals.response = {msg : "booking for provided booking ID does not exist"}
        next()
        return
    }

    bookingService.deleteBooking(bookingId)

    //query again to make sure if deleted.
    if(bookingService.bookingExists(bookingId)){
        res.status(500)
        res.locals.response - {msg : "could not delete booking."}
        next()
        return
    }
    res.status(204)
    res.locals.response = {}
    next()

})

module.exports = bookingsRouter