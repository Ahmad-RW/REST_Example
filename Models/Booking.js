
class Booking {
    startAt
    endAt 
    cost 
    roomId  
    userId
    href
    room
    constructor(startAt, endAt, cost, roomId, userId, href, room) {
        this.startAt = startAt
        this.endAt = endAt
        this.cost = cost
        this.roomId = roomId
        this.userId = userId
        this.href = href
        this.room = room
    }



}


module.exports = Booking
