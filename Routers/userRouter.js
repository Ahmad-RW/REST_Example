const express = require('express')
const userRouter = express()

const Room = require('../Models/Room')
const roomService = require('../Services/roomService')
const {getAbsoluteURL} = require('../getAbsoluteURL')
const Collection = require('../Models/Collection')
const PaginationOptions = require('../Models/PaginationOptions')
const moment = require('moment')
const PagedCollection = require('../Models/PagedCollection')
const userService = require('../Services/userService')
const Link = require('../Models/Link')
const User = require('../Models/UserEntity')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const crypto = require('crypto')
// GET users/
userRouter.get("/", function(req, res, next){	
	
	console.log("in get users")
	const offset = parseInt(req.query.offset) || 0
	const limit = parseInt(req.query.limit) || 5 
	const sortQuery = null 
	const filterQuery = null 

	let users = userService.getAll()
	console.log("users legnth" ,users.length)
	let response
	try{
		console.log(users)
		const link = new Link(`${req.protocol}://${req.hostname}:5000/users/`, "collection" )
		const pagedCollection = new PagedCollection(offset, users.length, limit, users, link, "collection", sortQuery, filterQuery, [])
		
		response = pagedCollection.applyPagination().getResponse()
			
	}catch(error){
		console.log("in catch")
		res.status(500)
		res.locals.response = error
		next()
		return
		
	}


	res.status(200)
	res.locals.response = response
	console.log(res.locals.response)
	next()
})



userRouter.post("/", function(req, res, next){
	console.log("in create user")

	const user = new User(req.body.email, req.body.firstName, req.body.lastName, new Date(), "USER", req.body.pass)

	console.log(user)

	
	const result = userService.create(user)
	
	if(result === null){
		res.status(400)
		next()
		return
		}
	res.status(201)

	res.header("location", `${req.protocol}://${req.hostname}:5000/user/userInfo`)
	next()
		

})



userRouter.post("/token", function(req, res, next){
	console.log("in create token")

	const userId = req.body.username
	const pass = req.body.password
	const grant_type = req.body.grant_type

	
	if(grant_type.toUpperCase() !== "PASSWORD"){
		res.status(400)
		res.locals.response = {error : "grant type is not supported"}
		next()
		return
	}

	
	if(!userService.isPasswordValid(userId, pass)){
		res.status(400)
		res.locals.response = {error : "user credentials invalid"} 
		next()
		return
	}
	

	const user = userService.getUser(userId)
	const exp = 3600 
	const token = jwt.sign({userId : user.userName}, process.env.secret, { expiresIn : exp})
	
	const response = {
		access_token : token,
		expires_in : exp,
		token_type : "Bearer"
	}

	res.status(200)
	res.set("Cache-Control", "no-cache")
	res.locals.response = response
	next()
	
})


userRouter.get("/userInfo", validateToken, function(req, res, next){
	console.log("in get user info")
	
	
	const user = userService.getUser(res.locals.userId)

	if(user === null){
		res.status(401).send()
		return
	}
	res.status(200)
	const response = {
		userInfo : {
			userName : user.userName,
			lastName : user.lastName,
			role	 : user.role
		}
	}
	res.locals.response = response
	next()
})




function validateToken(req, res, next){
	console.log("validating token")

	const userToken = req.get("Authorization").slice(7)
		
	if(!userToken){
		res.status(401).send()
		return
	}
	jwt.verify(userToken, process.env.secret, function(err, decoded){
		if(err){
			res.status(401).send()
		}
		else{
			console.log("decoded userId is ", decoded.userId)
			res.locals.userId = decoded.userId
			next()
		}
	})



}
module.exports = userRouter 
