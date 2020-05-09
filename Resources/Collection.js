
class Collection {
    value = []
    constructor(value, href, rel) {

        this.value = value
        this.href = href
        this.rel = rel
    }

    getResponse() {
        let response = {
            self: {
                href: this.href,
                rel: [this.rel],
            },
            value: this.value
        }

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
