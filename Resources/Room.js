
class Room {
    roomId = ""
    size = ""
    floor = ""
    executive = null 
    href = {}
    book = {}
    constructor(roomId, size, floor, executive, href, bookingForm) {
        this.roomId = roomId
        this.size = size
        this.floor = floor
        this.executive = executive
        this.href = href
        this.book = bookingForm
    }



}


module.exports = Room
