const Form = require("./Form")
const Link = require('./Link')
class Room {
    roomId
    size 
    floor 
    executive 
    link
    $form
    constructor(roomId, size, floor, executive, link) {
        this.roomId = roomId
        this.size = size
        this.floor = floor
        this.executive = executive
        this.link = link


        //attaching booking form
	   const linktoForm = new Link( `${this.link.href}/bookings`, "create-form", "POST", undefined)
        this.$form = new Form(linktoForm, 
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
