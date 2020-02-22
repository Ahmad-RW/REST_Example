const express = require('express')
const roomsRouter = express()
const routes = require('../routes')



roomsRouter.get(routes.getRooms,function(req, res, next){
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