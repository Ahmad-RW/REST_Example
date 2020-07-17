const loki = require('lokijs')
let db = new loki("inMemoryHotel")


const rooms = db.addCollection("rooms")
const ballRooms = db.addCollection("ballRooms")
const config = db.addCollection("config")
const bookings = db.addCollection("bookings")
console.log("populating database now")
//populate rooms start
rooms.insert({
    number : 1,
    size : "small",
    floor : 1,
    executive : false,
    available : true
}
)
rooms.insert({
    number : 2,
    size : "small",
    floor : 1,
    executive : false,
    available : true
}
)
rooms.insert({
    number : 3,
    size : "small",
    floor : 1,
    executive : false,
    available : true
}
)
rooms.insert({
    number : 4,
    size : "small",
    floor : 1,
    executive : false,
    available : true
}
)
rooms.insert({
    number : 5,
    size : "medium",
    floor : 1,
    executive : false,
    available : true

}
)
rooms.insert({
    number : 6,
    size : "medium",
    floor : 1,
    executive : false,
    available : true
}
)
rooms.insert({
    number : 7,
    size : "large",
    floor : 1,
    executive : false,
    available : true
}
)
rooms.insert({
    number : 8,
    size : "small",
    floor : 1,
    executive : true,
    available : true
}
)
rooms.insert({
    number : 9,
    size : "small",
    floor : 1,
    executive : true,
    available : true
}
)
rooms.insert({
    number : 10,
    size : "large",
    floor : 1,
    executive : false,
    available : true
}
)
rooms.insert({
    number : 11,
    size : "large",
    floor : "1",
    executive : false,
    available : true
}
)
rooms.insert({
    number : 12,
    size : "large",
    floor : 1,
    executive : true,
    available : true
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


config.insert({
    key : "MIN_STAY",
    value : 172800000 //ms in days
})

config.insert({
    key : "RATE",
    value : 250 //ms in days
})

// bookings.insert({
//     roomId : 1,
//     startAt : "10/10/2010",
//     endAt : "15/10/2010"
// })

module.exports = {
    rooms,
    ballRooms,
    config,
    bookings
};