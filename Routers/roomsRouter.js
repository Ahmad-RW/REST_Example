const express = require('express')
const roomsRouter = express()

const Room = require('../Resources/Room')
const roomService = require('../Services/RoomService')
const {getAbsoluteURL} = require('../getAbsoluteURL')
const Collection = require('../Resources/Collection')
const PaginationOptions = require('../Models/PaginationOptions')
const RoomOpenings = require('../Models/RoomOpenings')
const moment = require('moment')
const PagedCollection = require('../Models/PagedCollection')
// GET rooms/{roomId}



roomsRouter.get('/',function(req, res, next){
    console.log("Get rooms")
    
    const offset = parseInt(req.query.offset) || 0
    const limit  = parseInt(req.query.limit) || 5

    let result = roomService.getAllRooms()
    const roomsArray = []
    result.forEach(value =>{
        const room = new Room(value.number, value.size, value.floor, value.executive, `${getAbsoluteURL(req)}room/${value.number}`)
       
        roomsArray.push(room)
    })


    //const roomCollection = new Collection(roomsArray, getAbsoluteURL(req), "collection")


    const roomCollection = new PagedCollection(offset, roomsArray.length , limit, roomsArray, `${req.protocol}://${req.hostname}:5000/rooms/`, "collection" ).applyPagination().getResponse()
    res.status(200)
    //internally save the response and then send it at the last middleware(check index.js)
    res.locals.response = roomCollection
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
    
    const roomResource = new Room(result.number, result.size, result.floor, result.executive, getAbsoluteURL(req))

    console.log(typeof roomResource)
    res.status(200)
    res.locals.response = roomResource
    next()
   
})

roomsRouter.get('/openings', function(req, res, next){
    console.log("in get openings")

   
    const offset = parseInt(req.query.offset) || 0
    const limit  = parseInt(req.query.limit) || 5

    const rooms = roomService.getAllRooms().sort(function(firstElem, secondElem){
        if(firstElem.$loki < secondElem.$loki) return -1
        
        if(firstElem.$loki > secondElem.$loki) return 1

        return 0
    });

    const openings = []
    rooms.forEach(function(value){
        if(value.available) openings.push(new RoomOpenings({href : `${req.protocol}://${req.hostname}:5000/rooms/room/${value.number}`}, moment(), moment().add(2, 'days'), Math.floor(Math.random() *200) + 100  )) 
    })
    
    res.status(200)
    //internally save the response and then send it at the last middleware(check index.js)
    res.locals.response = new PagedCollection(offset, openings.length , limit, openings, `${req.protocol}://${req.hostname}:5000/rooms/openings`, "collection" ).applyPagination().getResponse()

     next()

})



















module.exports = roomsRouter;