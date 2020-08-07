//class to represent forms meta-data
class Form {
    rel = []
    href = ""
    method = ""
    value = []
    name = ""
    constructor(rel, href, method, value, name) {
        this.rel = rel
        this.method = method
        this.value = value
        this.href = href
        this.name = name
    }
    
}
 

module.exports = Form
