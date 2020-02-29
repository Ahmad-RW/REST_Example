const loki = require('lokijs')
let db = new loki("inMemoryHotel")


const rooms = db.addCollection("rooms")
const ballRooms = db.addCollection("ballRooms")
console.log("populating database now")
//populate rooms start
rooms.insert({
    number : "1",
    size : "small",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "2",
    size : "small",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "3",
    size : "small",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "4",
    size : "small",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "5",
    size : "medium",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "6",
    size : "medium",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "7",
    size : "large",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "8",
    size : "small",
    floor : "1",
    executive : true
}
)
rooms.insert({
    number : "9",
    size : "small",
    floor : "1",
    executive : true
}
)
rooms.insert({
    number : "10",
    size : "large",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "11",
    size : "large",
    floor : "1",
    executive : false
}
)
rooms.insert({
    number : "12",
    size : "large",
    floor : "1",
    executive : true
}
)

//populate rooms end *


//populate ballrooms start
ballRooms.insert({
    name : "Oak Ballroom",
    withDining : false,
    openbar : true,
    maxNumberOfGuests: 75

})
ballRooms.insert({
    name : "The Historic Ballroom",
    withDining : true,
    openbar : true,
    maxNumberOfGuests: 100

})
ballRooms.insert({
    name : "Lakeside Ballroom",
    withDining : true,
    openbar : true,
    stageAvailable : true,
    maxNumberOfGuests: 500

})

module.exports = {
    rooms,
    ballRooms
};