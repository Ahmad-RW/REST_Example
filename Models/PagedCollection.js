/*
*   I return paged collection in segments of 5 for each response. 
*   ideally you'd have this 5 in configuration file. Or you'll fall into a pit of nightmares and horror.
*
*
*
*/

const Collection = require('../Resources/Collection')
class PagedCollection extends Collection{
    offset
    size 
    limit
    first
    next
    prev
    last
    constructor( offset, size, limit, value, href, rel ){
         super(value, href, rel)
         this.offset = offset
         this.size = size
         this.limit = limit
         this.next = offset*2
         this.prev = offset == 0 ? 0 : parseInt(offset/2)

         //validation 
         this.prev < 0 ? this.prev = 0 : this.prev
         this.prev > this.size ? this.prev = this.offset - 5 : this.prev

         //validation
         this.next > this.size ? this.next = 0 : this.next
    }

    applyPagination(){
        console.log("applying pagination")

       //keep shifting until the value[0] is the offset the client eants the collection (value) to start at
       for (let i = 1; i < this.offset ; i++) {
        //don't pop is limit > length. if client requests offset out of bound, break from shifting
        if(this.offset > this.size) break
        console.log("shifting array")
        this.value.shift()
     
    }

       // keep popping until the lengtth of the collection (value) = to the limit the client wants
       for (let i = 0; this.limit < this.value.length ; i++) {
           //don't pop is limit > length. if client request limit grater than size of collection just return the whole thing.
           if(this.limit > this.size) break
           console.log("popping array")
           this.value.pop()
        
       }
       
        return this
   }

   

}


module.exports = PagedCollection