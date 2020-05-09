class PaginationOptions {
    offset
    size 
    limit
    constructor(offset, size, limit) {
        this.offset = offset
        this.size = size
        this.limit = limit
    }
}

module.exports = PaginationOptions