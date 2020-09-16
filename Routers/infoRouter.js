const express = require('express')
const info = express()
const jsonInfo   = require('../Models/Info.json')
const {getAbsoluteURL} = require('../getAbsoluteURL')
const Link = require('../Models/Link')
 info.get("/", function(req, res, next){

     let info = JSON.parse(JSON.stringify(jsonInfo))

	 let link = new Link(`${req.protocol}://${req.hostname}:5000/info`)
	 console.log(link.method)
    const resource = {
	    link,
        info
    }
    
     res.status(200) 
	 res.set('Cache-Control', 'public, max-age=172800')
     res.locals.response = resource
	 next()
 })





module.exports = info
