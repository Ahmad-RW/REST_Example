const db = require('../dbConfig')
const rooms = db.rooms
const bookings = db.bookings
const moment = require('moment')
const config = require('./configService')
const { ConnectionBase } = require('mongoose')
function getRoom(roomId){
    console.log("in get room")
    return rooms.findOne({number : parseInt(roomId)})
}

function getAllRooms(){
    console.log("in get all rooms")
    return rooms.find({})
}

function getConfilctedSlots(startAt, endAt, roomId){
    console.log("in get confilcted slots")

    let doesOverlap;
    const bookings =  db.bookings.find({roomId : roomId})
    console.log(bookings)
    if(bookings.length === 0) return false

    for (const booking of bookings) {
        console.log(booking)
        noBookings = false
        const bookedStartAt = moment(booking.startAt, 'DD-MM-YYYY')
        const bookedEndAt = moment(booking.endAt, 'DD-MM-YYYY')

        console.log(startAt.isSame(bookedStartAt))
        console.log(startAt.isBetween(bookedStartAt, bookedEndAt))
        doesOverlap =  startAt.isBetween(bookedStartAt, bookedEndAt) || startAt.isSame(bookedStartAt)
        if(doesOverlap){
            break;
        }
    }    
    
    console.log(doesOverlap) 
    return doesOverlap
}

function getBooking(bookingId){
    console.log("in get booking")
    const booking = db.bookings.findOne({$loki : parseInt(bookingId)})
    console.log(booking)

    return booking
    
}



module.exports = {
    getRoom,
    getAllRooms,
    getBooking,
    getConfilctedSlots
}