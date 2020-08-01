const Form = require("../Forms/Form")

class Room {
    roomId = ""
    size = ""
    floor = ""
    executive = null 
    href = {}
    $form = {}
    constructor(roomId, size, floor, executive, href) {
        this.roomId = roomId
        this.size = size
        this.floor = floor
        this.executive = executive
        this.href = href
        //this.book = bookingForm


        //attaching form
        this.$form = new Form(["create-form"], `/rooms/${roomId}/bookings`, "POST", 
        [{
            name : "startAt",
            label : "Booking start time",
            required : true,
            type : "datetime"
        },
        {
            name : "endAt",
            label : "Booking end time",
            required : true,
            type : "datetime"
        }], "book")
    }



}


module.exports = Room
