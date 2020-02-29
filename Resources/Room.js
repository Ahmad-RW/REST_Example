const Resource = require('./Resource')
class Room extends Resource{
    roomId = ""
    size = ""
    floor = ""
    executive = null

    constructor(href, roomId, size, floor, executive){
        super(href)
        this.roomId = roomId
        this.size = size
        this.floor = floor
        this.executive = executive

    }

}


module.exports = Room
