const db = require('../dbConfig')
const rooms = db.rooms
function getRoom(roomId){
    return rooms.findOne({number : roomId})
}

function getAllRooms(){
    console.log("in data access function")
    return rooms.find({})
}



module.exports = {
    getRoom,
    getAllRooms
}