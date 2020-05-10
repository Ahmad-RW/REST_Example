
class Collection {
    value = []
    href
    ref
    sortQuery
    sortCriteria
    filterQuery
    constructor(value, href, rel, sortQuery, filterQuery, sortCriteria ) {

        this.value = value
        this.href = href
        this.rel = rel
        this.sortQuery = sortQuery
        this.sortCriteria = sortCriteria
        this.filterQuery = filterQuery
    }

    sortCollection() {
        //tokens should look like this [rate, desc] or something like that where the [0] is field and [1] is criteria. desc or asc.
        console.log("sorting collection")

        //handle if client tries to sort unquerable endpoint
        if (this.sortCriteria.length === 0 && this.sortQuery !== undefined) {
            throw { msg: 'unquerable endpoint', code: 400 }
        }
        if (this.sortCriteria.length === 0) {
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
        if (!this.sortCriteria.includes(field)) {
            throw { msg: 'invalid sort syntax', code: 400 }
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
        if (this.filterQuery === undefined || this.filterQuery === null) {
            console.log("sort query failed sanity check")
            return
        }
        //handle if client tries to filter unquerable endpoint
        if (this.sortCriteria.length === 0 && this.filterQuery !== undefined) {
            throw { msg: 'unquerable endpoint', code: 400 }
        }
        if (this.sortCriteria.length === 0) {
            console.log("no sort criteria for this collection. exiting sortCollection")
            return
        }
        console.log(this.filterQuery)
        const tokens = this.filterQuery.split(' ')
        const field = tokens[0]
        const filterValue = tokens[1]            
        console.log(filterValue)

        //handle if client tries to filter unquerable endpoint
        if (this.sortCriteria.length === 0 && this.filterQuery !== undefined) {
            throw { msg: 'unquerable endpoint', code: 400 }
        }
        if (tokens.length != 2) {
            throw { msg: 'invalid filter syntax', code: 400 }

        }

        this.value = this.value.filter(function (value) {

            return value[field] != filterValue
        })
    }

    getResponse() {
        // if (this.sortCriteria.length !== 0) {
        //     this.sortCollection()
        //     this.filterCollection()
        // }

        let response = {
            self: {
                href: this.href,
                rel: [this.rel],
            },
            value: this.value
        }

        //if the collection is a paged one. apply first, next, prev, last endpoints of the paged collection. ideal for application who only want to retreive for example 5 rooms per page
        if (this.constructor.name === "PagedCollection") {
            response = {
                ...response,
                first: {
                    href: this.href,
                    rel: [this.rel]
                },
                last: {
                    href: `${this.href}?offset=${this.size}&limit=${this.size}`,
                    rel: [this.rel]
                }
            }
            if (this.next != 0) {
                response = {
                    ...response,
                    next: {
                        href: `${this.href}?offset=${this.next}&limit=${this.limit}`,
                        rel: [this.rel]
                    }
                }
            }
            if (this.prev != 0) {
                response = {
                    ...response,
                    previous: {
                        href: `${this.href}?offset=${this.prev}&limit=${this.limit}`,
                        rel: [this.rel]
                    }
                }
            }

        }

        return response
    }

}


module.exports = Collection
