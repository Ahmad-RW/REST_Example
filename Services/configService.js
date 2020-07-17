const db = require('../dbConfig')
const config = db.config

function getConfigUsingKey(key){
    console.log("in get config")
    return config.findOne({key})
}

module.exports = {
    getConfigUsingKey
}