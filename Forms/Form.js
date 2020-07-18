//class to represent forms meta-data
class Form {
    rel = []
    href = ""
    method = ""
    value = []
    constructor(rel, href, method, value) {
        this.rel = rel
        this.method = method
        this.value = value
        this.href = href
    }
    
}
 

module.exports = Form
