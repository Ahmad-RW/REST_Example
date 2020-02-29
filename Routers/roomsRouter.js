const express = require('express')
const roomsRouter = express()
const db = require('../dbConfig')
const rooms = db.rooms
const Room = require('../Resources/Room')
const {getAbsoluteURL} = require('../getAbsoluteURL')
// GET rooms/{roomId}
roomsRouter.get('/:roomId', function(req, res, next){
    var roomId = req.params.roomId

    let result = rooms.findOne({number : roomId})
    if(result === null){
        res.status(404).send()
        return
    }
    const roomResource = new Room(getAbsoluteURL(req), result.number, result.size, result.floor, result.executive)
    
    res.status(200)
    res.send(roomResource)

    
   
})

roomsRouter.get('/getRooms',function(req, res, next){
    console.log("Get rooms")
    try {
        throw Error("not implemented")
    } catch (error) {
       
        res.status(500)
        res.locals = {
            err: error.message
        }        
        next()
    }
})












module.exports = roomsRouter;