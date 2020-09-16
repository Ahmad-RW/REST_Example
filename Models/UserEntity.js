class User {
	userName
    firstName
	lastName
	creDate
	role
	pass
	constructor(userName, firstName, lastName, creDate, role, pass) {
		this.userName = userName 
		this.firstName = firstName
		this.lastName = lastName
		this.creDate = creDate
		this.role = role
		this.pass = pass
    }
    
}
 

module.exports = User
