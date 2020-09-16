//class to represent forms meta-data
class Form {
    link = {}
	value = []
    name = ""
    constructor(link, value, name) {
        this.link = link
	    this.value = value
        this.name = name
    }
    
}
 

module.exports = Form
