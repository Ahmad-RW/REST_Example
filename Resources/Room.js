const Resource = require('./Resource')
class Room {
    roomId = ""
    size = ""
    floor = ""
    executive = null 
    href = {}
    constructor(roomId, size, floor, executive, href) {
        this.roomId = roomId
        this.size = size
        this.floor = floor
        this.executive = executive
        this.href = href
    }



}


module.exports = Room
