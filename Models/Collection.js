const Form = require("./Form")
const Link = require("./Link")

class Collection {
    value = []
    link
    ref
    sortQuery
    criteria // sort criteria are allowed fields to sort/filter by
    filterQuery
    allowedOps = ['lt', 'lte', 'gt', 'gte', 'eq', '!eq']
    $form
    constructor(value, link, rel, sortQuery, filterQuery, criteria ) {

        this.value = value
        this.link = link
        this.rel = rel
        this.sortQuery = sortQuery
        this.criteria = criteria
        this.filterQuery = filterQuery

    }

    sortCollection() {
        //tokens should look like this [rate, desc] or something like that where the [0] is field and [1] is criteria. desc or asc.
        console.log("sorting collection")
        //handle if client tries to sort unquerable endpoint
        if (this.criteria.length === 0 && this.sortQuery !== undefined) {
            throw { msg: 'unquerable endpoint', code: 400 }
        }
        if (this.criteria.length === 0) {
            console.log("no sort criteria for this collection. exiting sortCollection")
            return
        }
        if (this.sortQuery === undefined || this.sortQuery === null) {
            console.log("sort query failed sanity check")
            return
        }
        const tokens = this.sortQuery.split(' ')

        const field = tokens[0]
        const criteria = tokens[1]
	
        if (tokens.length != 2) {
            throw { msg: 'invalid sort syntax', code: 400 }

        }


        //test if field exists in collection or not
        if (!this.criteria.includes(field)) {
            throw { msg: 'invalid sort criteria', code: 400 }
        }

        const compareFunction = function (a, b, criteria, field) {
            if (criteria.toUpperCase() === "desc".toUpperCase()) {
                if (a[field] < b[field]) {
                    return 1
                }

                if (a[field] > b[field]) {
                    return -1
                }
                return 0
            }
            else {
                if (a[field] > b[field]) {
                    return 1
                }

                if (a[field] < b[field]) {
                    return -1
                }
                return 0
            }
        }

        this.value.sort((a, b) => compareFunction(a, b, criteria, field))

    }

    filterCollection() {
        console.log("in filter query")
        //it won't get called if below statement is true however just as a fallback I added it.
        if (this.filterQuery === undefined || this.filterQuery === null) {
            console.log("filter query failed sanity check")
            return
        }

        //handle if client tries to filter unquerable endpoint. An endpoint is defined queryable if sortCriteria is populated at instance creation in the endpoint
        if (this.criteria.length === 0 && this.filterQuery !== undefined) {
            throw { msg: 'unquerable endpoint', code: 400 }
        }

        if (this.criteria.length === 0) {
            console.log("no sort/filter criteria for this collection. exiting filterCollection")
            return
        }

        
    
        //tokenzing filter query. 
        const tokens = this.filterQuery.split(' ')
        
        //if includes spaces return syntax error. ideally we can handle this and not cause an overhead for the client but I was lazy so...
        if(tokens.includes(' ')){
            console.log("syntax error. token includes an extra space")
            throw { msg: 'syntax error. extra spaces', code: 400 }
        }

        console.log(tokens)
        //I decided to be strict in terms of checking the filter and sort queries to avoid loop holes.
        if (tokens.length != 3) {
    
            throw { msg: 'invalid filter syntax', code: 400 }

        }

        // getting individual tokens after parsing
        const field = tokens[0]
        const operator = tokens[1] 
        const rightSideValue = tokens[2]
    
      

        //trying to filter by an unacceptable field
        if (!this.criteria.includes(field)) {
            throw { msg: 'invalid filter syntax', code: 400 }
        }

        //check if operator used is a valid one
        if(!this.isOperatorValid(operator)){
            console.log("invalid operator")
            throw {msg : `invalid operator. allowed operators are ${this.allowedOps.reduce((accum, curr)=>{ return accum.concat(","+curr)})}`, code : 400}
        }
        
        
        this.value = this.value.filter(function (value) {

            switch(operator.toLowerCase()){
                case 'lt':
                    return value[field] < rightSideValue

                case 'lte':
                    return value[field] <= rightSideValue

                case 'gt':
                    return value[field] > rightSideValue

                case 'gte':
                    return value[field] >= rightSideValue                    

                case 'eq':
                    return value[field] == rightSideValue

                case '!eq':
                    return value[field] != rightSideValue

                default:
                    return true

            }
            
        })
    }

    getResponse() {
     
        let response = {
            link : this.link,
            $form : this.$form,
            value : this.value
        }
        //if the collection is a paged one. apply first, next, prev, last endpoints of the paged collection. ideal for application who only want to retreive for example 5 rooms per page
        if (this.constructor.name === "PagedCollection") {
            const toFirst = new Link(this.link.href, this.link.rel, "GET", "first")
            const toLast = new Link( `${this.link.href}?offset=${this.next}&limit=${this.limit}`, this.link.rel, "GET", "last")
            response = {
                ...response,
                toFirst,
                toLast
            }
            if (this.next != 0) {
                const toNext = new Link(`${this.link.href}?offset=${this.next}&limit=${this.limit}`, this.link.rel, "GET", "next")
                response = {
                    ...response,
                    toNext
                }
            }
            if (this.prev != 0) {
                const toPrev = new Link(`${this.link.href}?offset=${this.prev}&limit=${this.limit}`, "collection", "GET", "previous")
                response = {
                    ...response,
                    toPrev  
                }
            }

        }

        return response
    }

    isOperatorValid(operator){
        return this.allowedOps.includes(operator)
    }

}


module.exports = Collection
