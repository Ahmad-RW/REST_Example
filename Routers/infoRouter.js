const express = require('express')
const info = express()
const jsonInfo   = require('../Resources/Info.json')
const {getAbsoluteURL} = require('../getAbsoluteURL')
const Resource = require('../Resources/Resource')
info.get("/", function(req, res){

    let urlLink = getAbsoluteURL(req)
    let resource = new Resource(urlLink)
    let info = JSON.parse(JSON.stringify(jsonInfo))

   resource = {
       ...resource, 
       info
   }
    
    res.status(200).send(resource)
})





module.exports = info