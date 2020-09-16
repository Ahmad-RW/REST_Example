const db = require('../dbConfig')
const users = db.users


function getAll(){
	return users.find({})
}


function create(user){
	return users.insert(user)
}

function isPasswordValid(userId, password){
	const user = getUser(userId) 
	if(user === null) return false
	
	if(user.pass === password) return true

	return false
}



function getUser(userId){
	return users.findOne({userName : userId})
}
module.exports = {
	getAll,
	create,
	isPasswordValid,
	getUser
}
