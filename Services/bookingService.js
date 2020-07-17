const db = require('../dbConfig')
const rooms = db.rooms
const bookings = db.bookings
const moment = require('moment')
const config = require('./configService')

function createBooking(startAt, endAt, roomId, userId) {
    console.log("in create booking")
    const bookings = db.bookings

    const minStay = config.getConfigUsingKey("MIN_STAY")
    const rate = config.getConfigUsingKey("RATE")
    console.log((moment.duration(endAt.diff(startAt)).asHours()))
    const cost = moment.duration(endAt.diff(startAt)).asHours() * rate.value
    console.log(cost)
    const booking = bookings.insert({
        startAt,
        endAt,
        roomId,
        userId,
        cost
    })

    return booking
}


function bookingExists(bookingId){
    console.log("in bookiong exists service")
    const bookings = db.bookings
    console.log(bookings.findOne({$loki : parseInt(bookingId)}) )
    return bookings.findOne({$loki : parseInt(bookingId)}) === null ? false : true 
}

function deleteBooking(bookingId) {
    console.log("in delete booking id service")
    const bookings = db.bookings
    bookings.findAndRemove({ $loki: parseInt(bookingId) })
}


module.exports = {
    createBooking,
    deleteBooking,
    bookingExists
}