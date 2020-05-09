

class Resource {
    href = {}
    constructor(href){
        this.href = href
    }
   serHref(href){
       this.href.href = href
   }
   setRel(rel){
       this.href.rel = rel
   }
   setMethod(method){
       this.href.method = method
   }
}



module.exports = Resource